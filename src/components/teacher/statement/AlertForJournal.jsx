import React, { memo, useEffect, useState, useCallback } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, getHeaders } from "../../../utills/ServiceUrls";
import { Alert, Box } from "@mui/material";
import CountDown from "../../time/CountDown";
import { FiClock } from "react-icons/fi";
import {
    dataVedimostFetched,
    dataVedimostFetchingError,
    dataVedimostLoad
} from "../../../redux/slice/vedimost/vedimostSlice";
import ModalSaveStatementForJournal from "./ModalSaveStatementForJournal";

const AlertForJournal = ({ groupId, eduId, subjectId, data, loadData }) => {
    const user = useSelector(state => state?.teacher?.teacher) || null;
    const vedimostData = useSelector(state => state.vedimostSlice?.data);
    const vedimostDataLoad = useSelector(state => state.vedimostSlice?.loading);
    const [modalSaveJournal, setModalSaveJournal] = useState(false);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const dispatch = useDispatch();

    const getVedimostInfo = async () => {
        if (groupId) {
            dispatch(dataVedimostLoad());
            try {
                const res = await axios.get(`${BASE_URL}/vedimost/getVedimostForBeingDone/${user?.id}/${subjectId}/${groupId}?educationYearId=${eduId}`, getHeaders());
                console.log(res.data, 'vedved');
                dispatch(dataVedimostFetched(res.data));
            } catch (err) {
                console.log(err);
                dispatch(dataVedimostFetchingError());
            }
        }
    };

    useEffect(() => {
        getVedimostInfo();
    }, [groupId]);

    const handleTimeUp = useCallback(() => {
        setIsTimeUp(true);
    }, []);

    return (
        <div>
            {groupId && !loadData && !vedimostDataLoad && (
                vedimostData?.obj === null ? (
                    <Alert sx={{ padding: '0 15px' }} variant="filled" severity="warning">
                        {vedimostData?.message}
                    </Alert>
                ) : (
                    vedimostData?.obj?.timeClose === null ? (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Alert
                                sx={{ padding: '0 15px', fontSize: '13px' }}
                                variant={vedimostData?.obj?.deadline >= new Date().getTime() && !isTimeUp ? "outlined" : "filled"}
                                severity="warning"
                                color={vedimostData?.obj?.deadline >= new Date().getTime() && !isTimeUp ? 'success' : 'error'}
                                icon={<FiClock size={'20px'} />}
                            >
                                Deadline: <CountDown targetDate={vedimostData?.obj?.deadline} onTimeUp={handleTimeUp} />
                            </Alert>
                            {vedimostData?.obj?.deadline >= new Date().getTime() && !isTimeUp && (
                                <ModalSaveStatementForJournal
                                    data={data}
                                    loadData={loadData}
                                    open={modalSaveJournal}
                                    setOpen={setModalSaveJournal}
                                    getVedimostInfo={getVedimostInfo}
                                />
                            )}
                        </Box>
                    ) : (
                        <Alert sx={{ padding: '0 15px' }} variant="filled" severity="success">
                            Statement sent successfully
                        </Alert>
                    )
                )
            )}
        </div>
    );
};

export default memo(AlertForJournal);
