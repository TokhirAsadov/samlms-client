import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {FaClipboardList} from "react-icons/fa";
import {Card, CardContent, Stack} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {HiPencilAlt} from "react-icons/hi";
import Modal from "@mui/material/Modal";
import {IoClose} from "react-icons/io5";
import Typography from "@mui/material/Typography";
import {extrasmall} from "../../../responsiv";
import axios from "axios";
import {toast} from "react-toastify";
import ImportDataStudents from "./importButton/ImportDataStudents";
import SearchResults from "./search/SearchResults";
import CreateGpaData from "./modals/CreateGpaData";
import {MONITORING_STUDENT_GPA_FILE} from "../../../utills/fileBase64";

const GpaStudents = () => {
    const saveFileUrl = '/workOtherService/updateGPA'
    const exampleFile = MONITORING_STUDENT_GPA_FILE
    const titleFile = 'MONITORING_STUDENT_GPA_FILE'
    const searchUrl = '/otherService/studentsGPA2/'
    const [rowNumber, setRowNumber] = useState(1000)
    const [putData, setPutData] = useState(null)
    const columns = [
        {
            field: 'count',
            headerName: '№',
            sortable: true,
            width: 50,
            align: 'center',
            justifyContent: 'center',
        },
        {
            minWidth: 100,
            flex: 0.4,
            field: 'studentId',
            headerName: 'Student id',
            sortable: false,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 150,
            flex: 1,
            field: 'fullName',
            headerName: 'Full name',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 60,
            flex: 0.3,
            field: 'course',
            headerName: 'Course',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.3,
            field: 'stGroup',
            headerName: 'Group name',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 150,
            flex: 0.7,
            field: 'yunalish',
            headerName: 'Direction',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            minWidth: 150,
            flex: 0.7,
            field: 'educationType',
            headerName: 'Education type',
            editable: false,
            sortable: false,
            align: 'center',
        },


        {
            minWidth: 90,
            flex: 0.3,
            field: 'fails',
            headerName: 'Fails',
            editable: false,
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 90,
            flex: 0.3,
            field: 'stGpa',
            headerName: 'GPA',
            editable: false,
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.3,
            field: 'passport',
            headerName: 'Passport',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            flex: 0.4,
            field: 'action',
            headerName: 'Action',
            editable: false,
            sortable: false,
            align: 'center',
            renderCell: (cellValue) => {
                return <Stack direction={"row"} spacing={2} justifyContent="center">
                    <IconButton
                        aria-label="change"
                        color="success"
                        onClick={() => handleUpdateData(cellValue.row)}
                    >
                        <HiPencilAlt/>
                    </IconButton>
                </Stack>
            }
        },
    ];
    const {headers} = getHeaders();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [openCreate, setOpenCreate] = useState(false)
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 30,
    });
    const handleUpdateData = (data) => {
        const body = {
            id: data.id,
            studentId: data.studentId,
            passport: data.passport,
            stGroup: data.stGroup,
            unv: data.unv,
            educationType: data.educationType,
            fullName: data.fullName,
            course: data.course,
            yunalish: data.yunalish,
            fails: data.fails,
            stGpa: data.stGpa
        }
        console.log(body)
        setPutData(body)
        setOpenCreate(true)
    }
    const handlePageChange = (newPage) => {
        setPagination((prev) => ({...prev, page: newPage}));
    };

    const handlePageSizeChange = (newPageSize) => {
        setPagination((prev) => ({...prev, pageSize: newPageSize}));
    };

    const fetchData = () => {
        setIsLoading(true)
        axios.get(`${BASE_URL}/workOtherService/getGPAs?page=${pagination.page + 1}&size=${pagination.pageSize}`)
            .then(res => {
                //console.log(res?.data?.obj?.content, " keldi data")
                setRowNumber(res.data.obj?.totalElements)
                setData(res?.data?.obj?.content?.map((row, index) => ({
                    ...row,
                    count: index + 1,
                })))
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {

        fetchData()
        console.log(data)

    }, [pagination]);

    const fetchDelete = () => {
        deleteId && axios.delete(`${BASE_URL}/example/${deleteId}`, {headers})
            .then(response => {
                handleCloseDelete();
                toast.success("Delete item")
            })
            .catch(err => {
                //console.log(err)
                toast.error('Error deleting')
            })
    }
    const handleOpenDelete = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    }

    const handleCloseDelete = () => {
        setDeleteId(null);
        setOpenDelete(false);
    }
    const handleCloseCreate = () => {
        setOpenCreate(false);
        setPutData(null)
    }
    return (
        <Container>
            <ImportDataStudents titleFile={titleFile} fetchData={fetchData} saveFileUrl={saveFileUrl}
                                urlBase={exampleFile}/>
            <Title>
                <FaClipboardList size={25}/>
                <h1>GPA</h1>
            </Title>
            <Card>
                <CardContent>
                    <Box display={'flex'} justifyContent={'space-between'} mb={2}>
                        <SearchResults setData={setData} searchUrl={searchUrl} pagination={pagination}
                                       fetchData={fetchData}/>
                    </Box>

                    <DataGrid
                        rowCount={rowNumber}
                        columns={columns}
                        rows={data || []}
                        loading={isLoading}
                        components={{Toolbar: GridToolbar}}
                        pageSize={pagination.pageSize}
                        page={pagination.page}
                        rowsPerPageOptions={[10, 30, 50, 70, 100]}
                        paginationMode={'server'}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        autoHeight
                        initialState={{ // hide items
                            columns: {
                                columnVisibilityModel: {
                                    action: false,
                                    studentId: false,
                                    yunalish: false,
                                    educationType: false,
                                    passport: false,
                                },
                            },
                        }}
                    />
                </CardContent>
            </Card>

            {/*modal delete*/}
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={style2}>
                    <ModalTitle>
                        <h5>
                            Delete
                        </h5>
                        <CloseBtnModal onClick={handleCloseDelete}> <IoClose size={22}/></CloseBtnModal>
                    </ModalTitle>
                    <Box>
                        <Stack sx={{height: "100px"}} direction="row" justifyContent="center" alignItems="center">
                            <Typography variant="h6" color="black">
                                Do you want to delete !
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="flex-end"
                               alignItems="center">
                            <Button variant="outlined" onClick={handleCloseDelete}>Cancel</Button>
                            <Button variant="contained" color="error" onClick={fetchDelete}>
                                Ok
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>

            {/*modal create*/}
            <Modal
                open={openCreate}
                onClose={handleCloseCreate}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleResult} component={style2}>
                    <ModalTitle>
                        <h3>
                            {putData ? 'Update' : 'Create'}
                        </h3>
                        <CloseBtnModal onClick={handleCloseCreate}> <IoClose size={22}/></CloseBtnModal>
                    </ModalTitle>
                    <Box>
                        <CreateGpaData closeBtnFn={handleCloseCreate} fetchData={fetchData} putData={putData}/>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

const ModalTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
        color: black;
    }

    h5 {
        color: red;
    }

`
const CloseBtnModal = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 50%;
    border: none;
    background-color: ${mainColor};
    color: white;
    font-size: 12px;
`
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
const styleResult = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "15px",
    borderRadius: "8px",
};
const Title = styled.div`
    display: flex;
    align-items: center;
    color: ${mainColor};
    gap: 5px;

    h1 {
        margin: 0;
        font-size: 30px;
        font-weight: bold;

    }
`

const Container = styled.div`
    width: 100%;
    padding: 1rem;

    .MuiDataGrid-columnHeaderTitleContainer {
        justify-content: center;
    }
`

export default GpaStudents;