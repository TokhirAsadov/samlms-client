export const mainColor = "#0096DB";
export const maninsidebar = "#FFF";
export const color_1 = "#43B5F4";
export const color_2 = "#89CFF5";
export const color_3 = "#ACE2FFDA";
export const color_4 = "#D4EDFB";
export const color_5 = "#E9F3FF";
export const active_sidebar_item_bg_color = "#DEEDF4";
export const navbarHeight = "60px";

export const TokenType="Bearer ";
export const TOKEN='YTIT_TOKEN';

export const NOTIFICATION_STORE='notifications';

export const getHeaders = () => {
  const token=localStorage.getItem(TOKEN)
  const headers={
    'Authorization':TokenType+token,
    'Access-Control-Allow-Origin': '*'
  }
  return {headers};
}

export const getToken = () => {
  const token=localStorage.getItem(TOKEN);
  return { token }
}


// export const BASE_URL = "http://localhost:8081/api/v1/desktop";
export const BASE_URL = "/api/v1/desktop"  ;
//    export const BASE_URL = "http://samlms.kiut.uz/api/v1/desktop";

export const CURRENT_TIME ="http://worldtimeapi.org/api/ip";


export const AUTH = {
  LOGIN: "/auth/login",
  EMAIL: "/auth/email/"
};

export const USER = {
  CHECK_ROLE: "/user/me",
  TIME_TABLE:"/user/timeTable/",
  USER_ACTION:"/user/getUserFields"
};

export const ADMIN = {
  MENU: "/admin/menu",
  DEVICE: "/admin/device",
  ALL_BUILDINGS: "/building/buildings",
  BUILDING_SAVE: "/building/createBuilding",
  BUILDING_DELETE: "/building/deleteBuilding/",
  BUILDING_GET_ELEMENT_BY_ID: "/building/getBuildingById/",
  BUILDING_UPDATE: "/building/updateBuilding",
  ALL_ROOMS: "/room/rooms",
  ROOM_SAVE: "/room/createRoom",
  ROOM_DELETE: "/room/deleteRoom/",
  ROOM_GET_ELEMENT_BY_ID: "/room/getRoomById/",
  ROOM_UPDATE: "/room/updateRoom",
  ACC_DOOR_PORTS: "/ac-door/getPortsByDeviceId/",
  ACC_DOOR_UPDATED: "/ac-door/updated"
}

export const ACC = {
  GET_USER_BY_ROLE_ID_AND_TIME_INTERVAL: "/acc/getUsersByRoleIdAndTimeInterval",
  COUNT_USER_BY_ROLE_ID_AND_WEEK_OR_MONTH:"/acc/countUsersByRoleIdAndWeekOrMonth"
};
export const STUDENT = {
  GET_FACULTY_AND_COMING_COUNT_WITH_ALL_BY_GROUP_LEVEL: "/student/getFacultyAndComingCountWithAllByGroupLevel",
  GET_FACULTY_AND_COMING_COUNT_WITH_ALL_BY_GROUP_LEVEL_AND_WEEK_OR_MONTH:"/student/getFacultyAndComingCountWithAllByGroupLevelAndWeekOrMonth",
  GET_FACULTY_BY_COURSE_LEVEL:"/student/getFacultyByCourseLevel/",
  GET_STUDENTS_BY_TIME_INTERVAL_AND_FACULTY_NAME:"/student/getStudentsByTimeIntervalAndLevelAndFacultyName",
  GET_STUDENTS_BY_TIME_INTERVAL_AND_LEVEL_AND_FACULTY_NAME:"/student/getStudentsByTimeIntervalAndLevelAndFacultyName",
  GET_GROUPS_STATISTIC_BY_FACULTY_NAME_AND_GROUP_LEVEL:"/student/getGroupsStatisticByFacultyNameAndGroupLevel",
  GET_STUDENT_WITH_RFID_FOR_TODAY: "/student/getStudentWithRFIDForToday/",
  GET_STUDENT_WITH_RFID: "/student/getStudentWithRFID",
  GET_GROUPS_BY_LEVEL_AND_FACULTY_NAME:"/student/getGroupsByLevelAndFacultyName/"
};

export const REKTOR = {
  GET_STUDENT_RESULTS_FOR_REKTOR: "/studentResult/getStudentResultsForRektor"
}

export const TIME_TABLE = "/user/timeTable/";
export const STUDENT_TIME_TABLE = "/user/studentTimeTable/";
export const STUDENT_TIME_TABLE_WITH_WEEK = "/timeTableByWeekOfYear/studentTimeTableByWeek/";

export const DEKAN = {
  GET_FACULTIES_FROM_DEKAN_BY_USER_ID:"/dekan/getFacultiesFromDekanByUserId",
  GET: "/dekan/get",///dekan/getBadAndStudent
  GET_GROUP_STATISTICS: "/dekan/getGroupStatistics",
  GET_GROUPS_NAMES_FOR_DEKAN_BY_FACULTY_ID: "/dekan/getGroupsNamesForDekanByFacultyId",
  GET_MESSAGES_HISTORY: "/sms/getMessages",
  GET_GROUPS_NAMES_FOR_DEKAN_BY_DEKAN_ID: "/dekan/getGroupsNamesForDekanByDekanId",
  GET_USER_SEARCHING_FOR_DEKAN: "/dekan/getUserSearchingForDekan/",
  SMS_CREATE: "/sms/create",
  STUDENT_ALL_DATA: "/user/studentAllData/",
  GET_STUDENT_RESULTS_FOR_DEKAN: "/studentResult/getStudentResultsForDekan/",
  GET_GROUPS_NAMES_FOR_DEKAN_BY_FACULTY_ID_AND_LEVEL: "/dekan/getGroupsNamesForDekanByFacultyIdAndLevel/",
  ALL_KAFEDRA:"/kafedra/allKafedra",
  CREATE_KAFEDRA: "/kafedra/createKafedra",
  UPDATE_KAFEDRA: "/kafedra/updateKafedra",
  GET_KAFEDRA_BY_ID: "/kafedra/getKafedraById/",
  DELETE_KAFEDRA: "/kafedra/deleteKafedra/"


}

export const KAFEDRA = {
  KAFEDRA_ACTION:"/kafedra/getKafedra",
  GET_TEACHERS_FOR_SEND_SMS:"/kafedra/getTeachersForSendSms",
  GET_MESSAGES_HISTORY: "/sms/getMessagesForKafedra"
}

export const STUDENT_ALL_DATA = "/user/studentAllData/";
export const TEACHER_ALL_DATA = "/user/teacherAllData/";

export const SEARCH = "/user/search/?keyword=";