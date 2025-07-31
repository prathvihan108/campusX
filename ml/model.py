import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict


def get_recommendations(
    user_id, posts_df, users_df, interactions_df, subscriptions_df=None, alpha=0.7, top_k=40, max_per_author=1
):
    user_id = str(user_id)
    print(f"Getting recommendations for user_id: {user_id}")

    if user_id not in users_df.index:
        return get_trending_posts(posts_df, top_k)

    user_vector = users_df.loc[user_id]

    # Drop non-numeric columns from posts_df before similarity
    if "post_id" in posts_df.columns:
        post_vectors = posts_df.drop(columns=["post_id", "author"])
    else:
        post_vectors = posts_df.drop(columns=["author"], errors='ignore').copy()

    post_vectors = post_vectors.fillna(0)

    common_columns = sorted(set(user_vector.index) | set(post_vectors.columns))
    user_vector = user_vector.reindex(common_columns, fill_value=0)
    post_vectors = post_vectors.reindex(columns=common_columns, fill_value=0)

    content_similarities = cosine_similarity([user_vector], post_vectors)[0]

    interaction_score = np.zeros(len(posts_df))

    user_interactions = interactions_df[interactions_df['user_id'] == user_id]

    if not user_interactions.empty:
        liked_post_ids = user_interactions[user_interactions['liked'] == 1]['post_id'].tolist()
        bookmarked_post_ids = user_interactions[user_interactions['bookmarked'] == 1]['post_id'].tolist()
        interaction_weight_map = {}
        for pid in liked_post_ids:
            interaction_weight_map[pid] = interaction_weight_map.get(pid, 0) + 1.0
        for pid in bookmarked_post_ids:
            interaction_weight_map[pid] = interaction_weight_map.get(pid, 0) + 0.7

        similar_users = interactions_df[
            (interactions_df['post_id'].isin(liked_post_ids)) &
            (interactions_df['user_id'] != user_id)
        ]
        co_liked_posts = interactions_df[
            interactions_df['user_id'].isin(similar_users['user_id'])
        ]['post_id']
        co_liked_counts = co_liked_posts.value_counts(normalize=True)

        post_id_to_index = {str(pid): idx for idx, pid in enumerate(posts_df.index)}

        for pid, score in co_liked_counts.items():
            pid = str(pid)
            if pid in post_id_to_index:
                interaction_score[post_id_to_index[pid]] += score

    # Author-following boost
    if subscriptions_df is not None and not subscriptions_df.empty:
        followed_channels = subscriptions_df[subscriptions_df['subscriber'] == user_id]['channel'].tolist()
        if followed_channels:
            for idx, author_id in enumerate(posts_df.get('author', [])):
                if author_id in followed_channels:
                    interaction_score[idx] += 0.2

    # Final combined score
    final_score = alpha * content_similarities + (1 - alpha) * interaction_score
    print("Final scores:", final_score)

    if len(final_score) == 0:
        return []

    # Get top posts by score
    top_indices = np.argsort(final_score)[::-1][:top_k]

    # Prepare recommended post IDs and authors for diversification
    if 'post_id' in posts_df.columns:
        recommended_posts = posts_df.iloc[top_indices][['post_id', 'author']]
    else:
        recommended_posts = posts_df.iloc[top_indices][['author']]
        recommended_posts['post_id'] = recommended_posts.index

    # Diversify recommendations limiting max posts per author
    author_counts = defaultdict(int)
    diversified_post_ids = []
    for _, row in recommended_posts.iterrows():
        author = row['author']
        post_id = row['post_id']
        if author_counts[author] < max_per_author:
            diversified_post_ids.append(post_id)
            author_counts[author] += 1
        if len(diversified_post_ids) >= top_k:
            break

    print("Diversified recommended post IDs:", diversified_post_ids)
    return diversified_post_ids


def get_trending_posts(post_vectors, top_k=40):
    trending = post_vectors.head(top_k)
    print("Trending posts:", trending)
    if 'post_id' in trending.columns:
        return trending['post_id'].tolist()
    else:
        return trending.index.tolist()
