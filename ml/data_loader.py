# ml/data_loader.py
import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
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
    likes = list(db.likes.find({}, {"user": 1, "post": 1}))
    df = pd.DataFrame(likes)
    df["user"] = df["user"].astype(str)
    df["post"] = df["post"].astype(str)
    return df

def load_bookmarks():
    bookmarks = list(db.bookmarks.find({}, {"user": 1, "post": 1}))
    df = pd.DataFrame(bookmarks)
    df["user"] = df["user"].astype(str)
    df["post"] = df["post"].astype(str)
    return df

def load_subscriptions():
    subs = list(db.subscriptions.find({}, {"subscriber": 1, "channel": 1}))
    df = pd.DataFrame(subs)
    df["subscriber"] = df["subscriber"].astype(str)
    df["channel"] = df["channel"].astype(str)
    return df
