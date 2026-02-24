from flask import Flask, jsonify
from flask_cors import CORS
from app.database import engine, Base

def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app)

    # Initialize the database
    Base.metadata.create_all(bind=engine)

    # Register blueprints
    from app.routes import bp as subscriptions_bp
    app.register_blueprint(subscriptions_bp)

    @app.route("/")
    def index():
        return jsonify({
            "name": "SubTrack API", 
            "status": "running", 
            "docs": "Endpoints available at /api/subscriptions"
        }), 200

    @app.route("/health")
    def health_check():
        return jsonify({"status": "healthy"}), 200

    @app.errorhandler(404)
    def resource_not_found(e):
        return jsonify(error=str(e)), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify(error="Internal server error"), 500

    return app
