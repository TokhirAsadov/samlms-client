import React, {memo, useState} from 'react';
import Box from '@mui/material/Box';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import Button from '@mui/material/Button';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {useDispatch} from "react-redux";
import {changeDayValue} from "../../redux/slice/tableData/tableSlice";

const filter = createFilterOptions();

const ModalChangeDay = ({open, handleClose, selectedDay}) => {
    const selectedOptions = ['H-Holiday', 'SL-Sick leave', 'DO-Day off', 'V-Vacation'];
    const [typeDay, setTypeDay] = useState('');
    const dispatch = useDispatch()

    const handleCansel = () => {
        handleClose();
        setTypeDay('');
    }
    const saveTypeData = () => {
        console.log(typeDay);
        if (typeDay.trim() !== '') {
            dispatch(changeDayValue({...selectedDay, hourValue: typeDay}))
            handleClose();
            setTypeDay('');
        }

    };

    return (
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
            <DialogTitle>Select day type</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{my:2}}>
                    <Autocomplete
                        value={typeDay}
                        onChange={(event, newValue) => {
                            if (newValue && newValue.inputValue) {
                                setTypeDay(newValue.inputValue,);
                            } else {
                                setTypeDay(newValue.toString().substring(0, newValue.indexOf('-')));
                            }
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            const {inputValue} = params;
                            const isExisting = options.some(
                                (option) => inputValue === option || (option.inputValue === inputValue)
                            );

                            if (inputValue !== '' && !isExisting) {
                                filtered.push({
                                    inputValue,
                                    title: `Add "${inputValue}"`,
                                });
                            }

                            return filtered;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="free-solo-with-text-dsgdemo"
                        options={selectedOptions}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
                        renderOption={(props, option) => <li {...props}>{option.title || option}</li>}
                        sx={{width: 300}}
                        freeSolo
                        renderInput={(params) => <TextField {...params} label="Type"/>}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCansel}>Cancel</Button>
                <Button onClick={saveTypeData}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(ModalChangeDay);
