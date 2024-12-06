# app/routes.py
from flask import jsonify, request, session, redirect
from src.quiz import Quiz, Question, Option, db
from src.user import User
def init_routes(app):
    @app.route('/corps/')
    def parties_du_corps():
        parties_du_corps = Corps.query.all()
        return jsonify({
            'corps': [{
                '_id': corps._id,
            }]
        })
    @app.route("/corps/<int:id>", methods=['GET', 'POST'])
    def partie_corps(id):
        if request.method = 'POST':
            data = request.get_json()
            id_user = session.get('user_id')
            try:
                parrallele = Parralle(
                    content=data['content'],
                    utilisateur=Utilisateur.query.filter_by(id=id_user).first()
                )
                db.session.add(parrallele)
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

        else:
        parralleles = ParralleleUtilsateur.query.all()
        nom_partie= ParralleleUtilisateur.query.filter_by(attribut=partie) # possible car unique
        return jsonify({
            'partie_du_corps': nom_partie
            'parrallele':[{
                'id_p' : parrallele.id,
            } for parrallele in parralleles ]
        })


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
        
        :param email: str : email de l'utilisateur
        :param password: str : mot de passe de l'utilisateur


        :return: json : message de connexion réussie ou erreur
        :return: int : code d'erreur 401 ou réussite 201
        """
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email).first()
        if user and user.check_password_verification(password):
            session['user_id'] = user.id
            return jsonify({
                'message': 'Login successful',
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'editor': user.editor
            }), 201
        else:
            return jsonify({
                'error': 'Invalid email or password'
            }), 401
        
    @app.route('/user/register', methods=['POST'])
    def register_user():
        """
        Enregistre un utilisateur

        :param username: str : nom d'utilisateur
        :param email: str : email de l'utilisateur
        :param password: str : mot de passe de l'utilisateur

        :return: json : message d'enregistrement réussi ou erreur
        :return: int : code d'erreur 500 ou réussite 201
        """
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        try:
            user = User(
                username=username,
                email=email,
                password=password,
                editor=False
            )
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return jsonify({
                'message': 'User registered successfully',
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'editor': user.editor
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'error': f'Error registering user: {str(e)}'
            }), 500

    @app.route('/user/logout', methods=['GET'])
    def logout_user():
        """
        Déconnecte un utilisateur

        :return: redirect : redirection vers la page d'accueil
        """
        session.pop('user_id', None)
        return redirect('/')
    
    @app.route('/user', methods=['GET'])
    def get_user():
        """
        Récupère les informations de l'utilisateur connecté

        :return: json : informations de l'utilisateur ou erreur
        :return: int : code d'erreur 401 ou réussite 201
        """

        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            return jsonify({
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'editor': user.editor
            }), 201
        else:
            return jsonify({
                'error': 'User not logged in'
            }), 401