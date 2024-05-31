import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";
import {mainColor} from "../../utills/ServiceUrls";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {extrasmall, medium, small} from "../../responsiv";
import ButtonMui from "@mui/material/Button";
import {FaEdit, FaSave} from "react-icons/fa";

const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;


const prepareForm = (formArr) => {
    return formArr.reduce((r, v) => (v.name !== "roles" && v.name !== "positions") ? ({...r, [v.name]: ""}) : ({
        ...r,
        [v.name]: []
    }), {});
}


const SaveUserForm = ({
                          title,
                          formArr,
                          submitBtn,
                          onSubmit,
                          updateItem,
                          roles,
                          positions,
                          regions,
                          districts,
                          redirect
                      }) => {


    const [form, setForm] = useState(prepareForm(formArr));


    const onSubmitHandler = () => {
        onSubmit(preForm(form));
    }


    useEffect(() => {
        setForm(
            {
                ...form,
                id: updateItem?.id,
                firstName: updateItem?.firstName,
                lastName: updateItem?.lastName,
                middleName: updateItem?.middleName,
                login: updateItem?.login,
                rfid: updateItem?.rfid,
                passport: updateItem?.passport,
                password: updateItem?.password,
                gander: updateItem?.gander,
                roles: updateItem?.roles,
                positions: updateItem?.positions,
                address: updateItem?.address,
                region: updateItem?.region,
                district: updateItem?.district,
            });

    }, [])
    useEffect(() => {
        console.log(form, "form change")
    }, [form])

    const hasRedirect = !!redirect;


    const preForm = (formArr) => {
        return {
            id: formArr?.id,
            firstName: formArr?.firstName,
            lastName: formArr?.lastName,
            middleName: formArr?.middleName,
            rfid: formArr?.rfid,
            login: formArr?.login,
            passport: formArr?.passport,
            password: formArr?.password,
            gander: formArr?.gander,
            region: formArr?.region,
            district: formArr?.district,
            address: formArr?.address,
            roles: formArr?.roles,
            positions: formArr?.positions,
        }
    }

    const obj = preForm(form);


    return (
        <SForm>
            <Title>{title}</Title>
            <WrapperScroll>
                {formArr?.map(({label, name, placeholder, type, value}, index) => {
                    if (type === "text") {
                        return <>
                            <TextField
                                label={label}
                                variant="outlined"
                                key={index}
                                disabled={name === "id"}
                                id={name}
                                name={name}
                                type={type}
                                value={form[name]}
                                onChange={(e) => setForm(preForm => ({...preForm, [name]: e?.target?.value}))}
                                placeholder={placeholder}
                            />
                        </>
                    }
                    if (type === "select") {
                        return <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name={name}
                                value={form[name]}
                                label={label}
                                onChange={(e) => setForm(preForm => ({...preForm, [name]: e?.target?.value}))}
                            >
                                {
                                    name === "gander" ? ["MALE", "FEMALE"]?.map(gander => (
                                            <MenuItem key={gander} value={gander}>{gander}</MenuItem>))
                                        : name === "region" ? regions?.map(region => {
                                                return <MenuItem key={region?.id}
                                                                 value={region?.nameUz}>{region?.nameUz}</MenuItem>
                                            })
                                            : districts?.filter(district => district?.region?.nameUz === form?.region)?.map(district => {
                                                return <MenuItem key={district?.id}
                                                                 value={district?.nameUz}>{district?.nameUz}</MenuItem>
                                            })
                                }
                            </Select>
                        </FormControl>
                    }
                    if (type === "multi") {
                        return updateItem ? <Autocomplete
                                multiple
                                id="checkboxes-tags-demo"
                                options={name === "roles" ? roles : positions}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option}
                                value={name === "roles" ? form?.roles : form?.positions}
                                onChange={(event, newValue) => {
                                    setForm((prev) => ({...prev, [name]: newValue}));
                                }}
                                renderOption={(props, option, {selected}) => (
                                    <li {...props}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{marginRight: 8}}
                                            checked={selected}
                                        />
                                        {option}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField {...params} label={label} placeholder={label}/>
                                )}
                            />
                            :
                            <Autocomplete
                                multiple
                                id="checkboxes-tags-demo"
                                options={name === "roles" ? roles : positions}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option}
                                onChange={(event, newValue) => {
                                    setForm((prev) => ({...prev, [name]: newValue}));
                                }}
                                renderOption={(props, option, {selected}) => (
                                    <li {...props}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{marginRight: 8}}
                                            checked={selected}
                                        />
                                        {option}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField {...params} label={label} placeholder={label}/>
                                )}
                            />
                    }
                })}
            </WrapperScroll>
            <Box
                sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'end',
                }}
            >
                <ButtonMui
                    variant={'contained'}
                    endIcon={title.startsWith("UPDATE") ? <FaEdit/> : <FaSave/>}
                    onClick={(e) => {
                        e.preventDefault();
                        onSubmitHandler();
                    }}
                >
                    {submitBtn}
                </ButtonMui>
            </Box>

            {hasRedirect && (
                <Redirect>
                    <RedirectLabel>{redirect.label}&nbsp;</RedirectLabel>
                    <RedirectLink to={redirect.link.to}>{redirect.link.label}</RedirectLink>
                </Redirect>
            )}
        </SForm>
    );
};

const WrapperScroll = styled.div`
    height: 380px;
    padding-top: 10px;
    display: grid;
    overflow-y: scroll;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    ${medium({
        height: '75vh',
        gridTemplateColumns: '1fr',
        gap: '15px',
    })}
    ${small({
        height: '75vh',
        gridTemplateColumns: '1fr',
        gap: '15px',
    })}
    ${extrasmall({
        height: '75vh',
        gridTemplateColumns: '1fr',
        gap: '15px',
    })}
`
const SForm = styled.form`
    width: 100%;
    color: ${mainColor};
`;


const Redirect = styled.div`
    font-size: 12px;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px !important;
`;

const RedirectLabel = styled.span`

`;
const Title = styled.h3`
    color: ${mainColor};
    margin-bottom: 20px !important;
`;

const RedirectLink = styled(Link)`
    text-decoration: none;
    color: blue;
`;

export default SaveUserForm;