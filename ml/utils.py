from collections import defaultdict

def diversify_recommendations(recommended_posts, post_vectors_df, max_per_author=1):

    # Group post IDs by their author
    grouped = defaultdict(list)
    for post_id in recommended_posts:
        author_id = post_vectors_df.loc[post_id]['author_id']
        grouped[author_id].append(post_id)
    
    # Create a list of lists, one per author
    author_post_lists = list(grouped.values())
    
    result = []
    author_indices = [0] * len(author_post_lists)
    while len(result) < len(recommended_posts):
        for idx, posts in enumerate(author_post_lists):
            count = 0
            while author_indices[idx] < len(posts) and count < max_per_author and len(result) < len(recommended_posts):
                result.append(posts[author_indices[idx]])
                author_indices[idx] += 1
                count += 1
    return result[:len(recommended_posts)]
