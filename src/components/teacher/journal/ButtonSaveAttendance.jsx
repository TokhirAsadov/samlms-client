import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {resetData} from "../../../redux/slice/attendanceJournal/attendanceJournal_slice";
import {resetDataScore} from "../../../redux/slice/multipartScore/multipartScore_slice";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {toast} from "react-toastify";

const ButtonSaveAttendance = ({fetchCoreDataStudents,handleCloseCalendarHeader}) => {
    const {headers} = getHeaders();
    const saveForDataAttendance = useSelector(state => state.attendanceForJournal);
    const dispatch = useDispatch();

    const handleNoSave = () => {
        dispatch(resetData());
        dispatch(resetDataScore());
    };

    const handleSaveData = () => {
        const dataForCreateAttendance = {
            ...saveForDataAttendance,
            attendances: saveForDataAttendance?.attendances.filter(st => st.id === null)
        };
        const dataForUpdateAttendance = saveForDataAttendance?.attendances?.filter(st => st?.id !== null)?.map(it => ({
            id: it?.id,
            isCome: it?.isCome
        }));

        let successMessage1 = '';
        let successMessage2 = '';

        const createPromise = dataForCreateAttendance.attendances.length > 0 ?
            axios.post(`${BASE_URL}/dynamicAttendance/createMultiDynamicAttendance2`, dataForCreateAttendance, {headers})
                .then(createResponse => {
                    if (createResponse.status === 200) {
                        successMessage1 += 'Attendance created successfully. ';
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    throw new Error("Failed to create attendance.");
                }) : Promise.resolve();

        const updatePromise = dataForUpdateAttendance?.length > 0 ?
            axios.put(`${BASE_URL}/dynamicAttendance/updateMultiDynamicAttendance`, dataForUpdateAttendance, {headers})
                .then(updateResponse => {
                    if (updateResponse.status === 200) {
                        successMessage2 += 'Attendance updated successfully. ';
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    throw new Error("Failed to update attendance.");
                }) : Promise.resolve();

        Promise.all([createPromise, updatePromise])
            .then(() => {
                toast.success('Successfully');
                fetchCoreDataStudents()
               //handleNoSave()
                handleCloseCalendarHeader()
                console.log(successMessage1)
                console.log(successMessage2)

            })
            .catch(error => {
                console.error("Error:", error);
                toast.error(error.message);
            });

    };


    return (
        saveForDataAttendance.attendances.length > 0 && (
            <Box sx={{display: 'flex', justifyContent: 'end', mt: 2}}>
                <Box sx={{display: "flex", gap: 2}}>
                    <Button variant={'contained'} color={"error"} onClick={handleNoSave}>Don't Save</Button>
                    <Button variant={'contained'} onClick={handleSaveData}>Save</Button>
                </Box>
            </Box>
        )
    );
};

export default ButtonSaveAttendance;
