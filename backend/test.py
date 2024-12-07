from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    query: str

@app.post("/query")
async def printQuery(query: Query):
    print("welcome")
    print(query.query)
    item = {"query": query.query}
    return {"item": item}
