import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, mainColor} from "../../../utills/ServiceUrls";
import {FaClipboardList} from "react-icons/fa";
import {Card, CardContent} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import {useSelector} from "react-redux";

const StudentResults = () => {
    const userId = useSelector(state => state.user?.user?.id)
    const allGrade = (percentage) => {
        const grade = [
            {
                alph: "A+",
                Min: 95,
                Max: 100,
            },
            {
                alph: "A",
                Min: 90,
                Max: 94,
            },
            {
                alph: "B+",
                Min: 85,
                Max: 89,
            },
            {
                alph: "B",
                Min: 80,
                Max: 84,
            },
            {
                alph: "C+",
                Min: 75,
                Max: 79,
            },
            {
                alph: "C",
                Min: 70,
                Max: 74,
            },
            {
                alph: "D+",
                Min: 65,
                Max: 69,
            },
            {
                alph: "D",
                Min: 60,
                Max: 64,
            },
            {
                alph: "F",
                Min: 0,
                Max: 59,
            },
            {
                alph: "FA",
                Min: 0,
                Max: 0,
            },
        ]

        const score = parseInt(percentage)
        if (score !== 0) {
            return grade.find(item => item.Min <= score)
        }
        return grade.find(item => item.Min <= score && item.Max <= score)

    }
    const columns = [
        {
            field: 'count',
            headerName: '№',
            sortable: true,
            width: 50,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.3,
            sortable: true,
            field: 'year',
            headerName: 'Year',
            editable: false,
        },
        {
            minWidth: 90,
            flex: 0.3,
            field: 'semester',
            headerName: 'Semester',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 200,
            flex: 1,
            field: 'subject',
            headerName: 'Subject',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 80,
            flex: 0.3,
            field: 'credit',
            headerName: 'Credit',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 80,
            flex: 0.3,
            field: 'score',
            headerName: 'Score',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.4,
            field: 'grade',
            headerName: 'Grade',
            editable: false,
            sortable: false,
            align: 'center',
        },
    ];
    const [data, setData] = useState([]);
    const [gpa, setGpa] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    function getRating(rating) {
        axios.get(BASE_URL + `/otherService/studentsResults/${rating}`)
            .then(res => {
                const resData = res.data.obj?.obj?.map((row, index) => ({
                    ...row,
                    count: index + 1,
                    grade:allGrade(row?.score)?.alph
                }));
                setData(resData)

            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    function getGpaData(id) {
        axios.get(BASE_URL + `/otherService/studentsGPA/${id}`)
            .then(res => {
                const resData = res.data.obj?.obj[0]?.stGpa
                setGpa(resData)

            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        setIsLoading(true)
        getRating(userId)
        getGpaData(userId)

    }, []);


    return (
        <Container>
            <Box display={'flex'} justifyContent={'end'}>
                <Button size={'small'} variant={'contained'} disabled >
                    GPA:{gpa ? gpa :0}
                </Button>
            </Box>
            <Title>
                <FaClipboardList size={25}/>
                <h1>Rating</h1>
            </Title>
            <Card>
                <CardContent>
                    <DataGrid
                        loading={isLoading}
                        components={{Toolbar: GridToolbar}}
                        columns={columns}
                        rows={data}
                        pageSize={30}
                        className="data-grid-container"
                        rowsPerPageOptions={[30, 60, 100]}
                        autoHeight
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
    .Mui-disabled{
        color:rgba(0, 0, 0, 1) !important;
    }
`

export default StudentResults;