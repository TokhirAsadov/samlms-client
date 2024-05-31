import React, {useState} from 'react';
import {Card, CardContent} from "@mui/material";
import {FaClipboardList} from "react-icons/fa";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import styled from "styled-components";
import SearchForAssistant from "./SearchForAssitant";
import Box from "@mui/material/Box";
import {mainColor} from "../../utills/ServiceUrls";

const DataGridForAssistant = ({dataForPage}) => {
    const {columns,title,searchUrl}=dataForPage

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)



    return (
        <Container>
            <Title>
                <FaClipboardList size={25}/>
                <h1>{title}</h1>
            </Title>
            <Card>
                <CardContent>
                    <Box sx={{mb:2}}>
                        <SearchForAssistant setData={setData} searchUrl={searchUrl} setIsLoading={setIsLoading}/>
                    </Box>
                    <DataGrid
                        columns={columns}
                        rows={data || []}
                        loading={isLoading}
                        components={{Toolbar: GridToolbar}}
                        rowsPerPageOptions={[10, 30, 50, 70, 100]}
                        autoHeight
                        initialState={{ // hide items
                            columns: {
                                columnVisibilityModel: {
                                    currents: false,
                                    finals: false,
                                    retakeN: false,
                                },
                            },
                        }}
                    />
                </CardContent>
            </Card>
        </Container>
    );
};
const Title = styled.div`
  display: flex;
  align-items: center;
  color: ${mainColor};
  gap: 5px;

  h1 {
    margin: 0;
    font-size: 30px;
    font-weight: bold;

  }
`
const Container = styled.div`
  width: 100%;
  padding: 1rem;

  .MuiDataGrid-columnHeaderTitleContainer {
    justify-content: center;
  }
`
export default DataGridForAssistant;