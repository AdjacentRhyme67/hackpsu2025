from google import genai
from api_keys import GOOGLE_API_KEY

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
    return response




