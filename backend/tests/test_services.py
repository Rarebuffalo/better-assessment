import pytest
from datetime import date
from pydantic import ValidationError
from app.schemas import SubscriptionCreate, SubscriptionUpdate
from app.services import SubscriptionService

def test_create_subscription(db_session):
    sub_data = SubscriptionCreate(
        name="Netflix",
        cost=15.99,
        billing_cycle="monthly",
        next_billing_date=date(2024, 1, 1),
        category="Entertainment"
    )
    sub = SubscriptionService.create_subscription(db_session, sub_data)
    assert sub.id is not None
    assert sub.name == "Netflix"
    assert sub.cost == 15.99
    assert sub.is_active is True

def test_schema_validation_prevents_invalid_cost():
    # Cost must be positive, this simulates schema rejection at the pydantic boundary
    with pytest.raises(ValidationError):
        SubscriptionCreate(
            name="Netflix",
            cost=-5.00,
            billing_cycle="monthly",
            next_billing_date=date(2024, 1, 1),
            category="Entertainment"
        )

def test_get_subscriptions(db_session):
    sub1 = SubscriptionCreate(
        name="Sub1", cost=10, billing_cycle="monthly", 
        next_billing_date=date.today(), category="A"
    )
    sub2 = SubscriptionCreate(
        name="Sub2", cost=20, billing_cycle="yearly", 
        next_billing_date=date.today(), category="B"
    )
    SubscriptionService.create_subscription(db_session, sub1)
    SubscriptionService.create_subscription(db_session, sub2)
    
    subs = SubscriptionService.get_subscriptions(db_session)
    assert len(subs) == 2

def test_delete_subscription(db_session):
    sub1 = SubscriptionCreate(
        name="Sub1", cost=10, billing_cycle="monthly", 
        next_billing_date=date.today(), category="A"
    )
    created_sub = SubscriptionService.create_subscription(db_session, sub1)
    
    success = SubscriptionService.delete_subscription(db_session, created_sub.id)
    assert success is True
    
    deleted_sub = SubscriptionService.get_subscription(db_session, created_sub.id)
    assert deleted_sub is None
