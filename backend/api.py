from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import ai

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define the input model
class Query(BaseModel):
    query: str
    

@app.post("/query/")
async def query(item: Query):
    # Print the query from the request body
    print(f"Received query: {item.query}")
    
    # Validate if the query is not empty
    if not item.query:
        raise HTTPException(status_code=400, detail="Missing 'query' parameter in request body")
    
    # Get response from ai.getQueryResponse
    response = ai.getQueryResponse(item.query)
    return {"response": response}

@app.get("/tickers")
async def root():
    # Load tickers from a JSON file
    try:
        with open("company_tickers.json", "r") as f:
            tickers = json.load(f)
        return {"tickers": tickers}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Tickers file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding tickers file")

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
        try:
            return json.loads(suggestions)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Invalid JSON string returned by getStockSuggestion()")
    else:
        # Raise an error if the type is unexpected
        raise TypeError("Unexpected type returned by getStockSuggestion()")
