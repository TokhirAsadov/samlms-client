import React, {memo, useEffect, useRef, useState} from 'react';
import InputAdornment from "@mui/material/InputAdornment";
import {TextField} from "@mui/material";
import {BsSearch} from "react-icons/bs";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../../utills/ServiceUrls";

const SearchResults = ({setData,searchUrl,fetchData,pagination}) => {
    const cancelTokenSourceRef = useRef(null);
    const [valueInput, setValueInput] = useState('')
     const {headers}=getHeaders()
    const handleSearch = (val) => {
        setValueInput(val)
        if (cancelTokenSourceRef.current) {
            cancelTokenSourceRef.current.cancel('Operation canceled due to new request.');
        }
        const newCancelTokenSource = axios.CancelToken.source();
        cancelTokenSourceRef.current = newCancelTokenSource;

        const delayDebounceFn = setTimeout(() => {
            if (val.length >= 2) {
                axios.get(`${BASE_URL}${searchUrl}${val}`, {
                    headers,
                    cancelToken: newCancelTokenSource.token,
                })
                    .then((res) => {
                        const resData = res.data.obj.obj;
                        setData(resData.map((row, index) => ({
                            ...row,
                            count: index + 1,
                        })));
                    })
                    .catch((err) => {
                        if (axios.isCancel(err)) {
                            console.log('Request canceled:', err.message);
                        } else {
                            console.error(err);
                        }
                    });
            } else {
                fetchData();
            }
        }, 300);

        return () => {
            if (newCancelTokenSource) {
                newCancelTokenSource.cancel('Operation canceled due to component unmount.');
            }
            clearTimeout(delayDebounceFn);
        };
    };

    useEffect(() => {
        setValueInput('')
    }, [pagination]);

    return (

            <TextField
                placeholder={'Search by ID card'}
                size={'small'}
                value={valueInput}
                onChange={e=>handleSearch(e.target.value)}
                id="idCard"
                sx={{width: '300px' }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">
                        <BsSearch size={20}/>
                    </InputAdornment>,
                }}
            />

    );
};

export default memo(SearchResults);