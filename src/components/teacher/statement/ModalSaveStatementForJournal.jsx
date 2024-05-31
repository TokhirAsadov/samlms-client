import React from 'react';
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {IoMdSend} from "react-icons/io";
import ButtonSaveStatement from "./ButtonSaveStatement";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 360,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    outline: 'none',
    p: 2,
    borderRadius: 1,
};
const ModalSaveStatementForJournal = ({open, setOpen,loadData,data,getVedimostInfo}) => {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button variant={'outlined'} onClick={handleOpen}>
                <IoMdSend size={22}/>
            </Button>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                       Statement
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{mt: 2}}>
                        Once you submit your statement, you cannot change your data!
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'end', gap: 2, mt: 2}}>
                        <Button size={'small'} variant={'outlined'} onClick={handleClose}>
                            cancel
                        </Button>
                        <ButtonSaveStatement data={data} handleClose={handleClose} loadData={loadData} getVedimostInfo={getVedimostInfo}/>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalSaveStatementForJournal;