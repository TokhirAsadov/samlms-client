import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import moment from "moment";
import {createAsyncThunk} from "@reduxjs/toolkit";



const dateFormat = (year, week, day) => {
    const momentObject = moment().year(year).isoWeek(week).day(day);

    if (momentObject.isValid) {
        return momentObject.format('DD.MM.YYYY');
    } else {
        return 'Invalid Date';
    }
};
const fetchAllStudentData = async (eduId, groupId, subjectId, hours,hh) => {
    const res = await axios.get(`${BASE_URL}/groupConnect/getStatisticsOfGroupForTeacher/${eduId}/${groupId}?subjectId=${subjectId}`, hh)
    return res.data[0][0]?.students?.map(allInfo => {
        const subjectsData = allInfo?.subjects.filter((i) => i.statistics.length === 0 || i.statistics?.some(d => d?.isCome === false))
        const subjectNb = subjectsData.map(item => {
            const date = moment().year(item.year).week(item.week).day(item.day).format('DD.MM.YYYY')
            const hourStart = hours.find(h => h.number === item.section).start
            return {...item, date, hourStart: moment(hourStart).format("HH:mm")}
        }).filter(item => moment(`${item.date} ${item.hourStart}`, 'DD.MM.YYYY HH:mm').isSameOrBefore(moment(), 'minute')).length
        return {...allInfo, subjectNb}
    }).sort((a, b) => {
        if (a.fullName < b.fullName) return -1
        if (a.fullName > b.fullName) return 1
        return 0
    })
}

export const getAllStudentData = createAsyncThunk("GET_NB_TABLE_DATA", async (data, thunkAPI) => {
    try {
        return await fetchAllStudentData(data.eduId, data.groupId, data.subjectId, data.hours,data.headers)
    } catch (err) {
        return thunkAPI.rejectWithValue('error')
    }
})