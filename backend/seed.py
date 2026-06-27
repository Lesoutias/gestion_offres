from app.seed_data import SUBMISSION_DOCUMENT_TYPES, seed_database


# Catalogue des 20 pieces que l'autorite locale peut exiger dans un DAO.
DOCUMENTS_NECESSAIRES = SUBMISSION_DOCUMENT_TYPES


if __name__ == "__main__":
    seed_database(verbose=True)
