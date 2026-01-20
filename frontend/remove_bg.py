from PIL import Image
import os

def remove_white_bg(path):
    print(f"Processing {path}...")
    try:
        img = Image.open(path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Simple threshold for white background
            # If R, G, B are all high (near white), make translucent/transparent
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(path, "PNG")
        print("Success: Background removed.")
    except Exception as e:
        print(f"Error: {e}")

remove_white_bg('c:/Users/amar/Desktop/student-finance-backend/frontend/public/images/logo.png')
