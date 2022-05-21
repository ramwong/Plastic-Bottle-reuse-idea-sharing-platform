from PIL import Image, ImageFilter
import os


def edge_image(path, target_path):
    # Opening the image (R prefixed to string
    # in order to deal with '\' in paths)
    image = Image.open(path)

    # Converting the image to grayscale, as edge detection
    # requires input image to be of mode = Grayscale (L)
    image = image.convert("L")

    # Detecting Edges on the Image using the argument ImageFilter.FIND_EDGES
    image = image.filter(ImageFilter.FIND_EDGES)

    # Saving the Image Under the name Edge_Sample.png
    image.save(target_path)


    path_split = os.path.join(".","").replace(".","")
    path = path.split(path_split)
    if "ideas" in path:
        idea_id = path[path.index('ideas')+1]
        image.save(os.path.join(os.getcwd(), 'ideas', idea_id,
               'augumented_images', path[-1]))  

if __name__ == "__main__":
    temp_path = "../temp/"
    temp_files = os.listdir(temp_path)
    print(temp_files)
    for temp_file in temp_files:
        path = f"../temp/{temp_file}"
        edge_image(path,path)