import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {useSelector} from "react-redux";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {FaUserAlt} from "react-icons/fa";
import Button from "@mui/material/Button";
import moment from "moment";
import {FiEdit} from "react-icons/fi";
import {BsCalendar2Date, BsPersonFillAdd, BsTrash} from "react-icons/bs";
import axios from "axios";
import {toast} from "react-toastify";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import UsersMonthStatistics from "../../userStatistics/UsersMonthStatistics";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import UserStatistics from "../../userStatistics/UserStatistics";
import SaveStaffForm from "../../form/SaveStaffForm";
import {motion as m} from "framer-motion";
import {extrasmall, small} from "../../../responsiv";

const DekanStaff = () => {
    const section = useSelector(state => state?.dekanat?.dekanat);
    const [spinner,setSpinner] = useState(true);
    const [openMonthModal, setOpenMonthModal] = useState(false);
    const [selectUserId,setSelectUserId] = useState("");
    const columns = [
    {field: 'id', headerName: 'ID', width: 40, editable: false},
    {
      field: 'fullName',
      headerName: 'Name',
      type: 'string',
      width: 300,
      editable: false,
      renderCell: (cellValues) => {
        return (
          <Wrapper>
            {
              cellValues?.row?.photo ? <img
                src={cellValues?.row?.photo ? BASE_URL + "/attachment/download/" + cellValues?.row?.photo?.id : ""}
                width={"40px"} height={"40px"}
                alt={cellValues?.value}
                style={{borderRadius: "50%"}}
              /> : <span style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px"
              }}><FaUserAlt/></span>
            }
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px"
            }}><Button
              onClick={() => handleOpenTeacherPanel(cellValues?.row?.id)}>{cellValues?.value}</Button></span>
          </Wrapper>
        );
      }
    },
    {field: 'login', headerName: 'Login', type: 'string', width: 300, editable: false,},
    {field: 'email', headerName: 'Email', type: 'string', width: 300, editable: false,},
    {field: 'rfid', headerName: 'RFID', type: 'string', width: 300, editable: false,},
    {field: 'passport', headerName: 'Passport', type: 'string', width: 300, editable: false,},
    {
      field: 'countTouch',
      headerName: `Kelgan kunlari \n${moment(new Date()).format("MMM")}`,
      type: 'string',
      width: 170,
      editable: false,
      renderCell: (cellValues) => {
        return (
          <Wrapper2>
            <Button
              onClick={() => handleOpenTimeTable(cellValues?.row?.fullName, cellValues?.row?.id, cellValues?.row?.photo?.id)}>
              {cellValues?.value}
              <BsCalendar2Date size={20} />
            </Button>
          </Wrapper2>
        );
      }
    },
    {
      field: 'positions', headerName: 'Shtat birligi va lavozimi', type: 'string', width: 190, editable: false,
      renderCell: (cellValues) => {
        return (
          <Wrapper2>
            {cellValues?.value}
          </Wrapper2>
        );
      }
    },
    {
      field: 'STATUS', headerName: 'Action', type: 'string', width: 100, editable: false,
      renderCell: (cellValues) => {
        return (
          <Wrapper2>
            <BtnEditPosition
              onClick={() => handleOpenEdit(cellValues?.row?.id, cellValues?.row?.fullName, cellValues?.row?.positions)}><FiEdit/></BtnEditPosition>
            <BtnEditPosition2 onClick={() => handleDeleted(cellValues?.row?.id, cellValues?.row?.fullName)}><BsTrash/></BtnEditPosition2>
          </Wrapper2>
        );
      }
    },
  ];
    const [data,setData] = useState([])
    const [open, setOpen] = useState(false);
    const [selectPhoto,setSelectPhoto] = useState("");
    const [selectUser,setSelectUser] = useState("");
    const [openTeacherPanel, setOpenTeacherPanel] = useState(false);
    const [openTimeTable, setOpenTimeTable] = useState(false);
    const [edit,setEdit] = useState(false);
    const {headers} = getHeaders();

    const handleOpenTimeTable = (name,userId,photoId) => {
      setSelectUser(name);
      setSelectPhoto(photoId)
      setSelectUserId(userId)
      return setOpenTimeTable(true);
    }
    const handleCloseOpenTimeTable = () => {
      setOpenTimeTable(false);
    }
    const handleOpenTeacherPanel = (selectId) => {
      setSelectUserId(selectId)
      setOpenTeacherPanel(true);
    }

    const handleCloseTeacherPanel = () => {
      setOpenTeacherPanel(false);
    }

    const handleOpenMonthModal = () => {
      setOpenMonthModal(true)
    }
    const handleCloseMonthModal = () => {
      setOpenMonthModal(false);
    }

    const handleOpen = () => {
      setUpdateItem({...updateItem,id:null,userId:null,sectionId:null,positionId: null})
      setOpen(true);
    }
    const handleClose = () => {
      setOpen(false);
      setEdit(false)
    }

    const handleOpenEdit = (id,fullName,position) => {

      setUpdateItem(prevState => ({...prevState,sectionId:null,positionId: position,userId: {value: id,label:fullName}}))

      axios.get(BASE_URL+"/staff/getStaffIdWithUserId/"+id,{headers})
        .then(res => {
          // console.log(updateItem,"- res data")
          toast.success(res?.data?.message);
          setUpdateItem(prevState => ({...prevState,id: res?.data?.obj}))
          setEdit(true)
        })
        .catch(err => {
          console.log(err)
          toast.error(err?.response?.data?.message, {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })
        })

    }


    const handleDeleted = (id,name) => {

      axios.get(BASE_URL+"/staff/getStaffIdWithUserId/"+id,{headers})
        .then(res => {

          if (window.confirm(`Do you want to delete ${name}?`)) {
            axios.delete(BASE_URL + "/staff/deleteStaff/" + res?.data?.obj, {headers})
              .then(res => {
                toast.error(res?.data?.message, {
                  position: "top-right",
                  autoClose: false,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                })
                getAllTeacherStatics();
              })
              .catch(err => {
                toast.error(err?.response?.data?.message, {
                  position: "top-right",
                  autoClose: false,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                })
                console.log(err)
              })

          }
        })
        .catch(err => {
          console.log(err)
          toast.error(err?.response?.data?.message);
        })
    }

    useEffect( () => {
      getAllTeacherStatics();
    },[])



    const getAllTeacherStatics = () => {
      setSpinner(true);
      let days = () => Array.from(Array(moment(new Date()).daysInMonth()).keys()).map(i => i + 1);
      setData([]);

      axios.get(BASE_URL+"/section/getStatisticsForDekan",{headers})
        .then(res => {
          console.log(res.data,"- 55 55 --------------------- -------------")
          setData(
            res?.data?.obj?.sort((a,b) => a.fullName > b.fullName ? 1 : -1)
          );
          setSpinner(false)
        })
        .catch(err => {
          console.log(err)
        });
    }

    const [updateItem,setUpdateItem] = useState({
      id:null,
      sectionId:null,
      positionId:null,
      userId:null
    })

    const onUpdate = (staff) => {

      if (
        staff?.id !== undefined &&
        staff?.id !== null &&
        staff?.id !== "" &&

        staff?.userId !== undefined &&
        staff?.userId !== null &&
        staff?.userId !== "" &&

        staff?.positionId !== undefined &&
        staff?.positionId !== "" &&
        staff?.positionId !== null
      ){
        axios.post(BASE_URL+"/staff/saveStaff", staff,{ headers })
          .then(res => {
            toast.success("Staff updated successfully.");
            getAllTeacherStatics();
            setEdit(false);
          })
          .catch(err => {
            console.log(err);
            toast.error(err?.response?.data?.message, {
              position: "top-right",
              autoClose: false,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            })
          })


      }
      else {
        toast.warning("Empty any fields...")
      }


    }

    const saveStaff = (form) => {

      if (form?.id==="" || form?.id === undefined){
        form.id = null
        form.sectionId = null
      }
      if (form?.id===null){
        form.sectionId = null
      }

      if (
        form?.userId !== undefined &&
        form?.userId !== null &&
        form?.userId !== "" &&

        form?.positionId !== undefined &&
        form?.positionId !== "" &&
        form?.positionId !== null
      ){
        toast.success("all done add")

        axios.post(BASE_URL+"/staff/saveStaff", form,{ headers })
          .then(response => {
            toast.success("Staff saved successfully.");
            getAllTeacherStatics();
            setOpen(false);
          })
          .catch(err => {
            console.log(err);
            toast.error(err?.response?.data?.message, {
              position: "top-right",
              autoClose: false,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            })
          });
      }
      else {
        toast.warning("Empty any fields...")
      }

      console.log(form,"save staff")

    }

    return (
      <Container>
        <Title>Table of Staffs
          <BtnWrapper>
            <Button variant={'contained'} onClick={handleOpenMonthModal}>
              Open Month Modal
            </Button>
            <Button variant={'contained'} color={'success'} onClick={handleOpen} endIcon={<BsPersonFillAdd/>} >Add Staff</Button>
          </BtnWrapper>
        </Title>




        <Modal
          open={openMonthModal}
          onClose={handleCloseMonthModal}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={styleMonthTable}
               component={BoxMy}
          >
            <CloseMyButtonForChild onClick={handleCloseMonthModal}
                                   whileHover={{ rotate: 180, scale: 1.1 }}
                                   whileTap={{ scale: 0.9 }}
                                   transition={{ duration: 0.3 }}
            ><RiCloseLine /></CloseMyButtonForChild>
            <UsersMonthStatistics colName={"Staffs"} isTeacher={false} date={new Date()} userName={section.name}
                                  kafedraId={section.id} url={"/staff/getStatisticsForRektor?sectionId="}/>
          </Box>
        </Modal>



        <Body>
          {
            spinner ? <Spinner /> : <DataGrid
              checkboxSelection
              style={{width:"500px!important",minHeight:"300px!important"}}
              columns={columns}
              rows={ data }
              components={{ Toolbar: GridToolbar }}/*** print and excel ****/
              autoHeight
              pageSize={10}
              initialState={{ // hide items
                ...data?.initialState,
                columns: {
                  columnVisibilityModel: {
                    id: false,
                    login: false,
                    card:false,
                    rfid:false,
                    email:false,
                    passport:false
                  },
                },
              }}
            />
          }
        </Body>


        {/*** ================= TIME TABLE =================== ***/}
        <Modal
          open={openTimeTable}
          onClose={handleCloseOpenTimeTable}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={styleTable}>
            <CloseMyButtonForChild onClick={handleCloseOpenTimeTable}
                                   whileHover={{ rotate: 180, scale: 1.1 }}
                                   whileTap={{ scale: 0.9 }}
                                   transition={{ duration: 0.3 }}
            ><RiCloseLine /></CloseMyButtonForChild>
            <UserStatistics userName={selectUser} userId={selectUserId} date={new Date()} photo={selectPhoto}/>
          </Box>
        </Modal>
        {/*** ================= TIME TABLE =================== ***/}


        {/*** ================= ADD STAFF =================== ***/}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} component={Formbox}>
            <CloseMyButtonForChild onClick={handleClose}
                                   whileHover={{ rotate: 180, scale: 1.1 }}
                                   whileTap={{ scale: 0.9 }}
                                   transition={{ duration: 0.3 }}
            ><RiCloseLine /></CloseMyButtonForChild>



            <SaveStaffForm
              isSection={false}
              title={"Add Staff"}
              formArr={[
                {
                  label: "id",
                  name: "id",
                  placeholder:"Enter id of staff",
                  type: "text",
                },
                {
                  label: "Select User:",
                  name: "userId",
                  placeholder:"Select User",
                  type: "select",
                },
                {
                  label: "Select Position:",
                  name: "positionId",
                  placeholder:"Select Position",
                  type: "select",
                },
              ]}
              submitBtn={updateItem?.id!==null ? "Update":"Save"}
              // submitBtn="Save"
              onSubmit={ (form)=> updateItem?.id!==null ? onUpdate(form) : saveStaff(form)}
              updateItem={updateItem}

            />
          </Box>
        </Modal>
        {/*** ================= ADD STAFF =================== ***/}


        {/*** ================= edit staff =================== ***/}
        <Modal
          open={edit}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} component={Formbox}>
            <CloseMyButtonForChild onClick={handleClose}
                                   whileHover={{ rotate: 180, scale: 1.1 }}
                                   whileTap={{ scale: 0.9 }}
                                   transition={{ duration: 0.3 }}
            ><RiCloseLine /></CloseMyButtonForChild>



            <SaveStaffForm
              isSection={false}
              title={"Update Staff"}
              formArr={[
                {
                  label: "id",
                  name: "id",
                  placeholder:"Enter id of staff",
                  type: "text",
                },
                {
                  label: "Select User:",
                  name: "userId",
                  placeholder:"Select User",
                  type: "select",
                },
                {
                  label: "Select Position:",
                  name: "positionId",
                  placeholder:"Select Position",
                  type: "select",
                },
              ]}
              submitBtn={updateItem?.id!==null ? "Update":"Save"}
              // submitBtn="Save"
              onSubmit={ (form)=> updateItem?.id!==null ? onUpdate(form) : saveStaff(form)}
              updateItem={updateItem}

            />
          </Box>
        </Modal>
        {/*** ================= edit staff =================== ***/}


      </Container>
    );
  };




const BoxMy = styled.div`
  ${extrasmall({
  width:"90vw !important"
})},
  ${small({
  width:"90vw !important"
})}
`

const styleMonthTable = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "85vw",
  height: "85vh",
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 4

};





const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "500px",
  padding: "15px ",
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3 ,
  p: 3,
};
const Formbox=styled.div`
${extrasmall({
  width:"95vw !important",
})}
`


const styleTable = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "95vw",
  minHeight: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const CloseMyButtonForChild = styled(m.button)`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${mainColor};
  border-radius: 50%;
  color: white;
  font-size: 26px;
  border: none;
  position: absolute;
  top: 10px;
  right: 10px;
`;


const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  margin: 5px !important;
`;


const BtnEditPosition2 = styled.button`
  width: 30px;
  height: 30px;
  background-color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
  border-radius: 0.5rem;
  color: red;
  padding: 5px !important;

  &:hover {
    transform: scale(1.1);
  }

`

const BtnEditPosition = styled.button`
  width: 30px;
  height: 30px;
  background-color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${mainColor};
  border-radius: 0.5rem;
  color: ${mainColor};
  padding: 5px !important;

  &:hover {
    transform: scale(1.1);
  }

`

const Wrapper2 = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 5px !important;
`;


const Body = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BtnWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`

const Title = styled.h3`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  color: ${mainColor};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 10px;
  margin-top: 10px !important;
  margin-left: 10px !important;
  padding: 5px 10px !important;
`;


export default DekanStaff;