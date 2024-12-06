from sqlalchemy import Column, String, Text, Integer, create_engine
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Corps(db.Model):
    _id = db.Column(db.Integer, primary_key=True)
    partie = db.Column(db.String(255), unique=True)
    parrallele = db.relationship(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    numero_schema = db.Column(db.Integer)


class Parrallele(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    __tablename__ = 'html_content'
    title = db.Column(String(255))  # Title of the content
    content = db.Column(Text)
