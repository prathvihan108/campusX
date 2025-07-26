import os
import pandas as pd
from pymongo import MongoClient, errors
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()  # Force connection on a request
    print("[✅] Connected to MongoDB successfully.")
except errors.ServerSelectionTimeoutError as err:
    print("[❌] Failed to connect to MongoDB:", err)
    raise SystemExit("MongoDB connection failed. Check your MONGO_URI.")

db = client['DummyLearn']

def load_users():
    users = list(db.users.find({}, {
        "_id": 1, "role": 1, "year": 1, "department": 1
    }))
    df = pd.DataFrame(users)
    df["_id"] = df["_id"].astype(str)
    return df

def load_posts():
    posts = list(db.posts.find({}, {
        "_id": 1, "category": 1, "author": 1, "length": 1
    }))
    df = pd.DataFrame(posts)
    df["_id"] = df["_id"].astype(str)
    df["author"] = df["author"].astype(str)
    return df

def load_likes():
    posts = list(db.posts.find({}, {"_id": 1, "likes": 1}))
    records = []

    for post in posts:
        post_id = str(post["_id"])
        for user_id in post.get("likes", []):
            records.append({"user": str(user_id), "post": post_id})

    df = pd.DataFrame(records)
    print("Likes Loaded:\n", df.head())
    return df


def load_bookmarks():
    posts = list(db.posts.find({}, {"_id": 1, "bookmarks": 1}))
    records = []

    for post in posts:
        post_id = str(post["_id"])
        for user_id in post.get("bookmarks", []):
            records.append({"user": str(user_id), "post": post_id})

    df = pd.DataFrame(records)
    print("Bookmarks Loaded:\n", df.head())
    return df


def load_subscriptions():
    subs = list(db.subscriptions.find({}, {"subscriber": 1, "channel": 1}))
    df = pd.DataFrame(subs)
    df["subscriber"] = df["subscriber"].astype(str)
    df["channel"] = df["channel"].astype(str)
    return df
