import json
import os
from flask import jsonify, request
from utils.mongodb import database
from datetime import datetime
import model_thread
import shutil
from bson.objectid import ObjectId

Collections_idea = database["idea"]
Collections_member = database["member"]

searching_image_path = os.path.join(os.getcwd(), "searching_images")
ideas_path = os.path.join(os.getcwd(), "ideas")


def extract_request_data():
    # get data from request
    data = json.loads(request.data)
    return data.get("idea_id"), data.get("image"), data.get("username"), data.get("score")


def voting():
    idea_id, image_name, username, score = extract_request_data()
    _id = ObjectId(idea_id)
    check_username = Collections_member.find_one({"username": username})

    if username == check_username["username"]:
        # check has voted
        get_votes = Collections_idea.find_one(
            {"_id": _id}, {"votes": 1, "_id": 0})
        if get_votes and "votes" in get_votes:
            for vote in get_votes["votes"]:
                if vote["username"] == username:
                    return jsonify({"idea_id": idea_id, "status": {"success": False, "reason": "already voted", "error_code": 400}})

        # update vote into db
        new_vote_json = {"username": username, "image": image_name,
                         "score": score, "vote_date": datetime.utcnow()}
        Collections_idea.update_one(
            {"_id": _id}, {"$push": {"votes": new_vote_json}})
        shutil.copy(os.path.join(searching_image_path, image_name),
                    os.path.join(ideas_path, idea_id, "voted_images", image_name))
        # add a voting idea request to model_thread if score >= 5
        # help to improve recommendation
        if score >= 5:
            model_thread.add_pending_voting(image_name, idea_id, score)

        return jsonify({"status": {"success": True}})
    else:
        return jsonify({"status": {"success": False, "reason": "user not exist", "error_code": 404}})
