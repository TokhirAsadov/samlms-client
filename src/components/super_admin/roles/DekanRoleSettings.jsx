import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import axios from "axios";
import {BASE_URL} from "../../../utills/ServiceUrls";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {toast} from "react-toastify";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


const animatedComponents = makeAnimated();

const DekanRoleSettings = () => {

    const [userOption, setUserOption] = useState([]);
    const [dekanatOption, setDekanatOption] = useState([]);
    const [eduOption, setEduOption] = useState([
        {
            value: "KUNDUZGI",
            label: "KUNDUZGI"
        },
        {
            value: "KECHKI",
            label: "KECHKI"
        },
        {
            value: "SIRTQI",
            label: "SIRTQI"
        },
    ]);
    const [user, setUser] = useState(null);
    const [edu, setEdu] = useState(null);
    const [ids, setIds] = useState(null);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        axios.get(BASE_URL + "/dekanat/getDatasForSavedDekan")
            .then(res => {
                console.log(res?.data, " ------------------- ")
                setUserOption(res?.data?.obj?.users)
                setDekanatOption(res?.data?.obj?.dekanats)
            })
            .catch(err => {
                console.log(err)
            })
    }


    const onSubmit = () => {
        //console.log({userId:user?.value,dekanatId: ids?.value},"submit")
        if (!user) {
            toast.warning("Iltimos, Dekan tanlang.")
        } else if (!ids) {
            toast.warning("Iltimos, Dekanat tanlang.")
        } else if (!edu) {
            toast.warning("Iltimos, Education type tanlang.")
        }
        axios.post(BASE_URL + "/dekan/save", {userId: user?.value, dekanatId: ids?.value, edu: edu?.value})
            .then(res => {
                if (res.status === 201) {
                    toast.success("Dekan yaratildi.")
                }
                fetchData();
            })
            .catch(err => {
                console.log(err)
                toast.error(err.response.message)
            })
    }

    return (
        <Container>
            <Wrapper>
                <Section>
                    <label htmlFor="cre_dek_select">Dekan tanlang:</label>
                    <Select
                        id={"cre_dek_select"}
                        width='300px'
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti={false}
                        options={userOption}
                        onChange={e => setUser(e)}
                        value={user}
                        name={user}
                        isClearable={true}
                    />
                </Section>
                <Section>
                    <label htmlFor="cre_dek_select">Dekanat tanlang:</label>
                    <Select
                        id={"cre_dek_select"}
                        width='300px'
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti={false}
                        options={dekanatOption}
                        onChange={e => setIds(e)}
                        value={ids}
                        name={ids}
                        isClearable={true}
                    />
                </Section>
                <Section>
                    <label htmlFor="cre_dek_select">Education Type:</label>
                    <Select
                        id={"cre_dek_select"}
                        width='300px'
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti={false}
                        options={eduOption}
                        onChange={e => setEdu(e)}
                        value={edu}
                        name={edu}
                        isClearable={true}

                    />
                </Section>
                <Box display={'flex'} justifyContent={'end'}>
                    <Button sx={{width: "200px"}} variant={'contained'} onClick={onSubmit}>Save</Button>
                </Box>
            </Wrapper>
        </Container>
    );
};



const Section = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;

  & > div {
    width: 400px;
  }
`

const Wrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 1rem;
`;

export default DekanRoleSettings;