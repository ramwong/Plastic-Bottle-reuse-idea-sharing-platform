from .project_information import endpoint

def deploy_model(model):
    model.deploy(
        endpoint=endpoint,
        deployed_model_display_name=model.name,
        traffic_percentage=100,
        sync=True
    )

    model.wait()
