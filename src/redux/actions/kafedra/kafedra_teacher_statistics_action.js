import {BASE_URL, getHeaders,} from "../../../utills/ServiceUrls";
import {
    kafedraTeacherStatisticsFetched,
    kafedraTeacherStatisticsFetchingError
} from "../../slice/kafedra/kafedra_teacher_statistics_slice";
import moment from "moment";

export const fetchKafedraTeacherStatistics = (request) => (dispatch) => {
    const {headers} = getHeaders();
    let days = () => Array.from(Array(moment(new Date()).daysInMonth()).keys()).map(i => i + 1);
    request(BASE_URL + "/kafera-mudiri/getStatistics", "GET", null, headers)
        .then(data => {
            // dispatch(kafedraTeacherStatisticsFetched([]))

            dispatch(kafedraTeacherStatisticsFetched(
                data?.obj?.sort((a, b) => a.fullName > b.fullName ? 1 : -1).map(i => {
                    let count = 0;

                    days()?.map(day => {
                        if (i.monthly[day] !== null) {
                            count++;
                        }
                    })

                    i.countTouch = count;
                    return i
                })
            ));
        })
        .catch(err => dispatch(kafedraTeacherStatisticsFetchingError(err)));

}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_kafedraTeacherStatistics", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function kafedraTeacherStatisticsLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_kafedraTeacherStatistics");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}