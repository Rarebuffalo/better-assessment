import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask import Flask

from app import create_app
from app.database import Base, get_db

# Use in-memory SQLite for testing to avoid disk IO and side effects
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def flask_app():
    _app = create_app({"TESTING": True})
    return _app

@pytest.fixture(scope="function")
def db_session():
    # Create the tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    # Teardown the tables
    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(flask_app, db_session):
    # Override get_db for testing to ensure we use the test DB
    import app.routes
    app.routes.get_db_session = lambda: db_session
    
    with flask_app.test_client() as client:
        yield client
