import {rektorStaffsFetched} from "../../slice/rektor/rektor_staffs_slice";

export const fetchRektorStaffs = (payload) => (dispatch) => {
    dispatch(rektorStaffsFetched(payload));
    saveToLocalStorage(payload);
}


export function saveToLocalStorage(store) {
  try {
    const serializedStore = JSON.stringify(store);
    window.localStorage.setItem("store_rektorStaffs",serializedStore);
  }catch (e){
    console.log(e);
  }
}

export function rektorStaffsLoadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem("store_rektorStaffs");
    if (serializedStore === null) return undefined;
    return JSON.parse(serializedStore);
  }catch (e){
    console.log(e);
    return undefined;
  }
}