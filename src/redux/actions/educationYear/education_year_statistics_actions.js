import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {
    educationYearStatisticsFetched, educationYearStatisticsFetching,
    educationYearStatisticsFetchingError, resetDataDeanStatistics
} from "../../slice/educationYear/education_year_statistics_slice";
import moment from "moment";
import axios from "axios";
const {headers} = getHeaders();
export const fetchEducationYearStatistics = (eduId, groupName, studentId,hh) => async (dispatch) => {
    dispatch(resetDataDeanStatistics());
    try {
        const response = await axios.get(`${BASE_URL}/groupConnect/subjectsWithStatistics/${studentId}?groupName=${groupName}&educationId=${eduId}`, {hh});
        const groupedArr = response.data?.obj.reduce((acc, obj) => {
            const found = acc.find(item => item[0].subject === obj.subject);
            if (found) {
                found.push(obj);
            } else {
                acc.push([obj]);
            }
            return acc;
        }, [])?.map(arr2 => {
            const nbDataFilter = arr2?.filter(item => item?.statistics.length === 0 && moment().day(item.day).week(item.week).year(item.year) <= moment());
            return {
                lessonName: arr2[0]?.subject || '',
                nbCount: nbDataFilter?.length,
                nbData: nbDataFilter.map(i => ({
                    date: moment().day(i.day).week(i.week).year(i.year).format('DD.MM.YYYY'),
                    section: i.section,
                    room: i.room,
                }))
            };
        });

        dispatch(educationYearStatisticsFetched(groupedArr));
    } catch (error) {
        dispatch(educationYearStatisticsFetchingError(error));
    }
};


function compareFullNames(a, b) {
    const nameA = a?.fullName.toUpperCase();
    const nameB = b?.fullName.toUpperCase();

    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}
export const fetchEducationYearStatisticsDean=(groups,groupSelect,educationYear,dateConfig,hh) =>(dispatch)=>{
    dispatch(resetDataDeanStatistics())
    groupSelect &&  dispatch(educationYearStatisticsFetching())
    groupSelect && axios.get(BASE_URL + `/group/getStudentStatisticsForDeanOneWeek/${groups.find(i => i.name === groupSelect)?.id}?educationYearId=${educationYear?.id}&weekday=${dateConfig.day()}&week=${dateConfig.isoWeek()}&year=${dateConfig.year()}`, {hh})
        .then(response => {
            dispatch(educationYearStatisticsFetched(response?.data?.obj.sort(compareFullNames)))
        })
        .catch(e => {
            console.log(e)
            dispatch(educationYearStatisticsFetchingError(e))
        });
}

export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_educationYearStatistics", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function educationYearStatisticsLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_educationYearStatistics");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}