from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

from app.database import get_db
from app.config import settings
from app.models.user import User
from app.models.twin_profile import TwinProfile
from app.schemas.user_schema import UserRegister, UserLogin, Token, TwinProfileSchema

router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize Digital Twin Profile with seed defaults
    twin_profile = TwinProfile(
        user_id=user.id,
        primary_domain="education",
        goals=["Become a Data Analyst / AI Engineer", "Maintain physical health & 8hr sleep", "Grow personal savings"],
        interests=["Technology", "Data Analytics", "AI", "Reading"],
        strengths=["Problem Solving", "Mathematics", "Python"],
        budget="Medium",
        job_preference="Private",
        education_memory={"stream": "MPC", "target_degree": "B.Tech Data Science", "entrance_exam": "EAMCET"},
        health_memory={"age": 20, "gender": "Female", "blood_group": "O+", "allergies": ["Penicillin"]},
        business_memory={"type": "E-Commerce Retail", "monthly_revenue": 15000},
        personal_memory={"study_streak_days": 5, "sleep_average_hrs": 7.5},
        content_memory={"niche": "Tech & AI", "platform": "Instagram Reels"},
        customer_memory={"preferred_language": "English", "satisfaction_score": "High"}
    )
    db.add(twin_profile)
    db.commit()

    token = create_access_token({"sub": user.email, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = create_access_token({"sub": user.email, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }

@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at
    }
