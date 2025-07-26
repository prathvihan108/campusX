# model.py
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def get_recommendations(user_id, posts_df, users_df, interactions_df, alpha=0.7, top_k=10):
    # Extract target user's feature vector
    user_vector = users_df.loc[user_id]
    post_vectors = posts_df.drop(columns=["post_id"])
    
    # Content-based similarity
    content_similarities = cosine_similarity([user_vector], post_vectors)[0]  # shape = (num_posts,)

    # Collaborative filtering score (interaction-based)
    interaction_score = np.zeros(len(posts_df))
    
    # Posts the user has interacted with
    user_interactions = interactions_df[interactions_df['user_id'] == user_id]

    if not user_interactions.empty:
        # Posts liked/bookmarked by user
        liked_post_ids = user_interactions[user_interactions['liked'] == 1]['post_id'].tolist()
        bookmarked_post_ids = user_interactions[user_interactions['bookmarked'] == 1]['post_id'].tolist()

        # Give weights to interaction types
        interaction_weight_map = {}
        for pid in liked_post_ids:
            interaction_weight_map[pid] = interaction_weight_map.get(pid, 0) + 1.0
        for pid in bookmarked_post_ids:
            interaction_weight_map[pid] = interaction_weight_map.get(pid, 0) + 0.7  # bookmarks less weight

        # For all other users who liked same posts — recommend what they liked
        similar_users = interactions_df[interactions_df['post_id'].isin(liked_post_ids) & (interactions_df['user_id'] != user_id)]
        co_liked_posts = interactions_df[interactions_df['user_id'].isin(similar_users['user_id'])]['post_id']

        # Count frequency of co-liked posts
        co_liked_counts = co_liked_posts.value_counts(normalize=True)

        # Map post_id to index in posts_df
        post_id_to_index = {pid: idx for idx, pid in enumerate(posts_df['post_id'])}

        # Fill interaction score array
        for pid, score in co_liked_counts.items():
            if pid in post_id_to_index:
                interaction_score[post_id_to_index[pid]] = score

    # Combine both scores
    final_score = alpha * content_similarities + (1 - alpha) * interaction_score

    # Top N post indices
    top_indices = np.argsort(final_score)[::-1][:top_k]
    recommended_post_ids = posts_df.iloc[top_indices]['post_id'].tolist()

    return recommended_post_ids
