import moment from "moment";

function ItemNbForExcel({data, day, time}) {
    const currentDate = moment();
    const {firstName, lastName, subjects} = data
    let changeHour = new Date();
    const uniqueMap = new Map();
    const hours = [
        {
            number: 1,
            hour: "9:00 - 9:50",
            start: changeHour.setHours(9, 0, 0),
            end: changeHour.setHours(9, 50, 0),
        },
        {
            number: 2,
            hour: "10:00 - 10:50",
            start: changeHour.setHours(10, 0, 0),
            end: changeHour.setHours(10, 50, 0),
        },
        {
            number: 3,
            hour: "11:00 - 11:50",
            start: changeHour.setHours(11, 0, 0),
            end: changeHour.setHours(11, 50, 0),
        },
        {
            number: 4,
            hour: "12:00 - 12:50",
            start: changeHour.setHours(12, 0, 0),
            end: changeHour.setHours(12, 50, 0),
        },
        {
            number: 5,
            hour: "13:00 - 13:50",
            start: changeHour.setHours(13, 0, 0),
            end: changeHour.setHours(13, 50, 0),
        },
        {
            number: 6,
            hour: "14:00 - 14:50",
            start: changeHour.setHours(14, 0, 0),
            end: changeHour.setHours(14, 50, 0),
        },
        {
            number: 7,
            hour: "15:00 - 15:50",
            start: changeHour.setHours(15, 0, 0),
            end: changeHour.setHours(15, 50, 0),
        },
        {
            number: 8,
            hour: "16:00 - 16:50",
            start: changeHour.setHours(16, 0, 0),
            end: changeHour.setHours(16, 50, 0),
        },
        {
            number: 9,
            hour: "17:00 - 17:50",
            start: changeHour.setHours(17, 0, 0),
            end: changeHour.setHours(17, 50, 0),
        },
        {
            number: 10,
            hour: "18:00 - 18:50",
            start: changeHour.setHours(18, 0, 0),
            end: changeHour.setHours(18, 50, 0),
        },
        {
            number: 11,
            hour: "19:00 - 19:50",
            start: changeHour.setHours(19, 0, 0),
            end: changeHour.setHours(19, 50, 0),
        },
        {
            number: 12,
            hour: "20:00 - 20:50",
            start: changeHour.setHours(20, 0, 0),
            end: changeHour.setHours(20, 50, 0),
        },
    ];

    const filterSubjectArr = subjects?.filter(item => item?.statistics.length === 0)?.map(item => {
        const date = moment().year(item.year).week(item.week).day(item.day).format('DD.MM.YYYY')
        const hourStart = hours.find(h => h.number === item.section).start
        return {...item, date, hourStart: moment(hourStart).format("HH:mm")}
    }).filter(item => moment(`${item.date} ${item.hourStart}`, 'DD.MM.YYYY HH:mm').isBefore(currentDate))

    const uniqueArray = filterSubjectArr?.reduce((result, obj) => {
        const key = obj.date + obj.hourStart;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, true);
            result.push(obj);
        }
        return result;
    }, []).sort((a, b) => {
        const dateA = moment(`${a.date} ${a.hourStart}`, 'DD.MM.YYYY HH:mm');
        const dateB = moment(`${b.date} ${b.hourStart}`, 'DD.MM.YYYY HH:mm');
        return dateB.diff(dateA);
    });


    return uniqueArray.map((nb) => {
        console.log(nb?.date + "/" + nb?.section, 'nb logg')
        if (moment(new Date(time.getFullYear(), time.getMonth(), day)).format("DD.MM.YYYY") === nb?.date) {
            return nb?.section
        } else {
            return ""
        }
    }).filter(item => item !== "")

}

export default ItemNbForExcel;