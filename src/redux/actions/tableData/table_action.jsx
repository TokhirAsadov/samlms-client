import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import moment from "moment/moment";

const getSundayInMonth = (date) => {
    const targetDate = moment(date);
    const targetMonth = targetDate.month();
    const targetYear = targetDate.year();
    const lastDayOfMonth = targetDate.endOf('month').format('D');
    const sundaysArray = [];

    const firstDayOfMonth = moment({year: targetYear, month: targetMonth});
    let firstSunday = null;

    for (let day = 0; day < firstDayOfMonth.daysInMonth(); day++) {
        const currentDay = firstDayOfMonth.clone().startOf('isoWeek').add(day, 'days');
        if (currentDay.month() === targetMonth && currentDay.isoWeekday() === 7) {
            firstSunday = parseInt(currentDay.format('D'));
            break;
        }
    }

    if (firstSunday !== null) {
        sundaysArray.push(...Array.from({length: Math.ceil((lastDayOfMonth - firstSunday + 1) / 7)}, (_, index) => firstSunday + index * 7));
    }

    return sundaysArray;
};
const transformedArray = (inputObject,rate,date) => {
    const sundaysInMonth = getSundayInMonth(date);
    const constFactor=8;
    const rateNum= rate ? parseInt(rate): 0;
    return Object.entries(inputObject)
        .map(([key, value]) => {
            if (key === 'date' || key === 'id') {
                return;
            } else {
                return { day: parseInt(key), hourValue: value ===null ? (sundaysInMonth.includes(parseInt(key))?'H': 0): (sundaysInMonth.includes(parseInt(key))?'H': constFactor*rateNum)  };
            }
        })
        .filter(Boolean)
        .sort((a, b) => a.day - b.day);
};


const {headers} = getHeaders();
const getDataTeachers = async (valueData, staffData) => {
    const tableData = await axios.get(`${BASE_URL}/kafera-mudiri/getStatisticsForTable?kafedraId=${valueData.department}&date=${valueData.selectedDate.format('YYYY.MM.DD')}&teachersIds=${staffData?.filter(i => valueData?.personData?.includes(i.label))?.map(id => id?.value)}`, {headers})
    return tableData.data.obj?.map(item=>{
        return {
            ...item,
            monthly:transformedArray(item.monthly,item.rate,item.date),
           }
    }).sort((a, b) => parseInt(b?.userPosition?.value) - parseInt(a?.userPosition?.value));

}
export const getTableDataTeachers = createAsyncThunk("GET_TABLE_DATA", async (data, thunkAPI) => {
    try {
        return await getDataTeachers(data.valueData, data.staffData)
    } catch (err) {
        return thunkAPI.rejectWithValue('error')
    }
})