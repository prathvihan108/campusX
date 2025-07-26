# ml/vectorizer.py
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
import numpy as np
from data_loader import load_users, load_posts, load_likes, load_bookmarks, load_subscriptions


def preprocess_users(users_df):
    enc = OneHotEncoder()
    encoded = enc.fit_transform(users_df[["role", "year", "department"]]).toarray()
    feature_names = enc.get_feature_names_out(["role", "year", "department"])
    user_features = pd.DataFrame(encoded, columns=feature_names, index=users_df["_id"].astype(str))
    return user_features

def preprocess_posts(posts_df, users_df):
    merged = posts_df.merge(users_df, left_on="author", right_on="_id", suffixes=('', '_author'))

    enc = OneHotEncoder()
    encoded = enc.fit_transform(merged[["category", "role", "year", "department"]]).toarray()
    feature_names = enc.get_feature_names_out(["category", "role", "year", "department"])

    post_features = pd.DataFrame(encoded, columns=feature_names, index=posts_df["_id"].astype(str))
    post_features["length"] = posts_df.get("length", pd.Series(0, index=posts_df.index))

    return post_features

def build_interactions_df(likes_df, bookmarks_df):
    likes_df["liked"] = 1
    bookmarks_df["bookmarked"] = 1

    likes_df = likes_df.rename(columns={"user": "user_id", "post": "post_id"})
    bookmarks_df = bookmarks_df.rename(columns={"user": "user_id", "post": "post_id"})

    all_interactions = pd.merge(likes_df[["user_id", "post_id", "liked"]],
                                bookmarks_df[["user_id", "post_id", "bookmarked"]],
                                on=["user_id", "post_id"], how="outer").fillna(0)

    all_interactions["liked"] = all_interactions["liked"].astype(int)
    all_interactions["bookmarked"] = all_interactions["bookmarked"].astype(int)

    # Convert ObjectIds to strings
    all_interactions["user_id"] = all_interactions["user_id"].astype(str)
    all_interactions["post_id"] = all_interactions["post_id"].astype(str)

    return all_interactions


def prepare_data():
    users_df = load_users()
    posts_df = load_posts()
    likes_df = load_likes()
    bookmarks_df = load_bookmarks()
    subscriptions_df = load_subscriptions()

    user_vectors = preprocess_users(users_df)
    post_vectors = preprocess_posts(posts_df, users_df)
    interactions_df = build_interactions_df(likes_df, bookmarks_df)

    return user_vectors, post_vectors, interactions_df, subscriptions_df
