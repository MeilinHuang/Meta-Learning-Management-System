import os
import openai
from typing import List
from .chatgpt_types import Message
from dotenv import load_dotenv

#############
# CONSTANTS #
#############
DEFAULT_MODEL = "gpt-3.5-turbo"
DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant."

#################
# ENV VARIABLES #
#################
load_dotenv() # load .env from project root
openai.organization = os.getenv("OPENAI_ORGANIZATION_ID")
openai.api_key = os.getenv("OPENAI_API_KEY")

#################
# PUBLIC  FUNCS #
#################
def send_message(past_messages: List[Message], message: str, model=DEFAULT_MODEL):
    """
    Appends the user's message to the past messages, and queries `/chat/completions`, returning the raw JSON response.
    """
    user_message: Message = { "role": "user", "content": message }
    messages = past_messages + [user_message]
    return query_chat_completion(messages, model)

def query_chat_completion(messages: List[Message], model: str):
    """
    Query OpenAI endpoint `/chat/completions` with message and specified model, and returns the raw JSON response.
    """
    return openai.ChatCompletion.create(
        model = model,
        messages = messages
    )

# RYAN TODO:
# PHASE 1: BASIC
# - [ ] Basic Chat Completion working
# - [ ] Conversations automatically remove messages to stay under token limit
# - [ ] Each user can have multiple conversations
#       - [ ] Can delete conversations
#       - [ ] Can create new conversations

# PHASE 2: LONG-TERM MEMORY
# - [ ] Long-term Memory using vector database
# - [ ] Ability to ingest uploaded documents using text embeddings API
#       - [ ] .md
#       - [ ] .pdf
# - [ ] Responds with references to documents

# PHASE 3: LEARNING COMPANION
# - [ ] ChatBot is aware of current context:
#       - [ ] Current course
#       - [ ] Current topic
#       - [ ] Current question
# - [ ] Prompts are engineered to suit a variety of learning styles:
#       - [ ] Default: Helpful Tutor that doesn't give answers directly
#       - [ ] Socratic Method: Asks questions to guide student to answer
# - [ ] Student can modify difficulty of explanation level
