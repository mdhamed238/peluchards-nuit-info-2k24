# app/routes.py
from flask import jsonify, request
from src.quiz import Quiz, Question, Option, db

def init_routes(app):
    # Get all quizzes
    @app.route('/api/quizzes', methods=['GET'])
    def get_quizzes():
        quizzes = Quiz.query.all()
        return jsonify({
            'quizzes': [{
                '_id': quiz._id,
                'title': quiz.title,
                'description': quiz.description,
                'created_at': quiz.created_at
            } for quiz in quizzes]
        })

    # Get single quiz
    @app.route('/api/quizzes/<int:quiz_id>', methods=['GET'])
    def get_quiz(quiz_id):
        quiz = Quiz.query.get_or_404(quiz_id)
        
        return jsonify({
            'quiz': {
                '_id': quiz._id,
                'title': quiz.title,
                'description': quiz.description,
                'created_at': quiz.created_at,
                'questions': [{
                    '_id': question._id,
                    'question_text': question.question_text,
                    'options': [{
                        '_id': option._id,
                        'option_text': option.option_text,
                        'is_correct': option.is_correct
                    } for option in question.options]
                } for question in quiz.questions]
            }
        })

    # Create new quiz
    @app.route('/api/quizzes', methods=['POST'])
    def create_quiz():
        data = request.get_json()
        
        try:
            # Create quiz
            quiz = Quiz(
                title=data['title'],
                description=data['description']
            )
            db.session.add(quiz)
            db.session.commit()

            # Create questions and options
            for q_data in data['questions']:
                question = Question(
                    quiz_id=quiz._id,
                    question_text=q_data['question_text']
                )
                db.session.add(question)
                db.session.commit()

                for opt_data in q_data['options']:
                    option = Option(
                        question_id=question._id,
                        option_text=opt_data['option_text'],
                        is_correct=opt_data['is_correct']
                    )
                    db.session.add(option)
                
                db.session.commit()

            return jsonify({
                'message': 'Quiz created successfully',
                'quiz_id': quiz._id
            }), 201

        except KeyError as e:
            db.session.rollback()
            return jsonify({
                'error': f'Missing required field: {str(e)}'
            }), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'error': f'Error creating quiz: {str(e)}'
            }), 500

    # Update quiz
    @app.route('/api/quizzes/<int:quiz_id>', methods=['PUT'])
    def update_quiz(quiz_id):
        quiz = Quiz.query.get_or_404(quiz_id)
        data = request.get_json()

        try:
            # Update quiz basic info
            quiz.title = data.get('title', quiz.title)
            quiz.description = data.get('description', quiz.description)

            # Update questions if provided
            if 'questions' in data:
                # Remove existing questions and options
                for question in quiz.questions:
                    Option.query.filter_by(question_id=question._id).delete()
                Question.query.filter_by(quiz_id=quiz._id).delete()

                # Add new questions and options
                for q_data in data['questions']:
                    question = Question(
                        quiz_id=quiz._id,
                        question_text=q_data['question_text']
                    )
                    db.session.add(question)
                    db.session.commit()

                    for opt_data in q_data['options']:
                        option = Option(
                            question_id=question._id,
                            option_text=opt_data['option_text'],
                            is_correct=opt_data['is_correct']
                        )
                        db.session.add(option)

            db.session.commit()
            return jsonify({
                'message': 'Quiz updated successfully',
                'quiz_id': quiz._id
            })

        except Exception as e:
            db.session.rollback()
            return jsonify({
                'error': f'Error updating quiz: {str(e)}'
            }), 500

    # Delete quiz
    @app.route('/api/quizzes/<int:quiz_id>', methods=['DELETE'])
    def delete_quiz(quiz_id):
        quiz = Quiz.query.get_or_404(quiz_id)

        try:
            # Delete all related options and questions
            for question in quiz.questions:
                Option.query.filter_by(question_id=question._id).delete()
            Question.query.filter_by(quiz_id=quiz._id).delete()
            
            db.session.delete(quiz)
            db.session.commit()

            return jsonify({
                'message': 'Quiz deleted successfully'
            })

        except Exception as e:
            db.session.rollback()
            return jsonify({
                'error': f'Error deleting quiz: {str(e)}'
            }), 500
