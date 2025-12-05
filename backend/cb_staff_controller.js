// backend/cb_staff_controller.js

import 'dotenv/config'; // Load environment variables from .env file
import axios from 'axios'; // Importing axios for HTTP requests
import { getDBConnection } from './getDBConnection.js'; // Importing the database connection helper

import FormData from 'form-data'; // Importing FormData for handling multipart/form-data requests
import fs from 'fs'; // Importing fs for file system operations

//require('dotenv').config(); // Load environment variables from .env file
const KOBO_API_KEY = process.env.KOBO_API_KEY; // KoboToolbox API key from environment variables
const KOBO_NEW_SUBMISSION_API = process.env.KOBO_NEW_SUBMISSION_API_URL; // KoboToolbox API endpoint for new submissions
const KOBO_CB_FOR_STAFF_FORM_ID = process.env.KOBO_CB_FOR_STAFF_UID;
//const KOBO_CB_FOR_STAFF_FORM_ID = process.env.KOBO_CB_FOR_STAFF_UID_TEST; // KoboToolbox form ID for CB for Staff
const KOBO_DELETE_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_CB_FOR_STAFF_FORM_ID}/data/`; // KoboToolbox API endpoint for deleting submissions
const KOBO_DOWNLOAD_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_CB_FOR_STAFF_FORM_ID}/data.json`; // KoboToolbox API endpoint for downloading submissions






// ############################Function to get CB Staff participant data############################
function getCBStaffParticipantData(language, page, limit, filters = []) {
    return new Promise((resolve, reject) => {

        const db = getDBConnection(); // Get the database connection

        const queryParams = [];

        const isPaginated = page && limit && !isNaN(page) && !isNaN(limit);
        const offset = isPaginated ? (Number(page) - 1) * Number(limit) : 0;

        // Start building WHERE clauses from filters
        const whereClauses = [];
        filters.forEach((filter) => {
            // Map your filter conditions to SQL
            let sqlCond;
            switch (filter.condition) {
                case 'equals':
                    sqlCond = `${filter.column} = ?`;
                    queryParams.push(filter.value);
                    break;
                case 'contains':
                    sqlCond = `${filter.column} LIKE ?`;
                    queryParams.push(`%${filter.value}%`);
                    break;
                case 'gt':
                    sqlCond = `${filter.column} > ?`;
                    queryParams.push(filter.value);
                    break;
                case 'lt':
                    sqlCond = `${filter.column} < ?`;
                    queryParams.push(filter.value);
                    break;
                default:
                    return; // skip invalid condition
            }
            whereClauses.push(sqlCond);
        });
        // Add WHERE clause to your existing query
        let whereSQL = '';
        if (whereClauses.length > 0) {
            whereSQL = 'WHERE ' + whereClauses.join(' AND ');
        }

        // Construct the base query based on language
        let query = '';
        if (language === 'LA') {
            query = `WITH NumberedParticipants AS (
                SELECT
                    s.Id,
                    s.ReportingPeriodDate,
                    s.ActivityStartDate,
                    s.ActivityEndDate,
                    p.Name,
                    p.Responsibility,
                    p.Office,
                    p.StaffType,
                    p.Age,
                    p.Gender,
                    s.Category,
                    s.Topic,
                    s.ActivityLocation,
                    s.IFAD,
                    s.MAF,
                    s.WFP,
                    s.GoL,
                    s.Ben,
                    p.SubmissionId,
                    ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                FROM tb_CB_Staff_Participant p
                JOIN tb_CB_Staff_Submission s ON p.SubmissionId = s.Id
                ${whereSQL ? 'WHERE ' + whereClauses.join(' AND ') : ''}
            )
            SELECT
                np.Id AS SubmissionID,
                np.ReportingPeriodDate AS 'ໄລຍະເວລາລາຍງານ',
                np.ActivityStartDate AS 'ວັນເລີ່ມ',
                np.ActivityEndDate AS 'ວັນສຳເລັດ',
                np.Name AS 'ຊື່ ແລະ ນາມສະກຸນ ຜູ້ເຂົ້າຮ່ວມ',
                np.Age AS 'ອາຍຸ',
                genderT.Label_Lao AS 'ເພດ',
                np.Responsibility AS 'ໜ້າທີ່ຮັບຜິດຊອບ',
                officeT.Label_Lao AS 'ມາຈາກຫ້ອງການ',
                staffT.Label_Lao AS 'ເປັນພະນັກງານຂອງ',
                categoryT.Label_Lao AS 'ຮູບແບບການຝຶກ',
                topicT.Label_Lao AS 'ຫົວຂໍ້ສະເພາະດ້ານໃດ',
                np.ActivityLocation AS 'ສະຖານທີ ຈັດປະຊຸມ ຫຼື ຝຶກອົບຮົມ',
                CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben

            FROM NumberedParticipants np
            LEFT JOIN Translation_EN_LA officeT ON officeT.FormName='cb_for_staff' AND officeT.ItemCode=np.Office
            LEFT JOIN Translation_EN_LA staffT ON staffT.FormName='cb_for_staff' AND staffT.ItemCode=np.StaffType
            LEFT JOIN Translation_EN_LA genderT ON genderT.FormName='cb_for_staff' AND genderT.ItemCode=np.Gender
            LEFT JOIN Translation_EN_LA categoryT ON categoryT.FormName='cb_for_staff' AND categoryT.ItemCode=np.Category
            LEFT JOIN Translation_EN_LA topicT ON topicT.FormName='cb_for_staff' AND topicT.ItemCode=np.Topic AND topicT.Choice_Filter=np.Category
            ORDER BY np.SubmissionId DESC, np.rn
            `;
        } else if (language === 'EN') {
            // EN version
            query = `
            WITH NumberedParticipants AS (
                SELECT
                    s.Id,
                    s.ReportingPeriodDate,
                    s.ActivityStartDate,
                    s.ActivityEndDate,
                    p.Name,
                    p.Responsibility,
                    p.Office,
                    p.StaffType,
                    p.Age,
                    p.Gender,
                    s.Category,
                    s.Topic,
                    s.ActivityLocation,
                    s.IFAD,
                    s.MAF,
                    s.WFP,
                    s.GoL,
                    s.Ben,
                    p.SubmissionId,
                    ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                FROM tb_CB_Staff_Participant p
                JOIN tb_CB_Staff_Submission s ON p.SubmissionId = s.Id
                ${whereSQL ? 'WHERE ' + whereClauses.join(' AND ') : ''}
            )
            SELECT
                np.Id AS SubmissionID,
                np.ReportingPeriodDate AS ReportingPeriod,
                np.ActivityStartDate AS StartDate,
                np.ActivityEndDate AS EndDate,
                np.Name,
                np.Age,
                genderT.Label_English AS Gender,
                np.Responsibility,
                officeT.Label_English AS Office,
                staffT.Label_English AS StaffType,
                
                categoryT.Label_English AS Category,
                topicT.Label_English AS Topic,
                np.ActivityLocation,
                CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben
            FROM NumberedParticipants np
            LEFT JOIN Translation_EN_LA officeT ON officeT.FormName='cb_for_staff' AND officeT.ItemCode=np.Office
            LEFT JOIN Translation_EN_LA staffT ON staffT.FormName='cb_for_staff' AND staffT.ItemCode=np.StaffType
            LEFT JOIN Translation_EN_LA genderT ON genderT.FormName='cb_for_staff' AND genderT.ItemCode=np.Gender
            LEFT JOIN Translation_EN_LA categoryT ON categoryT.FormName='cb_for_staff' AND categoryT.ItemCode=np.Category
            LEFT JOIN Translation_EN_LA topicT ON topicT.FormName='cb_for_staff' AND topicT.ItemCode=np.Topic AND topicT.Choice_Filter=np.Category
            ORDER BY np.SubmissionId DESC, np.rn
            `;
        } else if (language === 'statistic') {
            //Raw data for statistics counts
            query = `WITH NumberedParticipants AS (
                                SELECT
                                    s.Id,
                                    s.ReportingPeriodDate,
                                    s.ActivityStartDate,
                                    s.ActivityEndDate,
                                    p.Name,
                                    p.Responsibility,
                                    p.Office,
                                    p.StaffType,
                                    p.Age,
                                    p.Gender,             
                                    s.Category,
                                    s.Topic,
                                    s.ActivityLocation,
                                    s.IFAD,
                                    s.MAF,
                                    s.WFP,
                                    s.GoL,
                                    s.Ben,
                                    p.SubmissionId,
                                    ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                                FROM tb_CB_Staff_Participant p
                                JOIN tb_CB_Staff_Submission s ON p.SubmissionId = s.Id
                            ),
                            FinalResult AS (
                                SELECT
                                    Id,
                                    np.ReportingPeriodDate AS ReportingPeriod,
                                    np.ActivityStartDate AS StartDate,
                                    np.ActivityEndDate AS EndDate,
                                    Name,
                                    Responsibility,
                                    Office,
                                    StaffType,
                                    Gender,
                                    Category,
                                    Topic,
                                    ActivityLocation,
                                    CASE WHEN rn = 1 THEN IFAD ELSE NULL END AS IFAD,
                                    CASE WHEN rn = 1 THEN MAF ELSE NULL END AS MAF,
                                    CASE WHEN rn = 1 THEN WFP ELSE NULL END AS WFP,
                                    CASE WHEN rn = 1 THEN GoL ELSE NULL END AS GoL,
                                    CASE WHEN rn = 1 THEN Ben ELSE NULL END AS Ben
                                FROM NumberedParticipants
                            )

                            SELECT
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' AND StaffType = 'afn_ii_staff' THEN Name END) AS ContractedStaffTrained,
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' AND StaffType = 'gol_staff' THEN Name END) AS GovStaffTrained,
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' AND Gender = '_male' THEN Name END) AS MenStaffParticipants,
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' AND Gender = '_female' THEN Name END) AS WomenStaffParticipants,
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' THEN Name END) AS TotalStaffTrained,
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' THEN Topic END) AS TotalSubjectsTrained
                            FROM FinalResult
            
            `;
        }
        // If limit is provided and valid, append LIMIT clause
        // let finalQuery = query;
        // if (limit && !isNaN(limit)) {
        //     finalQuery += `LIMIT ?`;
        //     queryParams.push(Number(limit))
        // }
        let finalQuery = query;
        if (isPaginated) {
            finalQuery += `LIMIT ? OFFSET ?`;
            queryParams.push(Number(limit), offset);
        }

        // First: Get total count (needed for frontend)
        const countQuery = `SELECT COUNT(*) as total FROM tb_CB_Staff_Participant`;
        db.get(countQuery, [], (err, countRow) => {
            if (err) {
                db.close();
                return reject(err);
            }

            // Then: Fetch paginated or full data
            //db.all(query, [], (err, rows) => {
            db.all(finalQuery, queryParams, (err, rows) => {
                db.close();
                if (err) {

                    reject(err);
                } else {

                    // Add row number column
                    const dataWithNo = rows.map((row, index) => ({ No: (isPaginated ? offset + index + 1 : index + 1), ...row }));
                    resolve({
                        data: dataWithNo,
                        total: countRow.total,
                        page: isPaginated ? Number(page) : undefined,
                        limit: isPaginated ? Number(limit) : undefined
                    });
                }
            });
        });
    });
}



// ############################ Function to get CB Staff data by SubmissionId ############################
function getCBStaffParticipantDataBySID(SubmissionId, language) {
    return new Promise((resolve, reject) => {

        const db = getDBConnection(); // Get the database connection

        let query = '';
        if (language === 'LA') {
            query = `WITH NumberedParticipants AS (
                            SELECT
                                s.Id,
                                s.ReportingPeriodDate,
                                s.ActivityStartDate,
                                s.ActivityEndDate,
                                p.Id AS PID,
                                p.Name,
                                p.Responsibility,
                                p.Office,
                                p.StaffType,
                                p.Age,
                                p.Gender,
                                s.Category,
                                s.Topic,
                                s.ActivityLocation,
                                s.IFAD,
                                s.MAF,
                                s.WFP,
                                s.GoL,
                                s.Ben,
                                p.SubmissionId,
                                ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                              FROM tb_CB_Staff_Participant p
                              JOIN tb_CB_Staff_Submission s ON p.SubmissionId = s.Id
                              WHERE s.Id =?
                            )

                            SELECT
                              np.PID,
                              np.Id AS SubmissionID,
                              np.ReportingPeriodDate AS 'ໄລຍະເວລາລາຍງານ',
                              np.ActivityStartDate AS 'ວັນເລີ່ມ',
                              np.ActivityEndDate AS 'ວັນສຳເລັດ',
                              np.Name AS 'ຊື່ ແລະ ນາມສະກຸນ ຜູ້ເຂົ້າຮ່ວມ',
                              np.Age AS 'ອາຍຸ',
                              genderT.Label_Lao   AS 'ເພດ',
                              np.Responsibility AS 'ໜ້າທີ່ຮັບຜິດຊອບ',

                              -- Translated fields
                              officeT.Label_Lao   AS 'ມາຈາກຫ້ອງການ',
                              staffT.Label_Lao    AS 'ເປັນພະນັກງານຂອງ',
                              
                              categoryT.Label_Lao AS 'ຮູບແບບການຝຶກ',
                              topicT.Label_Lao    AS 'ຫົວຂໍ້ສະເພາະດ້ານໃດ',

                              np.ActivityLocation AS 'ສະຖານທີ ຈັດປະຊຸມ ຫຼື ຝຶກອົບຮົມ',

                              -- Show only for first participant
                              --CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                              --CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                              --CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                              --CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                              --CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben
                            np.IFAD AS IFAD,
                            np.MAF AS MAF,
                            np.WFP AS WFP,
                            np.GoL AS GoL,
                            np.Ben AS Ben

                            FROM NumberedParticipants np

                            -- Join translations for Office
                            LEFT JOIN Translation_EN_LA officeT
                              ON officeT.FormName = 'cb_for_staff'
                              AND officeT.ItemCode = np.Office

                            -- Join translations for StaffType
                            LEFT JOIN Translation_EN_LA staffT
                              ON staffT.FormName = 'cb_for_staff'
                              AND staffT.ItemCode = np.StaffType

                            -- Join translations for Gender
                            LEFT JOIN Translation_EN_LA genderT
                              ON genderT.FormName = 'cb_for_staff'
                              AND genderT.ItemCode = np.Gender

                            -- Join translations for Category
                            LEFT JOIN Translation_EN_LA categoryT
                              ON categoryT.FormName = 'cb_for_staff'
                              AND categoryT.ItemCode = np.Category

                            -- Join translations for Topic
                            LEFT JOIN Translation_EN_LA topicT
                              ON topicT.FormName = 'cb_for_staff'
                              AND topicT.ItemCode = np.Topic
                              AND topicT.Choice_Filter = np.Category

                            ORDER BY np.SubmissionId DESC, np.rn;
            `;
        } else if (language === 'EN') {
            // EN version
            query = `WITH NumberedParticipants AS (
                            SELECT
                                s.Id,
                                s.ReportingPeriodDate,
                                s.ActivityStartDate,
                                s.ActivityEndDate,
                                p.Id AS PID,
                                p.Name,
                                p.Responsibility,
                                p.Office,
                                p.StaffType,
                                p.Age,
                                p.Gender,
                                s.Category,
                                s.Topic,
                                s.ActivityLocation,
                                s.IFAD,
                                s.MAF,
                                s.WFP,
                                s.GoL,
                                s.Ben,
                                p.SubmissionId,
                                ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                                FROM tb_CB_Staff_Participant p
                                JOIN tb_CB_Staff_Submission s ON p.SubmissionId = s.Id
                                WHERE s.Id =?
                            )

                            SELECT
                                np.PID,
                                np.Id AS SubmissionID,
                                np.ReportingPeriodDate AS ReportingPeriod,
                                np.ActivityStartDate AS StartDate,
                                np.ActivityEndDate AS EndDate,
                                np.Name,
                                np.Age,

                                genderT.Label_English   AS Gender,
                                np.Responsibility,

                                -- Translated fields
                                officeT.Label_English   AS Office,
                                staffT.Label_English    AS StaffType,
                                
                                categoryT.Label_English AS Category,
                                topicT.Label_English    AS Topic,

                                np.ActivityLocation,

                                -- Show only for first participant
                                --CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                                --CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                                --CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                                --CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                                --CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben
                                np.IFAD AS IFAD,
                                np.MAF AS MAF,
                                np.WFP AS WFP,
                                np.GoL AS GoL,
                                np.Ben AS Ben

                            FROM NumberedParticipants np

                            -- Join translations for Office
                            LEFT JOIN Translation_EN_LA officeT
                                ON officeT.FormName = 'cb_for_staff'
                                AND officeT.ItemCode = np.Office

                            -- Join translations for StaffType
                            LEFT JOIN Translation_EN_LA staffT
                                ON staffT.FormName = 'cb_for_staff'
                                AND staffT.ItemCode = np.StaffType

                            -- Join translations for Gender
                            LEFT JOIN Translation_EN_LA genderT
                                ON genderT.FormName = 'cb_for_staff'
                                AND genderT.ItemCode = np.Gender

                            -- Join translations for Category
                            LEFT JOIN Translation_EN_LA categoryT
                                ON categoryT.FormName = 'cb_for_staff'
                                AND categoryT.ItemCode = np.Category

                            -- Join translations for Topic
                            LEFT JOIN Translation_EN_LA topicT
                                ON topicT.FormName = 'cb_for_staff'
                                AND topicT.ItemCode = np.Topic
                                AND topicT.Choice_Filter = np.Category

                            ORDER BY np.SubmissionId DESC, np.rn;
            
            `;
        }

        db.all(query, [SubmissionId], (err, rows) => {
            db.close();
            if (err) {

                reject(err);
            } else {

                // Add row number column
                const dataWithNo = rows.map((row, index) => ({ No: index + 1, ...row }));
                resolve(dataWithNo);
            }
        });
    });
}



// ############################Function to dowload CB Staff submission data from KoboToolbox Online############################
async function downloadCBStaffSubmissionDataFromKoboToolbox() {

    let db;
    try {
        db = getDBConnection();
        const headers = { Authorization: `Token ${KOBO_API_KEY}` };
        let nextUrl = KOBO_DOWNLOAD_SUBMISSION_API;

        // clear old data
        await runQuery(db, "DELETE FROM tb_CB_Staff_Submission");
        await runQuery(db, "DELETE FROM tb_CB_Staff_Participant");

        while (nextUrl) {
            const resp = await axios.get(nextUrl, { headers });
            const root = resp.data;
            nextUrl = root.next;

            for (const el of root.results) {
                const submissionId = el["_id"];

                await runQuery(db, `
                    INSERT INTO tb_CB_Staff_Submission 
                    (Id, Uuid, Start, End, ReportingPeriodDate, ActivityStartDate, ActivityEndDate, Category, Topic, ActivityLocation, IFAD, MAF, WFP, GoL, Ben, Version, SubmissionTime)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(Id) DO UPDATE SET 
                        Uuid=excluded.Uuid,
                        Start=excluded.Start,
                        End=excluded.End,
                        ReportingPeriodDate=excluded.ReportingPeriodDate,
                        ActivityStartDate=excluded.ActivityStartDate,
                        ActivityEndDate=excluded.ActivityEndDate,
                        Category=excluded.Category,
                        Topic=excluded.Topic,
                        ActivityLocation=excluded.ActivityLocation,
                        IFAD=excluded.IFAD,
                        MAF=excluded.MAF,
                        WFP=excluded.WFP,
                        GoL=excluded.GoL,
                        Ben=excluded.Ben,
                        Version=excluded.Version,
                        SubmissionTime=excluded.SubmissionTime
                `, [
                    submissionId,
                    el["_uuid"],
                    el["start"],
                    el["end"],
                    el["date_lv6zg63"],
                    el["group_of5oy77/date_mg3ho62"],
                    el["group_of5oy77/date_pg0bf05"],
                    el["select_one_category"],
                    el["select_one_topic"],
                    el["_act_location"],
                    parseInt(el["group_kw0iz30/_IFAD_"] || null),
                    parseInt(el["group_kw0iz30/_MAF_"] || null),
                    parseInt(el["group_kw0iz30/_WFP_"] || null),
                    parseInt(el["group_kw0iz30/_GoL_"] || null),
                    parseInt(el["group_kw0iz30/_Ben_"] || null),
                    el["__version__"],
                    el["_submission_time"]
                ]);

                if (Array.isArray(el["group_ap1ti89"])) {
                    for (const p of el["group_ap1ti89"]) {
                        await runQuery(db, `
                            INSERT INTO tb_CB_Staff_Participant 
                            (SubmissionId, Name, Responsibility, Office, StaffType, Age, Gender)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                        `, [
                            submissionId,
                            p["group_ap1ti89/_participation_name"],
                            p["group_ap1ti89/_reponsibility"],
                            p["group_ap1ti89/_office"],
                            p["group_ap1ti89/_type_of_staff"],
                            p["group_ap1ti89/_age"],
                            p["group_ap1ti89/_gender"],
                        ]);
                    }
                }
            }
        }

        console.log("CB Staff submission data downloaded and saved to the database successfully.");

    } catch (err) {
        console.error("Error downloading form CB Staff data:", err.message);
        throw err; // ✅ rethrow so Express knows it failed
    } finally {
        if (db) db.close();
    }
}
// helper: wrap sqlite run() into a Promise
function runQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}


// ############################ Function to delete CB Staff submission data from both local database and KoboToolbox Online ############################
async function deleteSubmissionInKoboAndDatabase(submissionId) {
    try {
        // Delete the whole submission from Kobo
        // this function will not handle data refresh to local database
        // the data refresh will be handled by the frontend

        const response = await fetch(`${KOBO_DELETE_SUBMISSION_API}${submissionId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${KOBO_API_KEY}`,
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete submission from Kobo: ${response.status} ${response.statusText} - ${errorText}`);
            //console.log(`Failed to delete submission from Kobo: ${response.statusText}`);

        }

        // Delete the submission from local database
        const db = getDBConnection();
        await new Promise((resolve, reject) => {
            // Delete participants first
            db.run("DELETE FROM tb_CB_Staff_Participant WHERE SubmissionId = ?", [submissionId], function (err) {
                if (err) return reject(err);

                // Then delete the submission itself
                db.run("DELETE FROM tb_CB_Staff_Submission WHERE Id = ?", [submissionId], function (err) {
                    db.close();
                    if (err) return reject(err);
                    resolve();
                });
            });
        });


    } catch (error) {

        console.error(`Delete URL involved the error: ${KOBO_DELETE_SUBMISSION_API}${submissionId}/}`);
        console.error('Error deleting submission:', error);
        throw error; // ✅ rethrow so Express knows it failed

    }
}






// ############################ Function to UUID of a specific submissionID from local database before delete a participant ############################
async function getSubmissionUUIDBySubmissionId(submissionId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Uuid FROM tb_CB_Staff_Submission WHERE Id = ?", [submissionId]);
    db.close();

    return row ? row.Uuid : null; // Return the UUID or null if not found

}
//function get new submissionID from local database by UUID
async function getNewSubmissionIdByUUID(uuId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Id as SubmissionId FROM tb_CB_Staff_Submission WHERE Uuid = ?", [uuId]);
    db.close();

    return row ? row.SubmissionId : null; // Return the UUID or null if not found

}








// ############################ Delete only participant in local DB ############################
async function deleteOnlyParticipantInDB(participantId) {
    const db = getDBConnection();

    return new Promise((resolve, reject) => {
        db.run("DELETE FROM tb_CB_Staff_Participant WHERE Id = ?", [participantId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// ############################ Delete a submission in KoboToolbox ############################
async function deleteOnlySubmissionInKobo(submissionId) {
    try {
        // Delete the whole submission from Kobo

        const response = await fetch(`${KOBO_DELETE_SUBMISSION_API}${submissionId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${KOBO_API_KEY}`,
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete submission from Kobo: ${response.status} ${response.statusText} - ${errorText}`);
        }

    } catch (error) {

        console.error(`Delete URL involved the error: ${KOBO_DELETE_SUBMISSION_API}${submissionId}/}`);
        console.error('Error deleting submission:', error);
        throw error; // ✅ rethrow so Express knows it failed

    }
}




//DB Helper function to run queries just for below function getRawSubmissionAndParticipantsData(submissionId) this function will help return data as array instead of DB object
function runGet(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function runAll(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}
//Get raw participant data from database by SubmissionId
async function getRawSubmissionAndParticipantsData(submissionId) {
    const db = getDBConnection();

    const submission = await runGet(db, "SELECT * FROM tb_CB_Staff_Submission WHERE Id = ?", [submissionId]);
    const participants = await runAll(db, "SELECT * FROM tb_CB_Staff_Participant WHERE SubmissionId = ?", [submissionId]);

    db.close();
    return { submission, participants };
}







// ############################ Function to update KoboToolbox Existing data ############################
async function updateKoboSubmission(submissionId, submissionData, participants) {
    try {

        //delete the existing submission from KoboToolbox and local database
        await deleteSubmission(submissionId);
    }
    catch (error) {
        console.error(`Error updating submission ${submissionId} in KoboToolbox:`, error);
        throw error; // ✅ rethrow so Express knows it failed
    }
}


// ############################ Function to create CB Staff submission XML data to submit to KoboToolbox Online ############################
//Datetime formatting function to match KoboToolbox's expected format:
function formatLocalISOWithOffset(date = new Date()) {
    const tzOffset = -date.getTimezoneOffset(); // minutes
    const sign = tzOffset >= 0 ? '+' : '-';
    const pad = n => String(n).padStart(2, '0');
    const hours = pad(Math.floor(Math.abs(tzOffset) / 60));
    const minutes = pad(Math.abs(tzOffset) % 60);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${hours}:${minutes}`;
}

// Function to escape XML special characters
function escapeXML(str) {
    //if (!str) return '';
    if (str === null || str === undefined) return '';
    // return str.replace(/&/g, '&amp;')
    //     .replace(/</g, '&lt;')
    //     .replace(/>/g, '&gt;')
    //     .replace(/'/g, '&apos;')
    //     .replace(/"/g, '&quot;');
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
}


//############################ XML Builder function: ############################
function buildSubmissionXML(submission, participants) {
    const now = formatLocalISOWithOffset();
    const end = formatLocalISOWithOffset(new Date(Date.now() + 10 * 60000));

    // console.log("Participants from DB:", participants);
    // console.log("Type of participants:", typeof participants);
    // console.log("IsArray?", Array.isArray(participants));

    const xml = [];
    xml.push(`<?xml version='1.0' encoding='UTF-8' ?>`);
    xml.push(`<data id='${KOBO_CB_FOR_STAFF_FORM_ID}'>`);
    xml.push(`  <start>${now}</start>`);
    xml.push(`  <end>${end}</end>`);
    xml.push(`  <date_lv6zg63>${escapeXML(submission.ReportingPeriodDate)}</date_lv6zg63>`);

    xml.push(`  <group_of5oy77>`);
    xml.push(`    <date_mg3ho62>${escapeXML(submission.ActivityStartDate)}</date_mg3ho62>`);
    xml.push(`    <date_pg0bf05>${escapeXML(submission.ActivityEndDate)}</date_pg0bf05>`);
    xml.push(`  </group_of5oy77>`);

    xml.push(`  <select_one_category>${escapeXML(submission.Category)}</select_one_category>`);
    xml.push(`  <select_one_topic>${escapeXML(submission.Topic)}</select_one_topic>`);
    xml.push(`  <_act_location>${escapeXML(submission.ActivityLocation)}</_act_location>`);

    participants.forEach(p => {
        xml.push(`  <group_ap1ti89>`);
        xml.push(`    <_participation_name>${escapeXML(p.Name)}</_participation_name>`);
        xml.push(`    <_reponsibility>${escapeXML(p.Responsibility)}</_reponsibility>`);
        xml.push(`    <_office>${escapeXML(p.Office)}</_office>`);
        xml.push(`    <_type_of_staff>${escapeXML(p.StaffType)}</_type_of_staff>`);
        xml.push(`    <_age>${escapeXML(p.Age)}</_age>`);
        xml.push(`    <_gender>${escapeXML(p.Gender)}</_gender>`);
        xml.push(`  </group_ap1ti89>`);
    });

    xml.push(`  <group_kw0iz30>`);
    xml.push(`    <_IFAD_>${submission.IFAD || ''}</_IFAD_>`);
    xml.push(`    <_MAF_>${submission.MAF || ''}</_MAF_>`);
    xml.push(`    <_WFP_>${submission.WFP || ''}</_WFP_>`);
    xml.push(`    <_GoL_>${submission.GoL || ''}</_GoL_>`);
    xml.push(`    <_Ben_>${submission.Ben || ''}</_Ben_>`);
    xml.push(`  </group_kw0iz30>`);

    xml.push(`  <meta>`);
    xml.push(`    <instanceID>uuid:${submission.Uuid}</instanceID>`);
    xml.push(`  </meta>`);
    xml.push(`</data>`);

    return xml.join('\n');
}


//############################ Function to submit new submission to KoboToolbox Online ############################
async function submitNewSubmissionToKobo(xmlData) {
    const form = new FormData();
    form.append('xml_submission_file', xmlData, { filename: 'submission.xml' });

    await axios.post(KOBO_NEW_SUBMISSION_API, form, {
        headers: {
            ...form.getHeaders(),
            Authorization: `Token ${KOBO_API_KEY}`
        }
    });
}

//Due to the issue of database column return from frontend has 2 langues switch so the column is is dynamic
//so we need to normalized it before running SQL command
// Map localized keys to English DB column names
const normalizeKeys = (data) => {
    return {
        PID: data.PID || data.ParticipantId,
        SubmissionID: data.SubmissionID || data.SubmissionId,
        Name: data["Name"] || data["ຊື່ ແລະ ນາມສະກຸນ ຜູ້ເຂົ້າຮ່ວມ"],
        Responsibility: data["Responsibility"] || data["ໜ້າທີ່ຮັບຜິດຊອບ"],
        Office: data["Office"] || data["ມາຈາກຫ້ອງການ"],
        StaffType: data["StaffType"] || data["ເປັນພະນັກງານຂອງ"],
        Age: data["Age"] || data["ອາຍຸ"],
        Gender: data["Gender"] || data["ເພດ"],
        Category: data["Category"] || data["ຮູບແບບການຝຶກ"],
        Topic: data["Topic"] || data["ຫົວຂໍ້ສະເພາະດ້ານໃດ"],
        ActivityLocation: data["ActivityLocation"] || data["ສະຖານທີ ຈັດປະຊຸມ ຫຼື ຝຶກອົບຮົມ"],
        ReportingPeriod: data["ReportingPeriod"] || data["ໄລຍະເວລາລາຍງານ"],
        StartDate: data["StartDate"] || data["ວັນເລີ່ມ"],
        EndDate: data["EndDate"] || data["ວັນສຳເລັດ"],
        IFAD: isNaN(parseInt(data.IFAD)) ? null : parseInt(data.IFAD),
        MAF: isNaN(parseInt(data.MAF)) ? null : parseInt(data.MAF),
        WFP: isNaN(parseInt(data.WFP)) ? null : parseInt(data.WFP),
        GoL: isNaN(parseInt(data.GoL)) ? null : parseInt(data.GoL),
        Ben: isNaN(parseInt(data.Ben)) ? null : parseInt(data.Ben)
    };
};



// ############################ Edit Submission and participation data ############################
async function editSubmissionAndParticipants(data) {


    const db = getDBConnection();
    const d = normalizeKeys(data);

    console.log("Data received:", data);
    console.log("NormalizedKeys", d);
    try {
        // Update participant
        await runQuery(db, `
        UPDATE tb_CB_Staff_Participant
        SET
            Name = ?,
            Responsibility = ?,
            Office = ?,
            StaffType = ?,
            Age = ?,
            Gender = ?
                      

        WHERE Id = ?; `
            , [d.Name, d.Responsibility, d.Office, d.StaffType, d.Age, d.Gender, d.PID]);

        // Update submission
        await runQuery(db, `
        UPDATE tb_CB_Staff_Submission
        SET
            ReportingPeriodDate = ?,
            ActivityStartDate = ?,
            ActivityEndDate = ?,
            ActivityLocation = ?,
            IFAD = ?,
            MAF = ?,
            WFP = ?,
            GoL = ?,
            Ben = ?
        WHERE Id = ?;`,
            [d.ReportingPeriod,
            d.StartDate,
            d.EndDate,
            d.ActivityLocation,
            d.IFAD,
            d.MAF,
            d.WFP,
            d.GoL,
            d.Ben,
            d.SubmissionID]);

        console.log("Update cb staff data to database success.");

    } catch (error) {
        console.error("Error updating data to database from backend", error.message);
    } finally {
        if (db) db.close();
    }

}


// ############################Exporting the functions############################
export {
    getCBStaffParticipantData,
    getCBStaffParticipantDataBySID,
    downloadCBStaffSubmissionDataFromKoboToolbox,
    deleteSubmissionInKoboAndDatabase,
    deleteOnlyParticipantInDB,
    deleteOnlySubmissionInKobo,
    updateKoboSubmission,
    buildSubmissionXML,
    submitNewSubmissionToKobo,
    getRawSubmissionAndParticipantsData,
    getSubmissionUUIDBySubmissionId,
    getNewSubmissionIdByUUID,
    editSubmissionAndParticipants
};