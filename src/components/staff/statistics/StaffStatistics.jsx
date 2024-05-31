import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import UserStatistics from "../../userStatistics/UserStatistics";
import styled from "styled-components";
import Spinner from "../../spinner/Spinner";

const StaffStatistics = () => {

    const [done, setDone] = useState(false);
    const [userId, setUserId] = useState(null);
    const user = useSelector(state => state?.user?.user)


    useEffect(() => {
        if (user) {
            setDone(true);
            setUserId(user?.id);
        }
    })


    return (
        <Container>
            {
                done && userId != null ? <UserStatistics date={new Date()} userId={user?.id} photo={user?.photo?.id}
                                                         userName={user?.fullName} forUser={"1024px"}/>
                    :
                    <Spinner/>
            }
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 1rem !important;
`;


export default StaffStatistics;