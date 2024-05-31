import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {secondBulimFetched, secondBulimFetchingError} from "../../slice/bulim/bulim_second_slice";

export const fetchSecondBulim = (request) => (dispatch) => {
  const {headers} = getHeaders();
  request(BASE_URL+"/section/getSectionDatasByUserId","GET",null,headers)
    .then(data => {
      dispatch(secondBulimFetched(data?.obj));
      saveToLocalStorage(data?.obj);
    })
    .catch(err => dispatch(secondBulimFetchingError(err)));
}


export function saveToLocalStorage(store) {
  try {
    const serializedStore = JSON.stringify(store);
    window.localStorage.setItem("store_second_bulim",serializedStore);
  }catch (e){
    console.log(e);
  }
}

export function secondBulimLoadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem("store_second_bulim");
    if (serializedStore === null) return undefined;
    return JSON.parse(serializedStore);
  }catch (e){
    console.log(e);
    return undefined;
  }
}