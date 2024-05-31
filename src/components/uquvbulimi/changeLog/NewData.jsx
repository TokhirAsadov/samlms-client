import React from 'react';
import {Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {IoMdSave} from "react-icons/io";
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {toast} from "react-toastify";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import moment from "moment";
import axios from "axios";

const NewData = ({data, setData,fetchData}) => {

    const {headers} = getHeaders();

    const handleConfirm = (id) => {
        setData((prevState) =>
            prevState.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status: "CONFIRM",
                    }
                    : item
            )
        );
    }
    const handleChangeDate = (e,id) => {
        setData((prevState) =>
            prevState.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        deadline: e.target.value,
                    }
                    : item
            )
        );
    }
    const handleReject = (id) => {
        setData((prevState) =>
            prevState.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status: "REJECT",
                        deadline: null,
                    }
                    : item
            )
        );
    }
    const handleSave = async () => {
        console.log(data)

        await axios.put(`${BASE_URL}/permissionForTeacherGrading/changePermissionStatus`,data,{headers})
            .then(response => {
                console.log(response," all updated")
            })
            .catch(err => {
                console.log(err,"all updated error")
            })

        toast.success("success")
        fetchData();
    }

    return (
        <>
            <Bodybox>
                <table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Full Name</th>
                        <th>Subject</th>
                        <th>Group</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((item, index) => (
                        <tr key={index}>
                            <td style={{textAlign: 'center'}}>{index + 1}</td>
                            <td className={'date_position'}>{item?.teacher?.fullName} <span>{moment(item?.createdAt).format('DD.MM.YYYY HH:mm')}</span> </td>
                            <td style={{textAlign: 'center'}}>{item?.subject?.name}</td>
                            <td style={{textAlign: 'center'}}>{item?.group?.name}</td>
                            <td>
                                <Stack direction="row" justifyContent="center">
                                    <Button
                                        color={item.status === 'CONFIRM' ? 'success' : (item.status === 'AT_PROCESS' ? 'primary' : 'error')}
                                        variant={'contained'}>{item.status}</Button>
                                </Stack>
                            </td>
                            <td>
                                <Stack direction="row" justifyContent="center">
                                    <TextField
                                        sx={{width:'175px'}}
                                        size={'small'}
                                        disabled={item.status === 'REJECT' || item.status === 'AT_PROCESS'}
                                        inputProps={{ min: moment().format('YYYY-MM-DDTHH:mm') }}
                                        type={'datetime-local'}
                                        onChange={(e)=>handleChangeDate(e,item.id)} />
                                </Stack>
                            </td>
                            <td>
                                <Stack direction="row" justifyContent="center" spacing={3}>
                                    <Button
                                        onClick={() => handleConfirm(item.id)}
                                        variant={'outlined'}
                                        size="small"
                                        color="success">Confirm</Button>
                                    <Button
                                        onClick={() => handleReject(item.id)}
                                        variant={'outlined'}
                                        size="small"
                                        color="error">Reject</Button>
                                </Stack>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Bodybox>
            {data?.length === 0 ? <EmptyDataImg w={200} h={180}/> :
                <Box mt={'15px'} display={'flex'} justifyContent={'end'}>
                    <Button
                        variant={'contained'}
                        endIcon={<IoMdSave/>}
                        disabled={data.some(item => {
                            if (item.status==='AT_PROCESS'){
                                return true;
                            }
                            if(item.status==='CONFIRM'){
                                if (item.deadline===null){
                                    return true
                                }
                            }
                        } )}
                        onClick={handleSave}
                    >Save</Button>
                </Box>}
        </>
    );
};
const Bodybox = styled.div`
  margin-top: 25px;
  width: 100%;
  overflow-x: scroll;


  table {
    min-width: 900px;
    border-collapse: collapse;
    width: 100%;
    border-radius: 5px;
    overflow: hidden;

    td, th {
      border: 1px solid #ddd;
      padding: 8px;
      font-size: 13px;
    }

    th {
      text-align: center;
    }

    tr {
      &:nth-child(even) {
        background-color: #fcf9f9;
      }
    }

    th {
      background-color: ${mainColor};
      color: white;
    }

    .date_position {
      position: relative;

      span {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        padding-right: 5px;
        color: #c9bcbc;
        font-size: 12px;
        text-align: end;
      }
    }

  }

`;
export default NewData;
