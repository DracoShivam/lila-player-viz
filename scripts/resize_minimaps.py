import os
from PIL import Image

def resize_minimaps():
    input_dir = r"d:\LILA Website\player_data\minimaps"
    output_dir = r"d:\LILA Website\lila-player-viz\public\minimaps"
    
    os.makedirs(output_dir, exist_ok=True)
    
    mapping = {
        "AmbroseValley_Minimap.png": "AmbroseValley.png",
        "GrandRift_Minimap.png": "GrandRift.png",
        "Lockdown_Minimap.jpg": "Lockdown.png"
    }
    
    for filename, new_name in mapping.items():
        input_path = os.path.join(input_dir, filename)
        if os.path.exists(input_path):
            img = Image.open(input_path)
            img = img.resize((1024, 1024), Image.Resampling.LANCZOS)
            output_path = os.path.join(output_dir, new_name)
            img.save(output_path, "PNG")
            print(f"Saved {new_name}")
        else:
            print(f"Not found: {input_path}")

if __name__ == "__main__":
    resize_minimaps()
