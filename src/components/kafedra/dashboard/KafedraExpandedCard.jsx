import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import React from "react";
import styled from "styled-components";
import Spinner from "../../spinner/Spinner";
import {BASE_URL} from "../../../utills/ServiceUrls";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {IoMdClose} from "react-icons/io";
import {extrasmall} from "../../../responsiv";

export default function KafedraExpandedCard({sty,data, setExpanded, openColor, isDefault, title, openTable}) {

    const columns = [
        {field: 'id', headerName: 'ID', width: 40, editable: false,},
        {
            field: 'fullName', headerName: 'Name', type: 'string', width: 300, editable: false,
            renderCell: (cellValues) => {
                return (
                    <Wrapper>
                        <img
                            src={cellValues?.row?.photo ? BASE_URL + "/attachment/download/" + cellValues?.row?.photo?.id : ""}
                            width={"50px"} height={"50px"}
                            alt={cellValues?.value}
                            style={{borderRadius: "50%"}}
                        />
                        <span style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px"
                        }}>{cellValues?.value}</span>
                    </Wrapper>
                );
            }
        },
        {field: 'login', headerName: 'Login', type: 'string', width: 300, editable: false,},
        {field: 'email', headerName: 'Email', type: 'string', width: 300, editable: false,},
        {field: 'rfid', headerName: 'RFID', type: 'string', width: 300, editable: false,},
        {field: 'passport', headerName: 'Passport', type: 'string', width: 300, editable: false,},
        {field: 'positions', headerName: 'Shtat birligi va lavozimi', type: 'string', width: 300, editable: false,},
    ];
    return (
            <Modal
                open={openTable}
                onClose={setExpanded}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={style2}>
                    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:1}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{color:isDefault ? "#0096DB" : openColor }}>
                            {title}-{data.length}
                        </Typography>
                        <IconButton onClick={setExpanded}>
                            <IoMdClose />
                        </IconButton>
                    </Box>

                   <Box>
                       {
                           !openTable ? <Spinner/>
                               :
                               <DataGrid
                                   density="comfortable"
                                   style={{
                                       width: "100%",
                                       minHeight: "600px!important",
                                       borderRadius: '0.3rem',
                                       zIndex: "1000000000000000",
                                       backgroundColor: '#fff'
                                   }}
                                   columns={columns}
                                   rows={data}
                                   components={{Toolbar: GridToolbar}}
                                   autoHeight
                                   pageSize={5}
                                   rowsPerPageOptions={[5]}
                                   initialState={{
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
                   </Box>
                </Box>
            </Modal>
    )
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    minHeight:400,
    bgcolor: 'background.paper',
    border: 'none',
    outline: 'none',
    boxShadow: 24,
    borderRadius:1,
    p: 2,
};
const style2=styled.div`
${extrasmall({
    width: '95% !important',
})}
`

const Wrapper = styled.div`
  width: 100% ;
  display: flex;
  gap: 10px;
  margin: 5px !important;
`;