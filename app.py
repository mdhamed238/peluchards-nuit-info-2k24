from flask import Flask, jsonify
from src.config import Config
from src.quiz import db
from src.database import DatabaseManager
from src.quiz import Quiz, Question

app = Flask(__name__)
app.config.from_object(Config)
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

if __name__ == '__main__':
    DatabaseManager.init_db(app)
    app.run(debug=True)