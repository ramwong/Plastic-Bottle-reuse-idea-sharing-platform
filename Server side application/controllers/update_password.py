import json
from flask import jsonify, request
from utils.mongodb import database
import hashlib

Collections_member = database["member"]


def extract_request_data():
    # get data from request
    data = json.loads(request.data)
    return data.get("username"), data.get("current_password"), data.get("password")


def update_password():
    username, current_password, password = extract_request_data()

    check_same = Collections_member.find_one({"username": username})

    if check_same:
        current_password_hash = hashlib.sha256(
            current_password.encode("utf-8")).hexdigest()

        if "password" in check_same and current_password_hash == check_same["password"]:
            password_hash = hashlib.sha256(
                password.encode("utf-8")).hexdigest()
            userid = check_same["_id"]
            update_query = {"_id": userid}
            update_new_password = {"$set": {"password": password_hash}}

            Collections_member.update_one(update_query, update_new_password)

            return jsonify({"status": {"success": True}})

        return jsonify({"status": {"success": False,
                                   "reason": "invalid current password", "error_code": 400}})

    return jsonify({"status": {"success": False,
                               "reason": "user does not exist", "error_code": 400}})
