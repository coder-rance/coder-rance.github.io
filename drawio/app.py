"""
Simple server to host drawio-local.

You will be able to handle some events during user request, before running this script, you should have Flask installed.

```
pip3 install flask
python3 app.py
```
"""
import os

import werkzeug
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='public')

root = os.path.dirname(__file__)
default_page = 'index.html'


@app.route('/')
def index():
    return send_from_directory(root, default_page)


@app.route('/<path:filename>')
def serve(filename: str):
    if filename.endswith('/'):
        filename += default_page
    try:
        return send_from_directory(root, filename)
    except werkzeug.exceptions.NotFound as e:
        if filename.endswith("/"):
            return send_from_directory(root, filename + default_page)
        raise e


@app.route('/not-support', methods=['GET', 'POST'])
def not_support():
    return "Sorry, this action is not supported."


app.run(host='0.0.0.0', port=5000)
