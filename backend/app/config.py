import os

class Settings:
    PROJECT_NAME: str = "AI Twin — Agentic Decision Intelligence Platform"
    VERSION: str = "1.0.0"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ai_twin_secret_key_super_secure_2026_dev")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # DB URL: MySQL supported with SQLite fallback if MySQL is not running or specified
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "root")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "aitwin_db")
    
    USE_MYSQL: bool = os.getenv("USE_MYSQL", "false").lower() == "true"

    @property
    def DATABASE_URL(self) -> str:
        if self.USE_MYSQL:
            return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        # SQLite fallback for effortless zero-config local run
        return "sqlite:///./aitwin.db"

settings = Settings()
