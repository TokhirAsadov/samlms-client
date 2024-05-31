import { NOTIFICATION_STORE} from "../../../utills/ServiceUrls";
import {
  notificationAddFetched, notificationClear, notificationRemoveFetched,
} from "../../slice/notification/notification_slice";

export const fetchNotification = (payload) => (dispatch) => {
  dispatch(notificationAddFetched(payload?.sort(function(o1,o2){
    if (o1?.createdAt>o2?.createdAt)    return 1;
    else if(o1?.createdAt<o2?.createdAt) return  -1;
    else  return  0;
  })))

  saveToLocalStorage([...loadNotificationFromLocalStorage() || [],...payload || []]?.sort(function(o1,o2){
    if (o1?.createdAt>o2?.createdAt)    return 1;
    else if(o1?.createdAt<o2?.createdAt) return  -1;
    else  return  0;
  }))
}

export const deleteItemNotification=(id)=>(dispatch)=>{
 dispatch(notificationRemoveFetched(id))
  const parseStore =JSON.parse(window.localStorage.getItem(NOTIFICATION_STORE));

  const updatedData = parseStore.filter(item=>item.id !== id)
  saveToLocalStorage(updatedData)
}

export const ClearNotificationData=()=>(dispatch)=>{
  dispatch(notificationClear())
  window.localStorage.removeItem(NOTIFICATION_STORE)
}

export function saveToLocalStorage(store) {
  try {
    const serializedStore = JSON.stringify(store);
    window.localStorage.setItem(NOTIFICATION_STORE,serializedStore);
  }catch (e){
    console.log(e);
  }
}


// export const dispatch = useDispatch();
export function loadNotificationFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem(NOTIFICATION_STORE);
    if (serializedStore === null) return undefined;
    return JSON.parse(serializedStore);
  }catch (e){
    console.log(e);
    return undefined;
  }
}