let opt;
let href = window.location.href;
let user_index = href.indexOf("user=");
let date_index = href.indexOf("&date=");
let user_info = href.substr(user_index+5, date_index);
let date_info = href.substr(date_index+6);

window.onload = function () {
    loadPanorama(imgsrc);
};


async function loadPanorama(imgsrc) {
    let UserDate = {
        user: user_info,
        date: date_info
    };


    /*TODO 这里调后端返回 imgsrc 和 labels*/
    //eel.你的函数(UserDate);


    //读取数据
    var readData = await readDB("tj");
    //console.log(readData);
    var readLables=[];
    for(lable in readData){
        //console.log(readData[lable]);
        readLables.push(eval('(' + readData[lable]+ ')'));
    }
    //console.log(readLables);

    // let url_str = 'img/' + imgsrc;
    //console.log(url_str);

    opt = {
        container:'panoramaConianer',//容器
        url:url_str,            //'../img/tiled.jpg',
        lables: readLables,
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
