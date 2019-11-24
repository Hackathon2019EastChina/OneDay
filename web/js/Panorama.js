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

    //读取数据
    let ImgsrcLabels = await readPanorama(UserDate);
    console.log(ImgsrcLabels);

    let labels_arr = [];
    for(let lable in ImgsrcLabels.label){
        labels_arr.push(eval('(' + ImgsrcLabels.label[lable]+ ')'));
    }
    console.log(labels_arr);

    let url_str = 'img/' + ImgsrcLabels.path;
    console.log(url_str);

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


document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==81){ // 按 Esc
           window.location.href="calendar.html";
        }
    }