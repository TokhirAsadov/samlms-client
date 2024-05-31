import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {extrasmall, large, medium, small, xlarge} from "../../../responsiv";
import {RiBookMarkFill} from "react-icons/ri";
import {Menu, Stack, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import {MdDelete, MdUpdate} from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import {BsThreeDotsVertical} from "react-icons/bs";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {IoClose} from "react-icons/io5";
import Typography from "@mui/material/Typography";
import {useSelector} from "react-redux";
import axios from "axios";
import {toast} from "react-toastify";

function CreateSubjects() {
    const section = useSelector(state => state.section?.section);
    const user = useSelector(state => state.user?.user);
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
    const {headers}=getHeaders();
    const [obj, setObj] = useState({
      id: null,
      name: null,
      kafedraId: section?.id,
    })
    const [subjects,setSubjects] =useState([])
    const [modalCreateSubject, setModalCreateSubject] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [disabledSaveBtn, setDisabledSaveBtn] = useState(true)
    const openMenu = Boolean(anchorEl);
    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setObj(prevState => ({...prevState,id,name:subjects?.find(s=>s?.subjectId === id)?.subjectName}))
    };
    const handleOpenModal = () => setModalCreateSubject(true)
    const handleCloseModal = () => {
      setModalCreateSubject(false)
      setObj(prevState => ({...prevState,name:null,id:null}))
    }

    const saveSubjectName = () => {
        console.log(obj,"save method")
        axios.get(`${BASE_URL}/lesson/checkLessonNameAlreadyExists?subjectName=${obj?.name}`,{headers})
          .then((response) =>{
            console.log(response.data?.success)
            if (response?.data?.success){
              toast.error("⚠️"+response.data?.message)
            }
            else {
              fetchCreateSubject(obj)
            }
          })
          .catch((error) =>{
            console.log(error)
          })
    }

    const fetchCreateSubject = async (subject) => {
        await axios.post(`${BASE_URL}/lesson/createLessonV2`,subject,{headers})
          .then(response => {
            toast.success(response?.data?.message);
            fetchAllSubjects()
            handleCloseModal()
          })
          .catch(err => {
            console.log(err)
          })
    }


    const fetchAllSubjects = async () => {
        await axios.get(`${BASE_URL}/lesson/getAllLessonByKafedraOwnerId/${user?.id}`,{headers})
          .then(response => {
            setSubjects(response?.data?.obj)
              console.log(response.data)
          })
          .catch(err => {
            console.log(err)
          })
    }

    useEffect(()=>{
        if (obj?.name && obj?.name!==""){
            setDisabledSaveBtn(false)
        }
        else {
            setDisabledSaveBtn(true)
        }
    },[obj])
    const handleCloseMenu = (label) => {

        setAnchorEl(null);
        // content id

        if (label === "Update") {
            // fetch the update
            handleOpenModal()

        } else if (label === "Delete") {
            // fetch the delete
          fetchDeleteSubject(obj?.id)
        }
        else {

            setObj(prevState => ({...prevState,name:null,id:null}))
        }

    };

    const fetchCheckThenUpdate = async () => {
      await axios.get(`${BASE_URL}/lesson/checkLessonNameAlreadyExists?subjectName=${obj?.name}`,{headers})
        .then((response) =>{
          if (response?.data?.success){
            toast.error("⚠️"+response.data?.message)
          }
          else {
            updateSubject()
          }
        })
        .catch((error) =>{
          console.log(error)
        })
    }

    const updateSubject = async () => {
      await axios.put(`${BASE_URL}/lesson/updateLessonV2`,obj,{headers})
        .then(response => {
          response?.data?.success ? toast.success(response?.data?.message) : toast.error(response?.data?.message)
          fetchAllSubjects()
          handleCloseModal()
        })
        .catch(err => {
          console.log(err)
        })
    }

    const fetchDeleteSubject = async (id) => {
      if (window.confirm('Are you sure you want to delete lesson?')) {
        await axios.delete(`${BASE_URL}/lesson/deleteLesson/${id}`, {headers})
          .then(response => {
            toast.success(response?.data?.message)
            setSubjects(subjects?.filter(s => s.subjectId !== id));
            setObj(prevState => ({...prevState, name: null, id: null}))
          })
          .catch(err => {
            console.log(err);
          })
      }
      else {
        setObj(prevState => ({...prevState,name:null,id:null}))
      }
    }

    useEffect(() => {
        fetchAllSubjects();
    },[])

    return (
        <Container>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                <h2>Subjects</h2>
                <Button variant={'contained'} onClick={handleOpenModal}>
                    create a new subject
                </Button>
            </Box>

            <BodyCards>
                {
                    subjects?.map((_, index) => {
                        return (
                            <BodyCard key={_?.subjectId}>
                                <Box display={'flex'} alignItems={'flex-start'}>
                                    <Box width={"100%"}>
                                        <BodyCardTitle>
                                            <Box width={"30px"} height={'30px'}>
                                                <RiBookMarkFill size={30}/>
                                            </Box>
                                            <span>{_?.subjectName}</span>
                                        </BodyCardTitle>
                                    </Box>
                                    <IconButton
                                        aria-label="actions"
                                        id="long-button"
                                        aria-controls={openMenu ? 'long-menu' : undefined}
                                        aria-expanded={openMenu ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={(e) => handleClick(e, _?.subjectId)}
                                        size="small">
                                        <BsThreeDotsVertical/>
                                    </IconButton>
                                </Box>
                            </BodyCard>
                        )
                    })
                }
            </BodyCards>

            {/* modal create a new subject */}
            <Modal
                open={modalCreateSubject}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={style2}>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant={'h6'} color={mainColor} mt={1}>
                          {
                            obj?.id===null?"Create a new subject":"Update subject"
                          }
                        </Typography>
                        <IconButton onClick={handleCloseModal}> <IoClose size={22}/></IconButton>
                    </Box>
                    <Box>
                        <Stack sx={{height: "150px", padding: "0 10px"}} direction="row" justifyContent="center"
                               alignItems="center">
                            <TextField
                                fullWidth
                                value={obj?.name}
                                required
                                label="Subject name"
                                onChange={e => setObj(prevState => ({...prevState,name:e.target.value}))}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="flex-end"
                               alignItems="center">
                            <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
                            <Button variant="contained" onClick={obj?.id===null ? saveSubjectName : fetchCheckThenUpdate} disabled={disabledSaveBtn}>
                              {
                                obj?.id===null?"save":"update"
                              }
                            </Button>
                        </Stack>
                    </Box>
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
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "15px",
    borderRadius: "8px",
};
const style2 = styled.div`
  ${extrasmall({
    width: "95% !important",
  })}
`

const BodyCardTitle = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  align-items: start;
  font-size: 16px;
  text-align: start;
  color: ${mainColor};
  font-weight: bold;
  ${extrasmall({
    fontSize: "14px",
  })}
`
const BodyCard = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 1px 3px 8px 0 rgba(34, 60, 80, 0.2);

  p {
    display: flex;
    align-items: center;
    color: black;
    font-size: 14px;
  }

`;
const BodyCards = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
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


const Container = styled.div`
  width: 100%;
  padding: 1rem;

  h2 {
    color: ${mainColor};
    font-size: 28px;
  }
`

export default CreateSubjects;