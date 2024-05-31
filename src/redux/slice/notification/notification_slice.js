import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    notification: [],
    notificationLoadingStatus: "loading",
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        notificationFetching: state => {
            state.notificationLoadingStatus = 'loading'
        },
        notificationFetched: (state, action) => {
            state.notificationLoadingStatus = "done";
            state.notification = action.payload;
        },
        notificationAddFetched: (state, action) => {
            state.notificationLoadingStatus = "done";
            state.notification = [...state.notification || [], ...action.payload || []];
        },
        notificationRemoveFetched: (state, action) => {
            state.notificationLoadingStatus = "done";
            state.notification = state.notification.filter(item => item.id !== action.payload)
        },
        notificationClear: (state, action) => {
            state.notificationLoadingStatus = "done";
            state.notification = []
        },
        notificationFetchingError: state => {
            state.userLoadingStatus = "error"
        },
    }
})

const {actions, reducer} = notificationSlice;

export default reducer;
export const {
    notificationFetching,
    notificationFetched,
    notificationRemoveFetched,
    notificationClear,
    notificationFetchingError,
    notificationAddFetched
} = actions;