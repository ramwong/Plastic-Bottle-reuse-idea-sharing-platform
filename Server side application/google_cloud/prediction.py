import base64
from .project_information import client_options,endpoint,location, project
from google.cloud import aiplatform
from google.cloud.aiplatform.gapic.schema import predict


client = aiplatform.gapic.PredictionServiceClient(client_options=client_options)
endpoint = client.endpoint_path(
    project=project, location=location, endpoint=endpoint
)

def predict_image(
    image_path,
    max_predictions = 10
):
    with open(image_path, "rb") as f:
        file_content = f.read()

    encoded_content = base64.b64encode(file_content).decode("utf-8")
    instance = predict.instance.ImageClassificationPredictionInstance(
        content=encoded_content,
    ).to_value()
    instances = [instance]
    parameters = predict.params.ImageClassificationPredictionParams( max_predictions=max_predictions,
    ).to_value()
    response = client.predict(
        endpoint=endpoint, instances=instances, parameters=parameters
    )
    predictions = response.predictions
    return predictions
