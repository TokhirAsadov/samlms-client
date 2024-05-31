import {createSlice} from "@reduxjs/toolkit";
import {getTableDataTeachers} from "../../actions/tableData/table_action";


const tableDataSlice = createSlice({
    name: 'tableData',
    initialState: {
        data: [],
        isLoading: false,
        isError: false
    },
    reducers: {
        changeDayValue: (state, action) => {
            state.data = state.data.map(user => {
                if (user.id === action.payload.personId) {
                    user.monthly = user.monthly.map(item => {
                        if (item.day === action.payload.day) {
                                return { ...item, hourValue: parseInt(action.payload.hourValue) || action.payload.hourValue };
                        } else {
                            return item;
                        }
                    });
                }
                return user;
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTableDataTeachers.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.data = []
        });
        builder.addCase(getTableDataTeachers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.data = action.payload;
        });
        builder.addCase(getTableDataTeachers.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
            state.data = []
        });
    }
})

const {reducer,actions} = tableDataSlice
export default reducer
export const {changeDayValue}=actions