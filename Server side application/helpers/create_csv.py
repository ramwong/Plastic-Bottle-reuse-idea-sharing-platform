"""
gs://bucket/filename4.bmp,sunflowers,closeup
row = f"gs://a4_fyp/{filename},{id}"
"""

import csv
import os


def create_csv():
    ideas_path = os.path.join(os.getcwd(), 'ideas')
    ideas = os.listdir(ideas_path)
    with open(os.path.join(os.getcwd(), "dataset.csv"), mode="w", newline="") as csv_file:
        writer = csv.writer(csv_file, escapechar="", quoting=csv.QUOTE_NONE)
        rows = []
        for idea in ideas:
            idea_augumented_images_path = os.path.join(
                ideas_path, idea, "augumented_images")

            augumented_images = os.listdir(idea_augumented_images_path)
            for augumented_image in augumented_images:
                if augumented_image == "source.jpg":
                    rows.append([f"gs://a4_fyp/{idea}.jpg", idea])
                else:
                    rows.append([f"gs://a4_fyp/{augumented_image}", idea])
        writer.writerows(rows)
