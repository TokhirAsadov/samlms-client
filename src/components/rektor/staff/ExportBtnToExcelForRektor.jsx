import React, {memo} from 'react';
import moment from "moment";
import * as XLSX from "xlsx";
import Button from "@mui/material/Button";

const ExportBtnToExcelForRektor = ({dataToExcel,direction}) => {

    function pres(a, b) {
        if (!a || !b) return 0
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

        const headerRow = ['№', 'Direction', 'All Staff', 'Staff Came', 'Percent',`${moment().format('DD.MM.YYYY HH:mm')}`];

        const sheetData = [headerRow, ...sortedData.map((item, index) => [
            index + 1,
            item.name,
            item.data?.allCount || 0,
            item.data?.comeCount || 0,
            pres(item.data?.allCount , item.data?.comeCount ),
        ])];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'data');
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

export default memo(ExportBtnToExcelForRektor);