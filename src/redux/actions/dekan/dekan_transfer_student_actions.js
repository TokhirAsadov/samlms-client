import {transferStudentFetched} from "../../slice/dekan/dekan_transfer_student_slice";

export const fetchTransferStudent = (payload) => (dispatch) => {
    dispatch(transferStudentFetched(payload));
    console.log(payload, "enter")
    saveToLocalStorage(payload);
}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_transferStudent", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function transferStudentLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_transferStudent");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}