from openai import OpenAI
from config import MINIMAX_API_KEY, MINIMAX_BASE_URL, MINIMAX_MODEL

client = OpenAI(
    api_key=MINIMAX_API_KEY,
    base_url=MINIMAX_BASE_URL
)

response = client.chat.completions.create(
    model=MINIMAX_MODEL,
    messages=[
        {"role": "user", "content": "你好，请用一句话介绍你自己"}
    ]
)

print("回复:", response.choices[0].message.content)
