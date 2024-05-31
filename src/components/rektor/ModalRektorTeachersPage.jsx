import React, {memo, useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, mainColor} from "../../utills/ServiceUrls";
import {FaUserAlt} from "react-icons/fa";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {RiCloseLine} from "react-icons/ri";
import UserStatistics from "../userStatistics/UserStatistics";
import SimpleBar from "simplebar-react";
import UsersMonthStatistics from "../userStatistics/UsersMonthStatistics";
import {AnimatePresence, motion as m} from 'framer-motion'
import {BsCalendar2Date} from "react-icons/bs";
import {extrasmall, large, medium, small} from "../../responsiv";

const ModalRektorTeachersPage = ({colName, kafedraMudiri, come, noCome, all, facultyName, kafedraId, isTeacherUrl}) => {

    const [allItem, setAllItem] = useState([])

    useEffect(() => {
        setAllItem(all)

    }, [])

    const [selectUser, setSelectUser] = useState("");
    const [selectUserId, setSelectUserId] = useState("");
    const [selectPhoto, setSelectPhoto] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openMonthModal, setOpenMonthModal] = useState(false);

    const handleOpenModal = (name, userId, photoId) => {
        setSelectUser(name);
        setSelectPhoto(photoId)
        setSelectUserId(userId)
        return setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleOpenMonthModal = () => {
        setOpenMonthModal(true)
    }

    const handleCloseMonthModal = () => {
        setOpenMonthModal(false);
    }

    const container = {
        hidden: {opacity: 0},
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.8,
            },
        },
    }

    const containerChild = {
        hidden: {scale: 0},
        show: {scale: 1},
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


    const row = {
        hidden: {opacity: 0, scale: 0.75},
        show: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    }


    return (
        <Container
            variants={container}
            initial="hidden"
            animate="show"
        >

            {/*** ------------- left -------------- ***/}
            <Left
                variants={containerChild}
            >
                <LeftSection1>
                    {
                        kafedraMudiri ?
                            <>
                                <ImgWrapper>
                                    {
                                        kafedraMudiri?.photos ?
                                            <img src={BASE_URL + "/attachment/download/" + kafedraMudiri?.photos?.id}
                                                 width={"200px"} height={"200px"} style={{borderRadius: "50%"}} alt=""/>
                                            : <FaUserAlt/>
                                    }
                                </ImgWrapper>
                                <LeftSection1Row>
                                    <LeftSection1RowItem flex={1}>Name:</LeftSection1RowItem>
                                    <LeftSection1RowItem flex={2}>{kafedraMudiri?.fullName}</LeftSection1RowItem>
                                </LeftSection1Row>
                                <LeftSection1Row>
                                    <LeftSection1RowItem flex={1}>Email:</LeftSection1RowItem>
                                    <LeftSection1RowItem flex={2}>{kafedraMudiri?.email}</LeftSection1RowItem>
                                </LeftSection1Row>
                                <LeftSection1Row>
                                    <LeftSection1RowItem flex={1}>Tel:</LeftSection1RowItem>
                                    <LeftSection1RowItem flex={2}>{kafedraMudiri?.phones?.length !== 0 ?
                                        kafedraMudiri?.phones?.filter(i => i.phoneType === "WORK_PHONE")[0]?.phoneNumber : "-"
                                    }</LeftSection1RowItem>
                                </LeftSection1Row>
                            </>
                            : <>⚠️</>
                    }
                </LeftSection1>
                <LeftSection2>
                    <OpenMonthModalBtn onClick={handleOpenMonthModal}>
                        Open Month Modal
                    </OpenMonthModalBtn>


                    <AnimatePresence>
                        {
                            openMonthModal && <Modal
                                open={openMonthModal}
                                onClose={handleCloseMonthModal}
                                aria-labelledby="keep-mounted-modal-title"
                                aria-describedby="keep-mounted-modal-description"

                                component={m.div}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.3}}
                                exit={{opacity: 0}}
                            >
                                <Box sx={styleMonthTable}>
                                    <CloseMyButtonForChild onClick={handleCloseMonthModal}
                                                           whileHover={{rotate: 180, scale: 1.1}}
                                                           whileTap={{scale: 0.9}}
                                                           transition={{duration: 0.3}}
                                    ><RiCloseLine/></CloseMyButtonForChild>
                                    <UsersMonthStatistics colName={colName} isTeacher={isTeacherUrl} date={new Date()}
                                                          userName={facultyName} kafedraId={kafedraId}
                                                          url={isTeacherUrl ? "/kafera-mudiri/getStatisticssForRektor?kafedraId=" : "/staff/getStatisticsForRektor?sectionId="}/>
                                </Box>
                            </Modal>
                        }
                    </AnimatePresence>

                </LeftSection2>
            </Left>
            {/*** ------------- left -------------- ***/}

            {/*** ------------- center -------------- ***/}
            <Center
                variants={containerChild}
            >
                <h5 style={{
                    fontSize: "20px",
                    textAlign: "center",
                    color: "white"
                }}>{isTeacherUrl ? "O'qituvchilar" : "Hodimlar"} {" ro'yxati"}</h5>

                    <CenterItem
                        variants={row}
                        initial="hidden"
                        animate="show"
                    >
                        {
                            allItem?.map((i, index) => {
                                return <CenterItemRow key={i.id}
                                                      custom={index}
                                                      animate="visible"
                                                      variants={variants}
                                                      initial="hidden"
                                    // variants={item}
                                    // initial="hidden"
                                    // animate="show"
                                >
                                    <CenterImgWrapper>
                                        {
                                            i?.photo ? <img src={BASE_URL + "/attachment/download/" + i?.photo?.id}
                                                            style={{borderRadius: "50%"}} width={"40px"} height={"40px"}
                                                            alt=""/>
                                                : <FaUserAlt/>
                                        }
                                    </CenterImgWrapper>
                                    <span style={{
                                        flex: 3,
                                        display: "flex",
                                        alignItems: "flex-start",
                                        fontSize: "12px",
                                        lineHeight: "40px"
                                    }}>{i.fullName}</span>
                                    <CenterBtnWrapper>
                                        <CenterBtn onClick={() => handleOpenModal(i.fullName, i.id, i?.photo?.id)}>
                                            {i?.countTouch}
                                            <BsCalendar2Date size={19} color={mainColor}/>
                                        </CenterBtn>
                                    </CenterBtnWrapper>
                                </CenterItemRow>
                            })
                        }


                        {/*** ================= TIME TABLE =================== ***/}
                        <Modal
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="keep-mounted-modal-title"
                            aria-describedby="keep-mounted-modal-description"
                        >
                            <Box sx={styleTable}>
                                <CloseMyButtonForChild onClick={handleCloseModal}
                                                       whileHover={{rotate: 180, scale: 1.1}}
                                                       whileTap={{scale: 0.9}}
                                                       transition={{duration: 0.3}}
                                ><RiCloseLine/></CloseMyButtonForChild>
                                <UserStatistics userName={selectUser} userId={selectUserId} date={new Date()}
                                                photo={selectPhoto}/>
                            </Box>
                        </Modal>
                        {/*** ================= TIME TABLE =================== ***/}

                    </CenterItem>

            </Center>
            {/*** ------------- center -------------- ***/}

            {/*** ------------- right -------------- ***/}
            <Right
                variants={containerChild}
            >
                <RightSection>
                    <h5 style={{fontSize: "14px", textAlign: "center", color: "white"}}>Ishga kelganlar</h5>

                        <RightSectionItem>
                            {
                                come?.map((i, index) => {
                                    return <RightSection1Row key={i.id}
                                                             custom={index}
                                                             animate="visible"
                                                             variants={variants}
                                                             initial="hidden"
                                    >
                                        <RightImgWrapper>
                                            {
                                                i?.photo ? <img src={BASE_URL + "/attachment/download/" + i?.photo?.id}
                                                                style={{borderRadius: "50%"}} width={"20px"}
                                                                height={"20px"} alt=""/>
                                                    : <FaUserAlt/>
                                            }
                                        </RightImgWrapper>
                                        <span style={{
                                            flex: 3,
                                            display: "flex",
                                            alignItems: "flex-start",
                                            fontSize: "10px",
                                            lineHeight: "20px"
                                        }}>{i.fullName}</span>
                                    </RightSection1Row>
                                })
                            }
                            {come?.length === 0 && <h1 style={{textAlign: "center", fontSize: "14px"}}>-</h1>}
                        </RightSectionItem>
                </RightSection>
                <RightSection>
                    <h5 style={{fontSize: "14px", textAlign: "center", color: "red"}}>Ishga kelmaganlar</h5>
                        <RightSectionItem>
                            {
                                noCome?.map((i, index) => {
                                    return <RightSection1Row key={i.id}
                                                             custom={index}
                                                             animate="visible"
                                                             variants={variants}
                                                             initial="hidden"
                                    >
                                        <RightImgWrapper>
                                            {
                                                i?.photo ? <img src={BASE_URL + "/attachment/download/" + i?.photo?.id}
                                                                width={"20px"} height={"20px"} alt=""/>
                                                    : <FaUserAlt/>
                                            }
                                        </RightImgWrapper>
                                        <span style={{
                                            flex: 3,
                                            display: "flex",
                                            alignItems: "flex-start",
                                            fontSize: "10px",
                                            lineHeight: "20px"
                                        }}>{i.fullName}</span>
                                    </RightSection1Row>
                                })
                            }
                        </RightSectionItem>
                </RightSection>
            </Right>
            {/*** ------------- right -------------- ***/}


        </Container>
    );
};



const RightImgWrapper = styled.div`
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
`

const RightSection1Row = styled(m.div)`
    width: 100%;
    display: flex;
    gap: 5px;
`

const RightSectionItem = styled(m.div)`
    width: 100%;
    display: flex;
    gap: 5px;
    flex-direction: column;
`

const RightSection = styled.div`
    flex: 1;
    background-color: #a9d4e0;
    border-radius: 1rem;
    padding: 1rem !important;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: scroll;
    max-height: 250px;
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

const styleMonthTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "85vw",
    minHeight: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 2,
};

const styleTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "89vw",
    height: '400px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};


const CenterBtn = styled.button`
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 0.5rem;
    align-self: end;
  
    border: none;
`

const CenterBtnWrapper = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`

const CenterImgWrapper = styled.div`
    flex: 1;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    border-radius: 50%;
    overflow: hidden;

`

const CenterItemRow = styled(m.div)`
    width: 100%;
    display: flex;
    gap: 5px;
`

const CenterItem = styled(m.div)`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;

`

const Center = styled(m.div)`
    min-width: 300px;
    background-color: #a9d4e0;
    border-radius: 1rem;
    padding: 1rem !important;
    height: 520px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: scroll;
`

const LeftSection1RowItem = styled.div`
    flex: ${props => props.flex};
`

const LeftSection1Row = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
`

const ImgWrapper = styled.div`
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100px;
    border-radius: 50%;

`
const LeftSection1 = styled.div`
    background-color: #a9d4e0;
    border-radius: 1rem;
    padding: 1rem !important;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const OpenMonthModalBtn = styled.button`
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 20px !important;
    border: none;
    border-radius: 1rem;
    background-color: transparent;
    color: ${mainColor};
    transition: 0.3s background-color;

    &:hover {
        background-color: #fff;
    }

`

const LeftSection2 = styled.div`
    background-color: #a9d4e0;
    border-radius: 1rem;
    padding: 1rem !important;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Left = styled(m.div)`
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 400px;
`


const Right = styled(m.div)`
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 480px;
`;

const Container = styled(m.div)`
    width: 100%;
    height: 525px;
    display: grid;
    gap: 20px;
    grid-template-columns: 20rem auto 16rem;
    overflow-y: scroll;
    ${large({
        gridTemplateColumns: '20rem auto',
    })}
    ${medium({
        gridTemplateColumns: '1fr',
    })}
    ${small({
        gridTemplateColumns: '1fr',
    })}
    ${extrasmall({
        gridTemplateColumns: '1fr',
        height: "85vh !important",
    })}
`

export default memo(ModalRektorTeachersPage);