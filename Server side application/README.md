# What you need to have
- Get Google Application Credentials (which is a JSON file)
    - https://cloud.google.com/docs/authentication/getting-started
- In Google Cloud
    - Create a project, a Cloud Storage bucket, Vertex AI endpoint, and a Ubuntu VM instance.
    - Add port 5000 to white list in firewall for the Ubuntu VM


# Packages need to install(ubuntu)
1. `sudo apt install python3.10 apt-transport-https ca-certificates gnupg curl ffmpeg libsm6 libxext6`
2. `echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list`
3. `curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -`
4. `sudo apt update && sudo apt install google-cloud-sdk google-cloud-sdk-app-engine-python`

# What you need to set
- Environment variable of GOOGLE_APPLICATION_CREDENTIALS (with the JSON file)
- `gcloud init`
- google_cloud/project_information.py
    - bucket_name (from Cloud Storage)
    - project (from Project info - Project ID)
    - location (You can see a list in vertex AI and select one close to your VM location)
    - endpoint_name (from Vertex AI - Endpoints - ID)
- utils/mongodb.py
    - username (created at MongoDB - Database - Database User)
    - password (created at MongoDB - Database - Database User)
    - database_name (created at MongoDB - Database)
- Empty folder
    - files_to_be_upload
    - ideas
    - searching_images
    - temp
- In MongoDB:
    1. Create an account and database
    2. Create Database User
    3. Create 2 collections:
        - idea
        - member


# What you can set
- model_thread.py
    - number_of_task_to_train
        - define when to start by the number of pending tasks
    - time_to_start_if_less_than_limit
        - define when to start if number of pending tasks less then number_of_task_to_train
    - number_of_augument_image
        - define the number of augumented image by each example image

# Run
`python server.py`