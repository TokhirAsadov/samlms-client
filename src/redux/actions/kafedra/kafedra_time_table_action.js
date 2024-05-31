import {BASE_URL, getHeaders,} from "../../../utills/ServiceUrls";
import {kafedraTimeTableFetched, kafedraTimeTableFetchingError} from "../../slice/kafedra/kafedra_time_table_slice";

export const fetchKafedraTimeTable = (request, kafedra) => (dispatch) => {
    const {headers} = getHeaders();

    request(BASE_URL + "/user/getTimeTable" + `${(kafedra === null || kafedra === undefined) ? '?kafedraId=' + kafedra?.id : ""}`, "GET", null, headers)
        .then(data => {
            dispatch(kafedraTimeTableFetched({
                table: data?.obj,
                time: new Date().getTime()
            }));
            // saveToLocalStorage(data?.obj);
            saveToLocalStorage({
                table: data?.obj,
                time: new Date().getTime()
            });
        })
        .catch(err => dispatch(kafedraTimeTableFetchingError(err)));
}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_kafedraTimeTable", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function kafedraTimeTableLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_kafedraTimeTable");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}