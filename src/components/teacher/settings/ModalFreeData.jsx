import React, {useState} from 'react';
import Button from "@mui/material/Button";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide} from "@mui/material";
import FreeTimeTeacher from "./FreeTimeTeacher";
import {green} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import {MdFreeCancellation} from "react-icons/md";
import Box from "@mui/material/Box";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const ModalFreeData = () => {
    const [open, setOpen] = React.useState(false);
    const [modalAdd, setModalAdd] = useState(false);
    const handleClickOpenAdd = () => {
        setModalAdd(true);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Box>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Free time
                </Button>
            </Box>
            <Dialog
                open={open}
                maxWidth={'lg'}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title" sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <Typography variant={'h6'}>Free time</Typography>
                    <Button
                        variant={'contained'}
                        size={'small'}
                        color={'success'}
                        onClick={handleClickOpenAdd}
                        endIcon={<MdFreeCancellation/>}
                    >
                        add
                    </Button>
                </DialogTitle>
                <DialogContent sx={{backgroundColor:green[50]}}>
                        <FreeTimeTeacher modalAdd={modalAdd} setModalAdd={setModalAdd}/>
                </DialogContent>
                <DialogActions>
                    <Button variant={'outlined'} onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ModalFreeData;