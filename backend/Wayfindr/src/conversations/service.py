import requests
import json
from database import execute, fetch_all
from conversations.models import Prompt, Conversation

class AIbuddy:
    def __init__(self, model: str = "deepseek-r1:1.5b"):
        self.model = model
        self.url = "http://localhost:11434/api/chat"
        self.headers = {"Content-Type": "application/json"}
    
    async def ask_ai(self, prompt: str,conversation_id: int):
        payload = {
            "model": "deepseek-r1:1.5b",
            "messages": await self.get_all_prompts(conversation_id) + [{"role": "user", "content": prompt}],
            "stream": True,
            "temperature": 0.7,
            "max_tokens": 1000
        }
        full_message = ""
        response = requests.post(self.url, json=payload, headers=self.headers, stream=True)
        for line in response.iter_lines():
            if line:
                try:
                    data = json.loads(line.decode('utf-8'))
                    chunk = data.get("message", {}).get("content", "")
                    if chunk:
                        yield chunk
                        full_message += chunk
                except Exception as e:
                    yield f"Error: {e}"
                    continue
        await self.save_response(prompt, full_message, conversation_id)


    async def save_response(self, message:str, response: str, conversation_id: int):
        await execute(
            Prompt.__table__.insert().values(
                Message=message,
                Response=response,
                ConversationID=conversation_id,
            ),
            commit=True,
        )
        print(await self.get_all_prompts(conversation_id))

    async def get_all_prompts(self, conversation_id: int):
        prompts = await fetch_all(
            Prompt.__table__.select().where(Prompt.ConversationID == conversation_id)
        )
        chat = []
        for item in prompts:
            user_msg = item.get("Message", "").strip()
            ai_response = item.get("Response", "").strip()
            if user_msg:
                chat.append({"role": "user", "content": user_msg})
            if ai_response:
                chat.append({"role": "assistant", "content": ai_response})
        return chat