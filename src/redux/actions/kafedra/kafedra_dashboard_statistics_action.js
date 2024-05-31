import {BASE_URL, getHeaders,} from "../../../utills/ServiceUrls"
import {
    kafedraDashboardStatisticsFetched,
    kafedraDashboardStatisticsFetchingError
} from "../../slice/kafedra/kafedra_dashboard_statistics_slice";

export const fetchKafedraDashboardStatistics = (request) => (dispatch) => {
    const {headers} = getHeaders();
    request(BASE_URL + "/kafedra/getComeCountTodayStatistics", "GET", null, headers)
        .then(data => {
            let item = data?.obj;
            let arr = [];
            item?.comeCount !== null ? arr.push(item?.comeCount) : arr.push(0);
            item?.comeCount !== null ? arr.push(item?.allCount - item?.comeCount) : arr.push(item?.allCount);

            dispatch(kafedraDashboardStatisticsFetched(
                arr
            ));
            saveToLocalStorage(arr);

        })
        .catch(err => dispatch(kafedraDashboardStatisticsFetchingError(err)));

}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_kafedraDashboardStatistics", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function kafedraDashboardStatisticsLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_kafedraDashboardStatistics");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}