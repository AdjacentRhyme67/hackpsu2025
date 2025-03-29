from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import os
import requests
import json

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generate a random secret key for session management

@app.route('/api/data', methods=['POST'])
def handle_data():
    try:
        data = request.get_json()  # Get JSON data from the request
        if data is None:
            return jsonify({"error": "Invalid JSON data"}), 400

        # Process the JSON data
        name = data.get('name')
        age = data.get('age')

        if name and age:
            # Do something with the data (e.g., store in a database)
            print(f"Received data: Name={name}, Age={age}")
            return jsonify({"message": "Data received successfully"}), 200
        else:
            return jsonify({"error": "Missing 'name' or 'age' field"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Handle exceptions



if __name__ == '__main__':
    app.run(debug=True)

