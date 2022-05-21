from google.cloud import aiplatform
from .project_information import project, location

def import_to_dataset(job_name):
    
    aiplatform.init(project=project, location=location)

    dataset = aiplatform.ImageDataset.create(
        display_name=job_name,
        gcs_source=f"gs://a4_fyp/dataset.csv",
        import_schema_uri=aiplatform.schema.dataset.ioformat.image.multi_label_classification,
        sync=True,
    )

    dataset.wait()
    
    return dataset