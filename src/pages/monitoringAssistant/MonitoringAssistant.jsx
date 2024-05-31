import React, {lazy, Suspense} from 'react';
import NavBarUser from "../../components/navbar/NavBarUser";
import SideBar from "../../components/sidebar/SideBar";
import {MonitoringAssistantSideBar} from "../../data/data";
import {Navigate, Route, Routes} from "react-router-dom";
import styled from "styled-components";
import {extrasmall, small} from "../../responsiv";
import LayoutRating from "../../components/uquvbulimi/results/LayoutRating";
import {useSelector} from "react-redux";
import ButtonDownloadPdf from "../../components/uquvbulimi/results/pdfFileForTrainingDivision/ButtonDownloadPdf";
import Spinner from "../../components/spinner/Spinner";

const DataGridForAssistant = lazy(() => import("../../components/monitoringAssistant/DataGridForAssistant"));

const MonitoringAssistant = () => {
    const btntoggleval = useSelector(state => state.btnvalue.btnAction)

    const DataForPage = {
        result: {
            title: "Results",
            searchUrl: '/otherService/studentsResults2/',
            columns: [
                {
                    field: 'count',
                    headerName: '№',
                    sortable: true,
                    width: 50,
                    align: 'center',
                    justifyContent: 'center',
                },
                {
                    minWidth: 100,
                    flex: 0.4,
                    field: 'year',
                    headerName: 'Year',
                    sortable: true,
                    align: 'center',
                    justifyContent: 'center'
                }
                ,
                {
                    minWidth: 100,
                    flex: 0.5,
                    field: 'studentId',
                    headerName: 'Student id',
                    sortable: true,
                    align: 'center',
                    justifyContent: 'center'
                }
                ,
                {
                    flex: 0.3,
                    field: 'semester',
                    headerName: 'Semester',
                    sortable: true,
                    align: 'center',
                }
                ,
                {
                    minWidth: 200,
                    flex: 1,
                    field: 'subject',
                    headerName: 'Subject',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }
                ,
                {
                    flex: 0.3,
                    field: 'credit',
                    headerName: 'Credit',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }
                ,
                {
                    flex: 0.3,
                    field: 'score',
                    headerName: 'Score',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }
                ,
                {
                    flex: 0.3,
                    field: 'grade',
                    headerName: 'Grade',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }
                ,
            ]
        },
        fail: {
            title: 'Fails',
            searchUrl: '/otherService/studentsFails2/',
            columns: [
                {
                    field: 'count',
                    headerName: '№',
                    sortable: true,
                    width: 50,
                    align: 'center',
                    justifyContent: 'center',
                },
                {
                    minWidth: 90,
                    flex: 0.4,
                    field: 'year',
                    headerName: 'Year',
                    sortable: true,
                    align: 'center',
                    justifyContent: 'center'
                }
                ,
                {
                    minWidth: 90,
                    flex: 0.3,
                    field: 'semester',
                    headerName: 'Semester',
                    sortable: true,
                    align: 'center',
                }
                ,
                {
                    minWidth: 150,
                    flex: 1,
                    field: 'subject',
                    headerName: 'Subject',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }
                ,
                {
                    minWidth: 70,
                    flex: 0.2,
                    field: 'credit',
                    headerName: 'Credit',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }
                , {
                    minWidth: 100,
                    flex: 0.4,
                    field: 'currents',
                    headerName: 'Score',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }, {
                    minWidth: 100,
                    flex: 0.4,
                    field: 'finals',
                    headerName: 'Final Score',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }, {
                    minWidth: 100,
                    flex: 0.4,
                    field: 'totals',
                    headerName: 'Total Score',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }, {
                    minWidth: 100,
                    flex: 0.5,
                    field: 'penalty',
                    headerName: 'Penalty',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }, {
                    minWidth: 100,
                    flex: 0.5,
                    field: 'retakeN',
                    headerName: 'Contract',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }, {
                    minWidth: 100,
                    flex: 0.5,
                    field: 'retakeData',
                    headerName: 'Contract Date',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }, {
                    minWidth: 100,
                    flex: 0.5,
                    field: 'note',
                    headerName: 'Note',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }, {
                    minWidth: 100,
                    flex: 0.4,
                    field: 'receipt',
                    headerName: 'Receipt',
                    editable: false,
                    sortable: false,
                    align: 'center',
                    renderCell: (cellValue) => {
                        const penaltyIf = cellValue.row.penalty?.substring(0, 1)
                        const penalty = cellValue.row.penalty
                        const subject = cellValue.row.subject
                        const studentId = cellValue.row.studentId
                        return (<ButtonDownloadPdf
                            penaltyIf={penaltyIf}
                            penalty={penalty}
                            subject={subject}
                            studentId={studentId}
                        />)
                    }
                },


            ]
        },
        final: {
            title: 'Final',
            searchUrl: '/otherService/studentsFinals2/',
            columns: [
                {
                    field: 'count',
                    headerName: '№',
                    sortable: true,
                    width: 50,
                    align: 'center',
                    justifyContent: 'center',
                },
                {
                    minWidth: 100,
                    flex: 0.5,
                    field: 'studentId',
                    headerName: 'Student id',
                    sortable: true,
                    align: 'center',
                    justifyContent: 'center'
                },
                {
                    minWidth: 200,
                    flex: 1,
                    field: 'subject',
                    headerName: 'Subject',
                    editable: false,
                    sortable: false,
                    align: 'center',
                },
                {
                    minWidth: 100,
                    flex: 0.4,
                    field: 'forms',
                    headerName: 'Form',
                    sortable: true,
                    align: 'center',
                    justifyContent: 'center'
                },

                {
                    flex: 0.3,
                    field: 'datas',
                    headerName: 'Data',
                    editable: false,
                    sortable: false,
                    align: 'center',
                },
                {
                    flex: 0.3,
                    field: 'times',
                    headerName: 'Time',
                    editable: false,
                    sortable: false,
                    align: 'center',
                },
                {
                    flex: 0.3,
                    field: 'rooms',
                    headerName: 'Room',
                    editable: false,
                    sortable: false,
                    align: 'center',
                },
            ]
        },
        gpa: {
            title: 'Gpa',
            searchUrl: '/otherService/studentsGPA2/',
            columns: [
                {
                    field: 'count',
                    headerName: '№',
                    sortable: true,
                    width: 50,
                    align: 'center',
                    justifyContent: 'center',
                }, {
                    minWidth: 100,
                    flex: 0.4,
                    field: 'studentId',
                    headerName: 'Student id',
                    sortable: false,
                    align: 'center',
                    justifyContent: 'center'
                }, {
                    minWidth: 150,
                    flex: 1,
                    field: 'fullName',
                    headerName: 'Full name',
                    sortable: true,
                    align: 'center',
                    justifyContent: 'center'
                }, {
                    minWidth: 60, flex: 0.3, field: 'course', headerName: 'Course', sortable: true, align: 'center',
                }, {
                    minWidth: 100,
                    flex: 0.3,
                    field: 'stGroup',
                    headerName: 'Group name',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }, {
                    minWidth: 150,
                    flex: 0.7,
                    field: 'yunalish',
                    headerName: 'Direction',
                    editable: false,
                    sortable: false,
                    align: 'center',
                }, {
                    minWidth: 150,
                    flex: 0.7,
                    field: 'educationType',
                    headerName: 'Education type',
                    editable: false,
                    sortable: false,
                    align: 'center',
                },


                {
                    minWidth: 90,
                    flex: 0.3,
                    field: 'fails',
                    headerName: 'Fails',
                    editable: false,
                    sortable: true,
                    align: 'center',
                }, {
                    minWidth: 90,
                    flex: 0.3,
                    field: 'stGpa',
                    headerName: 'GPA',
                    editable: false,
                    sortable: true,
                    align: 'center',
                }, {
                    minWidth: 100,
                    flex: 0.3,
                    field: 'passport',
                    headerName: 'Passport',
                    editable: false,
                    sortable: false,
                    align: 'center',
                },

            ]
        }
    }


    return (
        <Container>
            <NavBarUser/>
            <Wrapper>
                <SideBar SidebarData={MonitoringAssistantSideBar}/>
                <WrapperPage btnval={btntoggleval}>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path={"/rating"} element={<LayoutRating/>}>
                                <Route path={"/rating/"} element={<Navigate to="results"/>}/>
                                <Route path={"results"}
                                       element={<DataGridForAssistant dataForPage={DataForPage.result}/>}/>
                                <Route path={"fails"} element={<DataGridForAssistant dataForPage={DataForPage.fail}/>}/>
                                <Route path={"final"}
                                       element={<DataGridForAssistant dataForPage={DataForPage.final}/>}/>
                                <Route path={"gpa"} element={<DataGridForAssistant dataForPage={DataForPage.gpa}/>}/>
                            </Route>
                        </Routes>
                    </Suspense>
                </WrapperPage>
            </Wrapper>
        </Container>
    );
};

const Wrapper = styled.div`
    display: flex;
    width: 100vw;
    height: 100%;
    background: #f7f7f7;
    position: relative;

`;

const WrapperPage = styled.div`
    width: ${props => props.btnval === 'open' ? "95vw" : "80vw"};
    margin-top: 60px;
    margin-left: ${props => props.btnval === 'open' ? "5vw" : "20vw"};
    transition: .3s;
    ${small({
        width: "100vw",
        "margin-left": "0px",
    })}
    ${extrasmall({
        width: "100vw",
        "margin-left": "0px",
    })}
`;

const Container = styled.div`
    width: 100vw;
`;
export default MonitoringAssistant;