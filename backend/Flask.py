from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import os
import requests
import json
from Genai import generate_response
from Genai import translate
from flask_cors import CORS


app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generate a random secret key for session management
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) for the Flask app
grade = 5
age = 7

@app.route('/start_button_click', methods = ['POST'])
def intial_data():
    data = request.get_json()  # Get JSON data from the request
    if data is None:
        return jsonify({"error": "Invalid JSON data"}), 400
    global grade
    global age
    grade = data.get('grade')
    age = data.get('age')

    if grade and age:
        response = generate_response(age, grade, None, None, None, None)
        return response, 200


@app.route('/api-data', methods=['POST'])
def handle_data():
    try:
        data = request.get_json()  # Get JSON data from the request
        if data is None:
            return jsonify({"error": "Invalid JSON data"}), 400

        # Process the JSON data

        every_character = data.get('allCharCounts')
        mistaken_characters = data.get('missedChars')
        typed_instead = data.get('missedCharFrequencies')
        calculated_list = calculate_letters(every_character, mistaken_characters, typed_instead)
        letter_one = calculated_list[0]
        letter_two = calculated_list[1]
        letter_one_compliment = calculated_list[2]  # Get the most common replacement for letter_one
        letter_two_compliment = calculated_list[3]  # Get the most common replacement for letter_two

        
        if grade and age and letter_one and letter_two and letter_one_compliment and letter_two_compliment:

           # Call the generate_content function with the provided data
            response = generate_response(age, grade, letter_one, letter_two, letter_one_compliment, letter_two_compliment)
            return response, 200
            #return response.text
    


    except Exception as e:
        print(e)
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
            percent_error = mistaken_characters[letter]/count
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

    return [letter_one, letter_two, letter_one_compliment, letter_two_compliment]

@app.route('/api-analytics', methods=['POST'])
def send_analytics():
        try:
            data = request.get_json()  # Get JSON data from the request
            if data is None:
                return jsonify({"error": "Invalid JSON data"}), 400
            
            every_character = data.get('allCharCounts')
            mistaken_characters = data.get('missedChars')
            typed_instead = data.get('missedCharFrequencies')
            letter_list = calculate_letters(every_character, mistaken_characters, typed_instead)

            analytics_json = {
                "firstLetter" : letter_list[0],
                "firstLetterPercent" : round((mistaken_characters[letter_list[0]] / every_character[letter_list[0]]),2),
                "secondLetter" : letter_list[1],
                "secondLetterPercent" : round((mistaken_characters[letter_list[1]] / every_character[letter_list[1]]),2),
                "firstLetterComp" : letter_list[2],
                "secondLetterComp" : letter_list[3]
            }
            return analytics_json, 200

        except Exception as e:
            print(e)
            return jsonify({"error": str(e)}), 500  # Handle exceptions
        
@app.route('/translate', methods=['POST'])
def translate_to_spanish():
    try:
        data = request.get_json()  # Get JSON data from the request
        if data is None:
            return jsonify({"error": "Invalid JSON data"}), 400
        print(data)
        text_string = ' '.join(str(data))
        translation = translate(text_string) 
        return translation
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
    
