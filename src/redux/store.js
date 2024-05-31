import {compose, configureStore} from "@reduxjs/toolkit";
import user from './slice/user/user_slice'
import section from './slice/kafedra/section_slice'
import bulim from './slice/bulim/bulim_slice'
import secondBulim from './slice/bulim/bulim_second_slice'
import student from './slice/student/student_slice'
import teacher from './slice/teacher/teacher_slice'
import dekanat from './slice/dekanat/dekanat_slice'
import dekanGroups from './slice/dekan/dekan_groups_slice'
import badBest from './slice/dekan/bad_and_best'
import transferFaculties from './slice/dekan/dekan_faculties_for_transfer_student_slice'
import transferStudent from './slice/dekan/dekan_transfer_student_slice'
import kafedraTeacherStatistics from './slice/kafedra/kafedra_teacher_statistics_slice'
import kafedraDashboardStatistics from './slice/kafedra/kafedra_dashboard_statistics_slice'
import kafedraTimeTable from './slice/kafedra/kafedra_time_table_slice'
import rektorDashboardTeachers from './slice/rektor/rektor_dashboard_teachers_slice'
import rektorDashboardStudents from './slice/rektor/rektor_dashboard_students_slice'
import rektorDashboardStaffs from './slice/rektor/rektor_dashboard_staffs_slice'
import rektorTeachers from './slice/rektor/rektor_teachers_slice'
import rektorStaffs from './slice/rektor/rektor_staffs_slice'
import educationYear from './slice/educationYear/education_year_slice'
import educationYearStatistics from './slice/educationYear/education_year_statistics_slice'
import notification from './slice/notification/notification_slice'
import stringMiddleware from "./middleware/stringMiddleware";
import {loadFromLocalStorage} from "./actions/user/user_actions";
import {sectionLoadFromLocalStorage} from "./actions/kafedra/section_actions";
import {studentLoadFromLocalStorage} from "./actions/student/student_actions";
import {teacherLoadFromLocalStorage} from "./actions/teacher/teacher_actions";
import {dekanatLoadFromLocalStorage} from "./actions/dekanat/dekanat_actions";
import {badBestLoadFromLocalStorage} from "./actions/dekan/badBest_actions";
import {rektorDashboardTeachersLoadFromLocalStorage} from "./actions/rektor/rektor_dashboard_teachers_action";
import {transferStudentLoadFromLocalStorage} from "./actions/dekan/dekan_transfer_student_actions";
import {transferFacultiesLoadFromLocalStorage} from "./actions/dekan/dekan_faculties_for_transfer_student_actions";
import {rektorDashboardStudentsLoadFromLocalStorage} from "./actions/rektor/rektor_dashboard_students_action";
import {rektorDashboardStaffsLoadFromLocalStorage} from "./actions/rektor/rektor_dashboard_staffs_action";
import {rektorTeachersLoadFromLocalStorage} from "./actions/rektor/rektor_teachers_action";
import {dekanGroupsLoadFromLocalStorage} from "./actions/dekan/dekan_groups_actions";
import {rektorStaffsLoadFromLocalStorage} from "./actions/rektor/rektor_staffs_action";
import {bulimLoadFromLocalStorage} from "./actions/bulim/bulim_actions";
import {kafedraDashboardStatisticsLoadFromLocalStorage} from "./actions/kafedra/kafedra_dashboard_statistics_action";
import {kafedraTimeTableLoadFromLocalStorage} from "./actions/kafedra/kafedra_time_table_action";
import btnreducer from "./slice/btnvalue";
import {secondBulimLoadFromLocalStorage} from "./actions/bulim/bulim_second_actions";
import {educationYearLoadFromLocalStorage} from "./actions/educationYear/education_year_actions";
import questionsState from "./slice/questions/questions_slice"
import lessonsTeacherSlice from "./slice/lessonsTeacher/lessons_teacher_slice"
import {lessonsTeacherStorage} from "./actions/lessonsTeacher/lessons_teacher_actions";
import infoStudentForLessonSlice from "./slice/infoStudentForLesson/infoStudentForLesson_slice"
import {infoStudentForLessonStorage} from "./actions/infoStudentForLesson/InfoStudentForLesson_actions";
import {loadNotificationFromLocalStorage} from "./actions/notification/notification_action";
import tableDataReduce from "./slice/tableData/tableSlice"
import hourSectionReduce from "./slice/hourSection/hourSectionSlice";
import AllNbStudentForTeacherReducer from "./slice/allNbModalForTeacher/allNbModalForTeacher_slice";
import attendanceJournal_slice from "./slice/attendanceJournal/attendanceJournal_slice";
import multipartScore_slice from "./slice/multipartScore/multipartScore_slice";
import dataForUpdateThemeGrade_slice from "./slice/dataForUpdateThemeGrade/dataForUpdateThemeGrade_slice";
import vedimostSlice from "./slice/vedimost/vedimostSlice";
const preloadedState = {
  user:{
    user: loadFromLocalStorage(),
    userId: "",
    userLoadingStatus: "start"
  },
  section:{
    section: sectionLoadFromLocalStorage(),
    sectionLoadingStatus: "start"
  },
  bulim:{
    bulim: bulimLoadFromLocalStorage(),
    bulimLoadingStatus: "start"
  },
  secondBulim:{
    secondBulim: secondBulimLoadFromLocalStorage(),
    secondBulimLoadingStatus: "start"
  },
  student:{
    student: studentLoadFromLocalStorage(),
    studentLoadingStatus: "start"
  },
  teacher:{
    teacher: teacherLoadFromLocalStorage(),
    teacherLoadingStatus: "start"
  },
  dekanat:{
    dekanat: dekanatLoadFromLocalStorage(),
    dekanatLoadingStatus: "start"
  },
  dekanGroups:{
    dekanGroups: dekanGroupsLoadFromLocalStorage(),
    dekanGroupsLoadingStatus: "start"
  },
  transferStudent:{
    transferStudent: transferStudentLoadFromLocalStorage(),
    transferStudentLoadingStatus: "start"
  },
  transferFaculties:{
    transferFaculties: transferFacultiesLoadFromLocalStorage(),
    transferFacultiesLoadingStatus: "start"
  },
  badBest:{
    badBest: badBestLoadFromLocalStorage(),
    badBestLoadingStatus: "start"
  },
  rektorDashboardTeachers:{
    rektorDashboardTeachers: rektorDashboardTeachersLoadFromLocalStorage(),
    rektorDashboardTeachersLoadingStatus: "start"
  },
  rektorDashboardStudents:{
    rektorDashboardStudents: rektorDashboardStudentsLoadFromLocalStorage(),
    rektorDashboardStudentsLoadingStatus: "start"
  },
  rektorDashboardStaffs:{
    rektorDashboardStaffs: rektorDashboardStaffsLoadFromLocalStorage(),
    rektorDashboardStaffsLoadingStatus: "start"
  },
  rektorTeachers:{
    rektorTeachers: rektorTeachersLoadFromLocalStorage(),
    rektorTeachersLoadingStatus: "start"
  },
  rektorStaffs:{
    rektorStaffs: rektorStaffsLoadFromLocalStorage(),
    rektorStaffsLoadingStatus: "start"
  },
  educationYear: {
    educationYear: educationYearLoadFromLocalStorage(),
    educationYearLoadingStatus: "loading",
  },
  kafedraDashboardStatistics: {
    kafedraDashboardStatistics: kafedraDashboardStatisticsLoadFromLocalStorage(),
    kafedraDashboardStatisticsLoadingStatus: "loading",
  },
  kafedraTimeTable: {
    kafedraTimeTable: kafedraTimeTableLoadFromLocalStorage(),
    kafedraTimeTableLoadingStatus: "loading",
  },
  lessonsTeacherSlice:{
    forLessonsData:lessonsTeacherStorage(),
    selectedGroup:null
  },
  infoStudentForLessonSlice:{
    dataInfoStudents:infoStudentForLessonStorage()
  },
  notification:{
    notification: loadNotificationFromLocalStorage(),
    notificationLoadingStatus: "start"
  },
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export const store = configureStore({
  reducer: {
    user,
    section,
    bulim,
    secondBulim,
    student,
    teacher,
    dekanat,
    dekanGroups,
    badBest,
    transferStudent,
    transferFaculties,
    kafedraTeacherStatistics,
    kafedraDashboardStatistics,
    kafedraTimeTable,
    rektorDashboardTeachers,
    rektorDashboardStudents,
    rektorDashboardStaffs,
    rektorTeachers,
    rektorStaffs,
    educationYear,
    educationYearStatistics,
    btnvalue:btnreducer,
    questionsState,
    lessonsTeacherSlice,
    infoStudentForLessonSlice,
    notification,
    tableData:tableDataReduce,
    hourSection:hourSectionReduce,
    AllNbStudentForTeacher:AllNbStudentForTeacherReducer,
    attendanceForJournal: attendanceJournal_slice,
    dataScoreMultipart:multipartScore_slice,
    dataForUpdateThemeGrade:dataForUpdateThemeGrade_slice,
    vedimostSlice,
  },
  middleware: (getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware)),
  devTools: process.env.NODE_ENV !== "production",
  preloadedState
})
