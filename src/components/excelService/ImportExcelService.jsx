import {useState} from "react";
import * as XLSX from 'xlsx';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import uploadImg from '../../utills/images/upload_file.png';
import "./dropdown.css"
import styled from "styled-components";
import {color_5, mainColor} from "../../utills/ServiceUrls";
import {FaCloudDownloadAlt} from "react-icons/fa";

const FOLLOW_TYPE_OF_FILES = ['xls','xlsx','csv'];

const studentData = [
  {
    fullName:"",
    passportNumber: "",
    email: "",
    tel: "",
    studentId: "",
    rfid: "",
    groupName: ""
  }
]

const ImportExcelService = ({blocked=true}) => {
  const [colDefs,setColDefs] = useState( []);
  const [data,setData] = useState([]);
  const [fileName,setFileName] = useState("");
  const [checkboxSelection, setCheckboxSelection] = useState(true);

  const convertToJson = (headers,data) => {
    const rows=[]
    data.forEach((row,rowIndex) => {
      let rowData={};
      row.forEach((element,index) =>{
        rowData[headers[index]] = element
      })
      rowData["id"] = rowIndex;
      console.log(rowData,'rowData')
      rows.push(rowData);
    })
    return rows;
  }

  const getException = (file) =>{
    const parse = file.name.split('.');
    const typeOdFile = parse[parse.length - 1];

    return FOLLOW_TYPE_OF_FILES.includes(typeOdFile);
  }

  const importExcel = (e) => {
    const file = e.target.files[0];
    setFileName(()=>file.name);
    const reader = new FileReader();
    reader.onload=(e) => {
      //parse data

      const bstr=e.target.result;
      const workBook=XLSX.read(bstr,{ type: "binary" })

      //get first sheet
      const workSheetName=workBook.SheetNames[0];
      const workSheet=workBook.Sheets[workSheetName];
      //
      const fileData=XLSX.utils.sheet_to_json(workSheet,{header:1});
      // console.log(fileData)
      const headers=fileData[0];
      const heads = headers.map(head=>({field: head, headerName: head, width: 200, editable: false}))
      setColDefs(()=>heads);
      console.log(heads)


      fileData.slice(0,1);
      setData(()=>convertToJson(headers,fileData.slice(1)));
    }

    if(file){
      if (getException(file)){
        reader.readAsBinaryString(file)
      }
      else {
        alert("Invalid file input, Select Excel or CSV file")
      }
    }
    // reader.readAsBinaryString(file);
  }

  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(studentData);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook,workSheet,"Student");

    //Buffer
    let buf = XLSX.write(workBook,{bookType:"xlsx",type:"buffer"});
    //Binary string
    XLSX.write(workBook,{bookType:"xlsx",type:"binary"});
    //Download
    XLSX.writeFile(workBook,"StudentData.xlsx")

  }

  return (
    <Container>
      <Wrapper>
        <div className="drop-file-input">
        <div className="drop-file-input__label">
          <img src={uploadImg} alt="" />
          <p>Import Users from Excel or CSV file</p>
        </div>
        <input disabled={blocked} type="file" value="" onChange={importExcel}/>
      </div>
        <ExampleExcelFileWrapper>
          <ExampleTitle>The excel file to be uploaded should look like this. For example:</ExampleTitle>
          <ExportButton
            onClick={downloadExcel}
            disabled={blocked}
          >
            <ExportButtonIcon>
              <FaCloudDownloadAlt />
            </ExportButtonIcon>
            Export Example Excel
          </ExportButton>
        </ExampleExcelFileWrapper>
      </Wrapper>
      <TableWrapper style={{ height: 300, width: '100%' }}>
        <FileName>{fileName}</FileName>
        {
            colDefs.length > 0 && <DataGrid
            checkboxSelection={checkboxSelection}
            style={{width: "900px", minHeight: "300px!important"}}
            columns={colDefs}
            rows={data}
            components={{Toolbar: GridToolbar}}/*** print and excel ****/
            autoHeight
            />
        }
      </TableWrapper>
    </Container>
  );
};

const FileName = styled.span`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: ${mainColor};
`;

const TableWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-direction: column;
`;

const ExportButtonIcon = styled.span`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const ExportButton = styled.button`
  width: 160px;
  display: flex;
  align-items: center; 
  padding: 5px 10px!important;
  background-color: ${mainColor};
  margin-bottom: 10px!important;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  &:hover{
    filter: brightness(1.1);
  }
  &:disabled{
    cursor: not-allowed;
  }
`;

const ExampleTitle = styled.span`
  padding: 5px 20px!important;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

const ExampleExcelFileWrapper = styled.div`
  width: 400px;
  min-height: 150px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  flex-direction: column;
  border-radius: 10px;
  color: ${mainColor};
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center; 
  gap: 30px;
  
`;

const Container = styled.div`
  width: 100%;
  max-width: 1024px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-direction: column;
  margin-top: 20px!important;
  background-color: #fff;
  overflow-y: scroll;
  border-radius: 10px;
  padding: 10px 20px!important;

  &::-webkit-scrollbar{
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb{
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
  }

  ::-webkit-scrollbar-thumb:window-inactive {
    background: ${color_5};
  }
`;

export default ImportExcelService;