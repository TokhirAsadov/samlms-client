import {motion} from "framer-motion";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import React from "react";
import styled from "styled-components";
import Spinner from "../../../../spinner/Spinner";
import {BASE_URL} from "../../../../../utills/ServiceUrls";
import {IoMdClose} from "react-icons/io";

export default function GroupExpandedCard({ data,setExpanded,openColor,isDefault,title,openTable }){

  const columns = [
    { field: 'id', headerName: 'ID', width: 40, editable: false },
    { field: 'fullName', headerName: 'Name',type: 'string', width: 300, editable: false,
      renderCell: (cellValues) => {
        return (
          <Wrapper>
            {
              cellValues?.row?.photo?.id &&
              <img
                src={cellValues?.row?.photo ? BASE_URL+"/attachment/download/" + cellValues?.row?.photo?.id : ""}
                width={"50px"} height={"50px"}
                alt={cellValues?.value}
                style={{borderRadius: "50%"}}
              />
            }
            <span style={{
              display:"flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize:"14px"
            }}>{cellValues?.value}</span>
          </Wrapper>
        );
      }},
    { field: 'email', headerName: 'Email',type: 'string', width: 300, editable: false, },
    { field: 'passport', headerName: 'Passport',type: 'string', width: 300, editable: false, },
    { field: 'fails', headerName: 'Fails',type: 'int', width: 300, editable: false, },
  ];

  return (
    <motion.div
      className="KafedraExpandedCard"
      style={{
        background: `${isDefault ? "#0096DB" : openColor}`,
        zIndex:"1",
        width: '900px',
        height: '600px',
        position:"absolute",
        top:"-100px",
        left:"-20px",
        // marginLeft:"100px",
        display: 'flex',
      }}
      transition={{duration: '0.2'}}
      layoutId="kafedraId"
    >
      <div onClick={setExpanded} style={{ width: '40px',height:'40px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',alignSelf: "flex-end", cursor: "pointer", color: "white",backgroundColor:'rgba(255,255,255,0.5)' }}>
          <IoMdClose />
      </div>
      <span>{title}</span>
      <Body>
        {
          !data ? <Spinner />
          :
            <DataGrid
            checkboxSelection
            density="comfortable"
            style={{
              width: "100%",
              minHeight: "600px!important",
              borderRadius: '1rem',
              zIndex: "1000000000000000",
              backgroundColor: '#fff'
            }}
            columns={columns}
            rows={data}
            components={{Toolbar: GridToolbar}}/*** print and excel ****/
            autoHeight
            pageSize={5}
            initialState={{ // hide items
              ...data.initialState,
              columns: {
                columnVisibilityModel: {
                  id: false,
                  login: false,
                  card: false,
                  rfid: false,
                  email: false,
                  passport: false
                },
              },
            }}
          />
        }
      </Body>
    </motion.div>
  )
}

const Body = styled.div`
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.75rem 0!important;
  border-radius: 1rem;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  margin: 5px!important;
`;