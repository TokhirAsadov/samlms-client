import {BASE_URL, getHeaders,} from "../../../utills/ServiceUrls";
import {dekanatFetched, dekanatFetchingError,} from "../../slice/dekanat/dekanat_slice";

export const fetchDekanat = (request) => (dispatch) => {
    const {headers} = getHeaders();
    console.log(headers, " ------- headers")
    request(BASE_URL + "/dekanat/dekanatDataForDekan", "GET", null, headers)
        .then(data => {
            console.log(data, "* ======= -----------------  fetch Dekanat  ------------------- ======= *")
            dispatch(dekanatFetched(data?.obj));
            saveToLocalStorage(data?.obj);
        })
        .catch(err => dispatch(dekanatFetchingError(err)));
}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_dekanat", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function dekanatLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_dekanat");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}