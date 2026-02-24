from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional
from enum import Enum

class BillingCycle(str, Enum):
    monthly = 'monthly'
    yearly = 'yearly'

class SubscriptionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    cost: float = Field(..., gt=0.0)
    billing_cycle: BillingCycle
    next_billing_date: date
    category: str = Field(..., min_length=1, max_length=100)
    is_active: bool = True
    
    @field_validator('cost')
    @classmethod
    def cost_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Cost must be strictly positive')
        return v

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    cost: Optional[float] = Field(None, gt=0.0)
    billing_cycle: Optional[BillingCycle] = None
    next_billing_date: Optional[date] = None
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    is_active: Optional[bool] = None

class SubscriptionResponse(SubscriptionBase):
    id: int

    model_config = {
        "from_attributes": True
    }
