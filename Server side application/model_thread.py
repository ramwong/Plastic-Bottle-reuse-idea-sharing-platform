from threading import Lock, Thread
from time import sleep, time
import os,json
from helpers.image_augmenting import create_augmentated_image
from helpers.create_csv import create_csv
from google_cloud.cloud_storage import save_file_to_cloud_storage
from google_cloud.import_to_dataset import import_to_dataset
from google_cloud.train_model import train_model
from google_cloud.deploy_model import deploy_model
from helpers.edge import edge_image

lock = Lock()
pending_ids = []

# number of task more than this, the training job will start if no existing task
number_of_task_to_train = 1000
time_to_start_if_less_than_limit = 24 * 60 * 60  # 1 day = 24 hour * 60 minutes * 60seconds
csv_name = "dataset.csv"
csv_path = os.path.join(os.getcwd(), csv_name)
upload_files_path = os.path.join(os.getcwd(), 'files_to_be_upload')


def add_pending_create_idea(id):
    """
    for creating an idea
    """
    with lock:
        pending_ids.append({
            'idea_id': id,
            'label': id,
            'number_of_augument_image': 49
        })


def add_pending_voting(filename, id, voting_score):
    """
    for voting, only provide filename without path
    """
    print(filename)
    with lock:
        pending_ids.append({
            "searching_image": filename,
            'label': id,
            'number_of_augument_image': voting_score*5-1
        })

def add_pending_delete_idea(idea_id):
    with lock:
        if idea_id in pending_ids:
            pending_ids.remove(idea_id)
        pending_ids.append(False)  # used to skip for loop (for id in ids) having "if id" in model_thread:


def model_thread():
    global pending_ids
    while True:
        waiting_time = 0
        while len(pending_ids) < number_of_task_to_train:
            # check any new tasks added, as later process may take a long time, pending_ids is a list
            sleep(1)
            waiting_time +=1
            if waiting_time >= time_to_start_if_less_than_limit and pending_ids:
                break
        with lock:
            # copy pending_ids and clear it, so other can add task
            ids = pending_ids[:]    # id = label
            pending_ids = []

        job_name = str(round(time() * 10000000))
        all_files_path = [csv_path]
        print("Job", job_name, "start")
        print("Affected task:", ids)
        for id in ids:
            try:
                if id:  # for delete request
                    target_path = ""    # cwd/files_to_be_upload/filename.jpg
                    id_files_path = []
                    # copy photos into files_to_be_upload folder
                    if "searching_image" in id:
                        searching_image_name = id["searching_image"]
                        target_path = os.path.join(
                            upload_files_path, searching_image_name)
                        id_files_path = [target_path]
                        edge_image(os.path.join(
                            os.getcwd(), 'searching_images', searching_image_name
                        ), target_path)
                    elif "idea_id" in id:
                        idea_id = id["idea_id"]
                        target_path = os.path.join(upload_files_path, f"{idea_id}.jpg")
                        id_files_path = [target_path]
                        edge_image(os.path.join(
                            os.getcwd(), 'ideas', idea_id, "source.jpg"
                        ), target_path)
                    # image augmentation
                    if target_path:
                        augment_result = create_augmentated_image(target_path, id["label"], id["number_of_augument_image"])
                        if augment_result:
                            id_files_path.extend(augment_result)
                            all_files_path.extend(id_files_path)
            except Exception as e:
                print(e)

        try:
            # create csv
            print(f"{job_name} creating csv")
            create_csv()
            
            # upload all file in files_to_be_upload folder
            # and delete it
            print(f"{job_name} uploading")
            save_file_to_cloud_storage(all_files_path[0])
            for file_path in set(all_files_path[1:]):
                
                save_file_to_cloud_storage(file_path)
                os.remove(file_path)

            # google cloud
            # import dataset
            print(f"{job_name} importing")
            dataset = import_to_dataset(job_name)

            # train model
            print(f"{job_name} training")
            model = train_model(job_name, dataset)

            # deploy the model
            print(f"{job_name} deploying")
            deploy_model(model)
            
        except Exception as e:
            print(e)
        """
        after model deploy, the function check there is any pending task.
        """


Thread(target=model_thread).start()
