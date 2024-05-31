import {BASE_URL, getHeaders, } from "../../../utills/ServiceUrls";
import {
  rektorDashboardStudentsFetched,
  rektorDashboardStudentsFetchingError
} from "../../slice/rektor/rektor_dashboard_students_slice";

export const fetchRektorDashboardStudents = (request) => (dispatch) => {
  const {headers} = getHeaders();
  request(BASE_URL+'/user/rektorDashboardStudents',"GET",null,headers)
    .then(data => {
      console.log(data,"* ======= -----------------  fetchDekan  ------------------- ======= *")
      dispatch(rektorDashboardStudentsFetched(data));
      saveToLocalStorage(data);
    })
    .catch(err => dispatch(rektorDashboardStudentsFetchingError(err)));
}


export function saveToLocalStorage(store) {
  try {
    const serializedStore = JSON.stringify(store);
    window.localStorage.setItem("store_rektorDashboardStudents",serializedStore);
  }catch (e){
    console.log(e);
  }
}

export function rektorDashboardStudentsLoadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem("store_rektorDashboardStudents");
    if (serializedStore === null) return [];
    return JSON.parse(serializedStore);
  }catch (e){
    console.log(e);
    return undefined;
  }
}