import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def connect_mongo():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client[os.getenv("DB_NAME")]
    return db

def get_posts_df():
    db = connect_mongo()
    posts = list(db.posts.find({}, {
        "_id": 1,
        "category": 1,
        "author": 1,
        "likes": 1,
        "bookmarks": 1
    }))
    df = pd.DataFrame(posts)
    df["_id"] = df["_id"].astype(str)
    return df

def get_users_df():
    db = connect_mongo()
    users = list(db.users.find({}, {
        "_id": 1,
        "role": 1,
        "department": 1,
        "year": 1
    }))
    df = pd.DataFrame(users)
    df["_id"] = df["_id"].astype(str)
    return df

def get_interactions_df():
    db = connect_mongo()
    posts = list(db.posts.find({}, {"_id": 1, "likes": 1, "bookmarks": 1}))
    data = []

    for post in posts:
        post_id = str(post["_id"])
        for user in post.get("likes", []):
            data.append({"user_id": str(user), "post_id": post_id, "type": "like"})
        for user in post.get("bookmarks", []):
            data.append({"user_id": str(user), "post_id": post_id, "type": "bookmark"})

    df = pd.DataFrame(data)
    return df