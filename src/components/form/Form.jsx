import React, {useState} from 'react';
import styled from "styled-components";
import Logo from "../Logo";
import {extrasmall, xlarge, xxlarge} from "../../responsiv";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";
import {AUTH, BASE_URL} from "../../utills/ServiceUrls";
import Modal from "@mui/material/Modal";
import {IoMdClose} from "react-icons/io";
import axios from "axios";
import {MdOutlineContentCopy} from "react-icons/md";
import {toast} from "react-toastify";
import {ButtonGroup} from "@mui/material";


const prepareForm = (formArr) => {
    return formArr.reduce((r, v) => ({...r, [v.name]: ""}), {});
}

const Form = ({ formArr,  onSubmit, redirect, isLoadingLogin}) => {
    const initialForm = prepareForm(formArr);
    const [form, setForm] = useState(prepareForm(formArr));
    const [open, setOpen] = useState(false);
    const [series, setSeries] = useState('')
    const [email, setEmail] = useState('')
    const [loginFind, setLoginFind] = useState('')
    const [tabsValue, setTabsValue] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setLoginFind('')
        setSeries('')
    };
    const handleClickLogin = (event, newValue) => {
        setTabsValue(false);
    };
    const handleClickEmail = (event, newValue) => {
        setTabsValue(true);
    };
    const onChangeHandler = (e) => setForm(p => ({...p, [e.target.name]: e.target.value}));
    const onSubmitHandler = () => onSubmit(form, () => {
            setForm(initialForm);
        }
    );

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const hasRedirect = !!redirect;
    const getSeries = (series) => {
        axios.get(BASE_URL + `/user/getLoginByPassport/${series}`)
            .then(res => {
                console.log(res.data)
                if (res.data) {
                    setLoginFind(res.data)
                } else {
                    toast.error('Empty')
                }
            })
            .catch(err => {
                console.log(err)
                toast.error('Error')
                setLoginFind('')
            })
    }
    const checkedEmailAndSendMessageEmail = (email) => {
        axios.get(BASE_URL + AUTH.EMAIL + email)
            .then(res => {
                if (res.data.success) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(() => {
                toast.warning("Error Service");
            })
    }
    const handleSendId = () => {
        if (series.trim() !== '') {
            getSeries(series)
        } else {
            toast.error('Empty')
        }
    }
    const handleSendEmail = () => {
        if (email.trim() !== '') {
            checkedEmailAndSendMessageEmail(email)
        } else {
            toast.error('Empty')
        }
    }
    const handleCopyText = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';

        document.body.appendChild(textarea);

        textarea.select();

        try {

            document.execCommand('copy');
            toast.success(`Copied ${text}`, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (err) {
            console.error('Unable to copy', err);
        } finally {
            document.body.removeChild(textarea);
        }
    };


    return (
        <>
            <Grid item xs={12} sm={12} md={12} lg={5} component={Paper} square>
                <Box
                    sx={{
                        mx: 4,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography component={titleM} variant="p" sx={{textAlign: "center"}}>
                        Kimyo International University in Tashkent
                    </Typography>
                    <Box component={logomobile} sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <Logo/>
                    </Box>
                    <Box component="form" noValidate sx={{mt: 2}}>
                        {formArr.map(({label, name, type}, index) => (

                            type !== 'password' ? (
                                <TextField
                                    key={index}
                                    margin="normal"
                                    value={form[name]}
                                    onChange={(e) => onChangeHandler(e)}
                                    required
                                    fullWidth
                                    name={name}
                                    label={label}
                                    type={type}
                                    id={name}
                                    autoComplete={"login"}
                                />
                            ) : (
                                <FormControl required key={index} fullWidth margin="normal" variant="outlined">
                                    <InputLabel htmlFor={name}>{label}</InputLabel>
                                    <OutlinedInput
                                        type={showPassword ? 'text' : 'password'}
                                        value={form[name]}
                                        onChange={(e) => onChangeHandler(e)}
                                        name={name}
                                        label={label}
                                        id={name}
                                        autoComplete={"current-password"}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>

                            )


                        ))}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoadingLogin}
                            sx={{
                                py: 1.5,
                                mt: 3,
                                mb: 2,
                                fontSize: 20,
                                background: "linear-gradient(294.71deg, #3E65A0 -3.52%, #61C2EC 92.59%)",

                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                onSubmitHandler();
                            }}
                        >
                            {isLoadingLogin ? <CircularProgress color="inherit"/> : 'Sign In'}
                        </Button>
                        <Box sx={{display: 'flex', justifyContent: 'end'}}>
                            <Button onClick={handleOpen}>
                                find Id
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} component={style2modal}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Find Id
                            </Typography>
                            <IconButton onClick={handleClose}>
                                <IoMdClose/>
                            </IconButton>
                        </Box>
                        <ButtonGroup >
                            <Button
                                onClick={handleClickLogin}
                                variant={!tabsValue ? 'contained' : 'outlined'}
                                size="small"
                            >
                                Login
                            </Button>
                            <Button
                                onClick={handleClickEmail}
                                variant={tabsValue ? 'contained' : 'outlined'}
                                size="small"
                            >
                                Email
                            </Button>
                        </ButtonGroup>
                        {
                            tabsValue ? (
                                <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: '30px'}}>
                                    <TextField
                                        fullWidth
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        label={'Email'}
                                        size={'medium'}
                                    />

                                    <Button
                                        onClick={handleSendEmail}
                                        variant={'contained'}
                                    >
                                        Send Email
                                    </Button>
                                </Box>
                            ) : (
                                <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: '30px'}}>
                                    <TextField
                                        fullWidth
                                        value={series}
                                        onChange={e => setSeries(e.target.value)}
                                        label={'Series passport'}
                                        size={'medium'}
                                    />
                                    {loginFind !== '' && <FormControl variant="outlined">
                                        <OutlinedInput
                                            value={loginFind}
                                            size={'medium'}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            endAdornment={<InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => handleCopyText(loginFind)}
                                                >
                                                    <MdOutlineContentCopy/>
                                                </IconButton>
                                            </InputAdornment>}
                                        />
                                    </FormControl>}

                                    <Button
                                        onClick={handleSendId}
                                        variant={'contained'}
                                    >
                                        Send
                                    </Button>
                                </Box>
                            )
                        }
                    </Box>
                </Modal>
            </Grid>

        </>
    );
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 3,
};

const style2modal = styled.div`
    ${extrasmall({
        width: '90% !important',
    })}`

const titleM = styled.p`
    width: 349px;
    font-size: 35px;
    font-weight: bold;
    ${extrasmall({
        width: "250px",
        fontSize: '25px',
    })}
`

const logomobile = styled.div`
    display: flex;
    ${xlarge({
        display: 'none'
    })}
    ${xxlarge({
        display: 'none'
    })}
`

export default Form;