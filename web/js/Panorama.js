let opt;
let href = window.location.href;
let user_index = href.indexOf("user=");
let date_index = href.indexOf("&date=");
let user_info = href.substring(user_index+5, date_index);
let date_info = href.substr(date_index+6);

window.onload = function () {
    loadPanorama();
};


async function loadPanorama() {
    let UserDate = {
        user: user_info,
        date: date_info
    };

    console.log(UserDate);

    /*TODO 这里调后端返回 imgsrc 和 labels*/
    //eel.你的函数(UserDate);


    //读取数据
    var ImgsrcLabels = await readDB("tj");
    let url_str = ImgsrcLabels.imgsrc;
    var labels_arr = [];
    for(let lable in ImgsrcLabels.labels){
        labels_arr.push(label);
    }

    opt = {
        container:'panoramaConianer',//容器
        url:url_str,            //'../img/tiled.jpg',
        lables: labels_arr,
        //[
            //{position:{lon:-72.00,lat:9.00},logoUrl:'',text:'蓝窗户'},
            // {position:{lon:114.12,lat:69.48},logoUrl:'',text:'一片云彩'},
            // {position:{lon:132.48,lat:-12.24},logoUrl:'',text:'大海'}
        //],
        widthSegments: 60,          //水平切段数
        heightSegments: 40,         //垂直切段数（值小粗糙速度快，值大精细速度慢）
        pRadius: 1000,              //全景球的半径，推荐使用默认值
        minFocalLength: 6,          //镜头最a小拉近距离
        maxFocalLength: 100,        //镜头最大拉近距离
        showlable: 'show'           // show,click
    };
    tp = new tpanorama(opt);
    tp.init();
}

//})
