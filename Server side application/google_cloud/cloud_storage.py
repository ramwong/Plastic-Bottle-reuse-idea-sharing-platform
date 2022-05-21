from google.cloud import storage
from .project_information import bucket_name
import os

storage_client = storage.Client()


def save_file_to_cloud_storage(file_full_path):
    
    path_split = os.path.join(".","").replace(".","")
    filename = file_full_path.split(path_split)[-1]
    storage = storage_client.bucket(bucket_name)
    blob = storage.blob(filename)
    blob.upload_from_filename(file_full_path)