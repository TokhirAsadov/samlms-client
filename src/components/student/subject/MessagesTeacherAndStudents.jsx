import React, {useEffect, useRef, useState} from 'react';
import {Dialog, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {IoMdClose} from "react-icons/io";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import {IoSendSharp} from "react-icons/io5";
import {mainColor} from "../../../utills/ServiceUrls";
import styled from "styled-components";

const MessagesTeacherAndStudents = ({open, setOpen, scroll}) => {
    const currentId = 3
    const fakeData = [{id: 1, message: "how are you"}, {id: 2, message: "how are you"}, {
        id: 3,
        message: "how are you a teacher"
    }]
    const descriptionElementRef = useRef(null);
    const [text, setText] = useState("")
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (open) {
            const {current: descriptionElement} = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const handleSave = (e) => {
        e.preventDefault()

        //fetch data
        console.log(text)
        setText("")
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
        >
            <DialogTitle
                sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>Messages <IconButton
                onClick={handleClose} aria-label="close" size="large">
                <IoMdClose/>
            </IconButton></DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText
                    ref={descriptionElementRef}
                    tabIndex={-1}
                    width={"350px"}
                    minHeight={"300px"}
                    maxHeight={"600px"}
                    component={contentText}
                >

                    {fakeData.map((item, index) => (
                        <Box component="div" key={index} display="flex" marginTop="15px"
                             justifyContent={currentId === item.id ? "end" : "flex-start"}>
                            <Box>
                                <MessageItem>
                                    <h5>Fayzulla Bekchanov</h5>
                                    <p>{item.message}</p>
                                </MessageItem>
                                <DateBox justify={currentId === item.id ? "end" : "start"}>
                                    <p>01.08.2023 15:00</p>
                                </DateBox>
                            </Box>

                        </Box>
                    ))}


                </DialogContentText>
            </DialogContent>
            <Box
                component="form"
                autoComplete="off"
                sx={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}
                onSubmit={handleSave}
            >

                <Input
                    value={text}
                    onChange={event => setText(event.target.value)}
                    fullWidth
                    placeholder="message"/>

                <IconButton type={"submit"}>
                    <IoSendSharp color={mainColor}/>
                </IconButton>

            </Box>

        </Dialog>
    );
};
const contentText = styled.div`

`;

const MessageItem = styled.div`
    max-width: 200px;
    background: #ece9e9;
    border-radius: 5px;
    padding: 10px;

    h5 {
        font-size: 14px;
        color: ${mainColor};
    }

`
const DateBox = styled.div`
    text-align: ${props => props.justify};

    p {
        font-size: 11px;
    }

`
export default MessagesTeacherAndStudents;
