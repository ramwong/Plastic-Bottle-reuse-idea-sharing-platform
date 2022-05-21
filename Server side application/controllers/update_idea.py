import json
from flask import jsonify, request
from utils.mongodb import database
import base64
import os
from datetime import datetime
from time import time
from helpers.optimal_image import optimal_image
import shutil
from .create_idea import process_contents, get_temp_source_image_path, save_source_image, save_contents_image
import model_thread
from bson.objectid import ObjectId

Collections = database["idea"]
temp_path = os.path.join(os.getcwd(), "temp")


def extract_request_data():
    # get data from request
    data = json.loads(request.data)
    return (data.get("idea_id"), data.get("username"), data.get("type"), 
        data.get("material_need"), data.get("title"),data.get("source").encode("utf-8"),
        data.get("contents"), data.get("product").encode("utf-8"))


def recreate_idea_path(idea_id):
    idea_path = os.path.join(os.getcwd(), "ideas", idea_id)
    shutil.rmtree(idea_path)
    os.mkdir(idea_path)
    return idea_path


def add_previous_votes(idea_id, tutorial_obj):
    get_votes = Collections.find({"_id": idea_id}, {"votes": 1})
    tutorial_obj["votes"] = get_votes.votes if "votes" in get_votes else []


def update_idea():
    idea_id, username, _type, is_material_need, title, source_image, contents, product_image = extract_request_data()
    _id = ObjectId(idea_id)
    check_username = Collections.find_one({"_id": _id})
    if check_username:
        if username == check_username["username"]:
            source_image_filename = save_source_image(source_image)

            if optimal_image(source_image_filename):
                idea_path = recreate_idea_path(idea_id)

                tutorial_obj = {"username": username, "type": _type,
                                "material_need": is_material_need,
                                "contents": [],
                                "title": title,
                                "create_date": datetime.utcnow(),
                                "votes": []}

                process_contents(contents, tutorial_obj["contents"])

                add_previous_votes(idea_id, tutorial_obj)

                update_query = {"_id": _id}
                update_data = {"$set": tutorial_obj}

                result = Collections.update_one(update_query, update_data)

                shutil.move(get_temp_source_image_path(
                    source_image_filename), os.path.join(idea_path, "source.jpg"))

                save_contents_image(idea_path, contents)

                with open(os.path.join(idea_path, "product.jpg"), "wb") as product_image_file:
                    product_image_file.write(base64.b64decode(product_image))

                # add a update idea request to model_thread, which is same as create
                model_thread.add_pending_create_idea(idea_id)
                return jsonify({"status": {"success": True}})
            else:
                return jsonify({"status": {"success": False, "reason": "source image cannot optimize", "error_code": 400}})

        else:
            return jsonify({"status": {"success": False, "reason": "You are not author", "error_code": 400}})
    else:
        return jsonify({"status": {"success": False, "reason": "Idea not found", "error_code": 400}})
