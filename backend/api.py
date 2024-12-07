from fastapi import FastAPI, Request
import json
import ai

app = FastAPI()

from pydantic import BaseModel


class Item(BaseModel):
    query: str


@app.post("/query/")
async def query(item: Item):
    # Parse the JSON body from the request
    print(Item)
    
    if not query:
        return {"error": "Missing 'query' parameter in request body"}
    
    print(query)
    
    # Get response from ai.getQueryResponse
    response = ai.getQueryResponse(query)
    return {"response": response}

@app.get("/tickers")
async def root():
    # Load tickers from a JSON file
    with open("company_tickers.json", "r") as f:
        tickers = json.load(f)
    return {"tickers": tickers}

@app.get("/suggestions")
async def get_suggestions():
    # Get suggestions from the `getStockSuggestion` function
    suggestions = ai.getStockSuggestion()
    
    # Check the type of the returned suggestions
    if isinstance(suggestions, (dict, list)):
        # If it's already a Python object, return it directly
        return suggestions
    elif isinstance(suggestions, str):
        # If it's a JSON string, parse it
        return json.loads(suggestions)
    else:
        # Raise an error if the type is unexpected
        raise TypeError("Unexpected type returned by getStockSuggestion()")
