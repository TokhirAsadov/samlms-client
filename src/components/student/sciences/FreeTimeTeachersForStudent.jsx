import React, {memo} from 'react';
import {
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {green} from "@mui/material/colors";
import Box from "@mui/material/Box";
import {FaRegCalendar} from "react-icons/fa6";
import {FaRegClock} from "react-icons/fa";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import styled from "styled-components";
import {extrasmall, medium, small} from "../../../responsiv";
import {BsFillDoorOpenFill} from "react-icons/bs";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const FreeTimeTeachersForStudent = ({open, handleClose, data}) => {

    return (
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
            <DialogTitle id="alert-dialog-title">
                Free time
            </DialogTitle>
            <DialogContent sx={{backgroundColor: green[50]}}>
                        <BoxCardContent>
                            {data?.length !== 0 && (
                                data?.map((item, index) => (
                                    <Card key={index}>
                                        <CardContent>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                justifyContent: 'center'
                                            }}>
                                                <Typography color={green[600]} fontWeight={'bold'}> <FaRegCalendar
                                                    size={18}/></Typography>
                                                <Typography color={green[600]} fontWeight={'bold'}
                                                            fontSize={14}>{item[0].day}</Typography>
                                            </Box>
                                            <Box
                                                sx={{display: 'flex', flexDirection: 'column', gap: '10px', mt: '8px'}}>
                                                {
                                                    item?.map(i2 => (
                                                        <Box key={i2} sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            border: 1,
                                                            borderColor: 'grey.500',
                                                            borderRadius: 1,
                                                            p: 0.5
                                                        }}>
                                                            <Box display={'flex'} alignItems={'center'} gap={0.5}>
                                                                <FaRegClock size={18}/>
                                                                <Typography fontSize={'14px'}>{i2.schedule}</Typography>
                                                            </Box>
                                                         <Box display={'flex'} alignItems={'center'} gap={0.5}>
                                                                <BsFillDoorOpenFill size={18}/>
                                                                <Typography fontSize={'14px'}>{i2.room}</Typography>
                                                            </Box>
                                                        </Box>
                                                    ))
                                                }
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </BoxCardContent>
                        {data?.length === 0 && (
                            <EmptyDataImg w={200} h={180}/>
                        )}
            </DialogContent>
            <DialogActions>
                <Button variant={'outlined'} onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

const BoxCardContent = styled.div`
    margin-top: 15px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    ${medium({
        gridTemplateColumns: 'repeat(3, 1fr)',
    })} ${small({
        gridTemplateColumns: 'repeat(2, 1fr)',
    })}
    ${extrasmall({
        gridTemplateColumns: 'repeat(1, 1fr)',
    })}
`;
export default memo(FreeTimeTeachersForStudent);