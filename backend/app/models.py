from sqlalchemy import Boolean, Column, Float, Integer, String, Date
from app.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    cost = Column(Float, nullable=False)
    # e.g., 'monthly', 'yearly'
    billing_cycle = Column(String(50), nullable=False)
    next_billing_date = Column(Date, nullable=False)
    category = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
