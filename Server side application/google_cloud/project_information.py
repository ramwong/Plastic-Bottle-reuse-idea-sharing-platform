from google.cloud import aiplatform
bucket_name = ""

project=""

location="us-central1"

endpoint_name=""

endpoint = aiplatform.Endpoint(endpoint_name=endpoint_name, project=project,location=location)

client_options = {"api_endpoint": f"{location}-aiplatform.googleapis.com"}