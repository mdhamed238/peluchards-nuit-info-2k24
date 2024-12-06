from sqlalchemy import Column, String, Text, Integer, create_engine
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Corps(db.Model):
    _id = db.Column(db.Integer, primary_key=True)
    partie = db.Column(db.String(255), unique=True)
    parrallele = db.relationship(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Parrallele(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(String(255))  # Title of the content
    content = db.Column(Text)
    utilisateur = db.relationship(db._id, nullable=False,) # Chaque parallele a 1 utilisateur => 1 utilisateur peut avoir plusieurs parraleles proposés
