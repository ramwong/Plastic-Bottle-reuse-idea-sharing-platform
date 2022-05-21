
import json
from flask import jsonify, request
from utils.mongodb import database
import base64
import os
import shutil
from time import time
from datetime import datetime
import model_thread
from helpers.optimal_image import optimal_image

Collections = database["idea"]
temp_path = os.path.join(os.getcwd(), "temp")


def extract_request_data():
    # get data from request
    data = json.loads(request.data)
    return (data.get("username"), data.get("title"), data.get("type"), data.get("material_need"),
            data.get("source").encode("utf-8"), data.get("contents"), data.get("product").encode("utf-8"))


def get_temp_source_image_path(source_image_filename):
    return os.path.join(temp_path, source_image_filename)


def save_source_image(source_image):
    # save source_image
    source_image_filename = f"{round(time() * 10000000)}.jpg"
    temp_source_image_path = get_temp_source_image_path(source_image_filename)
    with open(temp_source_image_path, "wb") as temp_source_image_file:
        temp_source_image_file.write(base64.b64decode(source_image))
    return source_image_filename


def process_contents(original_contents, updated_contents):
    for i, contents in enumerate(original_contents):
        if contents["type"] == "image":
            updated_contents.append({"type": "image", "content": i})
        else:
            updated_contents.append(
                {"type": "text", "content": contents["content"]})


def save_contents_image(idea_path, contents):
    for i, contents in enumerate(contents):
        if contents["type"] == "image":
            with open(os.path.join(idea_path, f"{i}.jpg"), "wb") as index_image:
                index_image.write(base64.b64decode(
                    contents["content"].encode("utf-8")))


def create_directory(idea_path):
    os.mkdir(idea_path)
    os.mkdir(os.path.join(idea_path, 'augumented_images'))
    os.mkdir(os.path.join(idea_path, 'voted_images'))


def create_idea():
    username, title, _type, is_material_need, source_image, contents, product_image = extract_request_data()

    source_image_filename = save_source_image(source_image)

    # optimal source image
    if optimal_image(source_image_filename):    # if optimal success
        # create tutorial dict
        tutorial_obj = {"username": username, "type": _type,
                        "material_need": is_material_need,
                        "contents": [],
                        "title": title,
                        "create_date": datetime.utcnow(),
                        "votes": []}
        process_contents(contents, tutorial_obj["contents"])

        # create new record in mongodb
        result = Collections.insert_one(tutorial_obj)

        # make directory by inserted id
        idea_path = os.path.join(os.getcwd(), 'ideas', str(result.inserted_id))
        create_directory(idea_path)

        # move source image to ideas/objectid
        shutil.move(get_temp_source_image_path(
            source_image_filename), os.path.join(idea_path, "source.jpg"))

        save_contents_image(idea_path, contents)

        # save product image
        with open(os.path.join(idea_path, "product.jpg"), "wb") as product_image_file:
            product_image_file.write(base64.b64decode(product_image))

        # add a create idea request to model_thread
        model_thread.add_pending_create_idea(str(result.inserted_id))

        # send result back to client
        return jsonify({"_id": f"{result.inserted_id}", "status": {"success": True}})
    else:   # if optimal fail, which may mean not found a bottle
        return jsonify({"status": {"success": False, "reason": "Image cannot optimize or does not contain a bottle", "error_code": 400}})
