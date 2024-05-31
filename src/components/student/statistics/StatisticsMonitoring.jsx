import React, { useState } from 'react';
import { ButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
import DayStatistics from "./section/DayStatistics";
import WeekStatistics from "./section/WeekStatistics";
import MonthStatistics from "./section/MonthStatistics";
import SemesterStatistics from "./section/SemesterStatistics";
import 'moment/locale/en-au';
import Box from "@mui/material/Box";
const sectionComponents = {
    day: DayStatistics,
    week: WeekStatistics,
    month: MonthStatistics,
    semester: SemesterStatistics
};

const StatisticsMonitoring = () => {
    const sectionData = Object.keys(sectionComponents);
    const [selectedSection, setSelectedSection] = useState(sectionData[0]);

    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };

    return (
        <>
            <Box sx={{display:'flex',justifyContent:'start'}}>
                <ButtonGroup disableElevation >
                    {sectionData.map(item => (
                        <Button
                            key={item}
                            variant={selectedSection === item ? 'contained' : 'outlined'}
                            onClick={() => handleSectionChange(item)}
                        >
                            {item}
                        </Button>
                    ))}
                </ButtonGroup>
            </Box>

            {React.createElement(sectionComponents[selectedSection],{setSelectedSection})}
        </>
    );
};

export default StatisticsMonitoring;
