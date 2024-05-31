import {BASE_URL, getHeaders, } from "../../../utills/ServiceUrls";
import {
  rektorDashboardTeachersFetched,
  rektorDashboardTeachersFetchingError
} from "../../slice/rektor/rektor_dashboard_teachers_slice";

export const fetchRektorDashboardTeachers = (request) => (dispatch) => {
  const {headers} = getHeaders();
  request(BASE_URL+'/user/rektorDashboardTeachers',"GET",null,headers)
    .then(data => {
      // console.log(data,"-------5555555555555555555 999999999999999999")
      dispatch(rektorDashboardTeachersFetched(data));
      saveToLocalStorage(data);
    })
    .catch(err => dispatch(rektorDashboardTeachersFetchingError(err)));
}


export function saveToLocalStorage(store) {
  try {
    const serializedStore = JSON.stringify(store);
    window.localStorage.setItem("store_rektorDashboardTeachers",serializedStore);
  }catch (e){
    console.log(e);
  }
}

export function rektorDashboardTeachersLoadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem("store_rektorDashboardTeachers");
    if (serializedStore === null) return [];
    return JSON.parse(serializedStore);
  }catch (e){
    console.log(e);
    return undefined;
  }
}