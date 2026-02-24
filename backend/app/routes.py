from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from app.database import SessionLocal
from app.schemas import SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse
from app.services import SubscriptionService

bp = Blueprint('subscriptions', __name__, url_prefix='/api/subscriptions')

def get_db_session():
    # Helper to get db session in a flask thread
    return SessionLocal()

@bp.errorhandler(ValidationError)
def handle_validation_error(e):
    # This prevents invalid states natively by capturing Pydantic errors globally
    return jsonify({"error": "Validation Error", "details": e.errors()}), 400

@bp.route('', methods=['GET'])
def list_subscriptions():
    db = get_db_session()
    try:
        subs = SubscriptionService.get_subscriptions(db)
        # Parse through response schema to ensure exact interface adherence
        res = [SubscriptionResponse.model_validate(sub).model_dump(mode='json') for sub in subs]
        return jsonify(res), 200
    finally:
        db.close()

@bp.route('/<int:sub_id>', methods=['GET'])
def get_subscription(sub_id):
    db = get_db_session()
    try:
        sub = SubscriptionService.get_subscription(db, sub_id)
        if not sub:
            return jsonify({"error": "Not Found"}), 404
        return jsonify(SubscriptionResponse.model_validate(sub).model_dump(mode='json')), 200
    finally:
        db.close()

@bp.route('', methods=['POST'])
def create_subscription():
    db = get_db_session()
    try:
        # Will raise ValidationError if payload is bad
        schema = SubscriptionCreate(**request.json)
        sub = SubscriptionService.create_subscription(db, schema)
        return jsonify(SubscriptionResponse.model_validate(sub).model_dump(mode='json')), 201
    except ValidationError as e:
        return handle_validation_error(e)
    finally:
        db.close()

@bp.route('/<int:sub_id>', methods=['PUT'])
def update_subscription(sub_id):
    db = get_db_session()
    try:
        schema = SubscriptionUpdate(**request.json)
        sub = SubscriptionService.update_subscription(db, sub_id, schema)
        if not sub:
            return jsonify({"error": "Not Found"}), 404
        return jsonify(SubscriptionResponse.model_validate(sub).model_dump(mode='json')), 200
    except ValidationError as e:
        return handle_validation_error(e)
    finally:
        db.close()

@bp.route('/<int:sub_id>', methods=['DELETE'])
def delete_subscription(sub_id):
    db = get_db_session()
    try:
        success = SubscriptionService.delete_subscription(db, sub_id)
        if not success:
            return jsonify({"error": "Not Found"}), 404
        return '', 204
    finally:
        db.close()
