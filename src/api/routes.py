# """
# This module takes care of starting the API Server, Loading the DB and Adding the endpoints
# """
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Documents, Favorites, Task, Leaderboard
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import os


api = Blueprint('api', __name__)
CORS(api, resources={r"/*": {"origins": os.getenv("FRONT_URL"), "allow_headers": ["Authorization", "Content-Type"], "supports_credentials": True}})

@api.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] =  os.getenv("FRONT_URL")
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE'
    return response

## CRUD Users:
@api.route('/signup', methods=['POST'])
def handle_create_user():
    
    body = request.get_json()
    
    if body is None:
        return jsonify({'msg': 'Error'}), 400
    if "username" not in body: 
        return jsonify({'msg': 'Error'}), 400
    if "email" not in body: 
        return jsonify({'msg': 'Error'}), 400
    if "password" not in body: 
        return jsonify({'msg': 'Error'}), 400
    
    user = User()
    
    user.username = body["username"]
    user.email = body["email"]
    user.password = body["password"]
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({}), 201


@api.route('/auth', methods=['POST'])
def handle_auth():
    body = request.get_json()
    
    if body is None:
        return jsonify({'msg': 'Error'}), 400
    if "id" not in body:
        return jsonify({'msg': 'Error'}), 400
    if "username" not in body: 
        return jsonify({'msg': 'Error'}), 400
    if "email" not in body: 
        return jsonify({'msg': 'Error'}), 400
    if "password" not in body: 
        return jsonify({'msg': 'Error'}), 400
    
    user = User.query.filter_by( 
         id = body["id"], 
         username = body["username"], 
         email = body["email"], 
         password = body["password"]).first()
    
    if user is None: 
        return jsonify({'msg': 'user not found'}), 401
    
    token = create_access_token(identity= user.email)
    
    
    return jsonify({'token': token}), 200


@api.route('/users', methods=['GET'])
def handle_get_users():
    
    all_users = User.query.all()
    all_users = list(map(lambda x: x.serialize(), all_users))

    return jsonify(all_users), 200


@api.route('/user/<int:id>', methods=['GET'])
def handle_get_user(id):
    
    user = User.query.get(id)
    user = user.serialize()

    return jsonify(user), 200

@api.route('/user/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_email = get_jwt_identity()
    print("Authenticated user email:", current_user_email)

    user = User.query.filter_by(email=current_user_email).first()

    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    return jsonify(user.serialize()), 200

@api.route('/user/<int:id>', methods=['DELETE'])
@jwt_required()  
def handle_delete_user(id):
    
    current_user = get_jwt_identity()
    
    user = User.query.get(id)

    if user is None:
        return jsonify({'msg': 'id does not exist'}), 404
    if user.username != current_user and not current_user == "admin":
        return jsonify({'msg': 'Permission denied'}), 403 
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({}), 204

@api.route('/user/<int:id>', methods=['PUT'])
@jwt_required() 
def handle_update_user(id):
    current_user = get_jwt_identity()

    user = User.query.get(id)

    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    if user.id != int(current_user) and current_user != "admin":
        return jsonify({'msg': 'Permission denied'}), 403

    body = request.get_json()

    if "username" in body:
        user.username = body["username"]
    if "email" in body:
        user.email = body["email"]

    db.session.commit()

    return jsonify(user.serialize()), 200

@api.route('/dashboard', methods=['GET'])
@jwt_required()
def handle_dashboard():
    
    current_user_email = get_jwt_identity() 
    
    user = User.query.filter_by(email=current_user_email).first()
    if user is None:
        return jsonify({'msg': 'user not exist'}), 404 

    response_body = {
        "message": f"This is the dashboard for user: {current_user_email}"
    }

    return jsonify(response_body), 200


@api.route('/search', methods=['GET'])
@jwt_required() 
def handle_search():
    
    current_user_email = get_jwt_identity()
    
    user = User.query.filter_by(email=current_user_email).first()
    if user is None:
        return jsonify({'msg': 'user not exist'}), 404

    response_body = {
        "message": f"This is the search section for user: {current_user_email}"
    }

    return jsonify(response_body), 200


@api.route('/login', methods=['POST'])
def login_user():
    body = request.get_json()

    if not body or "email" not in body or "password" not in body:
        return jsonify({'msg': 'Faltan credenciales'}), 400

    email = body["email"]
    password = body["password"]

    user = User.query.filter_by(email=email, password=password).first()  # Comparación directa

    if user is None: 
        return jsonify({'msg': 'Credenciales inválidas'}), 401

    # Convertir user.id a string antes de generar el token
    token = create_access_token(identity=str(user.id))

    return jsonify({'msg': 'Inicio de sesión exitoso', 'token': token}), 200

## CRUD Documents:
@api.route('/documents', methods=['POST'])
def handle_create_document():
    
    body = request.get_json()

    if body is None:
        return jsonify({'msg': 'Error'}), 400
    if "title" not in body:
        return jsonify({'msg': 'Title is required'}), 400
    if "description" not in body:
        return jsonify({'msg': 'Description is required'}), 400
    if "type" not in body:
        return jsonify({'msg': 'Type is required'}), 400
    if "subject" not in body:
        return jsonify({'msg': 'Subject is required'}), 400

    document = Documents(
        title=body["title"],
        description=body["description"],
        type=body["type"],
        subject=body["subject"]
    )
    
    db.session.add(document)
    db.session.commit()

    return jsonify(document.serialize()), 201


@api.route('/documents', methods=['GET'])
def handle_get_documents():
    
    all_documents = Documents.query.all()
    all_documents = list(map(lambda x: x.serialize(), all_documents))

    return jsonify(all_documents), 200


@api.route('/document/<int:id>', methods=['GET'])
def handle_get_document(id):
    
    document = Documents.query.get(id)
    
    if document is None:
        return jsonify({'msg': 'Document not found'}), 404

    return jsonify(document.serialize()), 200


@api.route('/document/<int:id>', methods=['PUT'])
def handle_update_document(id):
    
    document = Documents.query.get(id)

    if document is None:
        return jsonify({'msg': 'Document not found'}), 404

    body = request.get_json()

    if "title" in body:
        document.title = body["title"]
    if "description" in body:
        document.description = body["description"]
    if "type" in body:
        document.type = body["type"]
    if "subject" in body:
        document.subject = body["subject"]

    db.session.commit()

    return jsonify(document.serialize()), 200


@api.route('/document/<int:id>', methods=['DELETE'])
def handle_delete_document(id):
    
    document = Documents.query.get(id)

    if document is None:
        return jsonify({'msg': 'Document not found'}), 404

    db.session.delete(document)
    db.session.commit()

    return jsonify({}), 204


## CRUD Favorites
@api.route('/favorites', methods=['POST'])
@jwt_required()
def create_favorite():

    current_user_id = get_jwt_identity()
    body = request.get_json()

    if not body or "documents_id" not in body:
        return jsonify({'msg': 'Faltan datos'}), 400

    document = Documents.query.get(body["documents_id"])
    if not document:
        return jsonify({'msg': 'Documento no encontrado'}), 404

    new_favorite = Favorites(user_id=current_user_id, documents_id=body["documents_id"])
    
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({'msg': 'Favorito agregado correctamente', 'favorite': new_favorite.id}), 201


@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    try:
        current_user_id = get_jwt_identity()
        favorites = Favorites.query.filter_by(user_id=current_user_id).all()

        if not favorites:
            return jsonify({"message": "No hay favoritos"}), 200

        result = [{
            "id": fav.id,
            "document_id": fav.documents.id,
            "document_title": fav.documents.title,
            "document_type": fav.documents.type
        } for fav in favorites]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": "Error interno", "message": str(e)}), 500


@api.route('/favorites/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(id):

    current_user_id = get_jwt_identity()
    
    favorite = Favorites.query.filter_by(id=id, user_id=current_user_id).first()
    
    if not favorite:
        return jsonify({'msg': 'Favorito no encontrado'}), 404

    db.session.delete(favorite)
    db.session.commit()
    
    return jsonify({'msg': 'Favorito eliminado correctamente'}), 200


## CRUD tasks for calendar
@api.route('/tasks', methods=['POST'])
@jwt_required()
def handle_create_task():
    
    body = request.get_json()

    if body is None:
        return jsonify({'msg': 'Error'}), 400
    if "name" not in body:
        return jsonify({'msg': 'Name is required'}), 400
    if "due_date" not in body:
        return jsonify({'msg': 'Due date is required'}), 400

    current_user_email = get_jwt_identity()
    
    user: User = User.query.filter_by(email=current_user_email).first()

    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    task = Task(
        name=body["name"],
        description=body["description"],
        due_date=body["due_date"],
        user_id=user.id
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.serialize()), 201


@api.route('/tasks', methods=['GET'])
@jwt_required()
def handle_get_tasks():
    
    current_user_email = get_jwt_identity()
    
    user = User.query.filter_by(email=current_user_email).first()
    
    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    tasks = Task.query.filter_by(user_id=user.id).all()
    
    result = [task.serialize() for task in tasks]

    return jsonify(result), 200


@api.route('/tasks/<int:id>', methods=['GET'])
@jwt_required()
def handle_get_task(id):
    
    current_user_email = get_jwt_identity()
    
    user = User.query.filter_by(email=current_user_email).first()
    
    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    task = Task.query.filter_by(id=id, user_id=user.id).first()
    
    if task is None:
        return jsonify({'msg': 'Task not found'}), 404

    return jsonify(task.serialize()), 200


@api.route('/tasks/<int:id>', methods=['PUT'])
@jwt_required()
def handle_update_task(id):
    
    current_user_email = get_jwt_identity()
    
    user = User.query.filter_by(email=current_user_email).first()
    
    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    task = Task.query.filter_by(id=id, user_id=user.id).first()
    
    if task is None:
        return jsonify({'msg': 'Task not found'}), 404

    body = request.get_json()

    if "name" in body:
        task.name = body["name"]
    if "description" in body:
        task.description = body["description"]
    if "due_date" in body:
        task.due_date = body["due_date"]
    if "completed" in body:
        task.completed = body["completed"]

    db.session.commit()

    return jsonify(task.serialize()), 200


@api.route('/tasks/<int:id>', methods=['DELETE'])
@jwt_required()
def handle_delete_task(id):
    
    current_user_email = get_jwt_identity()
    
    user = User.query.filter_by(email=current_user_email).first()
    
    if user is None:
        return jsonify({'msg': 'User not found'}), 404

    task = Task.query.filter_by(id=id, user_id=user.id).first()
    
    if task is None:
        return jsonify({'msg': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({'msg': 'Task deleted successfully'}), 200

@api.route('/achievements', methods=['GET'])
@jwt_required()
def get_achievements():
    try:
        current_user_id = get_jwt_identity()

        # Simulación de días consecutivos (Esto debería ser obtenido de la base de datos)
        user = User.query.get(current_user_id)
        days_logged = user.consecutive_days if user else 0

        # Lista de logros desbloqueados
        unlocked = [ach for ach in [3, 5, 10, 15, 30] if days_logged >= ach]

        return jsonify(unlocked), 200  # 🔹 Devuelve JSON correctamente

    except Exception as e:
        print(f"Error en /achievements: {e}")  # 🔍 Log para ver errores en la terminal
        return jsonify({"error": "Error interno", "message": str(e)}), 500
    
# ------------------- USER PROGRESS -------------------
@api.route("/api/user/<int:user_id>", methods=["GET"])
def get_user_progress(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())

# ------------------- BADGES -------------------
@api.route("/api/badges/<int:user_id>", methods=["GET"])
def get_badges(user_id):
    user = User.query.get(user_id)
    if not user:
        print(f"❌ Usuario con ID {user_id} no encontrado en la base de datos.")
        return jsonify({"error": "User not found"}), 404

    user_badges = UserBadge.query.filter(UserBadge.user_id == user.id).all()
    if not user_badges:
        print(f"❌ El usuario con ID {user_id} no tiene insignias asignadas.")
        return jsonify({"error": "User has no badges"}), 404

    badges_data = [{"id": ub.badge.id, "name": ub.badge.name, "icon": ub.badge.icon} for ub in user_badges]
    print(f"✅ Insignias del usuario {user.username}: {badges_data}")
    return jsonify(badges_data)

# ------------------- LEADERBOARD -------------------
@api.route("/leaderboard", methods=["GET"])
def get_leaderboard():
    leaderboard = Leaderboard.query.order_by(Leaderboard.points.desc()).all()

    if not leaderboard:
        print("❌ No hay datos en el ranking.")
        return jsonify({"error": "Leaderboard is empty"}), 404

    leaderboard_data = []
    for entry in leaderboard:
        user = User.query.get(entry.user_id)
        if user:
            leaderboard_data.append({
                "user_id": entry.user_id,
                "username": user.username,
                "points": entry.points
            })
    
    print(f"✅ Datos del leaderboard: {leaderboard_data}")
    return jsonify(leaderboard_data)

# ------------------- ADD EXPERIENCE -------------------
@api.route("/user/<int:user_id>/add_xp", methods=["POST"])
def add_experience(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    xp_to_add = data.get("xp", 0)

    user.experience += xp_to_add
    db.session.commit()
    
    return jsonify({"message": f"Added {xp_to_add} XP", "new_experience": user.experience})

# ------------------- ADD BADGE -------------------
@api.route("/user/<int:user_id>/add_badge/<int:badge_id>", methods=["POST"])
def add_badge(user_id, badge_id):
    user = User.query.get(user_id)
    badge = Badge.query.get(badge_id)

    if not user or not badge:
        return jsonify({"message": "User or Badge not found"}), 404

    existing = UserBadge.query.filter_by(user_id=user_id, badge_id=badge_id).first()
    if existing:
        return jsonify({"message": "Badge already earned"}), 400

    new_badge = UserBadge(user_id=user_id, badge_id=badge_id)
    db.session.add(new_badge)
    db.session.commit()

    return jsonify({"message": f"Badge '{badge.name}' added to user {user.username}"})

# ------------------- INIT DATABASE -------------------
@api.route("/init_db", methods=["POST"])
def init_db():
    db.create_all()
    return jsonify({"message": "Database initialized"})