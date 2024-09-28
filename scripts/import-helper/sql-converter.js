const fs = require('fs');

try {
    const data = fs.readFileSync('miniature-inventory.json', 'utf8');
    const parsed = JSON.parse(data);
    const {models, groups, collections} = parsed.inventory;

    const groupsWithModels = groups.map(group => ({
        ...group,
        models: group.models.map(id => models.find(model => model.id === id))
    }))
    const collectionsWithGroups = collections.map(collections => ({
        ...collections,
        groups: collections.groups.map(id => groupsWithModels.find(group => group.id === id))
    }));

    const collectionValues = collectionsWithGroups.map(collection => `('QUZ0ulFhsHNQtnNlrRp0DvkVfkK2', '${collection.id}', '${collection.name}')`);
    const collectionStatements = "INSERT INTO `collections` (`user_id`, `collection_id`, `name`) VALUES " + collectionValues.join(", ") + ";"
    // console.log(collectionStatements);

    const groupValues = collectionsWithGroups.flatMap(collection => collection.groups.map(group => `('QUZ0ulFhsHNQtnNlrRp0DvkVfkK2', '${collection.id}', '${group.id}', '${group.name}')`));
    const groupStatement = "INSERT INTO `groups` (`user_id`, `collection_id`, `group_id`, `name`) VALUES " + groupValues.join(", ") + ";"
    // console.log(groupStatement);

    const modelValues = groupsWithModels.flatMap(group => group.models.map(model => `('QUZ0ulFhsHNQtnNlrRp0DvkVfkK2', '${group.id}', '${model.id}', '${model.name}')`));
    const modelStatement = "INSERT INTO `models` (`user_id`, `group_id`, `model_id`, `name`) VALUES " + modelValues.join(", ") + ";";
    // console.log(modelStatement);

    const miniValues = groupsWithModels.flatMap(group => group.models.flatMap(model => model.collection.map(miniature => `('QUZ0ulFhsHNQtnNlrRp0DvkVfkK2', '${model.id}', '${miniature.stage}', '${miniature.amount}')`)));
    // taking a subset here as the sql insert statement gets to big real soon.
    const subset = miniValues.slice(0, 200);
    const minatureStatement = "INSERT INTO `miniatures` (`user_id`, `model_id`, `stage_index`, `amount`) VALUES " + subset.join(", ") + ";"
    // console.log(minatureStatement);
} catch (err) {
    console.error('Error reading the file:', err);
}
