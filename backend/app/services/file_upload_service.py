import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from ..config import settings


class FileUploadService:
    ALLOWED_MIME_TYPES = {
        "application/pdf",
        "image/png",
        "image/jpeg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx"}

    @classmethod
    def validate_file(cls, file: UploadFile) -> None:
        suffix = Path(file.filename or "").suffix.lower()
        if suffix not in cls.ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Extension de fichier non autorisee")
        if file.content_type not in cls.ALLOWED_MIME_TYPES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Type MIME non autorise")
        if file.size and file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Fichier trop volumineux")

    @classmethod
    async def save_upload(cls, file: UploadFile, folder: str) -> dict[str, str]:
        cls.validate_file(file)
        upload_dir = Path(settings.UPLOAD_DIR) / folder
        upload_dir.mkdir(parents=True, exist_ok=True)
        suffix = Path(file.filename or "").suffix.lower()
        safe_name = f"{uuid.uuid4().hex}{suffix}"
        path = upload_dir / safe_name
        content = await file.read()
        path.write_bytes(content)
        return {
            "file_url": f"/uploads/{folder}/{safe_name}",
            "file_name": file.filename or safe_name,
            "file_mime_type": file.content_type or "application/octet-stream",
        }
