import React, {memo} from 'react';
import Button from "@mui/material/Button";
import moment from "moment/moment";
import * as XLSX from "xlsx";

const ExportBtnToExcel = ({dataToExcel,direction}) => {
    function pres(a, b) {
        return Math.ceil(b * 100 / a)
    }
    const exportToExcel = (data) => {
        if (!data || data.length === 0) {
            console.error('No data to export.');
            return;
        }
        const sortedData = data.sort((a, b) =>
            a.name.toUpperCase().localeCompare(b.name.toUpperCase())
        );

        const headerRow = ['№', 'Direction', 'All Students', 'Students Came', 'Percent',`${moment().format('DD.MM.YYYY HH:mm')}`];

        const sheetData = [headerRow, ...sortedData.map((item, index) => [
            index + 1,
            item.name,
            item.allCount || 0,
            item.comeCount || 0,
            pres(item.allCount, item.comeCount || 0),
        ])];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'GroupData');
        const fileName = `${direction}_data.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };
    return (
        <Button
            variant={'contained'}
          onClick={()=>exportToExcel(dataToExcel)}
        >
            export to excel
        </Button>
    );
};

export default memo(ExportBtnToExcel);