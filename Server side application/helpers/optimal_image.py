from google.cloud import vision
from PIL import Image
import os
client = vision.ImageAnnotatorClient()

def optimal_image(source_image_filename):
    source_image_path = os.path.join(os.getcwd(),'temp', source_image_filename)
    try:
        # open image
        with open(source_image_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.Image(content=content)
        
        # object localization
        objects = client.object_localization(image = image).localized_object_annotations
        for object in objects:
            if object.name == "Packaged goods" or object.name == "Bottle" or object.name == "Plastic Bottle":
                image = Image.open(source_image_path)
                width, height = image.size
                
                normalized_vertices = list(objects[0].bounding_poly._pb.normalized_vertices)
                left_top_nv = normalized_vertices[0]
                right_bottom_nv = normalized_vertices[2]
                
                left = width * left_top_nv.x
                top = height * left_top_nv.y
                right = width * right_bottom_nv.x
                bottom = height * right_bottom_nv.y
                
                updated_image = image.crop((left,top,right,bottom))
                
                # replace the image                
                updated_image.save(source_image_path)
                return True
    except:
        pass
    return False
    
if __name__ == "__main__":
    result =  optimal_image("./result/BTL014_[1, 3, 7, 9].jpg")
