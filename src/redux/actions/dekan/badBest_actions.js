import {BASE_URL, DEKAN, getHeaders, KAFEDRA} from "../../../utills/ServiceUrls";
import {badBestFetched, badBestFetchingError} from "../../slice/dekan/bad_and_best";

export const fetchBadBest = (request) => (dispatch) => {
  const {headers} = getHeaders();
  console.log("?????????????????????????????????????????????????????????????????????????????/")
  request(BASE_URL+"/dekan/getBadAndStudent","GET",null,headers)
    .then(data => {
      console.log(data,"* ======= --------------- BadBest --------------------- ======= *")
      dispatch(badBestFetched(data));
      badBestSaveToLocalStorage(data);
    })
    .catch(err => dispatch(badBestFetchingError(err)));
}


export function badBestSaveToLocalStorage(store) {
  try {
    console.log(store,"store")
    const serializedStore = JSON.stringify(store);
    window.localStorage.setItem("bad_and_best",serializedStore);
  }catch (e){
    console.log(e);
  }
}

export function badBestLoadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem("bad_and_best");
    if (serializedStore === null) return undefined;
    return JSON.parse(serializedStore);
  }catch (e){
    console.log(e);
    return undefined;
  }
}