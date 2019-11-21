function writeDB(writeData) {
    eel.write_db(writeData);
}

async function readDB(userName) {
    let readData = eel.read_db(userName)()
    return readData;
}


