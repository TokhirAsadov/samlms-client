import React from 'react';
import SectionNav from "../SectionNav";
import {Outlet} from "react-router-dom";
import styled from "styled-components";

const LayoutStudentsForRektor = () => {

    const data = [
        {
            name: 'Courses',
            path: '/rektor/students/'
        },
        {
            name: 'Directions',
            path: '/rektor/students/direction'
        },
        {
            name: 'Group',
            path: '/rektor/students/group'
        },
        {
            name: 'Attendance',
            path: '/rektor/students/attendance'
        },
        {
            name: 'Students',
            path: '/rektor/students/allStudents'
        },
    ]

    return (
        <Container>
            <SectionNav data={data}/>
            <Outlet/>
        </Container>
    );
};
const Container = styled.div`
  margin-top: 1rem;
  width: 100%;
  padding: 5px;
`
export default LayoutStudentsForRektor;
