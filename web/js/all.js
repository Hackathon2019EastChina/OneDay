const AVAILABLE_WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const localStorageName = 'user-name';   // ----！！！-------
let userName = localStorage.getItem(localStorageName);   // ----！！！-------
let daysTemplate = "";
//!!!!! 时间格式：day/month/year , month范围[0,11]


class CALENDAR {
    constructor(options) {
        // this.userName = '';
        this.options = options;
        this.elements = {
            days: this.getFirstElementInsideIdByClassName('calendar-days'),
            week: this.getFirstElementInsideIdByClassName('calendar-week'),
            month: this.getFirstElementInsideIdByClassName('calendar-month'),
            year: this.getFirstElementInsideIdByClassName('calendar-current-year'),
            eventList: this.getFirstElementInsideIdByClassName('current-day-events-list'),
            eventField: this.getFirstElementInsideIdByClassName('add-event-day-field'),
            eventAddBtn: this.getFirstElementInsideIdByClassName('add-event-day-field-btn'),
//            eventDeleteBtn: this.getFirstElementInsideIdByClassName('delete-event-day-field-btn'), // ------!!!
            currentDay: this.getFirstElementInsideIdByClassName('calendar-left-side-day'),
            currentWeekDay: this.getFirstElementInsideIdByClassName('calendar-left-side-day-of-week'),
            prevYear: this.getFirstElementInsideIdByClassName('calendar-change-year-slider-prev'),
            nextYear: this.getFirstElementInsideIdByClassName('calendar-change-year-slider-next'),
        };  // html blocks

        // 这一项要被删掉
        //this.eventList = JSON.parse(localStorage.getItem(localStorageName)) || {};   // ------！！！要返回一个按照LocolStorage里格式一样的eventList------

        this.date = +new Date();
        this.options.maxDays = 37;
        this.init();
    }

    // methods
    init() {
        if (!this.options.id) return false;
        this.eventsTrigger();
        this.drawAll();
        // this.getUserName();
    }

    // ------!!!获得用户名信息------
    // getUserName() {
    //     this.userName = localStorage.getItem(localStorageName);
    //     console.log(this.userName);
    // }

    // draw Methods
    drawAll() {
        this.drawWeekDays();
        this.drawMonths();
        this.drawDays();
        this.drawYearAndCurrentDay();
        this.drawEvents();

    }

    // add the Events in the left block (will be changed into images)   !!!
    async drawEvents() {
        let calendar = this.getCalendar();
        let judge = false;
        let eventList = ['记录你的生活'];
//        // ------!!!通过calendar.active.formatted（时间）调用函数返回当日的Event（以数组的形式，外面加一个[]），存入eventTemp-------
//        //
       let user_temp = userName; // "doubleZ";
       let date_temp = calendar.active.formatted;   // "2/6/2019"
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

       let UserDate = {
           user: user_info,
           date: date_info
       };
        //Todo: 根据UserDate调用后端，返回当日的Event（以数组的形式，外面加一个[]），存入eventTemp----------------
        let eventTemp = await readPanorama(UserDate);
        //let eventTemp = this.eventList[calendar.active.formatted]

        //let eventTemp = { description:'yes', path:'../img/test1.jpeg' };
        console.log(eventTemp);

        if(eventTemp.description){   // 如果eventList中有内容，内容覆盖
            eventList = [eventTemp];
            judge = true;
        }
        //eventList = [{description:"yes",path:"../img/test1.jpeg"}];  //debug
        let eventTemplate = "";

        if(judge){  // 如果有内容
            // ------！！！根据 用户（this.userName）+时间 访问后端，返回一个图片列表 picList[]
            // 设置一个count = 0 循环计数（既然只有一个那就不需要了）
            eventList.forEach(item => {
                // eventTemplate += `<li><img src="${path-of-the-picture}"><a>${item}</a></li>`;
                // eventTemplate += `<li><a class="scene-item" href="/">${item}</a> <input class="delete-item" type="button" value="x" /></li>`;

                // 下面这行html，将class="scene-item"换成class="scene-item"+count
                // eventTemplate += `<li><a class="scene-item" href="/">${item}</a></li>`;
                // href中的"/"用图片的地址代替，传入数据为之前的eventTemp，picPath = eventTemp[0].picPath , ${picPath}

                //Todo: href="/"将被替代为全景图片的路径
                // console.log(item.path);
                // eventTemplate = `<li><a style="background: linear-gradient(to right, rgba(102, 112, 93, 0.3), rgba(102, 112, 93, 0.9)), url(\'../img/${item.path}\') no-repeat center;" id="scene" class="scene-item" href="javascript:void(0);" onclick="hrefHandle('${UserDate}');">${item.description}</a></li>`;
                eventTemplate = `<li><a style="background: linear-gradient(to right, rgba(102, 112, 93, 0.3), rgba(102, 112, 93, 0.9)), url(\'../img/${item.path}\') no-repeat center;" id="scene" class="scene-item" href="javascript:void(0);" onclick="hrefHandle();">${item.description}</a></li>`;

                //css中设置scene-item的background的url为item.path
//                document.getElementById('scene').style['background'] = 'linear-gradient(to right, rgba(102, 112, 93, 0.3), rgba(102, 112, 93, 0.9)), url(' + item.path + ') no-repeat center;';
            });
        } else {
            eventList.forEach(item => {
                // eventTemplate += `<li>${item}</li>`;
                // console.log("fail to get event");
                eventTemplate = `<li>${item}</li>`;
            });
        }

        this.elements.eventList.innerHTML = eventTemplate; //往Calendar的eventList中添加eventTemplate的html
    }

    // 设置当前日历中 year[右上角] 以及 day（日期）、weekday（星期）[左侧上部]
    drawYearAndCurrentDay() {
        let calendar = this.getCalendar();
        this.elements.year.innerHTML = calendar.active.year;
        this.elements.currentDay.innerHTML = calendar.active.day;
        this.elements.currentWeekDay.innerHTML = AVAILABLE_WEEK_DAYS[calendar.active.week];
    }

    // draw当前月份的所有日期（elements.days中添加html）   !!!
    drawDays() {
        let calendar = this.getCalendar();

        let latestDaysInPrevMonth = this.range(calendar.active.startWeek).map((day, idx) => {
            return {
                dayNumber: this.countOfDaysInMonth(calendar.pMonth) - idx,
                month: new Date(calendar.pMonth).getMonth(),
                year: new Date(calendar.pMonth).getFullYear(),
                currentMonth: false
            }
        }).reverse();


        let daysInActiveMonth = this.range(calendar.active.days).map((day, idx) => {
            let dayNumber = idx + 1;
            let today = new Date();
            return {
                dayNumber,
                today: today.getDate() === dayNumber && today.getFullYear() === calendar.active.year && today.getMonth() === calendar.active.month,
                month: calendar.active.month,
                year: calendar.active.year,
                selected: calendar.active.day === dayNumber,
                currentMonth: true
            }
        });


        let countOfDays = this.options.maxDays - (latestDaysInPrevMonth.length + daysInActiveMonth.length);
        let daysInNextMonth = this.range(countOfDays).map((day, idx) => {
            return {
                dayNumber: idx + 1,
                month: new Date(calendar.nMonth).getMonth(),
                year: new Date(calendar.nMonth).getFullYear(),
                currentMonth: false
            }
        });

        let days = [...latestDaysInPrevMonth, ...daysInActiveMonth, ...daysInNextMonth];

        days = days.map(day => {
            let newDayParams = day;
            let formatted = this.getFormattedDate(new Date(`${Number(day.month) + 1}/${day.dayNumber}/${day.year}`));
            //Todo: newDayParams.hasEvent的作用有待商榷！！！
            //newDayParams.hasEvent = this.eventList[formatted];
            newDayParams.hasEvent = false;

            return newDayParams;
        });

        console.log(days);
        daysTemplate = "";

        days.forEach(async day => {
            let aDay = day.dayNumber.toString();
            let aMonth = day.month.toString();
            let aYear = day.year.toString();
            let dayFormat = aDay + '/' + aMonth + '/' + aYear;
            // ------！！！根据this.userName和具体日期dayFormat调用函数返回 来判断是否有Event, 返回到day.hasEvent------

            let user_temp = userName;
            let date_temp = aDay + '/' + aMonth + '/' + aYear;   // 2/6/2019
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
            let UserDate = {
                user: user_info,
                date: date_info
            };


            /*TODO 这里调后端返回 imgsrc 和 labels*/

            // day.hasEvent = await initCalender(UserDate);
            // day.hasEvent = day.hasEvent.state;
            day.hasEvent = false;
            daysTemplate += `<li class="${day.currentMonth ? '' : 'another-month'}${day.today ? ' active-day ' : ''}${day.selected ? 'selected-day' : ''}${day.hasEvent ? ' event-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" data-year="${day.year}"></li>`;
        });

        this.elements.days.innerHTML = daysTemplate;
    }

    // draw当前月份的所有月份（elements.month中添加html）
    drawMonths() {
        let availableMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthTemplate = "";
        let calendar = this.getCalendar();
        availableMonths.forEach((month, idx) => {
            monthTemplate += `<li class="${idx === calendar.active.month ? 'active' : ''}" data-month="${idx}">${month}</li>`
        });

        this.elements.month.innerHTML = monthTemplate;
    }

    // draw当前月份的所有月份（elements.week中添加html）
    drawWeekDays() {
        let weekTemplate = "";
        AVAILABLE_WEEK_DAYS.forEach(week => {
            weekTemplate += `<li>${week.slice(0, 3)}</li>`
        });

        this.elements.week.innerHTML = weekTemplate;
    }


    // Service methods
    // 设置触发器
    eventsTrigger() {
        this.elements.prevYear.addEventListener('click', e => {
            let calendar = this.getCalendar();

            console.log(calendar.pYear);
            this.updateTime(calendar.pYear);
            this.drawAll()

        });

        this.elements.nextYear.addEventListener('click', e => {
            let calendar = this.getCalendar();
            this.updateTime(calendar.nYear);
            this.drawAll()
        });

        this.elements.month.addEventListener('click', e => {
            let calendar = this.getCalendar();
            let month = e.srcElement.getAttribute('data-month');
            if (!month || calendar.active.month == month) return false;

            let newMonth = new Date(calendar.active.tm).setMonth(month);
            this.updateTime(newMonth);
            this.drawAll()
        });


        this.elements.days.addEventListener('click', e => {
            let element = e.srcElement;
            let day = element.getAttribute('data-day');
            let month = element.getAttribute('data-month');
            let year = element.getAttribute('data-year');
            if (!day) return false;
            let strDate = `${Number(month) + 1}/${day}/${year}`;
            this.updateTime(strDate);
            this.drawAll()
        });

//        this.elements.eventLink.addEventListener('mouseenter', e => {
//            // highlight the mouseover target
//            let classVal = e.getAttribute("class");
//            classVal = classVal.concat(" hover");
//            e.style['background'] = 'linear-gradient(to right ,rgba(102, 112, 93, 0),rgba(102, 112, 93, 0.7)),url(' + this.itemPath + ') no-repeat center;';
//        });
//
//        this.elements.eventLink.addEventListener('mouseleave', e => {
//            // highlight the mouseover target
//            let classVal = e.getAttribute("class");
//            classVal = classVal.replace("hover", "");
//            e.style['background'] = 'linear-gradient(to right ,rgba(102, 112, 93, 0.3), rgba(102, 112, 93, 0.9)),url(' + this.itemPath + ') no-repeat center;';
//        });


//        this.elements.eventAddBtn.addEventListener('click', e => {     //!!!添加图像，改成上传图像操作
//            addEvent(document.getElementById('img_input'));
////            let fieldValue = this.elements.eventField.value;
////            if (!fieldValue) return false;
////            let dateFormatted = this.getFormattedDate(new Date(this.date));
////
////            //通过 dateFormatted 和 用户信息（this.userName） 调用 UploadHandle(this); 函数将图片传到后端
////            UploadHandle(document.getElementById('img_input'), username, dateFormatted); //???
////            // ---从这里开始
//////            if (!this.eventList[dateFormatted]) this.eventList[dateFormatted] = [];
//////            this.eventList[dateFormatted].push(fieldValue);
//////            localStorage.setItem(localStorageName, JSON.stringify(this.eventList));
////            // ---到这里结束 全部注释掉
////            this.elements.eventField.value = '';
////            this.drawAll()
//        });

//        this.elements.eventDeleteBtn.addEventListener('click', e => {
//            // 删除当前页面的Event
//            let calendar = this.getCalendar();
//            let eventList = ['There is not any scenes.'];
//            // ???------!!!调用函数返回 和this.eventList[calendar.active.formatted]等意义的东西-------
//            let eventTemplate = "";
//            eventList.forEach(item => {
//                // eventTemplate += `<li>${item}</li>`;
//                eventTemplate = `<li>${item}</li>`;
//            });
//            this.elements.eventList.innerHTML = eventTemplate; //往Calendar的eventList中添加eventTemplate的html
//
//            // 删除数据库中的内容：
//            let dateFormatted = this.getFormattedDate(new Date(this.date));
//            // 通过 dateFormatted 和 用户信息（this.userName） 调用函数 删除后端图片
//
//            // this.drawAll()
//        });
    }

    updateTime(time) {
        this.date = +new Date(time);
        console.log(this.date);
    }

    // 返回一个[active{}, pMonth, nMonth, pYear, nYear] 当前时间、前一个月、后一个月、前一年、后一年
    getCalendar() {
        let time = new Date(this.date);

        return {
            active: {
                days: this.countOfDaysInMonth(time),
                startWeek: this.getStartedDayOfWeekByTime(time),
                day: time.getDate(),
                week: time.getDay(),
                month: time.getMonth(),
                year: time.getFullYear(),
                formatted: this.getFormattedDate(time),
                tm: +time
            },
            pMonth: new Date(time.getFullYear(), time.getMonth() - 1, 1),
            nMonth: new Date(time.getFullYear(), time.getMonth() + 1, 1),
            pYear: new Date(new Date(time).getFullYear() - 1, 0, 1),
            nYear: new Date(new Date(time).getFullYear() + 1, 0, 1)
        }
    }
    countOfDaysInMonth(time) {
        let date = this.getMonthAndYear(time);
        return new Date(date.year, date.month + 1, 0).getDate();
    }
    getStartedDayOfWeekByTime(time) {
        let date = this.getMonthAndYear(time);
        return new Date(date.year, date.month, 1).getDay();
    }
    getMonthAndYear(time) {
        let date = new Date(time);
        return {
            year: date.getFullYear(),
            month: date.getMonth()
        }
    }
    getFormattedDate(date) {
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    }

    range(number) {
        return new Array(number).fill().map((e, i) => i);
    }

    getFirstElementInsideIdByClassName(className) {
        return document.getElementById(this.options.id).getElementsByClassName(className)[0];
    }

//    addEvent(fileDOM){
//        console.log("OK!!!!!");
//
//
//        let fieldValue = this.elements.eventField.value;
//        if (!fieldValue) return false;
//        let dateFormatted = this.getFormattedDate(new Date(this.date));
//
//        //NothingTodo: 通过 dateFormatted 和 用户信息（this.userName） 调用 UploadHandle(this); 函数将图片传到后端
//        UploadHandle(fileDOM, username, dateFormatted); //???
//        // ---从这里开始
////            if (!this.eventList[dateFormatted]) this.eventList[dateFormatted] = [];
////            this.eventList[dateFormatted].push(fieldValue);
////            localStorage.setItem(localStorageName, JSON.stringify(this.eventList));
//        // ---到这里结束 全部注释掉
//        this.elements.eventField.value = '';
//        this.drawAll()
//    }

}


let calendar = new CALENDAR({
        id: "calendar"
});


function add(fileDOM){
    console.log(calendar);

    let fieldValue = calendar.elements.eventField.value;

    if (!fieldValue){
        alert("描述内容不可为空。");
        return false;
    }
    let dateFormatted = calendar.getFormattedDate(new Date(calendar.date));

    //通过 dateFormatted 和 用户信息（this.userName） 调用 UploadHandle(this); 函数将图片传到后端
    UploadHandle(fileDOM, userName, dateFormatted, fieldValue);
    // ---从这里开始
//            if (!this.eventList[dateFormatted]) this.eventList[dateFormatted] = [];
//            this.eventList[dateFormatted].push(fieldValue);
//            localStorage.setItem(localStorageName, JSON.stringify(this.eventList));
    // ---到这里结束 全部注释掉
    calendar.elements.eventField.value = '';
    // calendar.drawAll();
    setTimeout("window.location.reload()",1000);
}

function hrefHandle() {

    let user_temp = userName;
    let date_temp = calendar.getCalendar().active.formatted;
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

    window.location.href="panorama.html?user="+user_info+"&date="+date_info;

}