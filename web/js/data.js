function addTag(UserDateLabel) {
    eel.add_tag(UserDateLabel);
}

async function readPanorama(UserData) {
    let readPanoramaData = eel.read_panorama(UserData)()
    return readPanoramaData;
}


function addPanorama(UserDataImgnameImgsrcDesc){
    eel.add_panorama(UserDataImgnameImgsrcDesc)
}


