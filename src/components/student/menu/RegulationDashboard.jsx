import React from 'react';
import {Card, CardContent} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {mainColor} from "../../../utills/ServiceUrls";
import {REGULATIONS} from "../../../utills/fileBase64";
import styled from "styled-components";
import {extrasmall, medium, small} from "../../../responsiv";

const RegulationDashboard = () => {
    const downloadDecodedFile = () => {
        const base64Data = REGULATIONS;
        const decodedData = atob(base64Data);
        const uint8Array = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; ++i) {
            uint8Array[i] = decodedData.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], {type: 'application/pdf'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'file.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card
            sx={{
                marginTop: '30px',
                background: 'linear-gradient(to left, rgba(62, 101, 160, 1), rgba(97, 194, 236, 1))',
                color: '#ffffff',
                marginBottom: '1.5rem',
                overflow: 'visible',
            }}
        >
            <CardContent>
                <CardBodyBox>
                    <Box>
                        <h3>
                            ATTENTION TO ALL RESPECTED STUDENTS, I WOULD LIKE TO REMIND YOU OF CERTAIN ARTICLES OF
                            THE
                            INTERNAL UNIVERSITY REGULATIONS...
                        </h3>
                        <Box component={styleBtnBox}>
                            <Button
                                variant={'contained'}
                                onClick={downloadDecodedFile}
                                sx={{
                                    marginTop: '40px',
                                    background: '#ffffff',
                                    color: mainColor,
                                    '&:hover': {
                                        background: '#e0dcdc',
                                        color: mainColor,
                                    },
                                }}
                            >
                                Details
                            </Button>
                        </Box>
                    </Box>
                    <Box component={ImgBox}>
                        <StyleImgLogo src={'/assets/logo3d.png'} alt="logo"/>
                    </Box>
                </CardBodyBox>

            </CardContent>
        </Card>
    );
};

const styleBtnBox = styled.div`
  ${extrasmall({
    display: 'flex',
    justifyContent: 'end',
})}
`
const StyleImgLogo = styled.img`
  width: 250px;
  ${extrasmall({
    width: '200px',
})}
`
const ImgBox = styled.div`
  margin-top: -70px;
  display: flex;
  ${medium({
    justifyContent: 'center',
})}
  ${small({
    justifyContent: 'center',
})}
  ${extrasmall({
    justifyContent: 'center',
})}
`
const CardBodyBox = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  ${medium({
    flexDirection: 'column-reverse',
    justifyContent: 'center',
    gap: '0px'
})}
  ${small({
    flexDirection: 'column-reverse',
    justifyContent: 'center',
    gap: '0px'
})}
  ${extrasmall({
    flexDirection: 'column-reverse',
    justifyContent: 'center',
    gap: '0px'
})}

}

`
export default RegulationDashboard;