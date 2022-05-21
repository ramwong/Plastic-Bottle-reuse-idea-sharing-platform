# Supervisor
Prof. Lui Kwok Fai Andrew 呂國輝教授

https://www.hkmu.edu.hk/st/people/key-staff/staff-profile/?email=alui

# Teammate
Ram Wong
David Lam
Marco Cheung
Samuel Lau

# Description
This is my final year project.
This project aim to develop the prototype of a platform that can let users share their ideas about how to reuse plastic bottles. After user created a idea, the idea add to a pending task list. After A specific number of tasks or 24 hours after the last training, the training process start to handle the tasks in the pending task list. After trained the model, it will used to predict similiar bottles. Other users can search ideas by their bottles in hands using the model.

# Tools / Technologies used
1. Google Cloud Platform (Cloud Vision, Cloud Storage, Cloud Engine, Vertix AI)
2. MongoDB
3. Python (Flask)
4. React Native

# Cloud Vision
Used to detect any bottle in the image (while create idea and searching).

# Cloud Storage
Store images and dataset description

# Cloud Engline
Server Hosting
Stora ideas' images

# Vertix AI
Model training and deployment

# MongoDB
Store Idea detail (not saving images as it limited document size)

# Python (Flask)
Create JSON API server program to handle request and send response

# React Native
Create cross platform mobile application
