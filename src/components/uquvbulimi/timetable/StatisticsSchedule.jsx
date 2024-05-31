import React from 'react';
import styled from "styled-components";
import DataGridCustomize from "../../dataGridCustomize/DataGridCustomize";

const StatisticsSchedule = () => {
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
            flex: 1,
            field: 'name',
            headerName: 'Name',
            sortable: true,
            align: 'center',
            justifyContent: 'center'
        },

    ]
    return (
        <Container>
            <DataGridCustomize columns={columns} rows={[]} loading={false} />
        </Container>
    );
};
const Container=styled.div`
width: 100%;
`
export default StatisticsSchedule;