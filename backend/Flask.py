from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import os
import requests
import json
from Genai import generate_response

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
        
        every_character = data.get(every_character)
        mistaken_characters = data.get(mistaken_characters)
        typed_instead = data.get(typed_instead)




        # letter_one = data.get('letter_one')
        # letter_two = data.get('letter_two')
        # letter_one_compliment = data.get('letter_one_compliment')
        # letter_two_compliment = data.get('letter_two_compliment')
        
        if grade and age and letter_one and letter_two and letter_one_compliment and letter_two_compliment:

            # Call the generate_content function with the provided data
            response = generate_response(age, grade, letter_one, letter_two, letter_one_compliment, letter_two_compliment)
            # return jsonify({"response": response}), 200
            return response.text
            

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Handle exceptions

def find_key_by_value(dictionary, value):
    for key, val in dictionary.items():
        if val == value:
            return key
    return None

def calculate_letters(every_character, mistaken_characters, typed_instead):
    letter_percent_errors = []  # List to store (letter, percent_error) tuples

    # Calculate percent errors for all letters
    for letter, count in every_character.items():
        if letter in mistaken_characters:
            percent_error = count / mistaken_characters[letter]
            letter_percent_errors.append((letter, percent_error))

    # Sort the list by percent error in descending order
    letter_percent_errors.sort(key=lambda x: x[1], reverse=True)

    # Get the top two letters (if available)
    top_letters = [letter for letter, _ in letter_percent_errors[:2]]

    # Get the most common replacement letters
    letter_one_compliment = None
    letter_two_compliment = None

    if len(top_letters) >= 1:
        letter_one = top_letters[0]
        letter_one_compliment = find_key_by_value(typed_instead[letter_one], max(typed_instead[letter_one].values()))

    if len(top_letters) >= 2:
        letter_two = top_letters[1]
        letter_two_compliment = find_key_by_value(typed_instead[letter_two], max(typed_instead[letter_two].values()))

    return letter_one, letter_one_compliment, letter_two, letter_two_compliment



if __name__ == '__main__':
    app.run(debug=True)
    
