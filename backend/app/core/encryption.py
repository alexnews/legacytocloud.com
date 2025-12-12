"""Simple encryption for storing database passwords."""
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

from app.core.config import get_settings

settings = get_settings()


def _get_fernet() -> Fernet:
    """Get Fernet instance using SECRET_KEY."""
    # Derive a proper key from the secret key
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=b"legacytocloud_salt",  # Static salt, key is from secret_key
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(settings.secret_key.encode()))
    return Fernet(key)


def encrypt_password(password: str) -> str:
    """Encrypt a password for storage."""
    f = _get_fernet()
    encrypted = f.encrypt(password.encode())
    return encrypted.decode()


def decrypt_password(encrypted_password: str) -> str:
    """Decrypt a stored password."""
    f = _get_fernet()
    decrypted = f.decrypt(encrypted_password.encode())
    return decrypted.decode()
