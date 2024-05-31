import {BASE_URL, DEKAN, getHeaders,} from "../../../utills/ServiceUrls";
import {dekanGroupsFetched, dekanGroupsFetchingError} from "../../slice/dekan/dekan_groups_slice";

export const fetchDekanGroups = (request) => (dispatch) => {
    const {headers} = getHeaders();
    request(BASE_URL + DEKAN.GET_GROUPS_NAMES_FOR_DEKAN_BY_FACULTY_ID, "GET", null, headers)
        .then(data => {
            dispatch(dekanGroupsFetched(data));
            saveToLocalStorage(data);
        })
        .catch(err => dispatch(dekanGroupsFetchingError(err)));
}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_dekanGroups", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function dekanGroupsLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_dekanGroups");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}