const fs = require('fs');
const path = require('path');


function capitalizeWords(str) {
    return str.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

function writeJsonToFile(filePath, jsonObject) {
    const jsonString = JSON.stringify(jsonObject, null, 2); // Convert object to JSON string with 2-space indentation

    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON to file:', err);
            process.exit(1);
        } else {
            console.log('JSON file with paint names & SVG images has been saved.');
        }
    });
}

function loadCitadel() {
    // Read the contents of the directory
    const filenames = fs.readdirSync("./input");
    return filenames
        .filter(file => path.extname(file) === ".json")
        .map(file => {
            const filePath = path.join("./input", file);
            const fileNameWithoutExt = path.basename(file, path.extname(file));
            const data = fs.readFileSync(filePath, 'utf8');
            const paintArray = JSON.parse(data);
            const mapped = paintArray.map(paint => ({
                name: paint.name,
                color: "https://warhammer.com" + paint.images[0],
            }));
            return {
                [capitalizeWords(fileNameWithoutExt)]: mapped
            }
        })
        .reduce((a, b) => ({...a, ...b}), {});
}

writeJsonToFile("temp-paints.json", { ...loadCitadel() })