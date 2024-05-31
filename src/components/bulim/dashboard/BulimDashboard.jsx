import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {useSelector} from "react-redux";
import {GiTeacher} from "react-icons/gi";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import BulimChart from "./chart/BulimChart";
import axios from "axios";
import {motion as m} from "framer-motion";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import BulimStaffs from "../staffs/BulimStaffs";
import {extrasmall, medium, small} from "../../../responsiv";

const BulimDashboard = ({s}) => {


  const section = useSelector(state => s ? state?.secondBulim?.secondBulim : state?.bulim?.bulim);
  const [series,setSeries] = useState([20,8]);
  const [spinner,setSpinner] = useState(true);
  const [open,setOpen] = useState(false);

  const {headers} = getHeaders();

  useEffect(() =>{

    axios.get(BASE_URL+"/section/getStaffComeCountTodayStatistics?s="+s,{headers})
      .then(res=>{
        let item = res?.data?.obj;
        let arr = [];
        item?.comeCount!==null ? arr.push(item?.comeCount) : arr.push(0);
        item?.comeCount!==null ? arr.push(item?.allCount - item?.comeCount) : arr.push(item?.allCount);
        setSeries(() => arr);
        setSpinner(false);
      })
      .catch(err=>{
        console.log(err)
      })

    console.log(series)

  },[])


  const handleStaff = () => {
    section && setOpen(true);
  }

  const handleClose = () => {

    setOpen(false)
  }


  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <Title>{section?.name}</Title>
        </HeaderWrapper>

        <HeaderSection>

          <BodyCardSection onClick={handleStaff}>
            <BodyCardTitleWrapper>
              <BodyCardTitleIconWrapper>
                <BodyCardTitleIcon>
                  <GiTeacher/>
                </BodyCardTitleIcon>
              </BodyCardTitleIconWrapper>
              <BodyCardTitle>
                Staffs
                <BodyCardCountUsers>
                  {section ? series?.reduce((prev,current) => prev + current) ? series?.reduce((prev,current) => prev + current) : 0:0}
                </BodyCardCountUsers>
              </BodyCardTitle>
            </BodyCardTitleWrapper>
          </BodyCardSection>




          {/*** ================= staff =================== ***/}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
          >
            <Box sx={styleTable} component={styleTablemin}>
              <CloseMyButtonForChild onClick={handleClose}
                                     whileHover={{ rotate: 180, scale: 1.1 }}
                                     whileTap={{ scale: 0.9 }}
                                     transition={{ duration: 0.3 }}
              ><RiCloseLine /></CloseMyButtonForChild>
              <h2 style={{ textAlign: "center",color: mainColor }}>Staff</h2>
              <BulimStaffs s={s}/>
            </Box>
          </Modal>
          {/*** ================= staff =================== ***/}

          <HeaderSectionItem>
            {
              series?.reduce((prev,current) => prev + current) ? <BulimChart s={s} series={series} isSpinner={spinner}/> : "Not exists teachers"
            }
          </HeaderSectionItem>
        </HeaderSection>
      </Header>
    </Container>
  );
};

const styleTable = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "70vw",
  height: "95vh",
  bgcolor: '#f7f7f7',
  boxShadow: 24,
  borderRadius:3,
  p: 4,
};

const styleTablemin=styled.div`
  ${medium({
    width: "85vw !important",
    padding:"20px !important" ,
  })}
  ${small({
    width: "90vw !important",
    padding:"20px !important" ,
  })}
  ${extrasmall({
    width: "92vw !important",
    height: "90vh !important",
    padding:"15px !important",
  })}
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

const BodyCardCountUsers = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 10px;
  font-size: 60px;
  font-weight: 200;
`;

const BodyCardTitle = styled.span`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 30px;
  font-weight: 500;
`;

const BodyCardTitleIcon = styled.span`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: #f7f7f7;
  border-radius: 50%;
`;

const BodyCardTitleIconWrapper = styled.span`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 40px;
`;

const BodyCardTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 50px;
  flex-direction: column;
  padding: 5px 20px!important;
  margin-top: 10px!important;
`;

const BodyCardSection = styled.div`
  width: 450px;
  border-radius: 0.75rem;
  background-color: #fff;
  min-height: 250px;
  color: ${mainColor};
  cursor: pointer;

  &:hover{
    box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
  }
`;

const HeaderSectionItem = styled.div`
  width: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background-color: #fff;
  min-height: 250px;
  
  &:hover{
    -webkit-box-shadow: 2px 3px 5px 1px rgba(81, 159, 219, 0.43);
    -moz-box-shadow: 2px 3px 5px 1px rgba(81, 159, 219, 0.43);
    box-shadow: 2px 3px 5px 1px rgba(81, 159, 219, 0.43);
  }
`

const HeaderSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: scroll;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.span`
  display: block;
  color: ${mainColor};
`;

const HeaderWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 300px auto;
  gap: 20px;
  margin-bottom: 20px!important;
`;

const Header = styled.div`
  font-size: 24px;
  color: ${mainColor};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 10px;
  margin-top: 10px!important;
  padding: 5px 10px!important;
`;

export default BulimDashboard;