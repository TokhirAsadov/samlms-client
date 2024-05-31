import {createSlice, current} from "@reduxjs/toolkit";
import {getAllStudentData} from "../../actions/allNbModalForTeacher/allNbModalForTeacher_action";


const dataAllNbStudent = createSlice({
    name: 'allNbStudentForTeacher',
    initialState: {
        data: [],
        dataAttendance: {
            attendances: [],
        },
        isLoading: false,
        isError: false
    },
    reducers: {
        changeAttendance2: (state, {payload}) => {

            const {studentId, section: section, isCome, room, id, day, week, year, type} = payload;
            const existingAttendanceIndex = state.dataAttendance.attendances.findIndex(
                (st) => st.studentId === studentId && st.section === section && st.weekday===day && st.year===year && st.week===week && st.room===room
            );

            if (existingAttendanceIndex !== -1) {
                state.dataAttendance.attendances[existingAttendanceIndex] = {
                    ...state.dataAttendance.attendances[existingAttendanceIndex],
                    isCome,
                };
            } else {
                state.dataAttendance.attendances.push({
                    id,
                    type,
                    studentId,
                    isCome,
                    room,
                    section,
                    weekday: day,
                    week,
                    year,
                });
            }

            state.data = state.data.map(user => {
                if (user.studentId === studentId) {
                    user.subjects.map(sub => {
                        if (
                            sub.year === year &&
                            sub.week === week &&
                            sub.day === day &&
                            sub.section === section
                        ) {
                            sub.statistics.pop();
                            sub.statistics.push(payload);
                        }
                        return sub;
                    })

                }
                return user;
            });
            state.dataAttendance.attendances = state.dataAttendance.attendances.filter(
                (st) => typeof st.isCome === "boolean"
            );
        },
        resetAttendance:(state)=>{
            state.dataAttendance.attendances = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllStudentData.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.data = []
        });
        builder.addCase(getAllStudentData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.data = action.payload;
        });
        builder.addCase(getAllStudentData.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
            state.data = []
        });
    }
})

const {reducer, actions} = dataAllNbStudent
export default reducer;

export const {resetAttendance, changeAttendance2} = actions
