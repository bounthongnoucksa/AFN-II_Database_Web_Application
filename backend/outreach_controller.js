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

        // let query = `
        // SELECT 
        //     COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A1_All_Participants,
        //     COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
        // FROM tb_Form_1A1_Participant P
        // JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
        // WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
        // `;
        let query = `
        --It was requested to combine counts from Form 1A.1 , 1A.2 and CB for Villagers for indicator 1A.1 from M&E team
        SELECT
            A.Count_1A1_All_Participants
                + B.Count_cb_for_villagers_All_Participants
                    AS Count_cb_for_villagers_And_1A1_All_Participants,

            A.Count_1A1_Unique_HH_ID
                + B.Count_cb_for_villagers_Unique_HH_ID
                    AS Count_cb_for_villagers_And_1A1_Unique_HH_ID
        FROM
        (
            SELECT 
                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants,
                COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
        ) A
        CROSS JOIN
        (
            SELECT 
                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants,
                COUNT(DISTINCT P.HHId) AS Count_cb_for_villagers_Unique_HH_ID
            FROM tb_CB_for_Villagers_Participant P
            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
            WHERE S.ActivityCode IN ('1A.1','1A.2')
            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
        ) B;

        `;

        db.all(query, [dateRange.start,dateRange.end,dateRange.start,dateRange.end], (err, rows) => {
            db.close();
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


// Main function to get 1A.4 Outreach Data
function get1A4OutreachData(reportingPeriod, reportYear) {
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
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A4_All_Participants,
            COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A4_All_Participants,
            COUNT(DISTINCT P.HHId) AS Count_1A4_Unique_HH_ID
        FROM tb_Form_1A4_Participant P
        JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
        WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)
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

// Main function to get 1BAct6 Outreach Data
function get1BAct6OutreachData(reportingPeriod, reportYear) {
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
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct6_All_Participants,
            COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1BAct6_All_Participants,
            COUNT(DISTINCT P.HHId) AS Count_1BAct6_Unique_HH_ID
        FROM tb_Form_1BAct6_Participant P
        JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
        WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)
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

// Main function to get 1BAct8 Outreach Data
function get1BAct8OutreachData(reportingPeriod, reportYear) {
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
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct8_All_Participants,
            COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1BAct8_All_Participants,
            COUNT(DISTINCT P.HHId) AS Count_1BAct8_Unique_HH_ID
        FROM tb_Form_1BAct8_Participant P
        JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
        WHERE S.Subactivity IN ('con_irr', 'recon_irr')
        AND date(S.Reporting_Period) BETWEEN date(?) AND date(?);
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

// Main function to get 2Act1 Outreach Data
function get2Act1OutreachData(reportingPeriod, reportYear) {
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
            COUNT(DISTINCT P.NameOfMSME_Owner) AS Count_2Act1_Unique_MSME_Owner
        FROM tb_Form_2Act1_Participant P
        JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
        WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
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

// Main function to get 2Act2 Outreach Data
function get2Act2OutreachData(reportingPeriod, reportYear) {
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
            COUNT(DISTINCT P.NameAndSurname) AS Count_2Act2_Unique_MSME_Owner
        FROM tb_Form_2Act2_Participant P
        JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
        WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
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

// Main function to get 2Act3 Outreach Data
function get2Act3OutreachData(reportingPeriod, reportYear) {
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
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_2Act3_All_Participants,
            COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_2Act3_All_Participants,
            COUNT(DISTINCT P.HHId) AS Count_2Act3_Unique_HH_ID
        FROM tb_Form_2Act3_Participant P
        JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
        WHERE S.Subactivity IN ('accesstracks')
        AND date(S.Reporting_Period) BETWEEN date(?) AND date(?);
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

// Main function to get 3Act2 Outreach Data
function get3Act2OutreachData(reportingPeriod, reportYear) {
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
            COUNT(DISTINCT P.HHId || '_' || P.NameOfAPG) AS Count_3Act2_All_Participants,
            COUNT(DISTINCT P.HHId) AS Count_3Act2_Unique_HH_ID
        FROM tb_Form_3Act2_Participant P
        JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
        WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
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

export { 
    get1A1OutreachData, 
    get1A4OutreachData, 
    get1BAct6OutreachData, 
    get1BAct8OutreachData, 
    get2Act1OutreachData, 
    get2Act2OutreachData, 
    get2Act3OutreachData, 
    get3Act2OutreachData 
};

