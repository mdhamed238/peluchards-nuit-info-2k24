from werkzeug.security import generate_password_hash
from src.quiz import db, Quiz, Question, Option
from src.user import User
from src.seed import ocean_quiz_data, human_body_quiz_data

class DatabaseManager:
    @staticmethod
    def init_db(app):
        with app.app_context():
            db.create_all()
            DatabaseManager._populate_db()

    @staticmethod
    def _populate_db():
        try:
            # Create default admin user if doesn't exist
            admin_user = User.query.filter_by(username='admin').first()
            if not admin_user:
                admin_user = User(
                    username='admin',
                    password='UniAd@@',
                    editor=True
                )
                db.session.add(admin_user)
                db.session.commit()
                print("Default admin user created successfully!")

            # Clear existing quiz data
            Option.query.delete()
            Question.query.delete()
            Quiz.query.delete()
            
            # Import quizzes
            DatabaseManager._import_quiz(ocean_quiz_data)
            DatabaseManager._import_quiz(human_body_quiz_data)
            
            print("Database populated successfully!")
            
        except Exception as e:
            db.session.rollback()
            print(f"Error populating database: {str(e)}")

    @staticmethod
    def _import_quiz(quiz_data):
        # Create quiz
        quiz = Quiz(
            title=quiz_data["title"],
            description=quiz_data["description"]
        )
        db.session.add(quiz)
        db.session.commit()

        # Add questions and options
        for q_data in quiz_data["questions"]:
            question = Question(
                quiz_id=quiz._id,
                question_text=q_data["question_text"]
            )
            db.session.add(question)
            db.session.commit()

            for opt_data in q_data["options"]:
                option = Option(
                    question_id=question._id,
                    option_text=opt_data["option_text"],
                    is_correct=opt_data["is_correct"]
                )
                db.session.add(option)
            
        db.session.commit()