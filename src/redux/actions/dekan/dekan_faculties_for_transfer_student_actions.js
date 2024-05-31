import {transferFacultiesFetched} from "../../slice/dekan/dekan_faculties_for_transfer_student_slice";

export const fetchTransferFaculties = (payload) => (dispatch) => {
    dispatch(transferFacultiesFetched(payload));
    saveToLocalStorage(payload);
}


export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("store_transferFaculties", serializedStore);
    } catch (e) {
        console.log(e);
    }
}

export function transferFacultiesLoadFromLocalStorage() {
    try {
        const serializedStore = window.localStorage.getItem("store_transferFaculties");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}