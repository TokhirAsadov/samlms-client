import {motion} from "framer-motion";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import React from "react";
import moment from "moment";
import styled from "styled-components";
import Spinner from "../../../spinner/Spinner";
import {BASE_URL} from "../../../../utills/ServiceUrls";
import {IoMdClose} from "react-icons/io";

export default function BulimExpandedCard({data, setExpanded, openColor, isDefault, title, openTable}) {

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
        {
            field: 'time',
            headerName: `Kelgan vaqti \n${moment(new Date()).format("DD.MM.YYYY")}`,
            type: 'string',
            width: 180,
            editable: false,
            renderCell: (cellValues) => {
                console.log(cellValues)
                console.log(moment(cellValues?.row?.time).format("DD.MM.YYYY HH:mm:ss"), " ---- time bugun ")
                return (
                    <Wrapper>
                        {cellValues?.row?.time === null ? "-" : moment(cellValues?.row?.time).format("DD.MM.YYYY HH:mm:ss")}
                    </Wrapper>
                );
            }
        },
        {field: 'positions', headerName: 'Shtat birligi va lavozimi', type: 'string', width: 300, editable: false,},
    ];

    return (
        <motion.div
            className="KafedraExpandedCard"
            style={{
                background: `${isDefault ? "#0096DB" : openColor}`,
                zIndex: "100",
                minHeight:"300px",
                position: "absolute",
                display: 'flex',
            }}
            transition={{duration: '0.2'}}
            layoutId="kafedraId"
        >
            <div onClick={setExpanded} style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                alignSelf: "flex-end",
                cursor: "pointer",
                color: "white",
                backgroundColor: 'rgba(255,255,255,0.5)'
            }}>
<IoMdClose />
            </div>
            <span>{title}{" - "}{data?.length}</span>
            <Body>
                {
                    !openTable ? <Spinner/>
                        :
                        <DataGrid
                            density="comfortable"
                            style={{
                                width: "100%",
                                minHeight: "600px!important",
                                borderRadius: '1rem',
                                zIndex: "1000",
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
  margin: 1.75rem 0 !important;
  border-radius: 1rem;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  margin: 5px !important;
`;