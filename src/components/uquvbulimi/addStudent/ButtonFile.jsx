import React, {useState} from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {AiOutlineCloudUpload} from "react-icons/ai";
import Backdrop from "@mui/material/Backdrop";
import axios from "axios";
import styled from "styled-components";
import {toast} from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import {ButtonGroup, Stack} from "@mui/material";
import {BASE_URL, mainColor, TOKEN, TokenType} from "../../../utills/ServiceUrls";

const ButtonFile = ({saveFileUrl, urlBase, getHistoryUploadFile}) => {
    const [openBg, setOpenBg] = useState(false);
    const [fileUsers, setFileUsers] = useState(null)

    const handleSendFiles = () => {
        if (!fileUsers) return toast.warning('Empty')
        setOpenBg(true)
        const url = BASE_URL + saveFileUrl;
        const token = localStorage.getItem(TOKEN)
        const formData = new FormData();
        formData.append('file', fileUsers)
        console.log(fileUsers)

        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            },
        })
            .then(res => {
                console.log(res)
                toast.success(res?.data?.message ||'Uploaded file successfully')
                getHistoryUploadFile()
                setFileUsers(null)
            })
            .catch(err => {
                console.log(err)
                toast.error(err.response.data.message || 'Error')
            })
            .finally(() => {
                setOpenBg(false)
            })

    }
    const downloadDecodedFile = () => {
        const base64Data = urlBase;
        const decodedData = atob(base64Data);
        const uint8Array = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; ++i) {
            uint8Array[i] = decodedData.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], {type: 'application/xlsx'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'file.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleChangeDataFile = (e) => {
        setFileUsers(e.target.files[0])
    }
    return (
        <Box display={'flex'} justifyContent={'end'}>

            <Stack direction={'row'} spacing={2}>
                <ButtonGroup disableElevation
                             aria-label="save file button group">
                    <Button
                        variant={'outlined'}
                        component={'label'}
                        onChange={handleChangeDataFile}
                    >
                        {fileUsers ? fileUsers?.name : 'select users from file'}
                        <input
                            accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                            type={'file'}
                            hidden
                        />
                    </Button>
                    <Button onClick={handleSendFiles} variant={'contained'} endIcon={<AiOutlineCloudUpload/>}>
                        save
                    </Button>
                </ButtonGroup>

                <Button variant={'contained'} onClick={downloadDecodedFile}>
                    example file
                </Button>
            </Stack>

            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={openBg}
            >
                <BackDropMain>
                    <Box display={'flex'} justifyContent={'center'}>
                        <CircularProgress color="inherit"/>
                    </Box>
                </BackDropMain>
            </Backdrop>
        </Box>
    );
};
const BackDropMain = styled.div`
    position: relative;
    width: 95%;
    height: 30px;
    //background-color: #ccc;
    border-radius: 7px;
    overflow: hidden;

    .progress-bar {
        background-color: ${mainColor};
        color: #fff;
        text-align: center;
        line-height: 30px;
        width: 0;
        position: absolute;
        transition: width 0.1s;
    }
`
export default ButtonFile;