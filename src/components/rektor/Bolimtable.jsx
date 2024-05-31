import React from 'react';
import styled from "styled-components";
import {mainColor} from "../../utills/ServiceUrls";
import {FaUsers} from "react-icons/fa";

const Bolimtable = ({data}) => {


    return (
        <Corebox>
            <Bodybox>
                {/*head*/}
                <Rowitem>
                    <Colitem bgcolor={"#74d2fd"}><FaUsers/> Lavozmi</Colitem>
                    <Colitem bgcolor={"#74d2fd"}>Asosiy</Colitem>
                    <Colitem bgcolor={"#74d2fd"}>O'rindosh</Colitem>
                    <Colitem bgcolor={"#74d2fd"}>Soatbay</Colitem>
                    <Colitem bgcolor={"#74d2fd"}>Umumiy</Colitem>
                </Rowitem>
                {/*head*/}
                {/*body*/}
                {data.map((item,key)=>(
                    <Rowitem key={key}>
                        <Colitem>{item.lavozmi}</Colitem>
                        <Colitem>{item.asosiy}</Colitem>
                        <Colitem>{item.orindosh}</Colitem>
                        <Colitem>{item.soatbay}</Colitem>
                        <Colitem>{item.jami}</Colitem>
                    </Rowitem>
                ))}
            {/*general*/}
                <Rowitem >
                    <Colitem>Umumiy</Colitem>
                    <Colitem>{data.reduce((acc, curr) => acc + curr.asosiy, 0)}</Colitem>
                    <Colitem>{ data.reduce((acc, curr) => acc + curr.orindosh, 0)}</Colitem>
                    <Colitem>{data.reduce((acc, curr) => acc + curr.soatbay, 0)}</Colitem>
                    <Colitem>{data.reduce((acc, curr) => acc + curr.jami, 0)}</Colitem>
                </Rowitem>
            </Bodybox>
        </Corebox>
    );
};
const Colitem = styled.div`
  border-bottom: 1px solid #e0dfdf;
  border-left: 1px solid #e0dfdf;
  padding: 5px;
  width: 200px;
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.bgcolor || "none"};

`
const Rowitem = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: 500;
`
const Bodybox = styled.div`
  border: 1px solid ${mainColor};
  border-radius: 5px;
  width: 800px;
  margin: 20px auto;
`
const Corebox = styled.div`
  overflow: scroll;
  display: flex;
`
export default Bolimtable;