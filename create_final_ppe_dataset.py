from pathlib import Path
import shutil
import yaml

SOURCE = Path("construction-ppe")
OUTPUT = Path("FINAL_PPE_DATASET")

# Original class IDs
# 0 helmet
# 1 gloves
# 2 vest
# 3 boots
# 4 goggles
# 5 none
# 6 Person
# 7 no_helmet
# 8 no_goggle
# 9 no_gloves
# 10 no_boots

# New class mapping
CLASS_MAP = {
    6: 0,   # Person
    0: 1,   # helmet
    7: 2,   # no_helmet
    2: 3,   # vest
    3: 4,   # boots
    10: 5   # no_boots
}

CLASS_NAMES = [
    "person",
    "helmet",
    "no_helmet",
    "vest",
    "boots",
    "no_boots"
]

for split in ["train", "val", "test"]:

    image_source = SOURCE / "images" / split
    label_source = SOURCE / "labels" / split

    image_output = OUTPUT / "images" / split
    label_output = OUTPUT / "labels" / split

    image_output.mkdir(parents=True, exist_ok=True)
    label_output.mkdir(parents=True, exist_ok=True)

    image_extensions = ["*.jpg", "*.jpeg", "*.png"]

    images = []

    for ext in image_extensions:
        images.extend(image_source.glob(ext))

    copied = 0

    for image in images:

        label_file = label_source / (image.stem + ".txt")

        if not label_file.exists():
            continue

        new_lines = []

        with open(label_file, "r", encoding="utf-8") as f:

            for line in f:

                parts = line.strip().split()

                if len(parts) < 5:
                    continue

                old_class = int(parts[0])

                if old_class not in CLASS_MAP:
                    continue

                new_class = CLASS_MAP[old_class]

                new_line = (
                    str(new_class)
                    + " "
                    + " ".join(parts[1:])
                )

                new_lines.append(new_line)

        # Only copy images that contain at least
        # one of our required classes
        if not new_lines:
            continue

        shutil.copy2(
            image,
            image_output / image.name
        )

        with open(
            label_output / label_file.name,
            "w",
            encoding="utf-8"
        ) as f:

            f.write("\n".join(new_lines))

        copied += 1

    print(
        f"{split}: {copied} images created"
    )


# Create data.yaml

data = {
    "path": str(OUTPUT.resolve()),
    "train": "images/train",
    "val": "images/val",
    "test": "images/test",
    "nc": len(CLASS_NAMES),
    "names": CLASS_NAMES
}

with open(
    OUTPUT / "data.yaml",
    "w",
    encoding="utf-8"
) as f:

    yaml.dump(
        data,
        f,
        sort_keys=False
    )


print("\n================================")
print("FINAL PPE DATASET CREATED")
print("================================")

for i, name in enumerate(CLASS_NAMES):

    print(
        f"{i} → {name}"
    )

print("================================")