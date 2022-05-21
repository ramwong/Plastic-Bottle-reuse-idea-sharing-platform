import json
from flask import jsonify, request
from bson.objectid import ObjectId
from utils.mongodb import database
import base64
import os

Collections = database["idea"]


def extract_request_data():
    data = json.loads(request.data)
    return data.get("idea_id")

def add_image_to_result(result, path):
    for image_name in ("source", "product"):
        with open(os.path.join(path,f"{image_name}.jpg"), "rb") as image:
            image_base64 = base64.b64encode(image.read())
            result[image_name] = image_base64.decode("utf-8")

def update_result_contents_to_image(result, path):
    for i, contents in enumerate(result["contents"]):
        if contents["type"] == "image":
            with open(os.path.join(path, f"{contents['content']}.jpg"), "rb") as index_image:
                contents["content"] = base64.b64encode(
                    index_image.read()).decode("utf-8")


def get_one_idea():
    idea_id = extract_request_data()

    result = Collections.find_one({"_id": ObjectId(idea_id)})

    path = os.path.join(os.getcwd(), "ideas", idea_id)

    add_image_to_result(result, path)

    update_result_contents_to_image(result, path)

    result["_id"] = idea_id

    return jsonify(result)
