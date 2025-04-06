const removeKeys = (keys, object) => {
    keys.forEach((key) => {
        delete object[key];
    })
    return object;
}

module.exports = removeKeys;