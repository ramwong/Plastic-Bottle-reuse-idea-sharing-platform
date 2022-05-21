import json
from flask import jsonify, request
from utils.mongodb import database
import shutil
import os
import model_thread
from bson.objectid import ObjectId

Collections_idea = database["idea"]
Collections_member = database["member"]


def extract_request_data():
    # get data from request
    data = json.loads(request.data)
    return data.get("idea_id"), data.get("username")

def delete_idea():
    data = json.loads(request.data)
    idea_id, username = extract_request_data()

    check_username = Collections_member.find_one({"username": username})
    if check_username:
        if username == check_username["username"]:
            Collections_idea.delete_one({"_id": ObjectId(idea_id)})

            path = os.path.join(os.getcwd(), "ideas", idea_id)

            shutil.rmtree(path)

            # add a delete idea request to model_thread, which is same as update dataset
            model_thread.add_pending_delete_idea(idea_id)

            return jsonify({"status": {"success": True}})
        else:   # if optimal fail, which may mean not found a bottle
            return jsonify({"status": {"success": False, "reason": "You are not author", "error_code": 400}})
    else:
            return jsonify({"status": {"success": False, "reason": "You are not member", "error_code": 400}})