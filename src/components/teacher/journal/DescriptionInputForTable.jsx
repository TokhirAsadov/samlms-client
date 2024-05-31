import React, {memo, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    changeScoreStudent,
    changeThemeStudent,
    resetDataScore
} from "../../../redux/slice/multipartScore/multipartScore_slice";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import {ListItemText} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {HiMiniPencilSquare} from "react-icons/hi2";
import {saveData} from "../../../redux/slice/dataForUpdateThemeGrade/dataForUpdateThemeGrade_slice";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import {MdDelete, MdOutlineAdd} from "react-icons/md";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";

const DescriptionInputForTable = ({ setThemeModal, allThemeData, getThemeAll,educationId,subjectId,groupId }) => {
    const [text, setText] = useState('');
    const [evalTheme, setEvalTheme] = useState(false);
    const dispatch = useDispatch();
    const dataScoreMultipart = useSelector(state => state.dataScoreMultipart);

    useEffect(() => {
        if (allThemeData.length > 0) {
            const firstTheme = allThemeData[0];
            setText(firstTheme.id);
            fetchThemeGrades(firstTheme.id, firstTheme.maxGrade);
        }
    }, [allThemeData]);

    const fetchThemeGrades = (themeId, maxGrade) => {
        axios.get(`${BASE_URL}/themeOfSubjectForGrading/getGradesByThemeId/${themeId}`, getHeaders())
            .then(res => {
                dispatch(changeThemeStudent({id: themeId, maxGrade,gradesTheme:res.data.obj,educationId,subjectId,groupId }));
            })
            .catch(err => {
                console.error(err);
                toast.error(err.response?.data?.message || 'Error');
            });
    };

    const handleInputChange = event => {

        const newText = event.target.value;
        setText(newText);
        const theme = allThemeData.find(data => data.id === newText);
        if (theme) {
            fetchThemeGrades(newText, theme.maxGrade);
        }
    };

    const handleUpdateTheme = item => {
        dispatch(saveData(item));
        setThemeModal(true);
    };

    const handleDeleteTheme = item => {
        axios.delete(`${BASE_URL}/themeOfSubjectForGrading/deleteTheme/${item.id}`, getHeaders())
            .then(res => {
                toast.warning('Deleted');
                getThemeAll();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Error');
            });
    };

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 62px', width: 290, margin: '0 auto' }}>
            <FormControl fullWidth size="small">
                <InputLabel id="theme-label">Theme</InputLabel>
                <Select
                    labelId="theme-label"
                    open={evalTheme}
                    onOpen={() => setEvalTheme(true)}
                    onClose={() => setEvalTheme(false)}
                    value={text}
                    onChange={handleInputChange}
                    label="Theme"
                    sx={{ borderRadius: "4px 0 0 4px" }}
                >
                    {allThemeData.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px' }}>
                                <ListItemText primary={`${item.name}, max grade: ${item.maxGrade}`} />
                                {evalTheme && (
                                    <>
                                        <IconButton onClick={() => handleUpdateTheme(item)} size="small">
                                            <HiMiniPencilSquare />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteTheme(item)} size="small">
                                            <MdDelete />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Tooltip title="Add a new theme" arrow>
                <Button onClick={() => setThemeModal(true)}
                        sx={{ width: 35, height: '100%', borderRadius: "0 4px 4px 0" }}
                        variant="outlined">
                    <MdOutlineAdd size={20} />
                </Button>
            </Tooltip>
        </Box>
    );
};

export default memo(DescriptionInputForTable);
