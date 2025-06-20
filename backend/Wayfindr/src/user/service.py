from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Set up password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    """
    Hashes a plain password using bcrypt.
    """
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password) -> bool:
    """
    Verifies a plain password against a hashed password.
    Returns True if they match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Creates a JWT access token with the given data and expiration.
    Uses SECRET_KEY and ALGORITHM from environment variables.
    """
    to_encode = data.copy()
    # Set expiration time for the token (default: very long if not provided)
    expire = datetime.now() + (expires_delta or timedelta(hours=9999999))
    to_encode.update({"exp": expire})
    # Encode the token using the secret key and algorithm
    return jwt.encode(to_encode, os.getenv('SECRET_KEY'), algorithm=os.getenv('ALGORITHM'))