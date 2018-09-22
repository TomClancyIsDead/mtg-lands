import csv
import wget
import time
from wand.image import Image

#  load csv
with open("data/sample.csv", "r") as data_file, open("data/temp.csv", "w+") as temp_file:
    reader = csv.DictReader(data_file)
    field_names = ["name","set","land_type","cycle","color","image_url","thumb_url"]
    writer = csv.DictWriter(temp_file, fieldnames=field_names)
    writer.writeheader()
    #  for each line
    for row in reader:
    #     //  call api for image from card name
        request_url = f'https://api.scryfall.com/cards/named?exact={row["name"].replace(" ", "+")}&format=image&version=png'
        full_image_location = f'images/cards/full/{row["name"].lower().replace(" ", "_")}.png'
        wget.download(request_url, full_image_location)
        row["image_url"]=full_image_location
    #     // create thumb using image magick
        with Image(filename=full_image_location) as img:
            with img.clone() as thumb:
                thumb.transform(resize="x200")
                thumb_location = f'images/cards/thumb/{row["name"].lower().replace(" ", "_")}.png'
                thumb.save(filename=thumb_location)
                row["thumb_url"]=thumb_location
#     // write to new csv with full and thumb urls
        writer.writerow(row)
#      // delay 100 ms
        time.sleep(.1)

# https://api.scryfall.com/cards/named?exact=Rootbound+Craig?format=image?version=png