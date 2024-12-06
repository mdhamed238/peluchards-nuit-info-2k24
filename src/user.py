from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    editor = db.Column(db.Boolean, default=False)

    def __init__(self, username, password, editor=False):
        self.username = username
        self.password = generate_password_hash(password)
        self.editor = editor
    
    def check_password_verification(self, password):
        return check_password_hash(self.password, password)