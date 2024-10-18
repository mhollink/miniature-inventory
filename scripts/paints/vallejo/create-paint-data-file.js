const fs = require('fs');
const path = require('path');

function capitalizeWords(str) {
    return str.replaceAll("-", " ").split(' ').map(word => {
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
            console.log('JSON file with paints created');
        }
    });
}

function loadVallejo() {
    // Read the contents of the directory
    const filenames = fs.readdirSync("./input");
    return filenames
        .filter(file => path.extname(file) === ".json")
        .map(file => {
            const filePath = path.join("./input", file);
            const fileNameWithoutExt = path.basename(file, path.extname(file));
            const data = fs.readFileSync(filePath, 'utf8');
            const paints = JSON.parse(data);
            const paintArray = Object.values(paints);
            const mapped = paintArray
                .filter(paint => paint.price.price <= 3.2 || paint.price.price === 5.73)
                .map(paint => ({
                name: paint.title.split("-")[0].replaceAll("Vallejo", "").replaceAll(capitalizeWords(fileNameWithoutExt), "").trim(),
                color: paint.data_01 || "transparent",
            }));
            return {
                [capitalizeWords(fileNameWithoutExt)]: mapped
            }
        })
        .reduce((a, b) => ({...a, ...b}), {});
}

writeJsonToFile("temp-paints.json", {...loadVallejo()})