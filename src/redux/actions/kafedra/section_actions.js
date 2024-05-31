import {sectionFetched, sectionFetchingError} from "../../slice/kafedra/section_slice";
import {BASE_URL, getHeaders, KAFEDRA} from "../../../utills/ServiceUrls";

export const fetchSection = (request) => (dispatch) => {
    const {headers} = getHeaders();
    request(BASE_URL + KAFEDRA.KAFEDRA_ACTION, "GET", null, headers)
        .then(data => {
            dispatch(sectionFetched(data));
            saveToLocalStorage(data);
        })
        .catch(err => dispatch(sectionFetchingError(err)));
}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_section", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function sectionLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_section");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}