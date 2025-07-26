# ml/app.py
from fastapi import FastAPI
from pydantic import BaseModel
from model import get_recommendations, get_trending_posts
from vectorizer import prepare_data

app = FastAPI()

class RequestBody(BaseModel):
    user_id: str

@app.post("/recommend")
def recommend(request: RequestBody):
    user_id = request.user_id

    user_vectors, post_vectors, interactions_df, subscriptions_df = prepare_data()

    if user_id not in user_vectors.index:
        return {"error": "User not found"}

    # Check if user has any interaction
    user_interactions = interactions_df[interactions_df['user_id'] == user_id]

    if user_interactions.empty:
        # Cold-start: recommend top trending posts
        fallback_posts = get_trending_posts(post_vectors, top_k=10)
        return {"recommendations": fallback_posts, "note": "cold start fallback"}

    # Hybrid recommendation including subscriptions
    recommended_posts = get_recommendations(
        user_id, post_vectors, user_vectors, interactions_df, subscriptions_df
    )

    return {"recommendations": recommended_posts}
