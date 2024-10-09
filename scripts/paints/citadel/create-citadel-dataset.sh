#!/bin/bash

# Step 1; create intermediate file which has SVG images
node ./create-paint-data-file.js

# Step 2; Convert the SVG images to their fill color
python3 convert-svg-to-color.py

# Step 3; clean up the temp file
rm temp-paints.json;