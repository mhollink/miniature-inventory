#!/bin/bash

# Check if Inkscape is installed
if ! command -v inkscape &> /dev/null
then
    echo "Inkscape is not installed. Please install it and try again."
    exit 1
fi


# Check if input SVG file is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <input-file-name>"
    exit 1
fi

INPUT_FILE=$1
SIZES=(72 96 120 128 144 152 180 192 384 512)

# Loop through sizes and generate PNG files
for SIZE in "${SIZES[@]}"; do
    OUTPUT_FILE="icon-${SIZE}x${SIZE}.png"
    echo "Generating ${OUTPUT_FILE}..."
    inkscape "$INPUT_FILE" --export-type=png --export-width=$SIZE --export-height=$SIZE --export-filename=$OUTPUT_FILE
done

echo "All icons generated successfully!"
