import json
import requests
from bs4 import BeautifulSoup
import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()


client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("OPENAI_API_KEY")
)

r = requests.get('https://www.vox.com/policy/390031/anthem-blue-cross-blue-shield-anesthesia-limits-insurance')

# Parsing the HTML
soup = BeautifulSoup(r.content, 'html.parser')

s = soup.find('div', class_='entry-content')
content = soup.find_all('p')
article_text = " ".join([p.text for p in content])
  

def getStockSuggestion():
  
  prompt ="""You are an expert financial analyst.
  Based on the text in the article below, return a list of stock tickers that are related directly or indirectly to the article.

  <article_text>""" +"\n" + article_text + "\n" + """</article_text>

  Return your response in JSON format like this example:
  stocks = [
      {
        "ticker": "AAPL",
        "explanation": "<explanation of why the company is related to the article>"
      },
      {
        "ticker": "TSLA"
        "explanation": "<explanation of why the company is related to the article>"
        "sentiment": "<number from 0 to 10 on how postive or negative the article is for the company>"
      },
  ]
  """

  llm_response = client.chat.completions.create(
      model="llama-3.1-70b-versatile",
      messages=[
          {"role": "user", "content": prompt}
      ],
      response_format={"type": "json_object"}
  )

  response = llm_response.choices[0].message.content  
  return response
    


def getQueryResponse(query):
  prompt = "You are an expert financial analyst. Answer the following question: " + query
  llm_response = client.chat.completions.create(
    model="llama-3.1-70b-versatile",
    messages=[
        {"role": "user", "content": prompt}
    ],
  )

  response = llm_response.choices[0].message.content
  return response
  

