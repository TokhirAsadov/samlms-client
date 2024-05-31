import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {extrasmall} from "../../../responsiv";
import {useDispatch, useSelector} from "react-redux";
import {educationYearStatisticsFetching} from "../../../redux/slice/educationYear/education_year_statistics_slice";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";
import {Card, CardContent} from "@mui/material";
import TableResults from "./TableResults";

const SubjectResult = () => {
    const {headers} = getHeaders();
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const [eduYears, setEduYears] = useState([]);
    const [scien, setScien] = useState("");
    const dekanat = useSelector(state => state?.dekanat?.dekanat) || null;
    const dispatch = useDispatch()
    const [groupSelect, setGroupSelect] = useState('');
    const [groups, setGroups] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const fetchEducationYears = async () => {
        await axios.get(BASE_URL + '/education/educationYearsForSelected', {headers})
            .then(res => {
                setEduYears(res?.data?.obj);
                dispatch(fetchEducationYear(res?.data?.obj?.[0]))
            })
            .catch(err => {
                console.log(err);
            })
    }
    const fetchData = async () => {
        setIsLoading(true)
        await axios.get(`${BASE_URL}/gradeOfStudentByTeacher/getAllMiddleGrade/${educationYear?.id}?groupId=${groups?.find(g => g?.name === groupSelect)?.id}`, {headers})
            .then(res => {
                console.log(res?.data, "come on data")
                setData(res?.data?.obj.sort(compareFullNames));
            })
            .catch(err => {
                console.log(err)
                setData([])
            })
            .finally(()=>{
                setIsLoading(false)
            })
    }
    const handleChange3 = (event) => {
        event.target.value !== educationYear?.name && dispatch(educationYearStatisticsFetching())
        dispatch(fetchEducationYear(eduYears?.find(i => i?.name === event.target.value)))
    };
    const handleChange1 = (event) => {
        setScien(event.target.value);
    };
    const handleChange2 = (event) => {
        setGroupSelect(event.target.value);
    };
    useEffect(() => {

        scien && axios.get(BASE_URL + `/dekan/getGroupsNamesForDekanByFacultyId/${dekanat?.faculties?.find(faculty => faculty.shortName === scien)?.id}`, {headers})
            .then(response => {
                //console.log(response,"ffffffffffffff")
                setGroups(response?.data?.sort(function (o1, o2) {
                    if (o1?.name > o2?.name) return 1;
                    else if (o1?.name < o2?.name) return -1;
                    else return 0;
                }))
            })
            .catch(err => {
                console.log(err)
            })
    }, [scien])

    function compareFullNames(a, b) {
        const nameA = a.fullName.toUpperCase();
        const nameB = b.fullName.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    useEffect(() => {
        groupSelect && fetchData();
    }, [groupSelect])

    useEffect(() => {
        fetchEducationYears();
    }, [])


    return (
        <Container>
            <CardInput>
                <Box sx={{width: 200}}>
                    <FormControl fullWidth>
                        <InputLabel id="semestr">Semestr</InputLabel>
                        <Select
                            labelId="semestr"
                            id="demo-simple-select"
                            value={educationYear?.name}
                            label="Semistr"
                            onChange={handleChange3}
                        >
                            {eduYears.map((item, key) => (
                                <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{width: 200}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Yo'nalish</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={scien}
                            label="Yo'nalish"
                            onChange={handleChange1}
                        >
                            {dekanat?.faculties?.map((item, key) => (
                                <MenuItem key={item?.id} value={item?.shortName}>{item?.shortName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{width: 200}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label1">Group</InputLabel>
                        <Select
                            labelId="demo-simple-select-label1"
                            id="demo-simple-select1"
                            value={groupSelect}
                            label="Group"
                            onChange={handleChange2}
                        >
                            {groups?.map((item, key) => (
                                <MenuItem key={item?.id} value={item?.name}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </CardInput>

            <Card sx={{mt: 1.5}}>
                <CardContent>
                    <TableResults loading={isLoading} data={data}/>
                </CardContent>
            </Card>
        </Container>
    );
};


const CardInput = styled.div`
    margin-top: 15px;
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    ${extrasmall({
        justifyContent: "center"
    })}
`


const Container = styled.div`
    padding: 1rem;
`

export default SubjectResult;
