import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import makeAnimated from "react-select/animated";
import axios from "axios";
import {BASE_URL, getHeaders, mainColor} from "../../utills/ServiceUrls";
import {motion} from "framer-motion";
import {toast} from "react-toastify";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {extrasmall} from "../../responsiv";



const RoleUser = () => {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
    const checkedIcon = <CheckBoxIcon fontSize="small"/>;
    const [spinner, setSpinner] = useState(true);
    const [userId, setUserId] = useState(null);
    const [roles, setRoles] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const {headers} = getHeaders();
    const [selectedRolesArray, setSelectedRolesArray] = useState([]);
    const handleSearch = (event, newInputValue) => {
        if (newInputValue.trim().length > 3) {
            axios.get(BASE_URL + "/user/getUsersForUserRole?keyword=" + newInputValue, {headers})
                .then(res => {
                    const resData = res?.data?.obj
                    const uniqueArray = resData.reduce((acc, current) => {
                        const x = acc.find((item) =>
                            item.label === current.label

                        );

                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            return acc;
                        }
                    }, []);
                    console.log(uniqueArray)
                    setUserOptions(uniqueArray)
                })
                .catch(err => {
                    console.log(err);
                })

        }
        else {
            setUserOptions([])
        }
    }

    const onChangeHandler = (event, newValue) => {
        setUserId(newValue);
    }

    useEffect(() => {
        axios.get(BASE_URL + "/role/allRoles")
            .then(res => {
                // console.log(res)
                setRoles(res.data?.obj);
                setSpinner(false);
            })
            .catch(err => {
                console.log(err)
            })
    }, [])





    const onSubmit = () => {

        if (userId !== null) {
            if (selectedRolesArray.length !== 0) {
                const arrayOfIds = selectedRolesArray.map(obj => obj.id)
                axios.post(BASE_URL + "/user/userRole", {userId: userId?.value, roleId: arrayOfIds}, {headers})
                    .then(res => {
                        if (res.status === 201) {
                            toast.success("Successfully changed roles of user..")
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                alert("Error.. Empty role...")
            }
        } else {
            alert("Error.. Please, select user..")
        }

    }

    return (
        <Container>
            <Wrapper>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    onFocus={()=>setUserOptions([])}
                    options={userOptions}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={option => option.label}
                    onChange={onChangeHandler}
                    onInputChange={handleSearch}
                    fullWidth
                    size={'small'}
                    renderInput={(params) => <TextField {...params} label="Select user" placeholder={'user'}/>}
                />

                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo1"
                    options={roles}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.roleName.startsWith("ROLE_") ? option.roleName.substring(5).toUpperCase() : option.roleName.toUpperCase()}
                    onChange={(event, newValue) => {
                        setSelectedRolesArray(newValue)
                    }}
                    size={'small'}
                    renderOption={(props, option, {selected}) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{marginRight: 8}}
                                checked={selected}
                            />
                            {option.roleName.startsWith("ROLE_") ? option.roleName.substring(5).toUpperCase() : option.roleName.toUpperCase()}
                        </li>
                    )}
                    fullWidth
                    renderInput={(params) => (
                        <TextField {...params} label="Select roles" placeholder="roles"/>
                    )}
                />
                <Button sx={{alignSelf: "start", width: "200px", margin: "0 auto"}} variant={'contained'}
                        onClick={onSubmit}>save</Button>
            </Wrapper>

        </Container>
    );
};

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    ${extrasmall({
        gridTemplateColumns: "1fr",
    })}
`;


const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 1rem;
`;

export default RoleUser;