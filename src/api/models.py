from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users' 

    id = db.Column(db.Integer, primary_key=True)  
    username = db.Column(db.String(50), nullable=False, unique=True) 
    email = db.Column(db.String(100), nullable=False, unique=True)  
    password = db.Column(db.String(250), nullable=False)  
    
    favorites = db.relationship('Favorites', back_populates='user')
    tasks = db.relationship('Task', back_populates='user') 
    
    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }


class Documents(db.Model): 
    __tablename__ = 'documents'  

    id = db.Column(db.Integer, primary_key=True)  
    title = db.Column(db.String(250), nullable=False)  
    description = db.Column(db.String(200), nullable=True)
    type = db.Column(db.String(100), nullable=False) 
    subject = db.Column(db.String(100), nullable=False)
    
    favorites = db.relationship('Favorites', back_populates='documents')
    
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'subject': self.subject
        }
    
    def __repr__(self):
        return f'<Document {self.title}>'


class Favorites(db.Model):  
    __tablename__ = 'favorites'  

    id = db.Column(db.Integer, primary_key=True) 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  
    documents_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False)  

    user = db.relationship('User', back_populates='favorites')
    documents = db.relationship('Documents', back_populates='favorites')

    def __repr__(self):
        return f'<Favorites user_id={self.user_id} document_id={self.documents_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "documents_id": self.documents_id
        }


class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    due_date = db.Column(db.DateTime)
    completed = db.Column(db.Boolean, default=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='tasks') 

    def __repr__(self):
        return f'<Task {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'due_date': self.due_date,
            'completed': self.completed,
            'user_id': self.user_id
        }
