import * as React from 'react';
import {useEffect, useState} from 'react';
import {BASE_URL, mainColor, REKTOR, STUDENT_ALL_DATA} from "../../../../utills/ServiceUrls";
import styled from "styled-components";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import RektorTalabaForModal from "./RektorTalabaForModal";
import {RiCloseLine} from "react-icons/ri";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import axios from "axios";
import {Card, CardContent} from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "95vw",
    height: "95vh",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 5,
};

export default function RektorTalabaTable() {
    const [spinner, setSpinner] = useState(true);
    const [group, setGroup] = useState("");
    const [dataModal, setDataModal] = useState({});
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const studentDataFetch = (userId, accountNonLocked) => {
        setGroup(null);
        axios.get(BASE_URL + STUDENT_ALL_DATA + userId)
            .then(res => {
                setDataModal(prev => ({
                    ...prev,
                    ...res.data,
                    accountNonLocked
                }))
                setGroup(() => res.data.groupData.name)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const columns = [
        {
            field: 'count',
            headerName: '№',
            width: 50,
            align: 'center',
            editable: false
        },
        {
            field: 'fullName',
            headerName: 'Full Name',
            minWidth: 350,
            flex: 1,
            editable: false,
            renderCell: (cellValues) => {
                return (
                    <StudentFullName onClick={(event) => {
                        console.log(cellValues.id);
                        studentDataFetch(cellValues.id, cellValues.row?.accountNonLocked);
                        handleOpen()
                    }}>{cellValues.row.fullName}</StudentFullName>
                );
            }
        },
        {field: 'fail', headerName: 'Fail', width: 80, align: 'center', editable: false},
        {
            field: 'missedLesson',
            headerName: 'Missed Lesson',
            flex: 0.7,
            minWidth: 120,
            align: 'center',
            editable: false,
        },
        {
            field: 'indebtedness',
            headerName: 'Indebtedness',
            flex: 0.7,
            minWidth: 120,
            align: 'center',
            editable: false,
        },
        {field: 'email', headerName: 'Email', flex: 0.7,align:'center', minWidth: 150, editable: false},
        {field: 'passport', headerName: 'Passport', flex: 1,align:'center', minWidth: 120, editable: false},
        {field: 'login', headerName: 'Login', flex: 1,align:'center', minWidth: 120, editable: false},
        {field: 'cardNo', headerName: 'Card Num', flex: 1,align:'center', minWidth: 120, editable: false},
    ];

    const [data, setData] = useState([])


    useEffect(() => {
        setSpinner(() => true);
        axios.get(BASE_URL + REKTOR.GET_STUDENT_RESULTS_FOR_REKTOR)
            .then(res => {
                setSpinner((prev) => !prev);
                setData(() => res.data.map((item, index) => ({...item, count: index + 1})))
            })
            .catch(err => {
                console.log(err);
            })
    }, [])


    return (
        <Container>
            <Card sx={{width: '100%'}}>
                <CardContent>

                    <DataGrid
                        columns={columns}
                        rows={data || []}
                        rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
                        components={{Toolbar: GridToolbar}}
                        autoHeight
                        loading={spinner}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    email: false,
                                    cardNo: false,
                                    login: false,
                                    passport: false
                                },
                            },
                            pagination: {
                                pageSize: 30
                            }
                        }}
                    />

                </CardContent>
            </Card>

            <Modal
                hideBackdrop
                open={open && group !== null}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                {
                    <Box sx={style}>
                        <CloseButtonForChild onClick={handleClose}><RiCloseLine/></CloseButtonForChild>
                        {
                            group && <RektorTalabaForModal
                                data={dataModal && dataModal}
                                group={group}
                                accountLocked={dataModal?.accountNonLocked}
                                results={dataModal && dataModal.results}
                            />
                        }
                    </Box>
                }
            </Modal>
        </Container>
    );
}

const Image = styled.img.attrs({
    src: ""
})`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
    margin: 5px !important;
`;


const Button = styled.button`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    background-color: #fff;
    padding-left: 5px;
    font-size: 14px;
    border: none;
    cursor: pointer;
    color: #000;
    transition: all 0.2s ease;
    letter-spacing: 1.2px;

    &:focus {
        transform: scale(0.95);
    }
`;


const StudentTel = styled.span`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    color: gray;
`;

const StudentFullName = styled.span`
    width: 100%;
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    cursor: pointer;
`;

const CloseButtonForChild = styled.button`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    color: ${mainColor};
    font-size: 26px;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;
`;


const Container = styled.div`
    width: 100%;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`;
