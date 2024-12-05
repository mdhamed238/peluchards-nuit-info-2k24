from flask import Flask, jsonify, render_template

from flask_cors import CORS
from src.config import Config
from src.quiz import db
from src.database import DatabaseManager
from src.quiz import Quiz, Question

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

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
    activities = [
        {
            'activity': 'activity 1',
            'description': 'description 1'
        },
        {
            'activity': 'activity 2',
            'description': 'description 2'
        }
    ]
    return render_template('activities.html', activities=activities)

if __name__ == '__main__':
    DatabaseManager.init_db(app)
    app.run(debug=True)