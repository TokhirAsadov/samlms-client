import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {extrasmall, large, medium, small, xlarge, xxlarge} from "../../../responsiv";
import './stylemap.css'
import {FaUserGraduate} from "react-icons/fa";
import {Autocomplete, TextField} from "@mui/material";
import {BiMap} from "react-icons/bi";
import {BASE_URL, mainColor} from "../../../utills/ServiceUrls";
import {GrMapLocation} from 'react-icons/gr'
import axios from "axios";

const Statistics = ({data}) => {

    const [statistics,setStatistics] = useState(data?.map(i => {
      return i?.ganders?.map(i2 => ({region: i?.region,gander:i2?.gander,count: i2?.count}))
    }).flat() || [])
    const [faculties,setFaculties] = useState([]);
    const courses = [1,2,3,4]
    const eduTypes=['KUNDUZGI','KECHKI','SIRTQI']
    const languages = ['UZBEK', "RUSSIAN", "ENGLISH"]

    const [faculty, setFaculty] = useState(null);
    const [inputValueFaculty, setInputValueFaculty] = useState('');

    const [course, setCourse] = useState(null)
    const [inputValueCourse, setInputValueCourse] = useState('');

    const [eduType, setEduType] = useState(null);
    const [inputValueEduType, setInputValueEduType] = useState('');

    const [language, setLanguage] = useState(null)
    const [inputValueLanguage, setInputValueLanguage] = useState('');




    /* Fake data */
    const Viloyatdata = [
        {
          "name": "Andijon viloyati", "students": 2000,"boys": 900, "girls": 1100,
        },
      {
        "name": "Buxoro viloyati", "students": 500, "boys": 260, "girls": 240,
      },
      {
        "name": "Farg‘ona viloyati", "students": 256, "boys": 156, "girls": 100,
      },
      {
        "name": "Jizzax viloyati", "students": 125, "boys": 85, "girls": 40,
      },
      {
        "name": "Namangan viloyati", "students": 325, "boys": 280, "girls": 45,
      },
      {
        "name": "Navoiy viloyati", "students": 452, "boys": 200, "girls": 252,
      },
      {
        "name": "Qashqadaryo viloyati", "students": 105, "boys": 65, "girls": 50,
      },
      {
        "name": "Qoraqalpog‘iston Respublikasi", "students": 304, "boys": 154, "girls": 150,
      },
      {
        "name": "Samarqand viloyati", "students": 402, "boys": 222, "girls": 180,
      },
      {
        "name": "Sirdaryo viloyati", "students": 605, "boys": 405, "girls": 200,
      },
      {
        "name": "Surxondaryo viloyati", "students": 214, "boys": 113, "girls": 101,
      },
      {
        "name": "Toshkent shahri", "students": 800, "boys": 300, "girls": 400,
      },
      {
        "name": "Toshkent viloyati", "students": 459, "boys": 209, "girls": 250,
      },
      {
        "name": "Xorazm viloyati", "students": 506, "boys": 205, "girls": 301,
      },
      {
        "name": "Chet el fuqarolari","key":"CHF", "students": 506, "boys": 205, "girls": 301,
      },
      {
        "name": "Fuqaroligi bo`lmagan","key":"BG", "students": 506, "boys": 205, "girls": 301,
      },
    ]

    let totalobj = {
        name: "Umumiy", boys: 0, girls: 0, students: 0
    }
    totalobj.boys = Viloyatdata.reduce((a, b) => a + b.boys, 0)
    totalobj.girls = Viloyatdata.reduce((a, b) => a + b.girls, 0)
    totalobj.students = Viloyatdata.reduce((a, b) => a + b.students, 0)




  useEffect(()=>{

    console.log( data?.map(i => {
      return i?.ganders?.map(i2 => ({region: i?.region,gander:i2?.gander,count: i2?.count}))
    }).flat() || [],"++++++++++++++++++++++++++++++++++++++++ ---------------------------")

    axios.get(BASE_URL+"/address/getFacultiesForStatistics")
      .then(res => {
        console.log(res?.data,"/getFacultiesForStatistics")
        setFaculties(res?.data?.obj)
      })
      .catch(err => {
        console.log(err,"/getFacultiesForStatistics")
      })
  },[])


  useEffect(()=>{
    (eduType!=null || course!=null || faculty!=null || language!=null) && axios.get(`${BASE_URL}/address/getStatistics?${eduType!=null?"eduType="+eduType+"&":""}${course!=null ? "level="+course+"&" : ""}${faculties?.find(i=>i?.name?.substring(i?.name?.indexOf(')')+1)===faculty)?.id!=null?"facultyId="+faculties?.find(i=>i?.name?.substring(i?.name?.indexOf(')')+1)===faculty)?.id+"&":""}${language!=null ?"eduLang="+ language:""}`)
      .then(res => {
        console.log(res,"statistics ---------------------------")
        setStatistics(res?.data?.obj)


      })
      .catch(err => {
        console.log(err,"error ---------------------")
      })

  },[eduType,course,faculty,language])




    return (<Container>
        <Cardgeneralinfo>
            <Cardcore>
                <Wrapperinput>

                  <Autocomplete
                    value={eduType}
                    onChange={(event, newValue) => {
                      setEduType(newValue);
                    }}
                    inputValue={inputValueEduType}
                    onInputChange={(event, newInputValue) => {
                      setInputValueEduType(newInputValue);
                    }}
                    id="controllable-states-demo eduType"
                    options={eduTypes}
                    sx={{ width: 200 }}
                    renderInput={(params) => <TextField {...params} label="Ta'lim shakli" />}
                  />

                    <Autocomplete
                        value={course}
                        onChange={(event, newValue) => {
                            setCourse(newValue);
                        }}
                        inputValue={inputValueCourse}
                        onInputChange={(event, newInputValue) => {
                            setInputValueCourse(newInputValue);
                        }}
                        id="controllable-states-demo course"
                        options={courses}
                        sx={{ width: 200 }}
                        renderInput={(params) => <TextField {...params} label="Course" />}
                    />

                    <Autocomplete
                        value={faculty}
                        onChange={(event, newValue) => {
                            setFaculty(newValue);
                        }}
                        inputValue={inputValueFaculty}
                        onInputChange={(event, newInputValue) => {
                            setInputValueFaculty(newInputValue);
                        }}
                        id="controllable-states-demo faculty"
                        options={faculties?.map(i=>i?.name?.substring(i?.name?.indexOf(')')+1)).sort()}
                        sx={{ width: 200 }}
                        renderInput={(params) => <TextField {...params} label="Ta'lim yo'nalshi" />}
                    />



                    <Autocomplete
                        value={language}
                        onChange={(event, newValue) => {
                            setLanguage(newValue);
                        }}
                        inputValue={inputValueLanguage}
                        onInputChange={(event, newInputValue) => {
                            setInputValueLanguage(newInputValue);
                        }}
                        id="controllable-states-demo language"
                        options={languages}
                        sx={{width: 200}}
                        renderInput={(params) => <TextField {...params} label="Ta'lim tili"/>}
                    />
                </Wrapperinput>
                <Infobox>
                    <Viloyatbox>
                        <Cityitem>
                            <Citytitle bgcolor={"#74d2fd"}><GrMapLocation/> Viloyatlar</Citytitle>
                            <Citystudentnum bgcolor={"#74d2fd"} ><FaUserGraduate color={"#dc3545"}/> Girls</Citystudentnum>
                            <Citystudentnum bgcolor={"#74d2fd"} ><FaUserGraduate color={"#198754"}/> Boys</Citystudentnum>
                            <Citystudentnum bgcolor={"#74d2fd"} ><FaUserGraduate color={"#000"}/> Students</Citystudentnum>
                        </Cityitem>
                        {Viloyatdata.map((item, key) => {
                         return  key<14 ? (
                            <Cityitem key={key}>
                              <Citytitle><BiMap/> {item.name}</Citytitle>
                              <Citystudentnum >{statistics?.find(i => i?.gander==="FEMALE" && i?.region===item.name)?.count || 0}</Citystudentnum>
                              <Citystudentnum>{statistics?.find(i => i?.gander==="MALE" && i?.region===item.name)?.count || 0}</Citystudentnum>
                              <Citystudentnum>{(statistics?.find(i => i?.gander==="FEMALE" && i?.region===item.name)?.count || 0) + (statistics?.find(i => i?.gander==="MALE" && i?.region===item.name)?.count || 0)}</Citystudentnum>
                            </Cityitem>) :
                           <Cityitem key={key}>
                             <Citytitle><BiMap/> {item.name}</Citytitle>
                             <Citystudentnum >{statistics?.filter(i => i?.gander==="FEMALE" && i?.region?.startsWith(item?.key))?.reduce((main,current)=> main+current?.count,0)||0}</Citystudentnum>
                             <Citystudentnum>{statistics?.filter(i => i?.gander==="MALE" && i?.region?.startsWith(item?.key))?.reduce((main,current)=> main+current?.count,0)||0}</Citystudentnum>
                             <Citystudentnum>{(statistics?.filter(i => i?.gander==="FEMALE" && i?.region?.startsWith(item?.key))?.reduce((main,current)=> main+current?.count,0)||0) + (statistics?.filter(i => i?.gander==="MALE" && i?.region?.startsWith(item?.key))?.reduce((main,current)=> main+current?.count,0)||0)}</Citystudentnum>
                           </Cityitem>
                        })}
                        <Cityitem fw={true}>
                            <Citytitle> {totalobj.name}</Citytitle>
                            <Citystudentnum >{statistics?.filter(i => i?.gander==="FEMALE")?.reduce((main,current)=> main+current?.count,0)||0}</Citystudentnum>
                            <Citystudentnum >{statistics?.filter(i => i?.gander==="MALE")?.reduce((main,current)=> main+current?.count,0)||0}</Citystudentnum>
                            <Citystudentnum >{(statistics?.filter(i => i?.gander==="FEMALE")?.reduce((main,current)=> main+current?.count,0)||0)+(statistics?.filter(i => i?.gander==="MALE")?.reduce((main,current)=> main+current?.count,0)||0)}</Citystudentnum>
                        </Cityitem>
                    </Viloyatbox>
                </Infobox>
            </Cardcore>
        </Cardgeneralinfo>
    </Container>);
};



const Citytitle = styled.div`
  flex: 1;
  min-width: 200px;
  border-bottom: 1px solid #e0dfdf;
  padding: 5px;
  display: flex;
  gap: 5px;
  justify-content: start;
  align-items: center;
  background-color: ${props => props.bgcolor || "#fff"};
`
const Citystudentnum = styled.div`
  border-bottom: 1px solid #e0dfdf;
  border-left: 1px solid #e0dfdf;
  padding:  8px;
  display: flex;
  gap: 5px;
  color: #000;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: 144px;
  background-color: ${props => props.bgcolor || "none"};
`
const Cityitem = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr;
  font-size: 14px;
  width:100%;
  font-weight: ${props => props?.fw ? "bold": 400};
`

const Infobox = styled.div`
  display: flex;
  
`
const Viloyatbox = styled.div`
  border: 1px solid ${mainColor};
  border-radius: 5px;
  margin-top: 20px;
  width: 100%;
  overflow: scroll;
  ${xxlarge({
    height:"684px",
  })}
${xlarge({
    height:"480px",
  })}
${large({
    height:"390px",
  })}
${extrasmall({
    height:"210px",
  })}
`
const Cardgeneralinfo = styled.div`
  width: 100%;
  margin: 0 auto ;
  ${extrasmall({
    padding:"5px"
  })}
`
const Cardcore = styled.div`
  margin: 0 auto;
  width: 847px;
  ${medium({
    width: "633px",
  })}
  ${small({
    width: "100%",
  })}
  ${extrasmall({
    width: "100%",
  })}
`
const Wrapperinput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  ${extrasmall({
    justifyContent: "center"
  })}

`


const Container = styled.div`
  width: 100%;
`
export default Statistics;