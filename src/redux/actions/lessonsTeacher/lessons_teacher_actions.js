import {addLessonInfo} from "../../slice/lessonsTeacher/lessons_teacher_slice";

export const setLessonsTeacher=(data)=>dispatch=>{
    dispatch(addLessonInfo(data))
    saveToLocalStorage(data)
}

export function saveToLocalStorage(store) {
    try {
        const serializedStore = JSON.stringify(store);
        window.localStorage.setItem("forLessonsData",serializedStore);
    }catch (e){
        console.log(e);
    }
}
export function lessonsTeacherStorage() {
    try {
        const serializedStore = window.localStorage.getItem("forLessonsData");
        if (serializedStore === null) return undefined;
        return JSON.parse(serializedStore);
    }catch (e){
        console.log(e);
        return undefined;
    }
}