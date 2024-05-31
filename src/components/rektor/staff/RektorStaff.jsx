import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor, TOKEN} from "../../../utills/ServiceUrls";
import {useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {FaUserTie} from "react-icons/fa";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import Spinner from "../../spinner/Spinner";
import ModalRektorTeachersPage from "../ModalRektorTeachersPage";
import {AnimatePresence, motion as m} from 'framer-motion'
import {rektorStaffsFetching} from "../../../redux/slice/rektor/rektor_staffs_slice";
import {fetchRektorStaffs} from "../../../redux/actions/rektor/rektor_staffs_action";
import {extrasmall, large, medium, small, xlarge} from "../../../responsiv";
import {Skeleton} from "@mui/material";
import ExportBtnToExcelForRektor from "./ExportBtnToExcelForRektor";

const RektorStaff = ({s}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(TOKEN);
        const decode = jwtDecode(token);
        let roleName2 = decode?.roles.find(i => i.roleName === 'ROLE_REKTOR')?.roleName;
        let roleName3 = decode?.roles.find(i => i.roleName === 'Kengash raisi')?.roleName;

        if (roleName2 !== "ROLE_REKTOR" && roleName3 !== "Kengash raisi") {
            navigate("/login");
        }
    }, [])


    const [data, setData] = useState([]);
    const [section, setSection] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false);


    useEffect(() => {
        setIsLoading(true)
        axios.get(BASE_URL + `/user/rektorStaff?s=${s}`, {headers})
            .then(res => {
                // console.log(res?.data,"r s")
                setData(res?.data)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [s])


    const dispatch = useDispatch();
    const {headers} = getHeaders();

    const handleOpenModal = (id, name) => {
        setSection(name);
        setOpenModal(true);
        dispatch(rektorStaffsFetching('loading'))

        axios.get(BASE_URL + `/user/getSectionStaffDataForRektorBySectionId?id=${id}&s=${s}`, {headers})
            .then(res => {
                // console.log(rektorTeacher)
                dispatch(fetchRektorStaffs(res?.data?.obj))

                console.log(res?.data, "'''''''''''  ''''''''''''")
            })
            .catch(err => {
                console.log(err)
            })

    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const rektorStaffs = useSelector(state => state?.rektorStaffs);

    const variants = {
        visible: index => ({
            scale: 1,
            transition: {
                delay: index * 0.1,
            },
        }),
        hidden: {scale: 0},
    }

    return (
        <>
            <WrapperSection>
                {
                    !isLoading ? data?.map((i, index) => {
                        return <BodyCardSection
                            key={i.id}
                            onClick={() => handleOpenModal(i.id, i.name)}
                            custom={index}
                            animate="visible"
                            variants={variants}
                            initial="hidden"
                        >
                            <BodyCardTitleWrapper>
                                <BodyCardTitleIconWrapper>
                                    <BodyCardTitleIcon>
                                        <FaUserTie/>
                                    </BodyCardTitleIcon>
                                    <ComeCount
                                        color={i?.data === null ? false : i?.data?.comeCount !== null}>{i?.data === null ? 0 : i?.data?.comeCount === null ? 0 : i?.data?.comeCount}</ComeCount>
                                </BodyCardTitleIconWrapper>
                                <hr/>
                                <BodyCardTitle>
                                    <span style={{fontSize: "14px"}}>{i?.name}</span>
                                    <BodyCardCountUsers>{i?.data === null ? 0 : i?.data?.allCount}</BodyCardCountUsers>
                                </BodyCardTitle>
                            </BodyCardTitleWrapper>
                        </BodyCardSection>
                    }) : (
                        Array.from({length: 5}).map((_, i) => (
                            <Skeleton sx={{transform: 'scale(1,1)'}} key={i} height={180}/>
                        ))
                    )
                }
            </WrapperSection>
            {
                !isLoading && <Box display={'flex'} justifyContent={'end'} sx={{width: '100%', my: 3}}>
                    <ExportBtnToExcelForRektor direction={`Data_${s ? 'staff' : 'deans'}`} dataToExcel={data}/>
                </Box>
            }

            {/*** ================= teacher =================== ***/}
            <AnimatePresence>
                {
                    openModal && <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"

                        component={m.div}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.3}}
                        exit={{opacity: 0}}
                    >
                        <Box sx={styleTable}>
                            <CloseMyButtonForChild
                                onClick={handleCloseModal}
                                whileHover={{rotate: 180, scale: 1.1}}
                                whileTap={{scale: 0.9}}
                                transition={{duration: 0.3}}
                            ><RiCloseLine/></CloseMyButtonForChild>
                            <h2 style={{textAlign: "center", color: mainColor, marginBottom: '10px'}}>{section}</h2>
                            {
                                rektorStaffs?.rektorStaffsLoadingStatus === "loading" ? <Spinner/> :
                                    <ModalRektorTeachersPage
                                        colName={"Staffs"}
                                        isTeacherUrl={false}
                                        kafedraMudiri={rektorStaffs?.rektorStaffs?.boss}
                                        all={rektorStaffs?.rektorStaffs?.allStaffs}
                                        come={rektorStaffs?.rektorStaffs?.comeStaff}
                                        noCome={rektorStaffs?.rektorStaffs?.noComeStaff}
                                        facultyName={section}
                                        kafedraId={rektorStaffs?.rektorStaffs?.id}
                                    />
                            }
                        </Box>
                    </Modal>
                }
            </AnimatePresence>
            {/*** ================= teacher =================== ***/}


        </>
    );
};


const styleTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90vw",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};
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


const ComeCount = styled.div`
    align-self: flex-end;
    color: ${props => props.color ? "lime" : "red"};
    display: flex;

`

const BodyCardCountUsers = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 30px;
    font-weight: 200;
`;

const BodyCardTitle = styled.span`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
`;

const BodyCardTitleIcon = styled.span`
    margin-top: -35px;
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    background: #deedf4;
    border-radius: 15%;
`;

const BodyCardTitleIconWrapper = styled.span`
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 24px;
`;

const BodyCardTitleWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 5px 15px !important;
    margin-top: 10px !important;
`;

const BodyCardSection = styled(m.div)`
    height: 150px;
    width: 100%;
    display: flex;
    background-color: #fff;
    border-radius: 10px;
    color: ${mainColor};
    cursor: pointer;

    &:hover {
        box-shadow: 2px 3px 5px 1px rgba(81, 159, 219, 0.43);
    }
`;


const WrapperSection = styled(m.div)`
    margin: 30px 0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    padding: 10px 0 !important;

    ${xlarge({
        gridTemplateColumns: "repeat(3,1fr)",
    })}
    ${large({
        gridTemplateColumns: "repeat(3,1fr)",
    })}
    ${medium({
        gridTemplateColumns: "repeat(2,1fr)",
    })}
    ${small({
        gridTemplateColumns: "repeat(2,1fr)",
    })}
    ${extrasmall({
        gridTemplateColumns: "repeat(1,1fr)",
    })}
`;


export default RektorStaff;