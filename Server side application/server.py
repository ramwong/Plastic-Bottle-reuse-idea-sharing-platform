from flask import Flask
from controllers.create_idea import create_idea
from controllers.get_idea_list import get_idea_list
from controllers.delete_idea import delete_idea
from controllers.get_one_idea import get_one_idea
from controllers.member_register import member_register
from controllers.member_login import member_login
from controllers.update_password import update_password
from controllers.get_recommendations_list import get_recommendations_list
from controllers.voting import voting
from controllers.update_idea import update_idea
from controllers.get_member_idea_list import get_member_idea_list
import os


app = Flask(__name__)


@app.route("/api/member_register/", methods=['POST'])   # checked
def member_register_api():
    return member_register()


@app.route("/api/member_login/", methods=['POST'])  # checked
def member_login_api():
    return member_login()


@app.route("/api/update_password/", methods=['POST'])   # checked
def update_password_api():
    return update_password()


@app.route("/api/create_idea/", methods=['POST'])   # updated
def create_idea_api():
    return create_idea()


@app.route("/api/get_one_idea/", methods=['POST'])   # updated
def get_one_idea_api():
    return get_one_idea()


@app.route("/api/get_member_idea_list/", methods=['POST'])  # updated
def get_member_idea_list_api():
    return get_member_idea_list()

@app.route("/api/get_idea_list/", methods=['POST'])  # updated
def get_idea_list_api():
    return get_idea_list()


# updated, as will save the image used to seach, use POST
@app.route("/api/get_recommendations_list/", methods=['POST'])
def get_recommendations_list_api():
    return get_recommendations_list()


@app.route("/api/voting/", methods=['POST'])    # updated
def voting_api():
    return voting()


@app.route("/api/update_idea/", methods=['POST'])   # updated
def update_idea_api():
    return update_idea()


@app.route("/api/delete_idea/", methods=['POST'])   # updated
def delete_idea_api():
    return delete_idea()


if __name__ == "__main__":
    if 'server.py' in os.listdir(os.getcwd()):
        app.run(host="0.0.0.0", port="5000")
    else:
        print('Please run in root directory which contain server.py')
