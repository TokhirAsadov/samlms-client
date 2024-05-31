import React, {useEffect, useState} from 'react';
import {Card, CardContent} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";

const HistoryData = () => {

    const columns = [
        {
            field: 'count',
            headerName: '№',
            sortable: true,
            width: 50,
            align: 'center',
            justifyContent: 'center',
        },
        {
            minWidth: 100,
            flex: 0.4,
            field: 'eduYear',
            headerName: 'Edu year',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            minWidth: 100,
            flex: 0.5,
            field: 'typeOfWeek',
            headerName: 'Type of week',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },
        {
            flex: 0.3,
            field: 'typeOfEducation',
            headerName: 'Type of education',
            sortable: true,
            align: 'center',
        },
        {
            minWidth: 100,
            flex: 0.3,
            field: 'weekOfEducation',
            headerName: 'Week of education',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            flex: 0.3,
            field: 'dateOfWeek',
            headerName: 'Date of week',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            flex: 0.3,
            field: 'dataType',
            headerName: 'Data type',
            editable: false,
            sortable: false,
            align: 'center',
        },
        {
            flex: 0.3,
            field: 'send',
            headerName: 'Send data',
            editable: false,
            sortable: false,
            align: 'center',
        },
    ];
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const res=[
            {
                id:"5464654",
                eduYear:"2023-2024",
                typeOfWeek:"Orientation week",
                typeOfEducation:"KUNDUZGI",
                weekOfEducation:35,
                dateOfWeek:"45,2023",
                dataType:"DEFAULT",
                send:"06.11.2023 12:00",
            },
         {
                id:"546sdf4654",
                eduYear:"2023-2024",
                typeOfWeek:"Orientation week",
                typeOfEducation:"KUNDUZGI",
                weekOfEducation:35,
                dateOfWeek:"45,2023",
                dataType:"DEFAULT",
                send:"06.11.2023 12:00",
            },
         {
                id:"5464sadf654",
                eduYear:"2023-2024",
                typeOfWeek:"Orientation week",
                typeOfEducation:"KUNDUZGI",
                weekOfEducation:35,
                dateOfWeek:"45,2023",
                dataType:"DEFAULT",
                send:"06.11.2023 12:00",
            },
        ]
        setData(res?.map((item,index)=>({
            ...item,
            count:index+1

        })))
        setIsLoading(false)

    }, []);

    return (
        <Card sx={{marginTop:3,}}>
            <CardContent>
                <DataGrid
                    columns={columns}
                    rows={data}
                    loading={isLoading}
                    components={{Toolbar: GridToolbar}}
                    pageSize={10}
                    rowsPerPageOptions={[10,20,30]}
                    autoHeight
                />
            </CardContent>
        </Card>
    );
};

export default HistoryData;