import {BASE_URL, getHeaders, } from "../../../utills/ServiceUrls";
import {rektorDashboardStaffsFetched, rektorDashboardStaffsFetchingError} from "../../slice/rektor/rektor_dashboard_staffs_slice";

export const fetchRektorDashboardStaffs = (request) => (dispatch) => {
  const {headers} = getHeaders();
  request(BASE_URL+'/user/rektorDashboardStaffs',"GET",null,headers)
    .then(data => {
       console.log(data,"* ======= -----------------  fetchDekan staff  ------------------- ======= *")
      dispatch(rektorDashboardStaffsFetched(data.map((item,index)=>({...item,count:index+1}))));
      saveToLocalStorage(data.map((item,index)=>({...item,count:index+1})));
    })
    .catch(err => dispatch(rektorDashboardStaffsFetchingError(err)));
}


export function saveToLocalStorage(store) {
  try {
    const serializedStore = JSON.stringify(store);
    window.localStorage.setItem("store_rektorDashboardStaffs",serializedStore);
  }catch (e){
    console.log(e);
  }
}

export function rektorDashboardStaffsLoadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem("store_rektorDashboardStaffs");
    if (serializedStore === null) return [];
    return JSON.parse(serializedStore);
  }catch (e){
    console.log(e);
    return undefined;
  }
}