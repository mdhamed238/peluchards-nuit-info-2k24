# app/routes.py
from flask import jsonify, request
from src.quiz import Quiz, Question, Option, db
from src.user import User
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

    @app.route('/user/login', methods=['POST'])
    def login_user():
        """
        Connecte un utilisateur
        
        :param username: str : nom d'utilisateur
        :param password: str : mot de passe de l'utilisateur
    
        :return: json : message de connexion réussie ou erreur
        :return: int : code d'erreur 401 ou réussite 201
        """
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password_verification(password):
            return jsonify({
                'message': 'Login successful',
                'user_id': user.id,
                'username': user.username,
                'editor': user.editor
            }), 201
        else:
            return jsonify({
                'error': 'Invalid username or password'
            }), 401
        
    @app.route('/user/register', methods=['POST'])
    def register_user():
        """
        Enregistre un utilisateur

        :param username: str : nom d'utilisateur
        :param password: str : mot de passe de l'utilisateur

        :return: json : message d'enregistrement réussi ou erreur 
        :return: int : code d'erreur 500 ou réussite 201
        """
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        # Validate required fields
        if not username or not password:
            return jsonify({
                'error': 'Username and password are required'
            }), 400
            
        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({
                'error': 'Username already exists'
            }), 409
            
        try:
            user = User(
                username=username,
                password=password,
                editor=False
            )
            db.session.add(user)
            db.session.commit()
            
            return jsonify({
                'message': 'User registered successfully',
                'user_id': user.id,
                'username': user.username,
                'editor': user.editor
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'error': f'Error registering user: {str(e)}'
            }), 500
            
    @app.route('/user/data', methods=['POST'])
    def get_user_data():
        """
        Récupère les données d'un utilisateur par son username
        
        :param username: str : Nom d'utilisateur à rechercher
        :return: json : données de l'utilisateur ou erreur
        :return: int : code 200 si succès, 400 si mauvaise requête, 404 si non trouvé
        """
        data = request.get_json()
        username = data.get('username')
        
        if not username:
            return jsonify({
                'error': 'Username is required'
            }), 400
            
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({
                'error': 'User not found'
            }), 404
            
        return jsonify({
            'id': user.id,
            'username': user.username,
            'editor': user.editor
        }), 200