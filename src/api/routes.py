# """
# This module takes care of starting the API Server, Loading the DB and Adding the endpoints
# """
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Documents
from app import  dbx
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import os
import dropbox, dropbox.exceptions, dropbox.files


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



@api.route('/dashboard', methods=['POST', 'GET'])
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


@api.route('/search', methods=['POST', 'GET'])
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

# Nueva ruta para login y autenticación
@api.route('/login', methods=['POST'])
def login_user():
    # Ruta para autenticar a un usuario con email y password.
    # Genera un token JWT si las credenciales son válidas.
    body = request.get_json()
    if body is None or "email" not in body or "password" not in body:
        return jsonify({'msg': 'Faltan credenciales'}), 400
    email = request.get_json()['email']
    password = request.get_json()['password']
    # Buscar usuario por email
    user = User.query.filter_by(email=email, password=password).first()
    if user is None or not user.password == password:  # Comprobar que el usuario exista y la contraseña coincida
        return jsonify({'msg': 'Credenciales inválidas'}), 401
    # Generar el token JWT
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


## CRUD favorites:

## CRUD upload && download from dropbox:

@api.route('/upload_to_dropbox', methods=['POST'])
@jwt_required()  
def upload_to_dropbox():
    
    file = request.files.get('file')
    
    if not file:
        return jsonify({'msg': 'No file provided'}), 400
    
    
    filename = file.filename
    dropbox_path = f"/{filename}" 

    try:
        
        dbx.files_upload(file.read(), dropbox_path, mode=dropbox.files.WriteMode.overwrite)
        return jsonify({'msg': f'File {filename} uploaded successfully to Dropbox.'}), 201
    except dropbox.exceptions.ApiError as e:
        return jsonify({'msg': f'Error uploading file to Dropbox: {e.error}'}), 500



