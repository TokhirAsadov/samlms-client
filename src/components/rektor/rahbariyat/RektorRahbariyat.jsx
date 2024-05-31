import React from 'react';
import BulimDashboard from "../../bulim/dashboard/BulimDashboard";
import BulimStaffs from "../../bulim/staffs/BulimStaffs";
import styled from 'styled-components'

const RektorRahbariyat = () => {
  return (
    <Wrapper2>
      <BulimDashboard s={false}/>
      <hr/>
      <BulimStaffs s={false}/>
    </Wrapper2>
  );
};

const Wrapper2 = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
  padding-bottom: 50px!important;
`

export default RektorRahbariyat;