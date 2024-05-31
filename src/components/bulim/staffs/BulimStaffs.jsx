import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {FaPlus, FaUserAlt, FaUserPlus} from "react-icons/fa";
import Button from "@mui/material/Button";
import moment from "moment";
import {FiEdit} from "react-icons/fi";
import {BsCalendar2Date, BsTrash} from "react-icons/bs";
import axios from "axios";
import {toast} from "react-toastify";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import UserStatistics from "../../userStatistics/UserStatistics";
import {motion as m} from "framer-motion";
import UsersMonthStatistics from "../../userStatistics/UsersMonthStatistics";
import {useSelector} from "react-redux";
import SaveStaffForm from "../../form/SaveStaffForm";
import {extrasmall, medium, small} from "../../../responsiv";


const BulimStaffs = ({s}) => {

  const section = useSelector(state => s ? state?.secondBulim?.secondBulim : state?.bulim?.bulim);
  const [spinner,setSpinner] = useState(true);
  const [openMonthModal, setOpenMonthModal] = useState(false);
  const [selectUserId,setSelectUserId] = useState("");
  const columns = [
    { field: 'count', headerName: '№', width: 40,align:'center', editable: false },
    { field: 'fullName', headerName: 'Name',type: 'string', minWidth: 300,flex:1, editable: false, renderCell: (cellValues) => {
        return (
          <Wrapper>
            {
              cellValues?.row?.photo ? <img
                src={cellValues?.row?.photo ? BASE_URL + "/attachment/download/" + cellValues?.row?.photo?.id : ""}
                width={"40px"} height={"40px"}
                alt={cellValues?.value}
                style={{borderRadius: "50%"}}
              />:<span style={{ display:"flex",alignItems:"center",justifyContent:"center",fontSize: "20px" }}><FaUserAlt  /></span>
            }
            <span style={{
              display:"flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize:"14px"
            }}><Button onClick={() => handleOpenTeacherPanel(cellValues?.row?.id)}>{cellValues?.value}</Button></span>
          </Wrapper>
        );
      }},
    { field: 'login', headerName: 'Login',type: 'string', minWidth: 100,flex:1,align:'center', editable: false, },
    { field: 'email', headerName: 'Email',type: 'string', minWidth: 150,flex:1,align:'center', editable: false, },
    { field: 'rfid', headerName: 'RFID',type: 'string', minWidth: 120,flex:1,align:'center', editable: false, },
    { field: 'passport', headerName: 'Passport',type: 'string', minWidth: 300,flex:1,align:'center', editable: false, },
    { field: 'countTouch',align:'center', headerName: `Days to come - \n${moment(new Date()).format("MMM")}`,type: 'string', width: 170, editable: false,
      renderCell: (cellValues) => {
        return (
          <Wrapper2>
            <Button onClick={() => handleOpenTimeTable(cellValues?.row?.fullName,cellValues?.row?.id,cellValues?.row?.photo?.id)}>
              {cellValues?.value}
              <BsCalendar2Date size={19} color={mainColor} />
            </Button>
          </Wrapper2>
        );
      }
    },
    { field: 'positions',align:'center', headerName: 'Positions',type: 'string', minWidth: 190,flex:0.5, editable: false,
      renderCell: (cellValues) => {
        return (
          <Wrapper2>
            {cellValues?.value}
          </Wrapper2>
        );
      }
    },
    { field: 'STATUS',align:'center', headerName: 'Status',type: 'string', minWidth: 100,flex:0.5, editable: false,
      renderCell: (cellValues) => {
        return (
          <Wrapper2>
            <BtnEditPosition onClick={() => handleOpenEdit(cellValues?.row?.id,cellValues?.row?.fullName,cellValues?.row?.positions)}><FiEdit /></BtnEditPosition>
            <BtnEditPosition2 onClick={() => handleDeleted(cellValues?.row?.id,cellValues?.row?.fullName)}><BsTrash /></BtnEditPosition2>
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


  const handleOpenMonthModal = () => {
    setOpenMonthModal(true)
  }
  const handleCloseMonthModal = () => {
    setOpenMonthModal(false);
  }

  const handleOpen = () => {
    setUpdateItem({...updateItem,id:null,userId:null,sectionId:section.id,positionId: null})
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    setEdit(false)
  }

  const handleOpenEdit = (id,fullName,position) => {

    setUpdateItem(prevState => ({...prevState,sectionId:section?.id,positionId: position,userId: {value: id,label:fullName}}))

    axios.get(BASE_URL+"/staff/getStaffIdWithUserId/"+id,{headers})
      .then(res => {
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
    setData([]);

    axios.get(BASE_URL+"/section/getStatistics",{headers})
      .then(res => {
        setData(
          res?.data?.obj?.sort((a,b) => a.fullName > b.fullName ? 1 : -1).map((item,index)=>({...item,count:index+1}))
        );
        setSpinner(false)
      })
      .catch(err => {
        console.log(err)
      });
  }

  const [updateItem,setUpdateItem] = useState({})

  const onUpdate = (staff) => {
    if (

      staff?.id !== undefined &&
      staff?.id !== null &&
      staff?.id !== "" &&

      staff?.userId !== undefined &&
      staff?.userId !== null &&
      staff?.userId !== "" &&

      staff?.sectionId !== undefined &&
      staff?.sectionId !== "" &&
      staff?.sectionId !== null &&

      staff?.positionId !== undefined &&
      staff?.positionId !== "" &&
      staff?.positionId !== null
    ){
      toast.success("all done")
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
    }

    if (
      form?.userId !== undefined &&
      form?.userId !== null &&
      form?.userId !== "" &&

      form?.sectionId !== undefined &&
      form?.sectionId !== "" &&
      form?.sectionId !== null &&

      form?.positionId !== undefined &&
      form?.positionId !== "" &&
      form?.positionId !== null
    ){

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
          <Button variant={'contained'} color={'success'} endIcon={<FaUserPlus />} onClick={handleOpen}> Add Staff</Button>
        </BtnWrapper>
      </Title>




      <Modal
        open={openMonthModal}
        onClose={handleCloseMonthModal}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={styleMonthTable}>
          <CloseMyButtonForChild onClick={handleCloseMonthModal}
                                 whileHover={{ rotate: 180, scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                                 transition={{ duration: 0.3 }}
          ><RiCloseLine /></CloseMyButtonForChild>

          <UsersMonthStatistics colName={"Staffs"} isTeacher={false} date={new Date()} userName={section?.name} kafedraId={section?.id} url={"/staff/getStatisticsForRektor?sectionId="}/>


        </Box>
      </Modal>



      <Body>
        {
          spinner ? <Spinner /> : <DataGrid
            columns={columns}
            rows={ data }
            components={{ Toolbar: GridToolbar }}
            autoHeight
            pageSize={15}
            initialState={{
              columns: {
                columnVisibilityModel: {
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
        <Box sx={style}  component={stylemini}>
          <CloseMyButtonForChild onClick={handleClose}
                                 whileHover={{ rotate: 180, scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                                 transition={{ duration: 0.3 }}
          ><RiCloseLine /></CloseMyButtonForChild>



          <SaveStaffForm
            isSection={true}
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
        <Box sx={style}>
          <CloseMyButtonForChild onClick={handleClose}
                                 whileHover={{ rotate: 180, scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                                 transition={{ duration: 0.3 }}
          ><RiCloseLine /></CloseMyButtonForChild>



          <SaveStaffForm
            isSection={true}
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



const styleMonthTable = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "80vw",
  height: "90vh",
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius:3,
  p: 4,
};


const styleEdit = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  display:'flex',
  flexDirection:'column',
  alignItems:'center',
  justifyContent: 'center',
  gap:'20px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius:3,
  p: 4,
};


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "68vw",
  padding: "20px",
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius:3,
  p: 8,
};
const stylemini=styled.div`
${medium({
  width:"75vw !important",
  padding: "15px !important"
})}}
${small({
  width:"85vw !important",
  padding: "15px !important"
})}}
${extrasmall({
  width:"90vw !important",
  padding: "10px !important"
})}}
`




const styleTable = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "80vw",
  minHeight: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius:3,
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
  margin: 5px!important;
`;


const BtnEditPosition2 = styled.button`
  width: 30px;
  height: 30px;
  background-color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border:1px solid red;
  border-radius: 0.5rem;
  color: red;
  padding: 5px!important;

  &:hover{
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
  border:1px solid ${mainColor};
  border-radius: 0.5rem;
  color: ${mainColor};
  padding: 5px!important;

  &:hover{
    transform: scale(1.1);
  }

`

const Wrapper2 = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 5px!important;
`;


const Body = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MyButton = styled.button`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
  border-radius: 0.5rem;
  background-color: ${props=>props.bg};
  border: 1px solid ${props=>props.bg};
  color: white;
  transition: 0.3s background-color, color;
  font-size: 16px;

  &:focus{
    transform: scale(0.95);
  }
  ${extrasmall({
    padding: "5px !important"
  })}
`;

const OpenMonthModalBtn = styled.button`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
  border-radius: 0.5rem;
  background-color: ${mainColor};
  border: 1px solid transparent;
  color: white;
  transition: 0.3s background-color, color;
  font-size: 16px;

  &:hover{
    background-color: #fff;
    color: ${mainColor};
    border: 1px solid ${mainColor};
  }
${extrasmall({
  padding: "5px !important",
})}
`


const BtnWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`

const Title = styled.h3`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  color: ${mainColor};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 10px;
  padding: 10px;
  .MuiDataGrid-columnHeaderTitleContainer {
    justify-content: center;
  }
`;

export default BulimStaffs;