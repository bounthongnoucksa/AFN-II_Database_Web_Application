//backend/outreach_controller.js
import axios from 'axios'; // Importing axios for HTTP requests
import { getDBConnection } from './getDBConnection.js'; // Importing the database connection helper

// Helper function to get date ranges based on reportingPeriod
function getDateRange(reportingPeriod, reportYear) {
    const year = parseInt(reportYear);
    if (isNaN(year)) throw new Error('Invalid reportYear');

    switch (reportingPeriod) {
        case 'Whole Year':
            return {
                start: `${year}-01-01`,
                end: `${year}-12-31`
            };
        case '6-Months':
            return {
                start: `${year}-01-01`,
                end: `${year}-06-30`
            };
        case 'Q1':
            return {
                start: `${year}-01-01`,
                end: `${year}-03-31`
            };
        case 'Q2':
            return {
                start: `${year}-04-01`,
                end: `${year}-06-30`
            };
        case 'Q3':
            return {
                start: `${year}-07-01`,
                end: `${year}-09-30`
            };
        case 'Q4':
            return {
                start: `${year}-10-01`,
                end: `${year}-12-31`
            };
        default:
            throw new Error('Invalid reportingPeriod');
    }
}


// Main function to get 1A.1 Outreach Data
function get1A1OutreachData(reportingPeriod, reportYear) {
    return new Promise((resolve, reject) => {

        let dateRange;
        try {
            dateRange = getDateRange(reportingPeriod, reportYear);
        } catch (error) {
            return reject(error);
        }

        const db = getDBConnection(); // Get the database connection

        let query = `
        SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A1_All_Participants,
            COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
        FROM tb_Form_1A1_Participant P
        JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
        WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
        `;

        db.all(query, [dateRange.start,dateRange.end], (err, rows) => {
            db.close();
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}



export { get1A1OutreachData };

