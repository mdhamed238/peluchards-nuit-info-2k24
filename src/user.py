from src import db
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from werkzeug.security import check_password_hash


class User(db.Model):
    id: Mapped[Integer] = mapped_column(primary_key=True)
    username: Mapped[String] = mapped_column(unique=True)
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    collaborator = Mapped[bool] = mapped_column(default=False)
    def check_password_verification(self, password):
        return check_password_hash(self.password)
