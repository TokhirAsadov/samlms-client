import React, {memo, useState} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useSelector} from "react-redux";

const FilterNoticeHistoryGroups = ({data,setFilteredGroups}) => {

    const groupsData=useSelector(state => state.dekanat?.dekanat?.faculties) ?? []
    const sortedGroupsData = [...groupsData].sort((a, b) => a?.shortName?.localeCompare(b?.shortName));
    const [selectedGroup, setSelectedGroup] = useState('');

    function filterData(input, dataArray) {
        if (input === "") {
            return [];
        }
        return dataArray.filter(item =>
            item.groupName.toLowerCase().includes(input.toLowerCase())
        );
    }
    const handleGroupChange = (event) => {
        const inputValue = event.target.value;
        setSelectedGroup(inputValue);
        const filteredData = filterData(inputValue, data);
        setFilteredGroups(filteredData);
    };
    return (
        <div>
            <FormControl sx={{ m: 2, minWidth: 150 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Group</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={selectedGroup}
                    onChange={handleGroupChange}
                    autoWidth
                    size="large"
                    label="Group"
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    {sortedGroupsData.map(option => (
                        <MenuItem key={option?.id} value={option?.shortName}>{option?.shortName}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default memo(FilterNoticeHistoryGroups);