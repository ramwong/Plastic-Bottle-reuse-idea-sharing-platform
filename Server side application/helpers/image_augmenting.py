# read image
import imageio
import os
import imgaug as ia
from imgaug import augmenters as iaa
ia.seed(4)

# image augmenting
aug = iaa.Sometimes(0.75, [
    iaa.Affine(rotate=(0, 359), fit_output=True),
    iaa.AdditiveGaussianNoise(scale=(0, 5)),
    iaa.Affine(scale=(0.5, 1.5), fit_output=True),
])

files_to_be_upload = os.path.join(os.getcwd(), "files_to_be_upload")

def create_augmentated_image(target, label, quantity):
    path_split = os.path.join(".","").replace(".","")
    path_split_str = target.split(path_split)
    image_name = path_split_str[-1]
    augmentated_images_full_path = []
    upload_images_full_path = []
    try:
        original_image = imageio.imread(target)
        for i in range(quantity):
            changed_image = aug(image=original_image)
            image_name = image_name.replace(".jpg","")
            changed_image_name = f"{image_name}_{i}.jpg"

            changed_image_full_path = os.path.join(files_to_be_upload, changed_image_name)
            imageio.imsave(changed_image_full_path, changed_image)
            upload_images_full_path.append(changed_image_full_path)
            augmented_image_full_path = os.path.join(
                os.getcwd(), "ideas", label, "augumented_images", changed_image_name)
            imageio.imsave(augmented_image_full_path, changed_image)
            augmentated_images_full_path.append(augmented_image_full_path)
    except Exception as e:
        print(e)
        try:
            if not upload_images_full_path:
                for path in upload_images_full_path:
                    os.remove(path)
            if not augmentated_images_full_path:
                for path in augmentated_images_full_path:
                    os.remove(path)
        except:
            pass
        return False
    return upload_images_full_path

# def create_and_save_image(original_image, changing_func, changing_name):
#     changed_image = changing_func(image=original_image)
#     imageio.imsave(
#         f"{directory}all/{filename}_{changing_name}_{labels}.jpg", changed_image)

# for file in files:
#     try:
#         original_image = imageio.imread(directory+file)
#         filename, labels = file[:-4].split("_")
#         for changing_name in all_changing_func:
#             create_and_save_image(original_image, all_changing_func[changing_name], changing_name)
#         shutil.copy(directory+file, directory+"all/"+file)
#     except:
#         print(file)


# upload to cloud storage

# import data into dataset
