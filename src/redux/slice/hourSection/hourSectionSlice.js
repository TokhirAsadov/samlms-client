import {createSlice} from "@reduxjs/toolkit";
import moment from "moment";

const initialState = [
    {
        number: 1,
        hour: "9:00 - 9:50",
        start: new Date().setHours(9, 0, 0),
        end: new Date().setHours(9, 50, 0),
    },
    {
        number: 2,
        hour: "10:00 - 10:50",
        start: new Date().setHours(10, 0, 0),
        end: new Date().setHours(10, 50, 0),
    },
    {
        number: 3,
        hour: "11:00 - 11:50",
        start: new Date().setHours(11, 0, 0),
        end: new Date().setHours(11, 50, 0),
    },
    {
        number: 4,
        hour: "12:00 - 12:50",
        start: new Date().setHours(12, 0, 0),
        end: new Date().setHours(12, 50, 0),
    },
    {
        number: 5,
        hour: "13:00 - 13:50",
        start: new Date().setHours(13, 0, 0),
        end: new Date().setHours(13, 50, 0),
    },
    {
        number: 6,
        hour: "14:00 - 14:50",
        start: new Date().setHours(14, 0, 0),
        end: new Date().setHours(14, 50, 0),
    },
    {
        number: 7,
        hour: "15:00 - 15:50",
        start: new Date().setHours(15, 0, 0),
        end: new Date().setHours(15, 50, 0),
    },
    {
        number: 8,
        hour: "16:00 - 16:50",
        start: new Date().setHours(16, 0, 0),
        end: new Date().setHours(16, 50, 0),
    },
    {
        number: 9,
        hour: "17:00 - 17:50",
        start: new Date().setHours(17, 0, 0),
        end: new Date().setHours(17, 50, 0),
    },
    {
        number: 10,
        hour: "18:00 - 18:50",
        start: new Date().setHours(18, 0, 0),
        end: new Date().setHours(18, 50, 0),
    },
    {
        number: 11,
        hour: "19:00 - 19:50",
        start: new Date().setHours(19, 0, 0),
        end: new Date().setHours(19, 50, 0),
    },
    {
        number: 12,
        hour: "20:00 - 20:50",
        start: new Date().setHours(20, 0, 0),
        end: new Date().setHours(20, 50, 0),
    },
];

const hourSectionSlice = createSlice({
    name: "hourSection",
    initialState,
})

export default hourSectionSlice.reducer