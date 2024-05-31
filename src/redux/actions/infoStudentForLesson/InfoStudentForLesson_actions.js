import {addInfoStudentLesson} from "../../slice/infoStudentForLesson/infoStudentForLesson_slice";

export const setInfoStudentForLesson=(data)=>dispatch=>{
    dispatch(addInfoStudentLesson(data))
    saveToLocalStorage(data)
}

export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("infoStudentForLesson",serializedStore);
    }catch (e){
        console.log(e);
    }
}
export function infoStudentForLessonStorage() {
    try {
        const serializedStore = window.localStorage.getItem("infoStudentForLesson");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    }catch (e){
        console.log(e);
        return undefined;
    }
}