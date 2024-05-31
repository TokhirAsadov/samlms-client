import React, {memo} from 'react';
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import cookie from "js-cookie";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import {Divider, Menu} from "@mui/material";
import {FaGlobe} from "react-icons/fa";

const language = [
    {
        code: "en",
        name: "English",
        icon: "/assets/gb.svg",
    },
    {
        code: "ru",
        name: "Russian",
        icon: "/assets/ru.svg",
    },
    {
        code: "uz",
        name: "O‘zbekcha",
        icon: "/assets/uz.svg",
    },
]


const Language = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeLanguage = (code) => {
        i18next.changeLanguage(code)
        handleClose()
    }

    const {t} = useTranslation();
    const currentLanguageCode = cookie.get("i18next") || 'en';



    return (
        <>
            <Tooltip title="Languages">
                <IconButton
                    onClick={handleClick}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <FaGlobe size={25} color={'rgb(87 86 86)'} />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem>
                    {t('language')}
                </MenuItem>
                <Divider/>
                {
                    language.map(
                        ({code, name, icon}) => {
                            return <MenuItem
                                key={code}
                                onClick={() => handleChangeLanguage(code)}
                                disabled={code === currentLanguageCode}
                            >
                      <span style={{opacity: code === currentLanguageCode ? 0.5 : 1}}
                      /> <img width={22} src={icon} alt={icon}/>
                                &nbsp;
                                {name}
                            </MenuItem>
                        })
                }
            </Menu>
        </>
    );
};

export default memo(Language);