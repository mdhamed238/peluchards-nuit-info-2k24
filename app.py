import os
print(os.getcwd())

from flask import Flask, render_template

app = Flask(__name__)

app.config['template_folder'] = 'threejs'
@app.route('/')
def index():
    return render_template("threejs/index.html")

if __name__ == '__main__':
    app.run(debug=True)