from flask import Flask, jsonify, render_template, redirect, url_for, request
from flask_cors import CORS
from src.config import Config
from src.quiz import db
from src.database import DatabaseManager
from src.quiz import Quiz, Question
import json
from src.quiz import Quiz, Question, User, Corps
from src.routes import init_routes

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

init_routes(app)

@app.route("/users")
def user_list():
    users = db.session.execute(db.select(User).order_by(User.username)).scalars()
    return render_template("user/list.html", users=users)


@app.route("/users/create", methods=["GET", "POST"])
def user_create():
    if request.method == "POST":
        user = User(
            username=request.form["username"],
            email=request.form["email"],
            password=request.form["password"]
        )
        db.session.add(user)
        db.session.commit()
        return redirect("index")

    return render_template("user/create.html")


@app.route("/user/<int:id>")
def user_detail(id):
    user = db.get_or_404(User, id)
    return render_template("user/detail.html", user=user)


@app.route("/user/<int:id>/delete", methods=["GET", "POST"])
def user_delete(id):
    user = db.get_or_404(User, id)

    if request.method == "POST":
        db.session.delete(user)
        db.session.commit()
        return redirect(url_for("user_list"))

    return render_template("user/delete.html", user=user)


@app.route('/api/quizzes', methods=['GET'])
def get_all_quizzes():
    quizzes = Quiz.query.all()
    return jsonify({
        'quizzes': [
            {
                '_id': quiz._id,
                'title': quiz.title,
                'description': quiz.description,
                'created_at': quiz.created_at.isoformat()
            } for quiz in quizzes
        ]
    })

@app.route('', methods=['POST', 'GET'])
def create_quiz():
    if request.method == 'POST':
        quiz_instance = Quiz(
            title = request.form['title'],
            description = request.form = ['description'],
            questions = request.form = ['questions']
        )



@app.route('/api/quizzes/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)

    questions = []
    for question in quiz.questions:
        options = [
            {
                '_id': option._id,
                'text': option.option_text,
                'is_correct': option.is_correct
            } for option in question.options
        ]

        questions.append({
            '_id': question._id,
            'question_text': question.question_text,
            'options': options
        })

    return jsonify({
        'quiz': {
            '_id': quiz._id,
            'title': quiz.title,
            'description': quiz.description,
            'created_at': quiz.created_at.isoformat(),
            'questions': questions
        }
    })

@app.route('/act', methods=['GET'])
def activities():
    activities = dict()
    with open('activities.json', 'r') as file:
        activities = json.load(file)
    return render_template('activities.html', activities=activities)


@app.route('share/', methods=['GET'])
def index():
    lst_parties_corps = db.all(Corps)
# ici recuperer tout les ids pour les envoyer dans la view (pour les liens)
# proposer de commencer l'exploration en introduisant correctement le concept
    return render_template('share/start', lst_parties_corps)


@app.route('share/<int:parti_id>', methods=['GET'])
def get_body_part(parti_id):
    corps_objet = db.get_or_404(Corps, id)
    return render_template()

if __name__ == '__main__':
    DatabaseManager.init_db(app)
    app.run(debug=True)
