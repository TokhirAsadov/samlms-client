import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Box from "@mui/material/Box";
import PdfDocument from "../../../utills/pdfFiles/PdfStatement";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {fetchEducationYear} from "../../../redux/actions/educationYear/education_year_actions";
import {educationYearStatisticsFetching} from "../../../redux/slice/educationYear/education_year_statistics_slice";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {extrasmall} from "../../../responsiv";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import {Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

function Statement() {
    const {headers} = getHeaders();
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const [eduYears, setEduYears] = useState([]);
    const [scien, setScien] = useState("");
    const dekanat = useSelector(state => state?.dekanat?.dekanat) || null;
    const dispatch = useDispatch()
    const [groupSelect, setGroupSelect] = useState('');
    const [groups, setGroups] = useState([]);
    const fakeData = []
    const [data, setData] = useState([]);
    const [loadData,setLoadData] = useState(false);
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
        setLoadData(true)
        await axios.get(BASE_URL + `/group/getStudentsOfGroupWithTodayStatisticsAndScoreForJournal/${educationYear?.id}?groupName=${groupSelect}`,{headers})
            .then(res => {
                setLoadData(false)
                console.log(res?.data,"come on data")
                setData(res?.data?.obj.sort(compareFullNames));
            })
            .catch(err=>{
                console.log(err)
                setLoadData(false)
                setData([])
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
        groupSelect && dispatch(educationYearStatisticsFetching())

        groupSelect && fetchData();
    }, [groupSelect])
    console.log(data)
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

            <Card>
                <CardContent>
                    <Box display={'flex'} justifyContent={'end'}>
                        <PdfDocument content={data}/>
                    </Box>

                    <Bodybox>
                        <table>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>
                                    <Box display='flex' gap={"8px"} alignItems={'center'} justifyContent={'center'}>
                                        <p>Full name</p>
                                    </Box>
                                </th>
                                <th>ID number</th>

                                <th>&sum; CC</th>
                            </tr>
                            </thead>
                            {loadData && <tr>
                                <td colSpan={4}>
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress />
                                    </Box>
                                </td>
                            </tr> }
                            <tbody>
                            {data?.length>0 && data?.map((item, key) => {

                                return (
                                    <tr key={key}>
                                        <td style={{textAlign: "center"}}>{key + 1}</td>
                                        <td><Typography textAlign={'start'}>{item?.fullName}</Typography></td>
                                        <td>
                                            {item?.login}
                                        </td>

                                        <td>
                                               0
                                        </td>

                                    </tr>
                                )
                            })
                            }
                            </tbody>

                        </table>

                        {data?.length===0 && <EmptyDataImg w={200} h={180}/>}
                    </Bodybox>
                </CardContent>
            </Card>

        </Container>
    );
}

const Bodybox = styled.div`
  margin-top: 25px;
  width: 100%;
  overflow-x: scroll;

  table {
    min-width: 1000px;
    border-collapse: collapse;
    width: 100%;
    text-align: center;
    border-radius: 5px;
    overflow: hidden;

    td, th {
      border: 1px solid #ddd;
      padding: 8px;
      font-size: 14px;
    }

    tr {
      &:nth-child(even) {
        background-color: #f2f2f2;
      }
    }

    th {
      background-color: ${mainColor};
      color: white;
    }
  }
  
`;
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
const Container=styled.div`
  width: 100%;
  padding: 1rem;
`
export default Statement;