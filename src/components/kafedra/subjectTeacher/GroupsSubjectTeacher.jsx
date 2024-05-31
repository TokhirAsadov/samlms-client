import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {kafedraTeacherStatisticsFetchingError} from "../../../redux/slice/kafedra/kafedra_teacher_statistics_slice";
import styled from "styled-components";
import {Autocomplete, Card, CardContent, CardHeader, Skeleton} from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {CgClose} from "react-icons/cg";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import {IoSend} from "react-icons/io5";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {extrasmall, large, medium, small, xlarge} from "../../../responsiv";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {MdOutlineCreateNewFolder} from "react-icons/md";
import {educationYearStatisticsFetching} from "../../../redux/slice/educationYear/education_year_statistics_slice";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";

const GroupsSubjectTeacher = () => {
    const eduLanguageData = ['UZBEK', 'ENGLISH', 'RUSSIAN']
    const eduTypeData = ["KUNDUZGI", "KECHKI", "SIRTQI", "MAGISTRATURE"]
    const [subjects,setSubjects] = useState([])
    const levelsOption = [1, 2, 3, 4, 5, 6]
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const [eduYears, setEduYears] = useState([]);
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const [selectedEduYears, setSelectedEduYears] = useState(null)
    const dispatch = useDispatch()
    const {headers} = getHeaders();
    const [disabledSave, setDisabledSave] = useState(true);
    const [groups, setGroups] = useState([])
    const initialInputData = {
        id:null,
        eduLang: eduLanguageData[0],
        eduType: eduTypeData[0],
        educationYearId: educationYear?.id,
        subjectId: null,
        teacherId: null,
        level: levelsOption[0],
        groupsIds: []
    }
    const [inputData, setInputData] = useState(initialInputData)

    const handleOpen = () => {

      fetchGroupsForKafedraMudri();
      setOpen(true);
    }
    const handleClose = () => {
      setOpen(false);
      setInputData(initialInputData)
    }
    const handleChange = (event) => {
        event.target.value !== educationYear?.name && dispatch(educationYearStatisticsFetching())
        dispatch(fetchEducationYear(eduYears?.find(i => i?.name === event.target.value)))
    };
    const handleChangeEduYears = (e) => {
        setSelectedEduYears(eduYears.find(i => i?.name === e.target.value))
    };

    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {

                setEduYears(res?.data?.obj);
                setSelectedEduYears(res?.data?.obj?.[0])
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }

    const getAllTeacherStatics = () => {
        setSpinner(true);
        setData([]);

        axios.get(`${BASE_URL}/plan/getTeacherWIthSubjectForPlan/${educationYear?.id}`, {headers})
            .then(res => {

                setData(res?.data?.obj?.sort((a, b) => a.fullName > b.fullName ? 1 : -1));
                setSpinner(false)
            })
            .catch(err => dispatch(kafedraTeacherStatisticsFetchingError(err)));
    }

  const fetchCreatePlan = async (obj) => {
    axios.post(`${BASE_URL}/plan/createdPlanByKafedraMudiri`, obj, {headers})
      .then(response => {

        toast.success("created plan of subject successfully")
        handleClose()
      })
      .catch(err => {
        console.log(err, "error creating plan response")
      })
  }

    const fetchSubjectsAndGroups = async () => {
        await axios.get(`${BASE_URL}/lesson/getAllLessonByKafedraOwner`,{headers})
          .then(res=>{
            setSubjects(res.data?.obj)

          })
          .catch(err => {
            console.log(err)
          })
    }

    const fetchGroupsForKafedraMudri = async () => {
        await axios.get(`${BASE_URL}/group/getGroupsForKafedraMudiri?lang=${inputData?.eduLang}&eduType=${inputData?.eduType}&level=${inputData?.level}`,{headers})
          .then(res => {
            setGroups(res?.data?.obj)
            // console.log(res,"================================== --------------------------------- =================================")
          })
          .catch(err => {
            console.log(err)
          })
    }

    useEffect(() => {
      fetchGroupsForKafedraMudri()
        if (inputData.teacherId !== "" &&
            inputData.groupsIds.length > 0 &&
            inputData.subjectId !== "" &&
            inputData.level != "") {

            setDisabledSave(false)

        } else {
            setDisabledSave(true)
        }
    }, [inputData])

    useEffect(() => {
        fetchEducationYears()
        fetchSubjectsAndGroups()

    }, [])
    useEffect(() => {
        educationYear && getAllTeacherStatics();
    }, [educationYear]);
    useEffect(() => {
      eduYears?.length>0 && setSelectedEduYears(eduYears[0])
    }, [eduYears]);

    const handleSave = () => {
      // console.log({...inputData,educationYearId: educationYear?.id,groupsId: inputData?.groupsId?.map(group => group.id) || []})
      fetchCreatePlan({...inputData,educationYearId: educationYear?.id,groupsIds: inputData?.groupsIds?.map(group => group.id) || []})
    }



    function Media(props) {
        const {loading = false} = props;

        return (
            <Card>
                <CardHeader
                    avatar={
                        loading && (
                            <Skeleton animation="wave" variant="circular" width={40} height={40}/>
                        )
                    }
                    action={
                        loading && null
                    }
                    title={
                        loading && (
                            <Skeleton
                                animation="wave"
                                height={15}
                                width="80%"
                                style={{marginBottom: 6}}
                            />
                        )
                    }
                    subheader={
                        loading && (
                            <Skeleton animation="wave" height={15} width="40%"/>
                        )
                    }
                />
                <CardContent>
                    {loading && (
                        <React.Fragment>
                            <Skeleton animation="wave" height={15} style={{marginBottom: 6}}/>
                            <Skeleton animation="wave" height={15}/>
                        </React.Fragment>
                    )}
                </CardContent>
            </Card>
        );
    }

    console.log(spinner)

    return (
        <Container>
            <TitleMain>
                <p>Connect group to teacher</p>
                <Button
                    variant="contained"
                    endIcon={<MdOutlineCreateNewFolder/>}
                    onClick={handleOpen}
                >
                    create group plan
                </Button>
            </TitleMain>

            <FormControl sx={{width: "280px", margin: "25px 0",background: "#fff"}}>
                <InputLabel id="demo-simple-select-readonly-label15">Academic year</InputLabel>
                <Select
                    labelId="demo-simple-select-readonly-label15"
                    id="demo-simple-select-readonly15"
                    value={selectedEduYears?.name || ""}
                    onChange={handleChangeEduYears}
                    label="Academic year"
                >
                    {eduYears?.map((item) => (
                        <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <MainBox>
                {spinner ? Array.from({length: 4}).map((item, index) => (
                    <Media key={index} loading/>
                )) : data.map((item, index) => (
                    <Card key={index}>
                        <CardContent>
                            <Box display="flex" gap={2} alignItems="center">
                                <Avatar alt={item?.fullName}
                                        src={item?.photo ? BASE_URL + "/attachment/download/" + item?.photo?.id : ""}/>
                                <Typography>{item?.fullName}</Typography>
                            </Box>
                            <Box mt={2}>
                                <ul style={{ listStyleType: 'none',color: `${mainColor}`, fontWeight: "bold", fontSize: "16px"}}>
                                  {
                                      item?.subjects?.map((subject,i) => <li key={i}><Link to={subject?.name}>{subject?.name}</Link></li>)
                                  }
                                </ul>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </MainBox>

            {/****modal create group for teacher *****/}
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style} component={style2}>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Create group plan
                        </Typography>
                        <IconButton onClick={handleClose} aria-label="close" size="medium">
                            <CgClose/>
                        </IconButton>
                    </Box>

                    <FormControl sx={{width: "100%", margin: "25px 0"}}>
                        <InputLabel id="demo-simple-select-readonly-label">Academic year</InputLabel>
                        <Select
                            labelId="demo-simple-select-readonly-label"
                            id="demo-simple-select-readonly"
                            value={educationYear?.name}
                            onChange={handleChange}
                            label="Academic year"
                        >
                            {eduYears?.map((item) => (
                                <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{display: "flex", gap: "20px"}}>
                        <FormControl sx={{width: "100%"}}>
                            <InputLabel id="demo-simple-select-readonly-label1">Language</InputLabel>
                            <Select
                                labelId="demo-simple-select-readonly-label1"
                                id="demo-simple-select-readonly"
                                value={inputData.eduLang}
                                label="Language"
                                onChange={(e) => setInputData((prevState) => ({
                                    ...prevState,
                                    eduLanguage: e.target.value
                                }))}
                            >
                                {eduLanguageData.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{width: "100%"}}>
                            <InputLabel id="demo-simple-select-readonly-label1">Type of education</InputLabel>
                            <Select
                                labelId="demo-simple-select-readonly-label1"
                                id="demo-simple-select-readonly"
                                value={inputData.eduType}
                                label="Type of education"
                                onChange={(e) => setInputData((prevState) => ({...prevState, eduType: e.target.value}))}
                            >
                                {eduTypeData.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{width: "100%"}}>
                            <InputLabel id="demo-simple-select-readonly-label1">Сourse</InputLabel>
                            <Select
                                labelId="demo-simple-select-readonly-label1"
                                id="demo-simple-select-readonly"
                                value={inputData.level}
                                label="Сourse"
                                onChange={(e) => setInputData((prevState) => ({...prevState, level: e.target.value}))}
                            >
                                {levelsOption.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <FormControl sx={{width: "100%", margin: "25px 0"}}>
                        <InputLabel id="demo-simple-select-readonly-label1">Teacher</InputLabel>
                        <Select
                            labelId="demo-simple-select-readonly-label1"
                            id="demo-simple-select-readonly"
                            value={inputData.teacherId}
                            label="Teacher"
                            onChange={(e) => setInputData((prevState) => ({
                                ...prevState,
                                teacherId: e.target.value
                            }))}
                        >
                            {data?.map((option, index) => (
                                <MenuItem key={index}
                                          value={option?.id}>{index + 1 + ". " + option?.fullName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{width: "100%"}}>
                        <InputLabel id="demo-simple-select-readonly-label1">Subject</InputLabel>
                        <Select
                            labelId="demo-simple-select-readonly-label1"
                            id="demo-simple-select-readonly"
                            value={inputData.subjectId}
                            label="Subject"
                            onChange={(e) => setInputData((prevState) => ({
                                ...prevState,
                                subjectId: e.target.value
                            }))}
                        >
                            {subjects?.map((option, index) => (
                                <MenuItem key={index}
                                          value={option?.subjectId}>{index + 1 + ". " + option?.subjectName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={groups}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.groupName}
                        value={inputData.groupsIds}
                        onChange={(event, newValue) => {
                            setInputData((prevState) => ({...prevState, groupsIds: newValue}));
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderOption={(props, option, {selected}) => (
                            <li {...props}>
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                    checkedIcon={<CheckBoxIcon fontSize="small"/>}
                                    style={{marginRight: 8}}
                                    checked={selected}
                                />
                                {option?.groupName}
                            </li>
                        )}
                        style={{width: "100%", margin: "25px 0"}}
                        renderInput={(params) => (
                            <TextField {...params} label="Groups"/>
                        )}
                    />

                    <Box mt={2} display={'flex'} justifyContent={'end'}>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            disabled={disabledSave}
                            endIcon={<IoSend/>}
                        > save</Button>
                    </Box>
                </Box>

            </Modal>
        </Container>
    );
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
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
const TitleMain = styled.h1`
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;

  p {
    color: ${mainColor};
    font-size: 30px;
    font-weight: bold;
    ${extrasmall({
      textAlign: "center",
      fontSize: "25px",
    })}
  }
  ${extrasmall({
    justifyContent:"center",
  })}
`;

const MainBox = styled.div`
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
  })}`

const Container = styled.div`
  width: 100%;
  padding: 1rem;
`

export default GroupsSubjectTeacher;
