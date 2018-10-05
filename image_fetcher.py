import sys
import os
import csv
import wget
import time
from wand.image import Image

input_file = sys.argv[1]
mode = sys.argv[2]

#  load csv
with open(input_file, "r") as data_file, open("data/full_data.csv", mode) as full_data_file, open("data/temp.csv", "w") as temp_error_data_file:
    reader = csv.DictReader(data_file)
    field_names = ["name","set","land_type","cycle","color","image_url","thumb_url"]
    writer = csv.DictWriter(full_data_file, fieldnames=field_names)
    if (mode == "w"):
        writer.writeheader()
    error_writer = csv.DictWriter(temp_error_data_file, fieldnames=field_names)
    error_writer.writeheader()
    #  for each line
    for row in reader:
        #     // write to new csv with full and thumb urls
        full_image_location = f'https://meta-studios.com/images/cards/full/{row["name"].lower().replace(" ", "_")}.png'
        row["image_url"]=full_image_location
        thumb_location = f'https://meta-studios.com/images/cards/thumb/{row["name"].lower().replace(" ", "_")}.png'
        row["thumb_url"]=thumb_location
        writer.writerow(row)

    #     //  call api for image from card name
        try:
            request_url = f'https://api.scryfall.com/cards/named?exact={row["name"].replace(" ", "+")}&format=image&version=png'
            wget.download(request_url, full_image_location)
        #     // create thumb using image magick
            with Image(filename=full_image_location) as img:
                with img.clone() as thumb:
                    thumb.transform(resize="x200")
                    thumb.save(filename=thumb_location)
        except:
            print(f'Error with {row["name"]}')
            error_writer.writerow(row)
#      // delay 100 ms
        time.sleep(.1)
os.rename("data/temp.csv", "data/error_data.csv" )
# https://api.scryfall.com/cards/named?exact=Rootbound+Craig?format=image?version=png