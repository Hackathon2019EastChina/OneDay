function addTag(UserDateLabel) {
    eel.add_tag(UserDateLabel);
}

async function readPanorama(UserData) {
    let readPanoramaData = eel.read_panorama(UserData)();
    return readPanoramaData;
}

async function initCalender(UserDate) {
    let readCalenderData = eel.init_calendar(UserDate)();
    return readCalenderData;
}

function addPanorama(UserDataImgnameImgsrcDesc){
    eel.add_panorama(UserDataImgnameImgsrcDesc)
}

function receiveSignUp(userpassword){
    eel.register(userpassword);
}

async function receiveSignIn(userpassword){
    let pass = eel.login(userpassword)();
    return pass;
}
