import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {teacherFetched, teacherFetchingError} from "../../slice/teacher/teacher_slice";

export const fetchTeacher = (request) => (dispatch) => {
    const {headers} = getHeaders();
    request(BASE_URL + "/user/teacherAllDataForOwn", "GET", null, headers)
        .then(data => {
            dispatch(teacherFetched(data));
            saveToLocalStorage(data);
        })
        .catch(err => dispatch(teacherFetchingError(err)));
}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_teacher", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function teacherLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_teacher");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}