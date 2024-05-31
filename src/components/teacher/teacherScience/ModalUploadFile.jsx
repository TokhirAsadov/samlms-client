import React, {useState} from 'react';
import styled from "styled-components";
import {AiFillWarning} from "react-icons/ai";
import {BASE_URL, mainColor, TOKEN, TokenType} from "../../../utills/ServiceUrls";
import {ImFolderUpload} from "react-icons/im";
import {IoSaveSharp} from "react-icons/io5";
import Box from "@mui/material/Box";
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {toast} from "react-toastify";
import Button from "@mui/material/Button";

const ModalUploadeFile = ({lineId, handleClose, fetchData}) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMsg, setErrorMsg] = useState(false);
    const [progress, setProgress] = useState(null);
    const [checked, setChecked] = React.useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const [urlName, setUrlName] = useState("")
    const [fileName, setFileName] = useState("")
    const [file, setFile] = useState(null)

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };


    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const validateSelectedFile = (e) => {
        e.preventDefault();
        const MAX_FILE_SIZE = 20480 // 20MB

        if (!selectedFile) {
            setErrorMsg("Please choose a file");
            return
        }

        const fileSizeKiloBytes = selectedFile.size / 1024

        if (fileSizeKiloBytes > MAX_FILE_SIZE) {
            setErrorMsg("File size is greater than maximum limit");
            return
        }

        if (selectedFile) {
            const fileFormat = /(\.jpg|\.jpeg|\.png|\.doc|\.docx|\.xls|\.xlsx|\.txt|\.ppt|\.pptx|\.pdf|\.zip|\.rar)$/i;
            const fileName = selectedFile.name
            const formatFile = fileName.substr(fileName.lastIndexOf("."));

            const isAllowed = fileFormat.test(formatFile)
            if (!isAllowed) {
                setErrorMsg("Invalid File Type.");
                return
            }
            setErrorMsg("")
        }

        setErrorMsg("")
        console.log(selectedFile, fileName)
        setProgress(50);


        const url = `${BASE_URL}/topicFile/upload/${lineId}/${checked ? urlName : fileName}?type=${checked ? "URL" : "FILE"}&fileUrl=${fileUrl}`;
        const formData = new FormData();
        formData.append('file', selectedFile);
        const token = localStorage.getItem(TOKEN)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            }
        }

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
                // setOpenBg(false)
                handleClose();
                fetchData();
            })
            .catch(err => {

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


        setSelectedFile(null)

    };


    const savePhoto = (e) => {
        e.preventDefault()
        const url = `${BASE_URL}/topicFile/upload/${lineId}/${checked ? urlName : fileName}?type=${checked ? "URL" : "FILE"}&fileUrl=${fileUrl}`;
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem(TOKEN)
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': TokenType + token,
                'Access-Control-Allow-Origin': '*'
            }
        }
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
                handleClose();
            })
            .catch(err => {

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
    }


    function LinearProgressWithLabel(props) {
        return (
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{width: '100%', mr: 1}}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
                <Box sx={{minWidth: 35}}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }

    LinearProgressWithLabel.propTypes = {
        /**
         * The value of the progress indicator for the determinate and buffer variants.
         * Value between 0 and 100.
         */
        value: PropTypes.number.isRequired,
    };


    return (<Container>
        <WarningBox>
            <h4><AiFillWarning/> <span>Warning</span></h4>
            <ul>
                <li>File size max: 20mb</li>
                <li>Select only 1 file</li>
                <li>File format: doc, pdf, ppt, xlsx, txt, rar, zip, jpg, png</li>
                <li>URL</li>
            </ul>
        </WarningBox>
        <ChooseTypeBox>
            <LablsSwitch cl={!checked && `${mainColor}`}>FILE</LablsSwitch>
            <Switch
                color="default"
                checked={checked}
                onChange={handleChange}
                inputProps={{'aria-label': 'controlled'}}
            />
            <LablsSwitch cl={checked && `${mainColor}`}>URL</LablsSwitch>
        </ChooseTypeBox>
        {!checked ? (
            <form onSubmit={validateSelectedFile}>

                <InputUploadeFileBox>
                    <input type="file" name="file" id="file"
                           accept=".jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx, .txt, .ppt, .pptx, .pdf, .zip, .rar"
                           onChange={handleFileChange}/>
                    <label htmlFor="file"><ImFolderUpload/>
                        <span>{selectedFile ? (selectedFile?.name?.length < 15 ? selectedFile?.name : selectedFile?.name?.substring(0, 15) + "....") : "Choose a file"}</span></label>
                </InputUploadeFileBox>

                <TextField
                    sx={{marginTop: "20px"}}
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    type="text"
                    fullWidth
                    required
                    id="outlined-required"
                    label="File name"
                    size="small"
                />


                <ValidateSelectedFileBox>
                    <p className="error-message">{errorMsg}</p>
                </ValidateSelectedFileBox>

                {/*----progress bar---*/}

                {progress && <Box sx={{width: '100%'}}>
                    <LinearProgressWithLabel value={progress}/>
                </Box>}

                <BtnBox>
                    <Button
                        variant={'contained'}
                        color={'success'}
                        endIcon={<IoSaveSharp size={18}/>}
                        type="submit"
                    >
                        Save
                    </Button>
                </BtnBox>
            </form>) : (
            // form url
            <form onSubmit={savePhoto}>

                <TextField
                    value={urlName}
                    onChange={(e) => setUrlName(e.target.value)}
                    type="text"
                    fullWidth
                    required
                    id="outlined-required"
                    label="URL name "
                    size="small"
                />

                <TextField
                    sx={{mt: 1.5}}
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    type="url"
                    fullWidth
                    required
                    id="outlined-required"
                    label="URL"
                    size="small"
                />

                <BtnBox>
                    <Button
                        variant={'contained'}
                        color={'success'}
                        endIcon={<IoSaveSharp size={18}/>}
                        type="submit"
                    >
                        Save
                    </Button>
                </BtnBox>
            </form>

        )}

    </Container>);
};


const ChooseTypeBox = styled.div`
    margin: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`
const LablsSwitch = styled.h6`
    color: ${props => props.cl || '#000'};
    font-size: 15px;
`

const ValidateSelectedFileBox = styled.div`
    margin: 10px 0;

    p {
        color: red;
    }

`;

const BtnBox = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: end;
    padding-right: 15px;
`

const BtnSave = styled.button`
    padding: 5px 20px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: #198754;
    border: 1px solid #198754;
    background-color: #ffffff;

    :hover {
        background-color: #198754;
        color: #ffffff;
    }
`

const InputUploadeFileBox = styled.div`

    input {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }

    input + label {
        width: 150px;
        padding: 7px 10px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 700;
        color: white;
        background-color: ${mainColor};
        display: inline-flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }

    input + label:hover {
        background-color: #007eb0;
    }

`

const WarningBox = styled.div`
    margin: 20px 0;
    border-radius: 8px;
    padding: 0.5em;
    background-color: rgba(225, 174, 74, 0.72);

    h4 {
        color: #000000;
        font-size: 20px;
        display: flex;
        gap: 5px;
        align-items: center;
    }

    li {
        color: rgba(255, 0, 0, 0.82);
        font-weight: bold;
        list-style-position: inside;
    }
`
const Container = styled.div`
`
export default ModalUploadeFile;
