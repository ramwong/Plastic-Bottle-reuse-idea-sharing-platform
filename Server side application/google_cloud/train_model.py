from google.cloud import aiplatform

def train_model(job_name, dataset):
    training_fraction_split = 0.8
    validation_fraction_split = 0.1
    test_fraction_split = 0.1
    #budget_milli_node_hours = 1000  # may not work
    budget_milli_node_hours = 8000 
    disable_early_stopping = False
    sync = True

    job = aiplatform.AutoMLImageTrainingJob(
        display_name=job_name,
        model_type="CLOUD",
        prediction_type='classification',
        multi_label=True
    )

    model = job.run(
        dataset=dataset,
        model_display_name=job_name,
        training_fraction_split=training_fraction_split,
        validation_fraction_split=validation_fraction_split,
        test_fraction_split=test_fraction_split,
        budget_milli_node_hours=budget_milli_node_hours,
        disable_early_stopping=disable_early_stopping,
        sync=sync
    )

    model.wait()
    
    return model
