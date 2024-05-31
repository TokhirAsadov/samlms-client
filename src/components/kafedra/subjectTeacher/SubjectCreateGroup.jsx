import React, {useState} from 'react';
import styled from "styled-components";
import Button from "@mui/material/Button";
import {BiArrowBack} from "react-icons/bi";
import {useNavigate, useParams} from "react-router-dom";
import {getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {extrasmall, large, medium, small, xlarge} from "../../../responsiv";
import Box from "@mui/material/Box";
import {MdDelete, MdLanguage, MdUpdate} from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import {useDispatch} from "react-redux";
import {FaLayerGroup} from "react-icons/fa";
import {VscTypeHierarchySuper} from "react-icons/vsc";
import {Menu} from "@mui/material";
import {BsThreeDotsVertical} from "react-icons/bs";

const SubjectCreateGroup = () => {
    const {subject} = useParams()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);

    const [dataId,setDataId] =useState(null)
    const menuOptions=[
        {
            title:"Update",
            icon:<MdUpdate color={"#0087be"}/>
        },
        {
            title:"Delete",
            icon:<MdDelete color={"red"} />
        }
    ]

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event,id) => {
        setAnchorEl(event.currentTarget);
        setDataId(id)
    };

    const handleCloseMenu = (label) => {
        setAnchorEl(null);
        console.log(dataId)

        if (label==="Update"){
            setOpen(true)
        }
        else {

        }

    };



    return (
        <Container>
            <TitleMain>
                <p>{subject}</p>

                <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<BiArrowBack/>}>
                    Back
                </Button>
            </TitleMain>

            <BoxCardMain>
                {Array.from({length: 5}).map((item, key) => (
                        <CardSience key={key}>
                            <Box display={'flex'} alignItems={'flex-start'}>
                            <Box width={"100%"} onClick={() => navigate(`${key}`)}>
                                <CardTitle fs="18px" fw="bold" cl={mainColor}><VscTypeHierarchySuper/> Type of
                                    education: <span>Sirtqi</span> </CardTitle>
                                <CardTitle fs="18px" fw="bold" cl={mainColor}><MdLanguage/> Language: <span> Uzbek</span>
                                </CardTitle>
                                <CardTitle fs="18px" fw="bold" cl={mainColor}><FaLayerGroup/> Groups </CardTitle>
                                <CardTitle fs="15px" fw="bold" cl="#4c4c4c"> MAN, BMAN, FIN </CardTitle>
                            </Box>

                            <IconButton
                                aria-label="actions"
                                id="long-button"
                                aria-controls={openMenu ? 'long-menu' : undefined}
                                aria-expanded={openMenu ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={(e)=>handleClick(e,key)}
                                size="small">
                                <BsThreeDotsVertical/>
                            </IconButton>
                            </Box>
                        </CardSience>
                ))}

            </BoxCardMain>




            {/******** menu actions *************/}

            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                PaperProps={{
                    style: {
                        maxHeight: 40 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {menuOptions.map((item,key) =>(
                    <MenuItem key={key} onClick={()=>handleCloseMenu(item.title)}>
                        <Box display={'flex'} gap={'5px'} alignItems={'center'}>
                            {item.icon} {item.title}
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </Container>
    );
};

const CardTitle = styled.p`
  color: ${props => props.cl || "black"};
  font-size: ${props => props.fs};
  font-weight: ${props => props.fw || "normal"};

  span {
    color: #4c4c4c;
  }
`
const CardSience = styled.div`
  border: 1px solid #f1eded;
  padding: 10px;
  border-radius: 5px;
  background-color: #FFFF;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    box-shadow: 1px 3px 8px 0 rgba(34, 60, 80, 0.2);
  }
`;

const BoxCardMain = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  padding: 10px;
  ${xlarge({
    gridTemplateColumns: "1fr 1fr 1fr  ",
  })}
  ${large({
    gridTemplateColumns: "1fr 1fr 1fr  ",
  })}
  ${medium({
    gridTemplateColumns: "1fr 1fr ",
  })}
  ${small({
    gridTemplateColumns: "1fr 1fr ",
  })}
  ${extrasmall({
    gridTemplateColumns: "1fr ",
  })}
`;


const TitleMain = styled.h1`
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    color: ${mainColor};
    font-size: 30px;
    font-weight: bold;
    ${extrasmall({
      textAlign: "center",
      fontSize: "20px",
    })}
  }
`;
const Container = styled.div`
  width: 100%;
  padding: 1rem;
`
export default SubjectCreateGroup;
