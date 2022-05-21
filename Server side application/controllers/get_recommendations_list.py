from cProfile import label
import json
from flask import jsonify, request
from utils.mongodb import database
from bson.objectid import ObjectId
import base64
import os, json
from time import time
from helpers.optimal_image import optimal_image
import shutil
from google_cloud.prediction import predict_image
from helpers.edge import edge_image

Collections = database["idea"]
temp_path = path = os.path.join(os.getcwd(), "temp")
search_path = path = os.path.join(os.getcwd(), "searching_images")

def fill_image_to_contents(idea_path,contents):
    for step in contents:
        if step["type"] == "image": 
            path = os.path.join(idea_path, f"{step['content']}.jpg")
            with open(path, "rb") as image:
                step['content'] = base64.b64encode(image.read()).decode("utf-8")
            
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

def extract_request_data():
    data = json.loads(request.data)
    return (data.get("image").encode("utf-8"), data.get("types"), data.get("material_needs"), 
         data.get("username"), data.get("quantity"))

def save_searching_image(image):
    # save source_image
    image_filename = f"{round(time() * 10000000)}.jpg"
    image_path = os.path.join(temp_path, image_filename)
    with open(image_path, "wb") as search_image_file:
        search_image_file.write(base64.b64decode(image))
    return image_filename, image_path

def process_searching_image(username, temp_image_filename, temp_image_path):
    new_image_name = f"{username}_{temp_image_filename}"
    searching_image_path = os.path.join(search_path, new_image_name)
    shutil.copy(temp_image_path,searching_image_path)

    edge_image(temp_image_path, temp_image_path)
    return new_image_name

def add_image_to_result(result, path):
    for image_name in ("source", "product"):
        with open(os.path.join(path,f"{image_name}.jpg"), "rb") as image:
            image_base64 = base64.b64encode(image.read())
            result[image_name] = image_base64.decode("utf-8")

def process_predictions_result(predictions, query, quantity):
    recommend_result = []
    for prediction in predictions:
        for i, id in enumerate(prediction["displayNames"]):
            query["_id"] = ObjectId(id)
            idea_path = os.path.join(os.getcwd(), "ideas", id)
            query_result = Collections.find_one(query)
            if query_result:
                query_result["chance"] = prediction["confidences"][i]
                del query_result["contents"]
                add_image_to_result(query_result, idea_path)                    
                calculate_avg_votes_score(query_result)
                del query_result["votes"]
                query_result["_id"] = id
                recommend_result.append(query_result)
    recommend_result.sort(reverse=True, key=lambda item:item["chance"])
    if quantity:
        recommend_result = recommend_result[:quantity]
    return recommend_result

def get_recommendations_list():

    image,types,is_material_needs, username,quantity = extract_request_data()

    temp_image_filename, temp_image_path = save_searching_image(image)

    if optimal_image(temp_image_filename):
        and_query = []
        query = {}

        if types:
            type_or = []
            for _type in types:
                type_or.append({'type':_type})
            and_query.append({"$or":type_or})
        if is_material_needs:
            material_needs_or = []
            for is_material_need in is_material_needs:
                material_needs_or.append({'material_need':is_material_need})
            and_query.append({"$or":material_needs_or})
        if and_query:
            query["$and"] = and_query

        new_image_name = process_searching_image(username, temp_image_filename, temp_image_path)

        predictions = predict_image(temp_image_path,  quantity or 30)
        recommend_result = process_predictions_result(predictions, query, quantity)
        os.remove(temp_image_path)
        return jsonify({"image_name": new_image_name, "status": {"success": True}, 
                        "ideas":recommend_result})

    else: 
        return jsonify({"status": {"success": False, "reason": "image cannot optimize", "error_code": 400}})








    