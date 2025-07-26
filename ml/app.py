# ml/app.py
from fastapi import FastAPI
from pydantic import BaseModel
from model import get_recommendations
from vectorizer import prepare_data

app = FastAPI()

class RequestBody(BaseModel):
    user_id: str

@app.post("/recommend")
def recommend(request: RequestBody):
    user_id = request.user_id

    user_vectors, post_vectors, interactions_df = prepare_data()
    
    if user_id not in user_vectors.index:
        return {"error": "User not found"}

    recommended_posts = get_recommendations(user_id, post_vectors, user_vectors, interactions_df)
    return {"recommendations": recommended_posts}
