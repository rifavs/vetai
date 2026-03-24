import os
import random
import shutil

print("Script started...")

SOURCE_DIR = "dataset_original"
DEST_DIR = "dataset"

TRAIN_COUNT = 80
TEST_COUNT = 20

for split in ["train", "test"]:
    os.makedirs(os.path.join(DEST_DIR, split), exist_ok=True)

for disease in os.listdir(SOURCE_DIR):
    disease_path = os.path.join(SOURCE_DIR, disease)

    if os.path.isdir(disease_path):
        images = os.listdir(disease_path)
        random.shuffle(images)

        train_images = images[:TRAIN_COUNT]
        test_images = images[TRAIN_COUNT:TRAIN_COUNT + TEST_COUNT]

        train_dest = os.path.join(DEST_DIR, "train", disease)
        test_dest = os.path.join(DEST_DIR, "test", disease)

        os.makedirs(train_dest, exist_ok=True)
        os.makedirs(test_dest, exist_ok=True)

        for img in train_images:
            shutil.copy(
                os.path.join(disease_path, img),
                os.path.join(train_dest, img)
            )

        for img in test_images:
            shutil.copy(
                os.path.join(disease_path, img),
                os.path.join(test_dest, img)
            )

print("Dataset prepared successfully ✅")