# """
# This module takes care of starting the API Server, Loading the DB and Adding the endpoints
# """
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Documents, Favorites, Task
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import os


api = Blueprint('api', __name__)

@api.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] =  os.getenv("FRONT_URL")
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE'
    return response

CORS(api)

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
    if user.username != current_user and not current_user == "admin":
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
    
    if body is None or "email" not in body or "password" not in body:
        return jsonify({'msg': 'Faltan credenciales'}), 400
    
    email = request.get_json()['email']
    password = request.get_json()['password']

    user = User.query.filter_by(email=email, password=password).first()
    
    if user is None or not user.password == password: 
        return jsonify({'msg': 'Credenciales inválidas'}), 401
    
    token = create_access_token(identity=user.email)
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
    if "src_url" not in body:
        return jsonify({'msg': 'Url is required'}), 400

    document = Documents(
        title=body["title"],
        description=body["description"],
        type=body["type"],
        subject=body["subject"],
        src_url=body["src_url"]   
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
    if "src_url" in body:
        document.src_url = body["src_url"]

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

    current_user_id = get_jwt_identity()
    
    favorites = Favorites.query.filter_by(user_id=current_user_id).all()

    result = [{
        "id": fav.id,
        "document_id": fav.documents.id,
        "document_title": fav.documents.title,
        "document_type": fav.documents.type
    } for fav in favorites]

    return jsonify(result), 200


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

