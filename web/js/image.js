let files_saver = [];

function UploadHandle(fileDOM) {
    files_saver = [];

    if(!window.FileReader){
        alert("您的浏览器不支持图片预览功能, 如需该功能请升级您的浏览器!");
        return;
    }

    //把上传的图片存到后端
    SendImage();
}

/**
 * user: doubleZ
 * date: 2019-01-01
 * imgname: test1.png
 * imgsrc: [Base64编码的图片]
 */
function SendImage() {
    let imageType = /^image\//;

    let user_temp = "doubleZ";"2/6/2019"
    let date_temp = ;   // 2/6/2019
    let data_arr = date_temp.split("/");

    //处理用户名字段
    let user_info = user_temp;

    //处理日期字段
    if(data_arr[0].length === 1){
        data_arr[0] = "0" + data_arr[0];
    }
    if(data_arr[1].length === 1){
        data_arr[1] = "0" + data_arr[1];
    }
    let date_info = data_arr[2] + "-" + data_arr[1] + "-" + data_arr[0];


    for(let i=0;i<fileDOM.files.length;++i){

        let file = fileDOM.files[i];
        let reader = new FileReader();

        if(!imageType.test(file.type)){
            alert("请选择图片, 该类型的文件不受支持!");
            return;
        }

        reader.onload = function (event) {
            let img_base64 = event.target.result.split(",")[1];

            let UserDateImage = {
                user: user_info,           //
                date: date_info,            //2019-01-01
                imgname: file.name,
                imgsrc: img_base64
            };

            eel.你的函数(UserDateImage)
            // eel.get_origin_img(file.name, img_base64);
        };

        files_saver.push(file.name);

        reader.readAsDataURL(file);
    }
}


function MakeFullView() {
    eel.full_view(files_saver[0], files_saver[1]);
}