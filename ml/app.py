from fastapi import FastAPI
from pydantic import BaseModel
from model import get_recommendations, get_trending_posts
from vectorizer import prepare_data

app = FastAPI()

class RequestBody(BaseModel):
    user_id: str

@app.post("/recommend")
def recommend(request: RequestBody):
    user_id = str(request.user_id)  # Ensure string type

    user_vectors, post_vectors, interactions_df, subscriptions_df = prepare_data()

    # Defensive print
    # print("User index sample:", user_vectors.index[:5])

    if user_id not in user_vectors.index:
        return {"error": "User not found"}

    user_interactions = interactions_df[interactions_df['user_id'] == user_id]

    if user_interactions.empty:
        fallback_posts = get_trending_posts(post_vectors, top_k=20)
        return {"recommendations": fallback_posts, "note": "cold start fallback"}

    recommended_posts = get_recommendations(
        user_id, post_vectors, user_vectors, interactions_df, subscriptions_df
    )
    return {"recommendations": recommended_posts}
