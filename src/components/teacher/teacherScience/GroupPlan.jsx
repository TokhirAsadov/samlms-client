import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {MdDelete, MdOutlineCreateNewFolder, MdUpdate} from "react-icons/md";
import {CgClose} from "react-icons/cg";
import IconButton from "@mui/material/IconButton";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {Autocomplete, Menu} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import {useDispatch, useSelector} from "react-redux";
import {IoSend} from "react-icons/io5";
import {extrasmall, large, medium, small, xlarge} from "../../../responsiv";
import {useNavigate, useParams} from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import {BiArrowBack} from "react-icons/bi";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {FaLayerGroup} from "react-icons/fa"
import axios from "axios";
import {toast} from "react-toastify";
import {BsThreeDotsVertical} from "react-icons/bs";

const GroupPlan = () => {
    const {fan} = useParams()
    const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
    const checkedIcon = <CheckBoxIcon fontSize="small"/>;
    const {forLessonsData} = useSelector(state => state.lessonsTeacherSlice)
    const [open, setOpen] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [disabled, setDisabled] = useState(true)
    const [data, setDate] = useState([])
    const [obj, setObj] = useState({
        educationYearId: forLessonsData?.educationYear?.id,
        eduType: forLessonsData?.groupData?.eduType,
        eduLang: forLessonsData?.groupData?.eduLang,
        subjectId: forLessonsData?.groupData?.lessonId,
        level: forLessonsData?.groupData?.level,
        groupsIds: selectedGroups?.map(s => s?.groupId) || []
    })
    const [oldObj, setOldObj] = useState({
        id: null,
        educationYearId: forLessonsData?.educationYear?.id,
        eduType: forLessonsData?.groupData?.eduType,
        eduLang: forLessonsData?.groupData?.eduLang,
        subjectId: forLessonsData?.groupData?.lessonId,
        level: forLessonsData?.groupData?.level,
        groupsIds: selectedGroups?.map(s => s?.groupId) || []
    })
    const [limitGroupName, setLimitGroupName] = useState(true)
    const navigate = useNavigate()
    const {headers} = getHeaders();
    const menuOptions = [
        {
            title: "Update",
            icon: <MdUpdate color={"#0087be"}/>
        },
        {
            title: "Delete",
            icon: <MdDelete color={"red"}/>
        }
    ]

    const uniqueArray = forLessonsData?.allGroup?.reduce((acc, current) => {
        const existingItem = acc.find(item => item.groupId === current.groupId);
        if (!existingItem) {
            acc.push(current);
        }
        return acc;
    }, []);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (e, id) => {
        setAnchorEl(e.currentTarget);

        let getItem = data?.find(d => d.id === id);
        setOldObj(prevState => ({
            ...prevState,
            id,
            eduLang: getItem?.eduLang,
            eduType: getItem?.eduType,
            groupsIds: getItem?.groups?.map(g => g.groupId)
        }))
    };
    const handleCloseMenu = (label) => {
        setAnchorEl(null);

        if (label === "Update") {

            console.log(oldObj, "for id")
            setOpen(true)
        } else {

        }

    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setOldObj(prevState => ({...prevState, id: null}))
    }


    useEffect(() => {
        if (selectedGroups?.length > 0) {
            setDisabled(false)
        }
    }, [selectedGroups]);


    const fetchCreatePlan = async () => {
        axios.post(`${BASE_URL}/plan/createdPlan`, obj, {headers})
            .then(response => {
                console.log(response, "create plan response")
                toast.success("created plan of subject successfully")
                setOpen(false);
                setSelectedGroups([]);
                fetchPlans()
            })
            .catch(err => {
                console.log(err, "error creating plan response")
            })
    }

    const fetchUpdatePlan = async () => {
        console.log(oldObj, "-----------------")
        axios.put(`${BASE_URL}/plan/updatedPlan`, oldObj, {headers})
            .then(response => {
                console.log(response, "create plan response")
                toast.success("created plan of subject successfully")
                setOpen(false);
                setOldObj(prevState => ({...prevState, id: null}))
                setSelectedGroups([]);
                fetchPlans()
            })
            .catch(err => {
                console.log(err, "error creating plan response")
            })
    }


    const fetchPlans = async () => {
        await axios.get(`${BASE_URL}/plan/getExistPlans?educationYearId=${forLessonsData?.educationYear?.id}&level=${forLessonsData?.groupData?.level}&subjectId=${forLessonsData?.groupData?.lessonId}`, {headers})
            .then(response => {
                console.log(response, "get exists plans ")
                setDate(response.data.obj)
            })
            .catch(err => {
                console.log(err, "error exists plans")
            })
    }
    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchNewArr = () => {
        let newArr = []
        oldObj?.groupsIds?.forEach(i => {
            if (forLessonsData?.allGroup?.find(g => g.groupId === i)) {
                newArr.push(forLessonsData?.allGroup?.find(g => g.groupId === i))
            }
        })
        return newArr.reduce((acc, current) => {
            const existingItem = acc.find(item => item.groupId === current.groupId);
            if (!existingItem) {
                acc.push(current);
            }
            return acc;
        }, []);
    }


    return (
        <Container>
            <TitleMain>
                <p>{fan}</p>

                <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<BiArrowBack/>}>
                    Back
                </Button>
            </TitleMain>
            <Box sx={{
                padding: "10px",
            }}>
                <Button
                    variant="contained"
                    endIcon={<MdOutlineCreateNewFolder/>}
                    onClick={handleOpen}
                >
                    create group plan
                </Button>
            </Box>


            <BoxCardMain>
                {data?.map((item, key) => (
                    <CardSience key={key}>
                        <Box display={'flex'} alignItems={'flex-start'}>
                            <Box width={"100%"}>
                                <CardTitle onClick={() => navigate(`${item.id}`)} fs="25px" fw="bold"
                                           cl={mainColor}><FaLayerGroup/> Groups </CardTitle>
                                <Box
                                    onClick={() => navigate(`${item.id}`)}
                                    sx={{
                                        cursor: 'pointer',
                                        marginTop: 1,
                                        display: 'grid',
                                        gridTemplateColumns: "1fr 1fr 1fr",
                                        gap: "5px",
                                    }}
                                >
                                    {item?.groups.slice(0, limitGroupName ? 5 : undefined).map((item2, index) => (
                                        <p style={{color: 'black', margin: 0, textAlign: 'center'}} key={item2.groupId}>
                                            <b>{index + 1 + "."}</b> {item2.groupName}
                                        </p>
                                    ))}
                                </Box>

                                <Box
                                    sx={{
                                        mt: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Button
                                        onClick={() => setLimitGroupName(!limitGroupName)}>{limitGroupName ? 'show more' : 'hidden'}</Button>
                                </Box>
                            </Box>
                            <IconButton
                                aria-label="actions"
                                id="long-button"
                                aria-controls={openMenu ? 'long-menu' : undefined}
                                aria-expanded={openMenu ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={(e) => handleClick(e, item?.id)}
                                size="small">
                                <BsThreeDotsVertical/>
                            </IconButton>
                        </Box>

                    </CardSience>
                ))}

            </BoxCardMain>

            {/******** modal create group ************/}
            <Modal
                open={open}
                onClose={() => handleClose()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style} component={style2}>
                    <CloseBtn>
                        <IconButton onClick={() => handleClose()} aria-label="close" size="medium">
                            <CgClose/>
                        </IconButton>
                    </CloseBtn>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {
                            oldObj?.id === null ? "Create " : "Update "
                        } group plan
                    </Typography>

                    <FormControl sx={{width: "100%", margin: "25px 0"}}>
                        <InputLabel id="demo-simple-select-readonly-label">Academic year</InputLabel>
                        <Select
                            labelId="demo-simple-select-readonly-label"
                            id="demo-simple-select-readonly"
                            value={forLessonsData?.educationYear?.name}
                            label="Academic year"
                            inputProps={{readOnly: true}}
                        >
                            <MenuItem
                                value={forLessonsData?.educationYear?.name}>{forLessonsData?.educationYear?.name}</MenuItem>
                        </Select>
                        <FormHelperText>Read only</FormHelperText>
                    </FormControl>

                    <Box sx={{display: "flex", gap: "20px"}}>
                        <FormControl sx={{width: "100%"}}>
                            <InputLabel id="demo-simple-select-readonly-label1">Language</InputLabel>
                            <Select
                                labelId="demo-simple-select-readonly-label1"
                                id="demo-simple-select-readonly"
                                value={forLessonsData?.groupData?.eduLang}
                                label="Language"
                                inputProps={{readOnly: true}}
                            >
                                <MenuItem
                                    value={forLessonsData?.groupData?.eduLang}>{forLessonsData?.groupData?.eduLang}</MenuItem>
                            </Select>
                            <FormHelperText>Read only</FormHelperText>
                        </FormControl>
                        <FormControl sx={{width: "100%"}}>
                            <InputLabel id="demo-simple-select-readonly-label1">Type of education</InputLabel>
                            <Select
                                labelId="demo-simple-select-readonly-label1"
                                id="demo-simple-select-readonly"
                                value={forLessonsData?.groupData?.eduType}
                                label="Type of education"
                                inputProps={{readOnly: true}}
                            >
                                <MenuItem
                                    value={forLessonsData?.groupData?.eduType}>{forLessonsData?.groupData?.eduType}</MenuItem>
                            </Select>
                            <FormHelperText>Read only</FormHelperText>
                        </FormControl>
                    </Box>

                    <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={uniqueArray}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option?.groupName}
                        value={
                            oldObj?.id === null ? selectedGroups : fetchNewArr()
                        }
                        onChange={(event, newValue) => {
                            console.log(newValue, "new Value")
                            oldObj?.id === null ?
                                setObj(prev => ({...prev, groupsIds: newValue?.map(n => n?.groupId)}))
                                :
                                setOldObj(prev => ({...prev, groupsIds: newValue?.map(n => n?.groupId)}))
                            setSelectedGroups(newValue);
                        }}
                        renderOption={(props, option, {selected}) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{marginRight: 8}}
                                    checked={selected}
                                />
                                {option?.groupName}
                            </li>
                        )}
                        style={{width: "100%", margin: "25px 0"}}
                        renderInput={(params) => (
                            <TextField required {...params} label="Groups" placeholder="Group" helperText="Required"/>
                        )}
                    />

                    <CloseBtn>
                        <Button
                            onClick={oldObj?.id === null ? fetchCreatePlan : fetchUpdatePlan}
                            variant="contained"
                            endIcon={<IoSend/>}
                            disabled={disabled}
                        > {oldObj?.id === null ? "Save" : "Update"}</Button>
                    </CloseBtn>
                </Box>
            </Modal>

            {/******** menu actions *************/}

            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                PaperProps={{
                    style: {
                        maxHeight: 40 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {menuOptions.map((item, key) => (
                    <MenuItem key={key} onClick={() => handleCloseMenu(item.title)}>
                        <Box display={'flex'} gap={'5px'} alignItems={'center'}>
                            {item.icon} {item.title}
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </Container>

    );
};
const TitleMain = styled.h1`
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
        color: ${mainColor};
        font-size: 30px;
        font-weight: bold;
        ${extrasmall({
            textAlign: "center",
            fontSize: "20px",
        })}
    }
`;
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 3,
};
const style2 = styled.div`
    ${extrasmall({
        width: '95% !important',
    })}
`
const BoxCardMain = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    padding: 10px;
    ${xlarge({
        gridTemplateColumns: "1fr 1fr 1fr  ",
    })}
    ${large({
        gridTemplateColumns: "1fr 1fr 1fr  ",
    })}
    ${medium({
        gridTemplateColumns: "1fr 1fr ",
    })}
    ${small({
        gridTemplateColumns: "1fr 1fr ",
    })}
    ${extrasmall({
        gridTemplateColumns: "1fr ",
    })}
`;
const CardSience = styled.div`
    border: 1px solid #f1eded;
    padding: 10px;
    border-radius: 5px;
    background-color: #FFFF;
    box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;

`;
const CardTitle = styled.p`
    color: ${props => props.cl || "black"};
    font-size: ${props => props.fs};
    font-weight: ${props => props.fw || "normal"};
    cursor: pointer;
`
const CloseBtn = styled.div`
    display: flex;
    justify-content: end;
`

const Container = styled.div`
    width: 100%;
    padding: 1rem;
`;
export default GroupPlan;
