import json
from flask import jsonify, request
from utils.mongodb import database
import hashlib


Collections_member = database["member"]


def extract_request_data():
    # get data from request
    data = json.loads(request.data)
    return data.get("username"), data.get("password")


def member_register():
    username, password = extract_request_data()

    if len(username) > 16 or len(username) == 0:
        return jsonify({"status": {"success": False, "reason": "invalid username",
                        "error_code": 400}})

    if len(password) > 16 or len(password) == 0:
        return jsonify({"status": {"success": False, "reason": "invalid password",
                        "error_code": 400}})

    check_exist = Collections_member.find_one({"username": username})

    if check_exist:
        if "username" in check_exist and username == check_exist["username"]:
            # username exist back to client
            return jsonify({"status": {"success": False, "reason": "username already exist",
                            "error_code": 400}})

    hash_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
    register_info = {"username": username, "password": hash_password}

    result = Collections_member.insert_one(register_info)

    return jsonify({"status": {"success": True}})
