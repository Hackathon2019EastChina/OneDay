let files_saver = [];

function UploadHandle(fileDOM) {
    files_saver = [];
    let imageType = /^image\//;

    if(!window.FileReader){
        alert("您的浏览器不支持图片预览功能, 如需该功能请升级您的浏览器!");
        return;
    }

    for(let i=0;i<fileDOM.files.length;++i){
        console.log(i);

        let file = fileDOM.files[i];
        let reader = new FileReader();

        if(!imageType.test(file.type)){
            alert("请选择图片, 该类型的文件不受支持!");
            return;
        }

        reader.onload = function (event) {
            let img_base64 = event.target.result.split(",")[1];
            eel.get_origin_img(file.name, img_base64);
        };

        files_saver.push(file.name);


        reader.readAsDataURL(file);
    }

}

function MakeFullView() {
    eel.full_view(files_saver[0], files_saver[1]);
}