import React, {useEffect, useState} from 'react';
import {BASE_URL, DEKAN, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import styled from "styled-components";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import FormForItem from "../../form/FormForItem";
import Modal from "@mui/material/Modal";
import axios from "axios";
import {toast} from "react-toastify";
import Spinner from "../../spinner/Spinner";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {FaEdit, FaPlus, FaTrash} from "react-icons/fa";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};


const DekanKafedra = () => {

  const [spinner,setSpinner] = useState(true);
  const [updateItem,setUpdateItem] = useState({})

  const [data,setData] = useState([
    { id: 1, name: "Tohir Asadov", state: "123456",},
    { id: 2, name: "Tohir Asadov", state: "123456",},
  ]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 40, editable: false },
    { field: 'nameEn', headerName: 'Kafedra',type: 'string', width: 300, editable: false, },
    { field: 'nameRu', headerName: 'Russian Name',type: 'string', width: 300, editable: false, },
    { field: 'nameUz', headerName: 'Uzbek Name',type: 'string', width: 300, editable: false, },
    { field: 'state', headerName: 'State',type: 'string', width: 240, editable: false,
      renderCell: (cellValues) => {
        return (
          <Wrapper>
            <Button
              bg={"blue"}
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                getUpdateItem(cellValues.id);
              }}
            >
              <FaEdit />
              Update
            </Button>

            <Button
              bg={"red"}
              variant="contained"
              color="danger"
              onClick={(e) => {
                e.preventDefault();
                checkDelete(cellValues.id);
              }}
            >
              <FaTrash />
              Delete
            </Button>
          </Wrapper>
        );
      }},
  ];

  const { headers } = getHeaders();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  }

  const addModalOpen = () => {
    setUpdateItem({...updateItem,id:null,nameEn:null,nameRu:null,nameUz:null})
    handleOpen();
  }

  const checkDelete = (id) => {
    axios.get(BASE_URL+DEKAN.GET_KAFEDRA_BY_ID+id, { headers })
      .then(res => {
        if (res.status===200){
          if (window.confirm("Do you agree to delete "+res.data?.obj?.nameEn+" kafedra?")){
            onDelete(id);
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const onDelete = (id) => {
    axios.delete(BASE_URL+DEKAN.DELETE_KAFEDRA+id,{ headers })
      .then(res => {
        if (res.status === 204){
          toast.success("Deleted kafedra successfully!...")
          setData(data.filter(item => item.id!==id));
          getAllBuildings();
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  const getUpdateItem = (id) => {
    axios.get(BASE_URL+DEKAN.GET_KAFEDRA_BY_ID+id, { headers })
      .then(res => {
        setUpdateItem(res.data.obj);
        if (res.data?.obj!==null){
          handleOpen();
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const onUpdate = (building) => {
    axios.put(BASE_URL+DEKAN.UPDATE_KAFEDRA, building,{ headers })
      .then(res => {
        if (res.status===202) toast.success("Kafedra updated successfully!...")
        getAllBuildings();
      })
      .catch(err => {
        console.log(err);
      })
  }

  const saveKafedra = (form) => {
    if (form?.id===""){
      form.id = null
    }

    axios.post(BASE_URL+DEKAN.CREATE_KAFEDRA, form,{ headers })
      .then(response => {
        toast.success("Kafedra success saved");
        // console.log(response)
        getAllBuildings();
      })
      .catch(err => {
        console.log(err);
        toast.error(err.message);
      });
  }

  useEffect(() => {
    getAllBuildings()
  },[])

  const getAllBuildings = () => {
    axios.get( BASE_URL+DEKAN.ALL_KAFEDRA,{headers})
      .then(res => {
        let item = res.data.obj.sort((a,b) => a.name > b.name ? 1 : -1);
        setSpinner(false);
        setData(item);
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Container>
      <Title>Table of Kafedra <Button onClick={addModalOpen} padding={"8px 10px"} float={"right"} width={"150px"} bg={"lime"}><FaPlus/> Add Kafedra</Button></Title>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <CloseButtonForChild onClick={handleClose}><RiCloseLine /></CloseButtonForChild>
          <FormForItem
            title={updateItem?.id!==null ? "UPDATE KAFEDRA" : "ADD KAFEDRA"}
            formArr={[
              {
                label: "id",
                name: "id",
                placeholder:"Enter id of build",
                type: "text",
              },
              {
                label: "add build",
                name: "nameEn",
                placeholder:"English name",
                type: "text",
              },
              {
                label: "add build",
                name: "nameRu",
                placeholder:"Russian name",
                type: "text",
              },
              {
                label: "add build",
                name: "nameUz",
                placeholder:"Uzbek name",
                type: "text",
              }
            ]}
            submitBtn={updateItem?.id!==null ? "Update":"Save"}
            onSubmit={ (form)=> updateItem?.id!==null ? onUpdate(form) : saveKafedra(form)}
            updateItem={updateItem}
          />
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
            pageSize={5}
            initialState={{ // hide items
              ...data.initialState,
              columns: {
                columnVisibilityModel: {
                  id: false,
                  nameRu: false,
                  nameUz:false
                },
              },
            }}
          />
        }
      </Body>
    </Container>
  );
};

const Body = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButtonForChild = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center; 
  background-color: rgba(255,255,255,0.6);
  border-radius: 50%;
  color: ${mainColor};
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



const Button = styled.button`
  float: ${props => props.float};
  width: ${props => props.width ? props.width : "100%"};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  gap: 10px;
  background-color: ${props => props.bg};
  padding: ${props => props.padding ? props.padding : "5px 10px" };
  font-size: 16px; 
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease; 
  letter-spacing: 1.2px;
  
  &:focus{
    transform: scale(0.95);
  }
`;

const Title = styled.h3`
  color: ${mainColor};
`;

const Container = styled.div`
  height: 100%;
  min-height: 500px;
  border-radius: 10px;
  margin-top: 10px!important;
  margin-left: 50px!important;
  padding: 5px 10px!important; 
`;


export default DekanKafedra;