import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {BASE_URL, getHeaders} from "../../utills/ServiceUrls";
import {TextField} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import {BsSearch} from "react-icons/bs";
import {useLocation} from "react-router-dom";

const SearchForAssistant = ({searchUrl, setData, setIsLoading}) => {
    const cancelTokenSourceRef = useRef(null);
    const {headers} = getHeaders()
    const [value, setValue] = useState('')
   const location=useLocation()

    const getSearchData=(val,newCancelTokenSource)=>{
        axios.get(`${BASE_URL}${searchUrl}${val}`, {
            headers,
            cancelToken: newCancelTokenSource.token,
        })
            .then((res) => {
                const resData = res.data.obj.obj;
                setData(resData?.map((row, index) => ({
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
            })
            .finally(() => {
                setIsLoading(false)
            });
    }
    useEffect(() => {
        const newCancelTokenSource = axios.CancelToken.source();
        if (value !== '') {
            getSearchData(value, newCancelTokenSource);
        }
        return () => {
            newCancelTokenSource.cancel('Operation canceled due to component unmount.');
        };
    }, [location.key]);
    const handleSearch = (val) => {
        setValue(val)
        if (cancelTokenSourceRef.current) {
            cancelTokenSourceRef.current.cancel('Operation canceled due to new request.');
        }
        const newCancelTokenSource = axios.CancelToken.source();
        cancelTokenSourceRef.current = newCancelTokenSource;

        const delayDebounceFn = setTimeout(() => {
            if (val.length >= 3) {
                setIsLoading(true)
                getSearchData(val,newCancelTokenSource)
            }
        }, 300);

        return () => {
            if (newCancelTokenSource) {
                newCancelTokenSource.cancel('Operation canceled due to component unmount.');
            }
            clearTimeout(delayDebounceFn);
        };
    };

    return (
        <TextField
            placeholder={'Search by ID card'}
            size={'small'}
            value={value}
            onChange={e => handleSearch(e.target.value)}
            id="outlined-start-adornmentdfg"
            sx={{width: '300px'}}
            InputProps={{
                startAdornment: <InputAdornment position="start">
                    <BsSearch size={20}/>
                </InputAdornment>,
            }}
        />
    );
};

export default SearchForAssistant;