import React from 'react';
import {AiOutlineCloudDownload, AiOutlineCloudUpload} from "react-icons/ai";
import Box from "@mui/material/Box";
import FileSaver from 'file-saver'
import {BASE_URL, TOKEN, TokenType} from "../../../../utills/ServiceUrls";
import axios from "axios";
import {toast} from "react-toastify";
import {STUDENTS_FOR_DEAN_BASE64} from "../../../../utills/fileBase64";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const ImportExportButton = () => {
    const [openBg, setOpenBg] = React.useState(false);
    const savePhoto = (e) => {

        const url = BASE_URL+"/student/uploadStudentsFromDean";
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        const token=localStorage.getItem(TOKEN)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization':TokenType+token,
                'Access-Control-Allow-Origin': '*'
            }
        }
        setOpenBg(true);

        axios.post(url, formData, config)
            .then((response) => {
                toast.success(response?.data?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            })
            .catch(err=>{

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
            .finally(()=>{
                setOpenBg(false)
            })

        e.target.value = null;
    }

    const downloadFileFromBase64 = () => {
        let dataFile = STUDENTS_FOR_DEAN_BASE64;
        let sliceSize = 1024;
        let byteCharacters = atob(dataFile);
        let bytesLength = byteCharacters.length;
        let slicesCount = Math.ceil(bytesLength / sliceSize);
        let byteArrays = new Array(slicesCount);
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++ sliceIndex){
            let begin = sliceIndex * sliceSize;
            let end = Math.min(begin + sliceSize,bytesLength);
            let bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; i++,offset++){
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        let blob = new Blob(byteArrays, { type: 'application/vnd.ms-excel' });
        FileSaver.saveAs(new Blob([blob],{}),"STUDENTINFO.xlsx");
    }

    return (
        <Box sx={{
            my: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        }}>
            <Button
             variant={'contained'}
             component={'label'}
             startIcon={<AiOutlineCloudUpload />}
             // onClick={savePhoto}
            >
                Import Students from file

                <input type="file" hidden
                       onChange={savePhoto}
                       accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
                />
            </Button>

            <Button
                variant={'contained'}
                startIcon={ <AiOutlineCloudDownload />}
                onClick={()=>downloadFileFromBase64()}>
                example file
            </Button>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBg}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};


export default ImportExportButton;
