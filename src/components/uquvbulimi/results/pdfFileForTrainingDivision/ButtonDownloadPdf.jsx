import React from 'react';
import PdfRec from "./PdfRec";
import PdfContr from "./PdfContr";

const ButtonDownloadPdf = ({ penalty, penaltyIf, subject, studentId }) => {


    return (
        <>
            {
            penaltyIf === '6' ? (
                <PdfRec  subject={subject} studentId={studentId} />
            ) : (
                <PdfContr
                    subject={subject}
                    idCard={studentId}
                    penalty={penalty}
                />
            )}
        </>
    );
};

export default ButtonDownloadPdf;
