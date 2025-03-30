from google import genai
from api_keys import GOOGLE_API_KEY
import json
import re

def generate_response(age,grade,letter_one,letter_two,letter_one_compliment,letter_two_compliment):
    """
    Generates content using the Google GenAI API.
    
    Args:
        grade (int): The grade level for the content generation.
        
    Returns:
        str: The generated content as a string.
    """
    # Initialize the GenAI client with your API key
     # Replace with your actual API key
     # Example: "AIzaSyBuUCB6ALyKL8eLY-C2Og2WA23u2vlljQs"

    prompt = f"""Create 4 sentences for a {age} year old in grade {grade} to practice keyboarding.
    They struggle typing the letters {letter_one} and {letter_two}. They often type {letter_one_compliment} instead of {letter_one} and {letter_two_compliment} instead of {letter_two}.
    Tailor the sentences so they can work on typing the letters correctly and learning the difference between the letters that they are supposed to type and the letters that they type instead.
    Ensure it's a sentence that somebody would actually say and would make sense in a real world context. Don't use punctuation other than a period in each sentence. Only return the sentences,
    nothing else, and return them as a JSON with the key values as integers and the values as the sentences"""

    if not letter_one or not letter_two or not letter_one_compliment or not letter_two_compliment:
        prompt =  f"""Create 4 sentences for a {age} year old in grade {grade} to practice keyboarding with a variety of different letters.
        Ensure it's a sentence that somebody would actually say and would make sense in a real world context. Don't use punctuation other than a period in each sentence. Only return the sentences,
        nothing else, and return them as a JSON with the key values as integers and the values as the sentences"""

    client = genai.Client(api_key=GOOGLE_API_KEY)

    response = client.models.generate_content(model="gemini-2.0-flash",contents=prompt)

    response_text = response.text  # Extract the text from the response object

    try:
        # If Gemini returns valid JSON
        sentences_json = json.loads(response_text)
        
        
        
        # Ensure we have keys 1,2,3,4
        result = {
            "one": "",
            "two": "",
            "three": "",
            "four": ""
        }
        
    except json.JSONDecodeError:
        # If Gemini didn't return valid JSON, try to extract sentences
        # Look for sentences or numbered list
        sentences = []
        
        # Check if response has markdown code blocks with JSON
        json_pattern = r'```(?:json)?\s*({.*?})\s*```'
        json_match = re.search(json_pattern, response_text, re.DOTALL)
        
        if json_match:
            try:
                extracted_json = json.loads(json_match.group(1))
                formatted_json = {int(k): v for k, v in extracted_json.items()}
                result = {
                    "one": formatted_json.get(1, ""),
                    "two": formatted_json.get(2, ""),
                    "three": formatted_json.get(3, ""),
                    "four": formatted_json.get(4, "")
                }
                return result
            except:
                pass
                
        # Try to find numbered sentences (1. sentence or 1) sentence)
        numbered_pattern = r'(?:\d[\.\)]\s*)([^\.]+\.)' 
        sentences = re.findall(numbered_pattern, response_text)
        
        # If we can't find numbered sentences, just split by periods
        if not sentences or len(sentences) < 4:
            # Remove any explanatory text and code blocks
            cleaned_text = re.sub(r'```.*?```', '', response_text, flags=re.DOTALL)
            sentences = [s.strip() + '.' for s in cleaned_text.split('.') if s.strip()]
            
        # Create result JSON with up to 4 sentences
        result = {}
        for i in range(min(4, len(sentences))):
            result[i+1] = sentences[i].strip()
            
        # Fill any missing entries
        for i in range(1, 5):
            if i not in result:
                result[i] = ""
    
    return result




