import React, {useState} from 'react';
import styled from "styled-components";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from "@mui/material/Button";
import {IoSave} from "react-icons/io5";
import Typography from "@mui/material/Typography";
import {mainColor} from "../../../utills/ServiceUrls";

const ModalSelectDay = ({dateInfo,setAllData, setOpen}) => {

    const [value, setValue] = useState("");
    const handleSave = (e) => {
        e.preventDefault()

        const newData = dateInfo.map((item) => ({...item, radioValue: value}))
        const uniqueAlldata = Array.from(new Set(newData.map(JSON.stringify))).map(JSON.parse);

        console.log(uniqueAlldata)

        setAllData([])
        setOpen(false)


    }


    return (
        <Container>

            <form onSubmit={handleSave}>
                <FormControl variant="standard" sx={{width: "100%"}}>
                    <FormLabel id="demo-form-control-label-placement">
                        <Typography variant="h6" sx={{color: `${mainColor}`}}>Select the day format</Typography>
                    </FormLabel>
                    <RadioGroup
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        aria-labelledby="demo-form-control-label-placement"
                        name="position"
                        defaultValue="Orientation week"
                        sx={{mt: 1,}}

                    >
                        <FormControlLabel value="Orientation week" control={<Radio required={true}/>}
                                          label="Orientation week"/>
                        <FormControlLabel value="Theoretical education" control={<Radio required={true}/>}
                                          label="Theoretical education"/>
                        <FormControlLabel value="Final exams" control={<Radio required={true}/>} label="Final exams"/>
                        <FormControlLabel value="Vacation" control={<Radio required={true}/>} label="Vacation"/>
                        <FormControlLabel value="Theoretical/Practical education" control={<Radio required={true}/>}
                                          label="Theoretical/Practical education"/>

                    </RadioGroup>
                    <Button type="submit" sx={{margin: "10px auto", padding: "5px 50px"}} variant="contained"
                            endIcon={<IoSave/>}>
                        Save
                    </Button>
                </FormControl>
            </form>
        </Container>
    );
};
const Container = styled.div`
  width: 100%;
  padding: 20px;
`
export default ModalSelectDay;
