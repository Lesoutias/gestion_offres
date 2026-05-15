import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.orm import Session

from ..config import settings
from ..models.email_notification import EmailNotification


class EmailService:
    @staticmethod
    def send_email(
        recipient_email: str,
        subject: str,
        message: str,
        db: Session = None,
        sent_by_id: int = None,
        application_id: int = None,
    ) -> bool:
        """
        Envoie un email et enregistre la notification en base de données.
        
        Args:
            recipient_email: Email du destinataire
            subject: Sujet de l'email
            message: Contenu de l'email (HTML)
            db: Session de base de données
            sent_by_id: ID de l'utilisateur qui envoie
            application_id: ID de la candidature associée
            
        Returns:
            bool: True si succès, False sinon
        """
        try:
            if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
                # Mode développement - logger seulement
                print(f"[EMAIL MODE DEV] To: {recipient_email}")
                print(f"[EMAIL MODE DEV] Subject: {subject}")
                print(f"[EMAIL MODE DEV] Message: {message}")
                
                # Sauvegarder quand même en base de données
                if db:
                    notification = EmailNotification(
                        recipient_email=recipient_email,
                        subject=subject,
                        message=message,
                        sent_by_id=sent_by_id,
                        application_id=application_id,
                    )
                    db.add(notification)
                    db.commit()
                return True

            # Mode production - envoyer vraiment l'email
            server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = settings.SMTP_FROM_EMAIL
            msg["To"] = recipient_email

            part = MIMEText(message, "html")
            msg.attach(part)

            server.sendmail(
                settings.SMTP_FROM_EMAIL,
                [recipient_email],
                msg.as_string(),
            )
            server.quit()

            # Enregistrer la notification en base de données
            if db:
                from datetime import datetime
                notification = EmailNotification(
                    recipient_email=recipient_email,
                    subject=subject,
                    message=message,
                    sent_by_id=sent_by_id,
                    application_id=application_id,
                    sent_at=datetime.utcnow(),
                )
                db.add(notification)
                db.commit()

            return True

        except Exception as e:
            print(f"Erreur lors de l'envoi d'email : {str(e)}")
            return False

    @staticmethod
    def send_invitation_email(
        candidate_name: str,
        candidate_email: str,
        job_offer_title: str,
        company_name: str,
        db: Session = None,
        sent_by_id: int = None,
        application_id: int = None,
    ) -> bool:
        """
        Envoie une invitation à un candidat retenu.
        """
        subject = f"Invitation - {job_offer_title} chez {company_name}"
        
        message = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Invitation à une entrevue</h2>
                <p>Chère {candidate_name},</p>
                
                <p>Bravo! Vous avez été sélectionné(e) pour passer à l'étape suivante du processus de sélection 
                pour le poste de <strong>{job_offer_title}</strong> chez <strong>{company_name}</strong>.</p>
                
                <p>Nous aimerions vous inviter à une entrevue pour discuter de cette opportunité.</p>
                
                <p>Veuillez consulter votre tableau de bord ou contactez directement le responsable 
                du recrutement pour plus de détails.</p>
                
                <br>
                <p>Cordialement,<br>
                L'équipe de gestion des offres d'emploi<br>
                Mairie de Goma</p>
            </body>
        </html>
        """
        
        return EmailService.send_email(
            recipient_email=candidate_email,
            subject=subject,
            message=message,
            db=db,
            sent_by_id=sent_by_id,
            application_id=application_id,
        )

    @staticmethod
    def send_rejection_email(
        candidate_name: str,
        candidate_email: str,
        job_offer_title: str,
        company_name: str,
        db: Session = None,
        sent_by_id: int = None,
        application_id: int = None,
    ) -> bool:
        """
        Envoie un email de rejet à un candidat.
        """
        subject = f"Candidature - {job_offer_title} chez {company_name}"
        
        message = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Mise à jour de votre candidature</h2>
                <p>Chère {candidate_name},</p>
                
                <p>Merci de votre intérêt pour le poste de <strong>{job_offer_title}</strong> chez <strong>{company_name}</strong>.</p>
                
                <p>Après examen attentif de votre candidature, nous regrettons de vous informer que 
                nous avons décidé de poursuivre avec d'autres candidats.</p>
                
                <p>Nous vous encourageons à postuler à d'autres offres d'emploi qui correspondent à votre profil.</p>
                
                <br>
                <p>Cordialement,<br>
                L'équipe de gestion des offres d'emploi<br>
                Mairie de Goma</p>
            </body>
        </html>
        """
        
        return EmailService.send_email(
            recipient_email=candidate_email,
            subject=subject,
            message=message,
            db=db,
            sent_by_id=sent_by_id,
            application_id=application_id,
        )
