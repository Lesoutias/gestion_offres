import os
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException, status

from ..config import settings


class FileService:
    ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
    UPLOAD_DIR = Path(settings.UPLOAD_DIR)

    @classmethod
    def initialize_upload_dir(cls):
        """Crée le répertoire d'upload s'il n'existe pas."""
        cls.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    @classmethod
    def validate_file(cls, file: UploadFile) -> bool:
        """Valide l'extension et la taille du fichier."""
        if file.size and file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Fichier trop volumineux. Taille maximale: {settings.MAX_FILE_SIZE / 1024 / 1024}MB",
            )

        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in cls.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Extension non autorisée. Extensions acceptées: {', '.join(cls.ALLOWED_EXTENSIONS)}",
            )

        return True

    @classmethod
    async def save_file(cls, file: UploadFile, application_id: int) -> dict:
        """
        Sauvegarde un fichier uploadé.
        
        Returns:
            dict: {"file_url": str, "file_name": str, "file_mime_type": str}
        """
        cls.initialize_upload_dir()
        cls.validate_file(file)

        # Créer un répertoire par candidature
        app_dir = cls.UPLOAD_DIR / f"application_{application_id}"
        app_dir.mkdir(parents=True, exist_ok=True)

        # Générer un nom de fichier unique
        file_ext = Path(file.filename).suffix.lower()
        import uuid
        unique_id = str(uuid.uuid4())[:8]
        new_filename = f"{unique_id}_{file.filename}"
        file_path = app_dir / new_filename

        # Sauvegarder le fichier
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # Retourner les informations du fichier
        return {
            "file_url": f"/uploads/application_{application_id}/{new_filename}",
            "file_name": file.filename,
            "file_mime_type": file.content_type,
        }

    @classmethod
    def delete_file(cls, file_url: str) -> bool:
        """Supprime un fichier."""
        try:
            # Convertir l'URL en chemin local
            file_path = Path("." + file_url)
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception as e:
            print(f"Erreur lors de la suppression du fichier: {str(e)}")
            return False

    @classmethod
    def get_file_path(cls, file_url: str) -> Path:
        """Retourne le chemin complet d'un fichier."""
        return Path("." + file_url)
