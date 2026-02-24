from sqlalchemy.orm import Session
from app.models import Subscription
from app.schemas import SubscriptionCreate, SubscriptionUpdate

class SubscriptionService:
    @staticmethod
    def get_subscriptions(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Subscription).offset(skip).limit(limit).all()

    @staticmethod
    def get_subscription(db: Session, subscription_id: int):
        return db.query(Subscription).filter(Subscription.id == subscription_id).first()

    @staticmethod
    def create_subscription(db: Session, sub_in: SubscriptionCreate):
        # Business logic can go here (like setting exact billing date if needed)
        db_sub = Subscription(**sub_in.model_dump())
        db.add(db_sub)
        db.commit()
        db.refresh(db_sub)
        return db_sub

    @staticmethod
    def update_subscription(db: Session, subscription_id: int, sub_update: SubscriptionUpdate):
        db_sub = SubscriptionService.get_subscription(db, subscription_id)
        if not db_sub:
            return None

        update_data = sub_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_sub, key, value)
            
        db.commit()
        db.refresh(db_sub)
        return db_sub

    @staticmethod
    def delete_subscription(db: Session, subscription_id: int):
        db_sub = SubscriptionService.get_subscription(db, subscription_id)
        if not db_sub:
            return False
        
        db.delete(db_sub)
        db.commit()
        return True
