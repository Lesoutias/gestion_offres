from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path

from fastapi import HTTPException, status
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from ..config import settings
from ..models.dao_document import DaoDocument
from ..models.offer import Offer
from ..models.offer_evaluation import OfferEvaluation
from ..models.report_export import ReportExport
from ..models.tender_call import TenderCall
from . import offer_scoring_service, tender_call_service

DOCUMENT_TYPE_LABELS = {
    "offre_technique": "Offre technique",
    "offre_financiere": "Offre financiere",
    "lettre_soumission": "Lettre de soumission",
    "autre": "Autre document specifie par l'autorite",
    "rccm": "RCCM",
    "identification_nationale": "Identification nationale",
    "numero_impot": "Numero impot",
    "attestation_fiscale": "Attestation de regularite fiscale",
    "attestation_cnss": "Attestation CNSS",
    "attestation_inpp": "Attestation INPP",
    "attestation_onem": "Attestation ONEM",
    "statuts_entreprise": "Statuts de l'entreprise",
    "pouvoir_signataire": "Pouvoir du signataire",
    "garantie_soumission": "Garantie de soumission",
    "attestation_bancaire": "Attestation bancaire",
    "etats_financiers": "Etats financiers",
    "preuve_experience": "References de marches similaires",
    "cv_personnel_cle": "CV du personnel cle",
    "liste_materiel": "Liste du materiel",
    "calendrier_execution": "Calendrier d'execution",
}

RECOMMENDATION_LABELS = {
    "favorable": "Conforme",
    "unfavorable": "Non conforme",
    "reserve": "Conforme avec reserves",
}

REPORT_TYPE_LABELS = {
    "companies_ranking": "Classement des entreprises",
    "offers_summary": "Synthese des offres",
    "commission_evaluations": "Rapport commission",
    "tenders_overview": "Vue globale des appels",
}


def _document_type_label(document_type: str) -> str:
    return DOCUMENT_TYPE_LABELS.get(document_type, document_type)


def _recommendation_label(value: str) -> str:
    return RECOMMENDATION_LABELS.get(value, value)


def _format_amount(montant: float, devise: str) -> str:
    return f"{montant:,.2f} {devise}".replace(",", " ")


def _format_datetime(value: datetime | None) -> str:
    if not value:
        return "-"
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).strftime("%d/%m/%Y %H:%M UTC")


def _load_tender_offers(db: Session, tender_call_id: int) -> tuple[TenderCall, DaoDocument | None, list[Offer]]:
    tender = tender_call_service.get_tender_call(db, tender_call_id)
    dao = db.query(DaoDocument).filter(DaoDocument.tender_call_id == tender_call_id).first()
    offers = (
        db.query(Offer)
        .options(joinedload(Offer.company), joinedload(Offer.documents))
        .filter(Offer.tender_call_id == tender_call_id, Offer.statut != "draft")
        .all()
    )
    if offers:
        offer_scoring_service.recalculate_tender_offer_scores(db, tender_call_id)
        db.expire_all()
        offers = (
            db.query(Offer)
            .options(joinedload(Offer.company), joinedload(Offer.documents))
            .filter(Offer.tender_call_id == tender_call_id, Offer.statut != "draft")
            .all()
        )
    return tender, dao, offers


def _build_pdf(title: str, subtitle: str, story: list) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )
    styles = getSampleStyleSheet()
    header_style = ParagraphStyle(
        "ReportHeader",
        parent=styles["Heading1"],
        fontSize=16,
        spaceAfter=6,
        textColor=colors.HexColor("#0f172a"),
    )
    sub_style = ParagraphStyle(
        "ReportSub",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.HexColor("#475569"),
        spaceAfter=12,
    )

    full_story = [
        Paragraph(title, header_style),
        Paragraph(subtitle, sub_style),
        Paragraph(f"Genere le {_format_datetime(datetime.now(timezone.utc))}", sub_style),
        Spacer(1, 0.4 * cm),
        *story,
    ]
    doc.build(full_story)
    return buffer.getvalue()


def _table_style() -> TableStyle:
    return TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f766e")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cbd5e1")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
    )


def _body_style():
    styles = getSampleStyleSheet()
    return ParagraphStyle(
        "ReportBody",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#1e293b"),
    )


def _section_style():
    styles = getSampleStyleSheet()
    return ParagraphStyle(
        "SectionTitle",
        parent=styles["Heading2"],
        fontSize=11,
        spaceBefore=10,
        spaceAfter=6,
        textColor=colors.HexColor("#0f766e"),
    )


def _empty_offers_paragraph() -> Paragraph:
    return Paragraph(
        "Aucune offre recue pour cet appel d'offres. Le rapport est genere a titre informatif.",
        _body_style(),
    )


def _persist_report(
    db: Session,
    *,
    report_type: str,
    tender_call_id: int | None,
    generated_by_id: int,
    file_name: str,
    content: bytes,
) -> ReportExport:
    reports_dir = Path(settings.UPLOAD_DIR) / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    safe_name = file_name.replace(" ", "_")
    disk_name = f"{timestamp}_{safe_name}"
    absolute_path = reports_dir / disk_name
    absolute_path.write_bytes(content)
    relative_path = f"reports/{disk_name}"
    export = ReportExport(
        report_type=report_type,
        tender_call_id=tender_call_id,
        file_name=file_name,
        file_path=relative_path,
        generated_by_id=generated_by_id,
    )
    db.add(export)
    db.commit()
    db.refresh(export)
    return export


def list_report_archives(db: Session, tender_call_id: int | None = None) -> list[ReportExport]:
    query = db.query(ReportExport).order_by(ReportExport.created_at.desc())
    if tender_call_id is not None:
        query = query.filter(ReportExport.tender_call_id == tender_call_id)
    return query.limit(50).all()


def get_report_archive(db: Session, export_id: int) -> ReportExport:
    export = db.query(ReportExport).filter(ReportExport.id == export_id).first()
    if not export:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Archive introuvable")
    return export


def read_report_archive_bytes(export: ReportExport) -> bytes:
    file_path = Path(settings.UPLOAD_DIR) / export.file_path
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fichier archive introuvable")
    return file_path.read_bytes()


def generate_and_store_report(
    db: Session,
    *,
    report_type: str,
    tender_call_id: int | None,
    generated_by_id: int,
    generator,
) -> tuple[bytes, str, ReportExport]:
    content, filename = generator(db, tender_call_id) if tender_call_id is not None else generator(db)
    export = _persist_report(
        db,
        report_type=report_type,
        tender_call_id=tender_call_id,
        generated_by_id=generated_by_id,
        file_name=filename,
        content=content,
    )
    return content, filename, export


def _generate_companies_ranking_content(db: Session, tender_call_id: int) -> tuple[bytes, str]:
    tender, _, offers = _load_tender_offers(db, tender_call_id)
    story: list = []
    if not offers:
        story.append(_empty_offers_paragraph())
    else:
        ranked = sorted(
            offers,
            key=lambda offer: (
                -(offer.score_total or 0),
                -(offer.score_technique or 0),
                -(offer.score_financier or 0),
                offer.montant,
            ),
        )
        rows = [["Rang", "Entreprise", "Montant", "Tech.", "Fin.", "Commission", "Total", "Statut"]]
        for index, offer in enumerate(ranked, start=1):
            company_name = offer.company.name if offer.company else f"Entreprise #{offer.company_id}"
            rows.append(
                [
                    str(index),
                    company_name,
                    _format_amount(offer.montant, offer.devise),
                    f"{offer.score_technique:.2f}" if offer.score_technique is not None else "-",
                    f"{offer.score_financier:.2f}" if offer.score_financier is not None else "-",
                    f"{offer.score_commission:.2f}" if offer.score_commission is not None else "-",
                    f"{offer.score_total:.2f}" if offer.score_total is not None else "-",
                    offer.statut,
                ]
            )
        table = Table(rows, colWidths=[1 * cm, 4.2 * cm, 2.5 * cm, 1.6 * cm, 1.6 * cm, 2.2 * cm, 1.7 * cm, 2.2 * cm])
        table.setStyle(_table_style())
        story.append(table)

    subtitle = (
        f"Appel d'offres {tender.reference} — {tender.objet}<br/>"
        f"Classement pondere : technique 40 %, financier 40 %, avis commission 20 %."
    )
    content = _build_pdf("Rapport de classement des entreprises", subtitle, story)
    return content, f"classement-entreprises-{tender.reference}.pdf"


def _generate_offers_summary_content(db: Session, tender_call_id: int) -> tuple[bytes, str]:
    tender, dao, offers = _load_tender_offers(db, tender_call_id)
    body_style = _body_style()
    section_style = _section_style()
    required_types = list(dao.required_document_types) if dao and dao.required_document_types else []
    story: list = []

    if dao:
        dao_lines = [
            f"<b>Pieces exigees (texte):</b> {dao.pieces_exigees or 'Non renseigne.'}",
            f"<b>Conditions de participation:</b> {dao.conditions_participation or 'Non renseigne.'}",
            f"<b>Criteres de selection:</b> {dao.criteres_selection or 'Non renseigne.'}",
        ]
        if required_types:
            labels = ", ".join(_document_type_label(item) for item in required_types)
            dao_lines.append(f"<b>Pieces obligatoires structurees:</b> {labels}")
        else:
            dao_lines.append("<b>Pieces obligatoires structurees:</b> Aucune definie.")
        story.append(Paragraph("Exigences du DAO", section_style))
        for line in dao_lines:
            story.append(Paragraph(line, body_style))
        story.append(Spacer(1, 0.3 * cm))
    else:
        story.append(Paragraph("Aucun dossier DAO associe a cet appel.", body_style))
        story.append(Spacer(1, 0.3 * cm))

    if not offers:
        story.append(_empty_offers_paragraph())
    else:
        for offer in sorted(offers, key=lambda item: item.id):
            company_name = offer.company.name if offer.company else f"Entreprise #{offer.company_id}"
            story.append(Paragraph(f"Offre #{offer.id} — {company_name}", section_style))
            story.append(
                Paragraph(
                    (
                        f"<b>Montant:</b> {_format_amount(offer.montant, offer.devise)}<br/>"
                        f"<b>Statut:</b> {offer.statut}<br/>"
                        f"<b>Scores:</b> technique {offer.score_technique or '-'}, "
                        f"financier {offer.score_financier or '-'}, commission {offer.score_commission if offer.score_commission is not None else '-'}, total {offer.score_total or '-'}"
                    ),
                    body_style,
                )
            )
            compliance_rows = [["Piece exigee", "Statut", "Fichier depose"]]
            if required_types:
                for document_type in required_types:
                    matching = [doc for doc in offer.documents if doc.document_type == document_type]
                    if matching:
                        files = ", ".join(doc.file_name for doc in matching)
                        compliance_rows.append([_document_type_label(document_type), "Fourni", files])
                    else:
                        compliance_rows.append([_document_type_label(document_type), "Manquant", "-"])
            else:
                compliance_rows.append(["Aucune piece structuree requise", "-", "-"])
            extra_docs = [doc for doc in offer.documents if doc.document_type not in required_types]
            for document in extra_docs:
                compliance_rows.append(
                    [
                        _document_type_label(document.document_type),
                        "Document supplementaire",
                        document.file_name,
                    ]
                )
            compliance_table = Table(compliance_rows, colWidths=[5 * cm, 3 * cm, 8 * cm])
            compliance_table.setStyle(_table_style())
            story.extend([compliance_table, Spacer(1, 0.4 * cm)])

    subtitle = (
        f"Appel d'offres {tender.reference} — {tender.objet}<br/>"
        f"Synthese des offres recues et conformite documentaire par rapport au DAO."
    )
    content = _build_pdf("Rapport synthese des offres", subtitle, story)
    return content, f"synthese-offres-{tender.reference}.pdf"


def _generate_commission_evaluations_content(db: Session, tender_call_id: int) -> tuple[bytes, str]:
    tender, _, offers = _load_tender_offers(db, tender_call_id)
    evaluations = (
        db.query(OfferEvaluation)
        .options(
            joinedload(OfferEvaluation.offer).joinedload(Offer.company),
            joinedload(OfferEvaluation.evaluator),
        )
        .join(Offer, Offer.id == OfferEvaluation.offer_id)
        .filter(Offer.tender_call_id == tender_call_id)
        .order_by(OfferEvaluation.created_at.desc())
        .all()
    )
    story: list = []
    body_style = _body_style()
    section_style = _section_style()

    if not evaluations:
        story.append(
            Paragraph(
                "Aucune evaluation commission enregistree pour cet appel d'offres.",
                body_style,
            )
        )
    else:
        for evaluation in evaluations:
            offer = evaluation.offer
            company_name = offer.company.name if offer and offer.company else "-"
            evaluator_name = evaluation.evaluator.full_name if evaluation.evaluator else f"User #{evaluation.evaluator_id}"
            story.append(Paragraph(f"Offre #{evaluation.offer_id} — {company_name}", section_style))
            story.append(
                Paragraph(
                    (
                        f"<b>Evaluateur:</b> {evaluator_name}<br/>"
                        f"<b>Date:</b> {_format_datetime(evaluation.created_at)}<br/>"
                        f"<b>Recommandation:</b> {_recommendation_label(evaluation.recommendation)}<br/>"
                        f"<b>Scores au moment de l'evaluation:</b> "
                        f"technique {evaluation.technical_score}, financier {evaluation.financial_score}, "
                        f"commission {evaluation.offer.score_commission if evaluation.offer.score_commission is not None else '-'}<br/>"
                        f"<b>Commentaire:</b> {evaluation.comment or 'Aucun commentaire.'}"
                    ),
                    body_style,
                )
            )
            story.append(Spacer(1, 0.3 * cm))

    if offers and not evaluations:
        story.append(Spacer(1, 0.2 * cm))
        story.append(
            Paragraph(
                f"{len(offers)} offre(s) recue(s) mais aucun rapport commission saisi pour le moment.",
                body_style,
            )
        )

    subtitle = (
        f"Appel d'offres {tender.reference} — {tender.objet}<br/>"
        f"Historique des evaluations et recommandations de la commission."
    )
    content = _build_pdf("Rapport commission d'evaluation", subtitle, story)
    return content, f"rapport-commission-{tender.reference}.pdf"


def _generate_tenders_overview_content(db: Session) -> tuple[bytes, str]:
    tenders = tender_call_service.list_tender_calls(db)
    offer_counts = dict(
        db.query(Offer.tender_call_id, func.count(Offer.id))
        .filter(Offer.statut != "draft")
        .group_by(Offer.tender_call_id)
        .all()
    )
    rows = [["Reference", "Objet", "Statut", "Date limite", "Nb offres", "Meilleur score"]]
    for tender in tenders:
        offers = (
            db.query(Offer)
            .filter(Offer.tender_call_id == tender.id, Offer.statut != "draft")
            .all()
        )
        if offers:
            offer_scoring_service.recalculate_tender_offer_scores(db, tender.id)
            db.expire_all()
            offers = db.query(Offer).filter(Offer.tender_call_id == tender.id, Offer.statut != "draft").all()
        best_score = max((offer.score_total or 0) for offer in offers) if offers else None
        rows.append(
            [
                tender.reference,
                tender.objet[:60] + ("..." if len(tender.objet) > 60 else ""),
                tender.statut,
                _format_datetime(tender.date_limite),
                str(offer_counts.get(tender.id, 0)),
                f"{best_score:.2f}" if best_score is not None else "-",
            ]
        )

    table = Table(rows, colWidths=[2.5 * cm, 5.5 * cm, 2.2 * cm, 3 * cm, 1.8 * cm, 2.5 * cm])
    table.setStyle(_table_style())
    subtitle = "Vue globale de tous les appels d'offres geres par la mairie."
    content = _build_pdf("Rapport global des appels d'offres", subtitle, [table])
    return content, "vue-globale-appels-offres.pdf"


def generate_companies_ranking_pdf(db: Session, tender_call_id: int, generated_by_id: int) -> tuple[bytes, str, ReportExport]:
    return generate_and_store_report(
        db,
        report_type="companies_ranking",
        tender_call_id=tender_call_id,
        generated_by_id=generated_by_id,
        generator=_generate_companies_ranking_content,
    )


def generate_offers_summary_pdf(db: Session, tender_call_id: int, generated_by_id: int) -> tuple[bytes, str, ReportExport]:
    return generate_and_store_report(
        db,
        report_type="offers_summary",
        tender_call_id=tender_call_id,
        generated_by_id=generated_by_id,
        generator=_generate_offers_summary_content,
    )


def generate_commission_evaluations_pdf(db: Session, tender_call_id: int, generated_by_id: int) -> tuple[bytes, str, ReportExport]:
    return generate_and_store_report(
        db,
        report_type="commission_evaluations",
        tender_call_id=tender_call_id,
        generated_by_id=generated_by_id,
        generator=_generate_commission_evaluations_content,
    )


def generate_tenders_overview_pdf(db: Session, generated_by_id: int) -> tuple[bytes, str, ReportExport]:
    content, filename = _generate_tenders_overview_content(db)
    export = _persist_report(
        db,
        report_type="tenders_overview",
        tender_call_id=None,
        generated_by_id=generated_by_id,
        file_name=filename,
        content=content,
    )
    return content, filename, export
