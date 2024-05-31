import React, {useEffect, useState} from 'react';
import moment from "moment";
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import Button from "@mui/material/Button"
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import axios from "axios";
import Box from "@mui/material/Box";
import {Skeleton} from "@mui/material";
import {RiCloseLine} from "react-icons/ri";
import Modal from "@mui/material/Modal";
import EnterAndOutTimesOfTeacher from "./EnterAndOutTimesOfTeacher";
import {useSelector} from "react-redux";
import SimpleBar from "simplebar-react";
import {motion as m} from 'framer-motion'
import {extrasmall, small} from "../../responsiv";
import * as XLSX from 'xlsx'
import {FaCircleCheck, FaCircleXmark} from "react-icons/fa6";
import Error from "../error/Error";
import Typography from "@mui/material/Typography";

const UsersMonthStatistics = ({userName, kafedraId, date, forUser, url, isTeacher, colName}) => {

    const [time, setTime] = useState(date);
    const [days, setDays] = useState([]);
    const [isError, setIsError] = useState(false)

    const [data, setData] = useState(null);

    const [timeModal, setTimeModal] = useState(null);
    const [timeModalItem, setTimeModalItem] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = (item, index) => {
        setTimeModal(new Date(time.getFullYear(), time.getMonth(), item))
        setTimeModalItem(data[index]?.monthly[item]);
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const {headers} = getHeaders();

    const getDay = (date) => {
        return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate()
    }

    const toDate = (date) => {
        return new Date(date);
    }

    const prevMonth = () => {
        setTime(new Date(time.getFullYear(), time.getMonth() - 1))
    }

    const nextMonth = () => {
        setTime(new Date(time.getFullYear(), time.getMonth() + 1))
    }

    useEffect(() => {
        setDays(() => Array.from(Array(moment(time).daysInMonth()).keys()).map(i => i + 1))
        getData();
    }, [time])

    const [counts, setCounts] = useState([])

    const counter = () => {
        data?.map(i => {
            let count = 0;
            days?.map(item => {
                if (i?.monthly[item] != null) {
                    count++;
                }
            })
            setCounts(prevState => [...prevState, count])
            return i
        })
    }

    useEffect(() => {
        setData(isTeacher ? teachers : staffs);
    }, [])

    const [check, setCheck] = useState(false);

    useEffect(() => {
        setCounts([]);
        counter();
    }, [check])

    const [spinner, setSpinner] = useState(true);
    const getData = async () => {
        setSpinner(true)
        await axios.get(`${BASE_URL + url + kafedraId}&date=${getDay(time)}`, {headers})
            .then(res => {
                setData(res?.data?.obj?.all);
                setIsError(false)
                setCheck(p => !p)
            })
            .catch(err => {
                console.log(err)
                setIsError(true)
            })
            .finally(()=>{
                setSpinner(false)
            })
    }

    const teachers = useSelector(state => state?.rektorTeachers?.rektorTeachers?.allTeachers)
    const staffs = useSelector(state => state?.rektorStaffs?.rektorStaffs?.allStaffs)

    const exportToExcel = () => {
        if (!data) {
            return;
        }
        const exportData = [
            [colName, ...days.map(day => day.toString()), 'Total'], // Add 'Total' column header
            ...data.map(i => {
                const rowData = [i.fullName];
                let total = 0;

                days.forEach(item => {
                    const date = new Date(time.getFullYear(), time.getMonth(), item);
                    if (date <= new Date()) {
                        const value = i.monthly[item] ? '1' : '0';
                        rowData.push(value);
                        total += parseInt(value);
                    } else {
                        rowData.push('');
                    }
                });
                rowData.push(total.toString());
                return rowData;
            }),
        ];

        const ws = XLSX.utils.aoa_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'exported_data.xlsx');
    };


    return (
        <>
            <Container style={{width: `${forUser ? forUser : "100%"}`}}>
      <ImageWrapper>
        <UserName>{userName}</UserName>
      </ImageWrapper>
      <hr/>

      <Month>
        <Button style={buttonStyles} onClick={prevMonth}><GrFormPrevious/></Button>
        <input type="month" id="start" name="start"
               min="2022-04"
               value={moment(time).format("YYYY-MM")}
               onChange={e => setTime(new Date(e.target.value))}
               style={monthInput}
        />
        <Button style={buttonStyles} onClick={nextMonth}><GrFormNext /></Button>
      </Month>

      <Wrapper>
        {
          !spinner ?
              isError ? <Typography textAlign={'center'} fontSize={20} fontWeight={'bold'} color={'red'}>Error</Typography>:
            <>
              <WrapperDay>
                {
                  days?.map((item,index) => {
                    return <>
                    {item===1 && <Teacher sz={true} key={index}>{colName}</Teacher>}
                    <Day key={item}>
                      <NumberDay>
                        {item}
                        <WeekDay>{moment(new Date(time.getFullYear(), time.getMonth(), item)).format("ddd")}</WeekDay>
                      </NumberDay>
                    </Day>
                    {item===days?.length && <Day>
                      <NumberDay>
                        {'\u2211'}
                      </NumberDay>
                    </Day>}
                    </>
                  })
                }
              </WrapperDay>

                {
                  data?.map((i,index) => {
                    return <WrapperDay>
                      <Teacher>{i.fullName}</Teacher>
                      {
                        days?.map(item => {
                          return <>
                          <Day key={item}>
                            <StatisticBox color={i.monthly[item]} onClick={() => handleOpen(item,index)}>
                              {
                                new Date(time.getFullYear(), time.getMonth(), item) <= new Date() ?
                                  i.monthly[item] ? <FaCircleCheck /> : <FaCircleXmark />: ""
                              }
                            </StatisticBox>
                          </Day>
                            {item===days?.length && <Day>
                              <StatisticBox color={counts[index] !== 0} bg={counts[index] !== 0 ? "green" : "red"}>
                                {counts[index]}
                              </StatisticBox>
                            </Day>}
                          </>
                        })
                      }
                    </WrapperDay>
                  })
                }

            </>
            :
              <Skeleton animation="wave" width={forUser ? forUser:"100%"} height={120}/>
        }
      </Wrapper>
      <Box display={'flex'} justifyContent={'end'} mt={1}>
        <Button onClick={exportToExcel} variant={'contained'} >Export</Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={styleTable} component={stylecomp} >
          <CloseMyButtonForChild onClick={handleClose}
                                 whileHover={{ rotate: 180, scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}
                                 transition={{ duration: 0.3 }}
          ><RiCloseLine /></CloseMyButtonForChild>
          <EnterAndOutTimesOfTeacher time={timeModal} item={timeModalItem}/>
        </Box>
      </Modal>

    </Container>
        </>
    );
};


const scrollStyle = {
    width: "1200px",
    height: 318,
    margin: "0 auto"
}

const Teacher = styled.div`
  flex: 3;
  display: flex;
  font-size: ${props => props.sz ? "12px" : "8px"};
  border: 1px solid ${mainColor};
  align-items: center;
  justify-content: center;
  padding: 5px 10px !important;
`

const CloseMyButtonForChild = styled(m.button)`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${mainColor};
  border-radius: 50%;
  color: white;
  font-size: 26px;
  border: none;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: ${mainColor};
`

const ImageWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const StatisticBox = styled.button`
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  border: 1px solid ${mainColor};
  color: ${props => props.bg ? '#fff' : props.color ? 'green' : 'red'};
  background-color: ${props => props.bg ? props.bg : "#fff"};
  transition: 0.1s all ease-in;

  &:hover {
    filter: brightness(.7);
  }

  &:focus {
    transform: scale(0.95);
  }
`;

const WeekDay = styled.span`
  font-size: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NumberDay = styled.div`
  width: 100%;
  min-height: 40px;
  border: 1px solid ${mainColor};
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Day = styled.div`
  flex: 1;
  height: 47px;
  display: flex;
  //flex-direction: column;
`;

const WrapperDay = styled.div`
  display: flex;
  width: 1200px;
  margin: 0 auto;
`;

const Month = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 24px;
`;

const Wrapper = styled.div`
  width: 100%;
    height: 70vh;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  margin-top: 25px !important;
`

const Container = styled.div`
  width: 800px;
  padding: 5px 10px !important;
`;

const buttonStyles = {
    width: "40px!important",
    height: "40px!important",
    fontSize: "24px",
}

const monthInput = {
    border: "none"
}

const styleTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50vw",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};
const stylecomp = styled.div`
  ${small({
    width: "80vw !important"
  })}
  ${extrasmall({
    width: "90vw !important"
  })}
`


export default UsersMonthStatistics;