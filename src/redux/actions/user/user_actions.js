import {userFetched, userFetchingError} from "../../slice/user/user_slice";
import {BASE_URL, TOKEN, TokenType, USER} from "../../../utills/ServiceUrls";

export const fetchUser = (request) => (dispatch) => {
  const token=localStorage.getItem(TOKEN)
  const headers={
    'Authorization':TokenType+token,
    'Access-Control-Allow-Origin': '*'
  }
  request(BASE_URL+USER.USER_ACTION,"GET",null,headers)
    .then(data => {
      dispatch(userFetched(data));
      saveToLocalStorage(data);
    })
    .catch(err => dispatch(userFetchingError(err)));
}

export function saveToLocalStorage(store) {
  try {
    const serializedStore = JSON.stringify(store);
    window.localStorage.setItem("store",serializedStore);
  }catch (e){
    console.log(e);
  }
}

export function loadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem("store");
    if (serializedStore === null) return undefined;
    return JSON.parse(serializedStore);
  }catch (e){
    console.log(e);
    return undefined;
  }
}

