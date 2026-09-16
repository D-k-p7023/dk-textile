import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# ---------------------------------------------------------
# DATABASE CONFIGURATION
# ---------------------------------------------------------

# On Render:
# DATABASE_URL will come from Render Environment Variables.
#
# On your local computer:
# If DATABASE_URL does not exist, SQLite will be used.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./dk_textile.db"
)


# Render may provide the PostgreSQL URL starting with
# "postgres://". SQLAlchemy expects "postgresql://".
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgres://",
        "postgresql://",
        1
    )


# ---------------------------------------------------------
# DATABASE ENGINE
# ---------------------------------------------------------

if DATABASE_URL.startswith("sqlite"):
    # SQLite configuration for local development
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL configuration for Render
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )


# ---------------------------------------------------------
# DATABASE SESSION
# ---------------------------------------------------------

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ---------------------------------------------------------
# BASE MODEL
# ---------------------------------------------------------

Base = declarative_base()