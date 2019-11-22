const AVAILABLE_WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const localStorageName = 'calendar-events';   // ----！！！-------
let userName_ = 'stern';   // ----！！！-------


class CALENDAR {
    constructor(options) {
        this.options = options;
        this.elements = {
            days: this.getFirstElementInsideIdByClassName('calendar-days'),
            week: this.getFirstElementInsideIdByClassName('calendar-week'),
            month: this.getFirstElementInsideIdByClassName('calendar-month'),
            year: this.getFirstElementInsideIdByClassName('calendar-current-year'),
            eventList: this.getFirstElementInsideIdByClassName('current-day-events-list'),
            eventField: this.getFirstElementInsideIdByClassName('add-event-day-field'),
            eventAddBtn: this.getFirstElementInsideIdByClassName('add-event-day-field-btn'),
            eventDeleteBtn: this.getFirstElementInsideIdByClassName('delete-event-day-field-btn'), // ------!!!
            currentDay: this.getFirstElementInsideIdByClassName('calendar-left-side-day'),
            currentWeekDay: this.getFirstElementInsideIdByClassName('calendar-left-side-day-of-week'),
            prevYear: this.getFirstElementInsideIdByClassName('calendar-change-year-slider-prev'),
            nextYear: this.getFirstElementInsideIdByClassName('calendar-change-year-slider-next')
        };  // html blocks

        this.eventList = JSON.parse(localStorage.getItem(localStorageName)) || {};   // ------！！！要返回一个按照LocolStorage里格式一样的eventList------

        this.date = +new Date();
        this.options.maxDays = 37;
        this.init();
    }

    // methods
    init() {
        if (!this.options.id) return false;
        this.eventsTrigger();
        this.drawAll();
    }

    // draw Methods
    drawAll() {
        this.drawWeekDays();
        this.drawMonths();
        this.drawDays();
        this.drawYearAndCurrentDay();
        this.drawEvents();

    }

    // add the Events in the left block (will be changed into images)   !!!
    drawEvents() {
        let calendar = this.getCalendar();
        let judge = false;
        let eventList = ['There is not any scenes.'];
        // ------!!!调用函数返回 和this.eventList[calendar.active.formatted]等意义的东西-------
        if(this.eventList[calendar.active.formatted]){   // 如果eventList中有内容，内容覆盖
            eventList = this.eventList[calendar.active.formatted];
            judge = true;
        }
        let eventTemplate = "";
        if(judge){  // 如果有内容
            // ------！！！根据 用户（this.userName）+时间 访问后端，返回一个图片列表 picList[]
            // ------！！！设置一个count = 0 循环计数
            eventList.forEach(item => {
                // eventTemplate += `<li><img src="${path-of-the-picture}"><a>${item}</a></li>`;
                // eventTemplate += `<li><a class="scene-item" href="/">${item}</a> <input class="delete-item" type="button" value="x" /></li>`;

                // ------！！！下面这行html，将class="scene-item"换成class="scene-item"+count
                // eventTemplate += `<li><a class="scene-item" href="/">${item}</a></li>`;
                eventTemplate = `<li><a class="scene-item" href="/">${item}</a></li>`;
                // ------！！！将"scene-item"+count这个class的css里的background的url设置成picList[count]
            });
        } else {
            eventList.forEach(item => {
                // eventTemplate += `<li>${item}</li>`;
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
            newDayParams.hasEvent = this.eventList[formatted];
            return newDayParams;
        });

        let daysTemplate = "";
        days.forEach(day => {
            // ------！！！具体日期调用函数返回 来判断是否有Event------
            daysTemplate += `<li class="${day.currentMonth ? '' : 'another-month'}${day.today ? ' active-day ' : ''}${day.selected ? 'selected-day' : ''}${day.hasEvent ? ' event-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" data-year="${day.year}"></li>`
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


        this.elements.eventAddBtn.addEventListener('click', e => {     //!!!添加图像，改成上传图像操作
            let fieldValue = this.elements.eventField.value;
            if (!fieldValue) return false;
            let dateFormatted = this.getFormattedDate(new Date(this.date));
            // 通过 dateFormatted 和 用户信息（this.userName） 调用 UploadHandle(this); 函数将图片传到后端
            // ---从这里开始
            if (!this.eventList[dateFormatted]) this.eventList[dateFormatted] = [];
            this.eventList[dateFormatted].push(fieldValue);
            localStorage.setItem(localStorageName, JSON.stringify(this.eventList));
            // ---到这里结束 全部注释掉
            this.elements.eventField.value = '';
            this.drawAll()
        });

        this.elements.eventDeleteBtn.addEventListener('click', e => {
            // 删除当前页面的Event
            let calendar = this.getCalendar();
            let eventList = ['There is not any scenes.'];
            // ------!!!调用函数返回 和this.eventList[calendar.active.formatted]等意义的东西-------
            let eventTemplate = "";
            eventList.forEach(item => {
                // eventTemplate += `<li>${item}</li>`;
                eventTemplate = `<li>${item}</li>`;
            });
            this.elements.eventList.innerHTML = eventTemplate; //往Calendar的eventList中添加eventTemplate的html

            // 删除数据库中的内容：
            // 。。。。。。

            this.drawAll()
        });
    }

    updateTime(time) {
        this.date = +new Date(time);
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
}


(function () {
    new CALENDAR({
        id: "calendar"
    })
})();