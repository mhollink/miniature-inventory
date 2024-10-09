import requests
from bs4 import BeautifulSoup
import json

# Function to fetch fill colors from an SVG URL
def get_preferred_fill_color(svg_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    response = requests.get(svg_url, headers=headers)

    if response.status_code == 200:
        svg_content = response.text

        # Parse the SVG content
        soup = BeautifulSoup(svg_content, 'xml')

        # Collect fill colors
        fill_colors = []
        for element in soup.find_all(True):  # Find all tags
            fill = element.get('fill')
            if fill:
                fill_colors.append(fill)

        # Filter and prioritize colors
        preferred_color = None
        for color in fill_colors:
            # Skip white and black
            if color in ['#FFFFFF', '#000000']:
                continue

            # Prefer hex colors
            if color.startswith('#') and (len(color) == 7 or len(color) == 4):
                # If we haven't set a preferred color yet, set it
                if preferred_color is None:
                    preferred_color = color
                # If we already have a preferred color, decide based on the preference
                elif preferred_color in ['#FFFFFF', '#000000']:
                    preferred_color = color  # Replace with a valid color
                # If both are valid colors, keep the existing preferred color
            # Optionally handle gradient URLs or other formats if necessary

        return preferred_color  # Return the selected preferred color
    else:
        print(f"Failed to retrieve SVG: {response.status_code}")
        return None


# Step 1: Load JSON data from a file
with open('temp-paints.json', 'r') as file:  # Replace 'your_file.json' with your actual file name
    data = json.load(file)

# Step 2: Iterate through the colors and extract fill colors
results = {}
print("Converting SVG images to their fill color")
for category, paints in data.items():
    print()
    results[category] = []
    for paint in paints:
        print("Fetching paint " + category + "/" + paint["name"])

        name = paint["name"]
        color_url = paint["color"]

        # Fetch the preferred fill color for the given URL
        preferred_color = get_preferred_fill_color(color_url)

        # Append the result if a valid color is found
        if preferred_color:
            results[category].append({
                "name": name,
                "color": preferred_color
            })
        else:
            results[category].append({
                "name": name,
                "color": "transparent"
            })

# Step 3: Optionally save the results to a new JSON file
with open('citadel.json', 'w') as output_file:  # Replace with your desired output file name
    json.dump(results, output_file, indent=4)

print()
print("Converted (where possible) the svg urls from paints.json to hex colors. See 'citadel.json'")
