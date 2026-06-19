from sqlalchemy.orm import Session

from .database import SessionLocal
from .models.company import Company
from .models.permission import Permission
from .models.public_authority import PublicAuthority
from .models.role import Role
from .models.user import User
from .security.password import hash_password


PERMISSIONS = [
    "user:read",
    "user:create",
    "user:update",
    "user:activate",
    "user:deactivate",
    "role:read",
    "role:create",
    "role:update",
    "role:delete",
    "permission:read",
    "permission:create",
    "permission:update",
    "permission:delete",
    "permission:assign",
    "company:create",
    "company:read",
    "company:update",
    "company:verify",
    "tender:create",
    "tender:read",
    "tender:update",
    "tender:publish",
    "tender:close",
    "tender:cancel",
    "tender:evaluate",
    "dao:create",
    "dao:read",
    "dao:update",
    "dao:upload",
    "offer:create",
    "offer:read_own",
    "offer:read_all",
    "offer:evaluate",
    "offer:award",
    "offer:reject",
    "offer_document:upload",
    "offer_document:read",
    "offer_document:delete",
    "public_contract:create",
    "public_contract:read",
    "public_contract:sign",
    "public_contract:cancel",
    "contract:create",
    "contract:read",
    "contract:update",
    "contract:upload",
    "contract:sign",
    "execution:create",
    "execution:read",
    "execution:update",
    "execution:start",
    "execution:complete",
    "dashboard:admin",
    "dashboard:authority",
    "dashboard:company",
    "audit:read",
]

ROLE_DEFINITIONS = {
    "admin": {
        "description": "Administrateur de la Mairie de Goma",
        "permissions": PERMISSIONS,
    },
    "autorite_publique": {
        "description": "Agent habilite de la Mairie de Goma",
        "permissions": PERMISSIONS,
    },
    "entreprise": {
        "description": "Entreprise soumissionnaire",
        "permissions": [
            "company:create",
            "company:read",
            "company:update",
            "tender:read",
            "dao:read",
            "offer:create",
            "offer:read_own",
            "offer_document:upload",
            "offer_document:read",
            "offer_document:delete",
            "public_contract:read",
            "contract:read",
            "execution:read",
            "dashboard:company",
        ],
    },
    "commission_evaluation": {
        "description": "Membre de la commission d'evaluation",
        "permissions": [
            "tender:read",
            "offer:read_all",
            "offer:evaluate",
            "dao:read",
            "offer_document:read",
        ],
    },
}


def get_or_create_role(db: Session, name: str, description: str) -> Role:
    role = db.query(Role).filter(Role.name == name).first()
    if role:
        role.description = description
        return role

    role = Role(name=name, description=description)
    db.add(role)
    db.flush()
    return role


def get_or_create_permission(db: Session, name: str) -> Permission:
    permission = db.query(Permission).filter(Permission.name == name).first()
    if permission:
        return permission

    permission = Permission(name=name, description=f"Permission {name}")
    db.add(permission)
    db.flush()
    return permission


def get_or_create_user(db: Session, email: str, full_name: str, password: str, role: Role) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        user.full_name = full_name
        user.role_id = role.id
        user.is_active = True
        return user

    user = User(
        email=email,
        full_name=full_name,
        hashed_password=hash_password(password),
        role_id=role.id,
        is_active=True,
    )
    db.add(user)
    db.flush()
    return user


def get_or_create_public_authority(db: Session, user: User) -> PublicAuthority:
    authority = db.query(PublicAuthority).filter(PublicAuthority.name == "Mairie de Goma").first()
    if not authority:
        authority = PublicAuthority(
            name="Mairie de Goma",
            description="Institution etatique chargee de la gestion administrative de la ville de Goma",
            budget=0,
            address="Goma, Nord-Kivu, RDC",
            phone=None,
            email="contact@mairiegoma.cd",
            user_id=user.id,
        )
        db.add(authority)
        db.flush()
        return authority

    authority.description = "Institution etatique chargee de la gestion administrative de la ville de Goma"
    authority.budget = authority.budget or 0
    authority.email = authority.email or "contact@mairiegoma.cd"
    authority.user_id = user.id
    return authority


def get_or_create_company(db: Session, user: User, name: str) -> Company:
    company = db.query(Company).filter(Company.owner_id == user.id).first()
    if company:
        company.name = name
        company.email = company.email or user.email
        return company

    company = Company(
        name=name,
        email=user.email,
        owner_id=user.id,
        is_verified=True,
    )
    db.add(company)
    db.flush()
    return company


def seed_database(verbose: bool = True) -> None:
    db = SessionLocal()
    try:
        permissions = {name: get_or_create_permission(db, name) for name in PERMISSIONS}

        roles = {}
        for role_name, definition in ROLE_DEFINITIONS.items():
            role = get_or_create_role(db, role_name, definition["description"])
            role.permissions = [permissions[name] for name in definition["permissions"]]
            roles[role_name] = role

        get_or_create_user(
            db,
            email="admin@mairiegoma.cd",
            full_name="Administrateur Mairie de Goma",
            password="Admin@12345",
            role=roles["admin"],
        )

        authority_user = get_or_create_user(
            db,
            email="autorite@mairiegoma.cd",
            full_name="Autorite Publique Mairie de Goma",
            password="Autorite@12345",
            role=roles["autorite_publique"],
        )
        get_or_create_public_authority(db, authority_user)

        get_or_create_user(
            db,
            email="commission@mairiegoma.cd",
            full_name="Commission d'evaluation Mairie de Goma",
            password="Commission@12345",
            role=roles["commission_evaluation"],
        )

        enterprise_user = get_or_create_user(
            db,
            email="entreprise@demo.cd",
            full_name="Responsable Entreprise Demo",
            password="Entreprise@12345",
            role=roles["entreprise"],
        )
        get_or_create_company(db, enterprise_user, "Entreprise Demo Goma")

        db.commit()

        if verbose:
            print("Seed termine avec succes.")
            print("Admin: admin@mairiegoma.cd / Admin@12345")
            print("Autorite publique: autorite@mairiegoma.cd / Autorite@12345")
            print("Commission evaluation: commission@mairiegoma.cd / Commission@12345")
            print("Entreprise demo: entreprise@demo.cd / Entreprise@12345")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
