import React, {useState} from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {AiOutlineCloudUpload} from "react-icons/ai";
import Backdrop from "@mui/material/Backdrop";
import axios from "axios";
import {BASE_URL, mainColor, TOKEN, TokenType} from "../../../../utills/ServiceUrls";
import styled from "styled-components";
import {toast} from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import {Stack} from "@mui/material";

const ImportDataStudents = ({saveFileUrl,urlBase,fetchData,titleFile}) => {

    const [openBg, setOpenBg] = useState(false);
    const [progress, setProgress] = useState(0)

    const handleSendFiles = (e) => {
        setOpenBg(true)
        const file=e.target.files[0];
        const url=BASE_URL+saveFileUrl;
        const token=localStorage.getItem(TOKEN)
        const config={
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            },
            onUploadProgress: data => {
                setProgress(Math.round((100 * data.loaded) / data.total))
            },
        }
        const formData = new FormData();
        formData.append('file', file)
        console.log(file)

        axios.put(url, formData, config)
            .then(res => {
                console.log(res)
                toast.success('Uploaded file successfully')
                fetchData()
            })
            .catch(err => {
                console.log(err)
                toast.error('Upload failed')
            })
            .finally(() => setOpenBg(false))
        //reset
        e.target.value = null;

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
        link.download = `${titleFile}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <Box display={'flex'} justifyContent={'end'}>

            <Stack direction={'row'} spacing={2}>
                <Button
                    startIcon={<AiOutlineCloudUpload/>}
                    variant={'contained'}
                    component={'label'}
                    onChange={handleSendFiles}
                >
                    import file
                    <input
                        accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                        type={'file'}
                        hidden
                    />
                </Button>

                <Button variant={'contained'} onClick={downloadDecodedFile}>
                    example file
                </Button>
            </Stack>

            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={openBg}
            >
                <BackDropMain>
                   {/* <div className="progress-bar" style={{width: `${progress}%`}}>
                        {progress}%
                    </div>*/}
                    <Box display={'flex'} justifyContent={'center'}>
                        <CircularProgress color="inherit" />
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
export default ImportDataStudents;