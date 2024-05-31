import {rektorTeachersFetched} from "../../slice/rektor/rektor_teachers_slice";

export const fetchRektorTeachers = (payload) => (dispatch) => {
    dispatch(rektorTeachersFetched(payload));
    saveToLocalStorage(payload);
}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_rektorTeachers", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function rektorTeachersLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_rektorTeachers");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}