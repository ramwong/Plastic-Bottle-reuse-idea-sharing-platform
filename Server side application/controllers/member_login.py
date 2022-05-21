import json
from flask import jsonify
from utils.mongodb import database
import hashlib
from .member_register import extract_request_data


Collections_member = database["member"]

def member_login():
    username, password = extract_request_data()

    check_exist = Collections_member.find_one({"username":username})
    
    if check_exist:
        password = hashlib.sha256(password.encode('utf-8')).hexdigest()
        if password == check_exist["password"]:
            #login success
            return jsonify({"username":username,"status":{"success":True}})
        else:
            #password wrong
            return jsonify({"username":username,"status":{"success":False,
                            "reason":"password wrong", "error_code":400}})
    else:
        #username not found
        return jsonify({"username":username,"status":{"success":False,
                            "reason":"username not found", "error_code":404}})