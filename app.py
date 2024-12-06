from flask import Flask, jsonify, render_template
from src import create_app, db
from src.config import Config
from src.database import DatabaseManager
from src.routes import init_routes
import json

app = create_app(Config)
init_routes(app)

@app.route('/act', methods=['GET'])
def activities():
    activities = dict()
    with open('activities.json', 'r') as file:
        activities = json.load(file)
    return render_template('activities.html', activities=activities)

if __name__ == '__main__':
    with app.app_context():
        DatabaseManager.init_db(app)
    app.run(debug=True)