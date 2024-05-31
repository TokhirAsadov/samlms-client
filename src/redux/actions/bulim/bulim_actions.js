import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {bulimFetched, bulimFetchingError} from "../../slice/bulim/bulim_slice";

export const fetchBulim = (request) => (dispatch) => {
  const {headers} = getHeaders();
  request(BASE_URL+"/section/getSectionDatas","GET",null,headers)
    .then(data => {
      dispatch(bulimFetched(data?.obj));
      saveToLocalStorage(data?.obj);
    })
    .catch(err => dispatch(bulimFetchingError(err)));
}


export function saveToLocalStorage(store) {
  try {
    const serializedStore = JSON.stringify(store);
    window.localStorage.setItem("store_bulim",serializedStore);
  }catch (e){
    console.log(e);
  }
}

export function bulimLoadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem("store_bulim");
    if (serializedStore === null) return undefined;
    return JSON.parse(serializedStore);
  }catch (e){
    console.log(e);
    return undefined;
  }
}