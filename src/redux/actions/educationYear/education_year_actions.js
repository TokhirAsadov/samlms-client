import {educationYearFetched} from "../../slice/educationYear/education_year_slice";

export const fetchEducationYear = (payload) => (dispatch) => {
    dispatch(educationYearFetched(payload));
    saveToLocalStorage(payload)
}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_educationYear", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function educationYearLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_educationYear");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}