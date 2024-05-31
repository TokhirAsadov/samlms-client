import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor, TOKEN} from "../../../utills/ServiceUrls";
import axios from "axios";
import {GiTeacher} from "react-icons/gi";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import Spinner from "../../spinner/Spinner";
import {AnimatePresence, motion as m} from "framer-motion";
import {useDispatch, useSelector} from "react-redux";
import {fetchRektorTeachers} from "../../../redux/actions/rektor/rektor_teachers_action";
import {rektorTeachersFetching} from "../../../redux/slice/rektor/rektor_teachers_slice";
import ModalRektorTeachersPage from "../ModalRektorTeachersPage";
import {useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";
import {extrasmall, large, medium, small, xlarge} from "../../../responsiv";
import {Skeleton} from "@mui/material";
import ExportBtnToExcelForRektor from "../staff/ExportBtnToExcelForRektor";

const RektorTeacher = () => {

    const {headers} = getHeaders();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [spinner, setSpinner] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const [facultyName, setFacultyName] = useState(false)

    const rektorTeacher = useSelector(state => state?.rektorTeachers);

    useEffect(() => {
        setIsLoading(true)
        axios.get(BASE_URL + "/user/rektorTeacher", {headers})
            .then(res => {
                // console.log(res?.data,"r t")
                setData(res?.data)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const handleCloseModal = () => {
        setOpenModal(false);
        setSpinner(true)
    }

    const dispatch = useDispatch();

    const handleOpenModal = (id, name) => {
        setFacultyName(name);
        setOpenModal(true);
        dispatch(rektorTeachersFetching('loading'))
        axios.get(BASE_URL + "/user/getKafedraTeachersDataForRektorByKafedraId?id=" + id, {headers})
            .then(res => {
                dispatch(fetchRektorTeachers(res?.data?.obj))
            })
            .catch(err => {
                console.log(err)
            })

    }

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
                                        <GiTeacher/>
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
                                <h2 style={{textAlign: "center", color: mainColor, marginBottom: '10px'}}>{facultyName}</h2>
                                {
                                    rektorTeacher?.rektorTeachersLoadingStatus === "loading" ? <Spinner/> :
                                        <ModalRektorTeachersPage
                                            colName={"Teachers"}
                                            isTeacherUrl={true}
                                            kafedraMudiri={rektorTeacher?.rektorTeachers?.kafedraMudiri}
                                            all={rektorTeacher?.rektorTeachers?.allTeachers}
                                            come={rektorTeacher?.rektorTeachers?.comeTeachers}
                                            noCome={rektorTeacher?.rektorTeachers?.noComeTeachers}
                                            facultyName={facultyName}
                                            kafedraId={rektorTeacher?.rektorTeachers?.id}
                                        />
                                }
                            </Box>
                        </Modal>
                    }
                </AnimatePresence>
                {/*** ================= teacher =================== ***/}
            </WrapperSection>
            {
                !isLoading && <Box display={'flex'} justifyContent={'end'} sx={{width: '100%', my: 3}}>
                    <ExportBtnToExcelForRektor direction={`Data_teachers`} dataToExcel={data}/>
                </Box>
            }
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
    //margin-right: 10px;
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

const WrapperSection = styled.div`
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
    ${extrasmall(
            {
                gridTemplateColumns: "repeat(1,1fr)",
            })}


`;


export default RektorTeacher;