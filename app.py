from flask import Flask, jsonify, render_template
from flask import redirect, url_for
from flask_cors import CORS
from src.config import Config
from src.quiz import db
from src.database import DatabaseManager
from src.quiz import Quiz, Question
from src.routes import init_routes
from src.humain import Corps

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

init_routes(app)

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
