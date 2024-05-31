import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {studentFetched, studentFetchingError} from "../../slice/student/student_slice";

export const fetchStudent = (request) => (dispatch) => {
    const {headers} = getHeaders();
    request(BASE_URL + "/user/studentAllDataForOwn", "GET", null, headers)
        .then(data => {
            dispatch(studentFetched(data));
            console.log(data, 'dadadadadada')
            saveToLocalStorage(data);
        })
        .catch(err => dispatch(studentFetchingError(err)));
}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_student", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function studentLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_student");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}