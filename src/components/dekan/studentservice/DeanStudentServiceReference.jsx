import React, {useState} from 'react';
import styled from "styled-components";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {Card, Stack} from "@mui/material";
import NewStudentService from "./NewStudentService";
import OldStudentService from "./OldStudentService";
import {BsArrowLeft, BsClockHistory} from "react-icons/bs";

const DeanStudentServiceReference = () => {
    const [cardBtn, setCardBtn] = useState(true)

    return (
        <Container>
            <Box mt={3}>
                <Stack direction="row" justifyContent={'end'} spacing={2} my={2}>
                    {cardBtn ? <Button endIcon={<BsClockHistory/>} onClick={() => setCardBtn(false)} variant={"contained"}>
                        history
                    </Button> : <Button startIcon={<BsArrowLeft/>} onClick={() => setCardBtn(true)} variant={"outlined"}>
                        back
                    </Button>}

                </Stack>
            </Box>
            <Card>
                {cardBtn ? (
                    <NewStudentService/>
                ) : (
                    <OldStudentService/>
                )}


            </Card>

        </Container>
    );
};


const Container = styled.div`
  .MuiDataGrid-columnHeaderTitleContainer {
    justify-content: center;
  }
  .data-grid-container {
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
  }
  .MuiDataGrid-cell {
    border-right: 1px solid #ccc;
    padding: 8px;
  }
  .MuiDataGrid-colCellTitle {
    border-bottom: 1px solid #ccc;
    padding: 8px;
    font-weight: bold;
  }
  .MuiDataGrid-cell:focus {
    outline: none !important;
    border: none !important;
  }
`

export default DeanStudentServiceReference;
