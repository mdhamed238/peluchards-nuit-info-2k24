from src.quiz import db, Quiz, Question, Option

class DatabaseManager:
    @staticmethod
    def init_db(app):
        with app.app_context():
            db.create_all()
            DatabaseManager._populate_db()

    @staticmethod
    def _populate_db():
        # Clear existing data
        Option.query.delete()
        Question.query.delete()
        Quiz.query.delete()

        # Create quiz
        quiz = Quiz(
            title='Ocean and Human Body Quiz',
            description='Test your knowledge about the parallels between oceans and the human body'
        )
        db.session.add(quiz)
        db.session.commit()

        # Questions data
        questions_data = [
            {
                'text': 'What system in the human body is comparable to ocean currents and thermohaline pump?',
                'options': [
                    ('Digestive system', False),
                    ('Circulatory system', True),
                    ('Nervous system', False),
                    ('Skeletal system', False)
                ]
            },
            {
                'text': 'Which organ function is similar to the ocean\'s role in gas exchange and CO2 dissolution?',
                'options': [
                    ('Liver', False),
                    ('Heart', False),
                    ('Lungs', True),
                    ('Kidneys', False)
                ]
            }
        ]

        for q_data in questions_data:
            question = Question(quiz_id=quiz._id, question_text=q_data['text'])
            db.session.add(question)
            db.session.commit()

            for opt_text, is_correct in q_data['options']:
                option = Option(
                    question_id=question._id,
                    option_text=opt_text,
                    is_correct=is_correct
                )
                db.session.add(option)
            
        db.session.commit()