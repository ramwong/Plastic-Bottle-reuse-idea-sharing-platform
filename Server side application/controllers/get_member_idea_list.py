
import json
from flask import jsonify, request
from utils.mongodb import database
import base64
import os
Collections = database["idea"]

def extract_request_data():
    data = json.loads(request.data)
    return data.get("username")


def add_image_to_result(result, path):
    for image_name in ("source", "product"):
        with open(os.path.join(path, f"{image_name}.jpg"), "rb") as image:
            image_base64 = base64.b64encode(image.read())
            result[image_name] = image_base64.decode("utf-8")


def calculate_avg_votes_score(result):
    total_vote_score = 0
    for i in range(0, len(result["votes"])):
        total_vote_score = total_vote_score + result["votes"][i]["score"]

    number_of_votes = len(result["votes"])

    if number_of_votes:
        avg_votes = total_vote_score / number_of_votes
    else:
        avg_votes = 5

    result["avg_votes"] = avg_votes


def get_member_idea_list():
    username = extract_request_data()

    results = Collections.find({"username": username})

    results_set = {"ideas": []}
    for result in results:
        idea_id = str(result["_id"])
        path = os.path.join(os.getcwd(), "ideas", idea_id)

        add_image_to_result(result, path)

        calculate_avg_votes_score(result)
        del result["votes"]

        result["_id"] = idea_id

        results_set["ideas"].append(result)

    return jsonify(results_set)
