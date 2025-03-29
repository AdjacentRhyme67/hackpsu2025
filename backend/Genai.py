from google import genai

prompt = """Create 4 sentences for a AGE year old in grade GRADE to practice keyboarding.
They struggle typing the letters LETTERONE and LETTERTWO. They often type LETTERONECOMPLIMENT instead of LETTERONE and LETTERTWOCOMPLIMENT instead of LETTERTWO.
Tailor the sentences so they can work on typing the letters correctly and learning the difference between the letters that they are supposed to type and the letters that they type instead.
Ensure it's a sentence that somebody would actually say and would make sense in a real world context. Don't use punctuation other than a period in each sentence."""


def generate_content(grade,):
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


    client = genai.Client(api_key="")

    response = client.models.generate_content(model="gemini-2.0-flash",contents=f"give me 4 sentences an individual with the comprehension of a {grade}th grader could type format in a python list.",
)



print(prompt)