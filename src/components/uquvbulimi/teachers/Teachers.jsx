import React from 'react';
import RektorTeacher from "../../rektor/teacher/RektorTeacher";
import styled from "styled-components";

const Teachers = () => {
    return (
        <Container>
            <RektorTeacher/>
        </Container>
    );
};
const Container=styled.div`
padding: 1rem;
`

export default Teachers;