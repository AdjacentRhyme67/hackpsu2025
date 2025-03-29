from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import os
import requests
import json
from Genai import generate_content

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generate a random secret key for session management

@app.route('/api/data', methods=['POST'])
def handle_data():
    try:
        data = request.get_json()  # Get JSON data from the request
        if data is None:
            return jsonify({"error": "Invalid JSON data"}), 400

        # Process the JSON data
        grade = data.get('grade')
        age = data.get('age')
        letter_one = data.get('letter_one')
        letter_two = data.get('letter_two')
        letter_one_compliment = data.get('letter_one_compliment')
        letter_two_compliment = data.get('letter_two_compliment')
        
        if grade and age and letter_one and letter_two and letter_one_compliment and letter_two_compliment:

            # Call the generate_content function with the provided data
            response = generate_content(age, grade, letter_one, letter_two, letter_one_compliment, letter_two_compliment)
            return jsonify({"response": response}), 200
            

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Handle exceptions



if __name__ == '__main__':
    app.run(debug=True)

