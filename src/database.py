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
                'text': 'Quel système du corps humain est comparable aux courants océaniques et à la pompe thermohaline ?',
                'options': [
                    ('Le système digestif', False),
                    ('Le système circulatoire', True),
                    ('Le système nerveux', False),
                    ('Le système squelettique', False)
                ]
            },
            {
                'text': 'Quelle fonction organique est similaire au rôle de l\'océan dans l\'échange gazeux et la dissolution du CO2 ?',
                'options': [
                    ('Le foie', False),
                    ('Le cœur', False),
                    ('Les poumons', True),
                    ('Les reins', False)
                ]
            },
            {
                'text': 'Quel est l\'un des rôles principaux de l\'océan dans la régulation du climat ?',
                'options': [
                    ('Créer des vagues', False),
                    ('Maintenir une température stable', True),
                    ('Produire du sel', False),
                    ('Générer du vent', False)
                ]
            },
            {
                'text': 'Quelle fonction du corps humain est similaire à la façon dont l\'océan stocke le carbone ?',
                'options': [
                    ('Le stockage des graisses', True),
                    ('La coagulation sanguine', False),
                    ('La formation des os', False),
                    ('La contraction musculaire', False)
                ]
            },
            {
                'text': 'Comme le système immunitaire humain protège contre les maladies, qu\'est-ce qui aide à maintenir la santé des océans ?',
                'options': [
                    ('Le sable', False),
                    ('Les vagues', False),
                    ('La biodiversité', True),
                    ('Les rochers', False)
                ]
            },
            {
                'text': 'Quelle composante de l\'océan agit comme la peau du corps humain, protégeant les couches plus profondes ?',
                'options': [
                    ('La couche de surface', True),
                    ('Le plancher océanique', False),
                    ('Les récifs coralliens', False),
                    ('La neige marine', False)
                ]
            },
            {
                'text': 'Quel processus océanique est similaire à la façon dont les humains maintiennent l\'équilibre du sel dans leur corps ?',
                'options': [
                    ('La formation des vagues', False),
                    ('La régulation de la salinité', True),
                    ('Le changement de température', False),
                    ('Le mouvement des marées', False)
                ]
            },
            {
                'text': 'Comment le rôle de l\'océan dans la production d\'oxygène se compare-t-il aux systèmes du corps humain ?',
                'options': [
                    ('Comme la production d\'énergie musculaire', False),
                    ('Comme la détoxification du foie', False),
                    ('Comme l\'échange d\'oxygène des poumons', True),
                    ('Comme la filtration des reins', False)
                ]
            },
            {
                'text': 'Quel rôle jouent les micro-organismes marins qui est similaire aux bactéries intestinales chez l\'humain ?',
                'options': [
                    ('La décomposition des nutriments', True),
                    ('La production de chaleur', False),
                    ('La création de courants', False),
                    ('La génération de vagues', False)
                ]
            },
            {
                'text': 'En quoi l\'acidification des océans est-elle similaire à une condition du corps humain ?',
                'options': [
                    ('Une tension musculaire', False),
                    ('Un déséquilibre du pH sanguin', True),
                    ('Une fracture osseuse', False),
                    ('Une éruption cutanée', False)
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