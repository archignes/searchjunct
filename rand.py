# Simple script to randomly open a single system to review potential updates.

import webbrowser
import json

# Load the systems data from the JSON file
with open('src/data/systems.json', 'r') as file:
    systems_data = json.load(file)

# Select a random system from the list
import random
selected_system = random.choice(systems_data)

# Create the URL with the selected system's ID
url = f"http://localhost:3000/?systems={selected_system['id']}"

# Open the URL in the default web browser
webbrowser.open(url)
