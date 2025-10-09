//backend/1A2_controller.js
import 'dotenv/config'; // Load environment variables from .env file
import axios from 'axios'; // Importing axios for HTTP requests
import { getDBConnection } from './getDBConnection.js'; // Importing the database connection helper

import FormData from 'form-data'; // Importing FormData for handling multipart/form-data requests
import fs from 'fs'; // Importing fs for file system operations

//require('dotenv').config(); // Load environment variables from .env file
const KOBO_API_KEY = process.env.KOBO_API_KEY; // KoboToolbox API key from environment variables
const KOBO_NEW_SUBMISSION_API = process.env.KOBO_NEW_SUBMISSION_API_URL; // KoboToolbox API endpoint for new submissions
const KOBO_CB_FOR_1A2_FORM_ID = process.env.KOBO_CB_FOR_1A2_UID;
//const KOBO_CB_FOR_1A2_FORM_ID = process.env.KOBO_CB_FOR_1A2_UID_TEST; // KoboToolbox form ID for CB for Villagers
const KOBO_DELETE_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_CB_FOR_1A2_FORM_ID}/data/`; // KoboToolbox API endpoint for deleting submissions
const KOBO_DOWNLOAD_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_CB_FOR_1A2_FORM_ID}/data.json`; // KoboToolbox API endpoint for downloading submissions


//Download new data from Kobo Toolbox
async function downloadForm1A2SubmissionDataFromKoboToolbox() {
    let db;
    try {
        db = getDBConnection();
        const headers = { Authorization: `Token ${KOBO_API_KEY}` };
        let nextUrl = KOBO_DOWNLOAD_SUBMISSION_API;

        // Clear old data
        await runQuery(db, "DELETE FROM tb_Form_1A2_Participant");
        await runQuery(db, "DELETE FROM tb_Form_1A2_Submission");

        while (nextUrl) {
            const resp = await axios.get(nextUrl, { headers });
            const root = resp.data;
            nextUrl = root.next;

            for (const el of root.results) {
                const submissionId = el["_id"];

                // Insert into tb_Form_1A2_Submission
                await runQuery(db, `
                    INSERT INTO tb_Form_1A2_Submission 
                    (Id, Uuid, Start, End, Reporting_period, Province, District, Village,
                     Subactivity, Act_conduct_date1, Act_conduct_date2, Conducted_by, Version, Submission_time)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(Id) DO UPDATE SET 
                        Uuid=excluded.Uuid,
                        Start=excluded.Start,
                        End=excluded.End,
                        Reporting_period=excluded.Reporting_period,
                        Province=excluded.Province,
                        District=excluded.District,
                        Village=excluded.Village,
                        Subactivity=excluded.Subactivity,
                        Act_conduct_date1=excluded.Act_conduct_date1,
                        Act_conduct_date2=excluded.Act_conduct_date2,
                        Conducted_by=excluded.Conducted_by,
                        Version=excluded.Version,
                        Submission_time=excluded.Submission_time
                `, [
                    submissionId,
                    el["_uuid"] || el["formhub/uuid"] || null,
                    el["start"] || null,
                    el["end"] || null,
                    el["_reportingperiod"] || null,
                    el["select_one_province"] || null,
                    el["select_one_district"] || null,
                    el["select_one_district_village"] || null,
                    el["_subactivity"] || null,
                    el["group_actconductdate_sa1oe86/date_ha2jz81"] || null,
                    el["group_actconductdate_sa1oe86/date_up9xu24"] || null,
                    el["_select_one_conductedby_01"] || null,
                    el["__version__"] || null,
                    el["_submission_time"] || null
                ]);

                // Insert participants
                if (Array.isArray(el["group_wi0we41"])) {
                    for (const p of el["group_wi0we41"]) {
                        await runQuery(db, `
                            INSERT INTO tb_Form_1A2_Participant 
                            (SubmissionId, HaveHH_id, HHId, NameAndSurname, Age, Gender, PWBWStatus, 
                             Ethnicity, Poverty_level, Pwd_status, Module_1, Module_2, Module_3, Module_4,
                             Receive_Grant, GrantUseFor, IFAD, MAF, WFP, GoL, Ben, OtherFund)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `, [
                            submissionId,
                            p["group_wi0we41/doyouhavehh_id"] || null,
                            p["group_wi0we41/mainhhid"] || null,
                            p["group_wi0we41/select_one_mainNameAndSurname"] || p["group_wi0we41/text_hx6fh11"] || null,
                            parseInt(p["group_wi0we41/age_selected"] || p["group_wi0we41/_mainAge"] || 0),
                            p["group_wi0we41/gender_selected"] || p["group_wi0we41/_mainGender"] || null,
                            p["group_wi0we41/_PW_BW_PW_BW"] || null,
                            p["group_wi0we41/ethnicity_selected"] || p["group_wi0we41/_mainEthnicity"] || null,
                            p["group_wi0we41/poverty_selected"] || p["group_wi0we41/_mainPovertyLevel"] || null,
                            p["group_wi0we41/mainPWD_selected"] || p["group_wi0we41/_mainPWD"] || null,
                            p["group_wi0we41/module_1"] || null,
                            p["group_wi0we41/module_2"] || null,
                            p["group_wi0we41/module_3"] || null,
                            p["group_wi0we41/module_4"] || null,
                            p["group_wi0we41/g_receive_Yes_No"] || null,
                            p["group_wi0we41/select_one_qg7ja17"] || null,
                            parseInt(p["group_wi0we41/group_wz1ah68/_IFAD_"] || null),
                            parseInt(p["group_wi0we41/group_wz1ah68/_MAF_"] || null),
                            parseInt(p["group_wi0we41/group_wz1ah68/_WFP_"] || null),
                            parseInt(p["group_wi0we41/group_wz1ah68/_GoL_"] || null),
                            parseInt(p["group_wi0we41/group_wz1ah68/_Ben_"] || null),
                            parseInt(p["group_wi0we41/group_wz1ah68/integer_oz4sh88"] || null)
                        ]);
                    }
                }
            }
        }

        console.log("✅ Form 1A2 submission data downloaded and saved to the database successfully.");

    } catch (err) {
        console.error("❌ Error downloading Form 1A2 data:", err.message);
        throw err; // ✅ rethrow so Express knows it failed
    } finally {
        if (db) await db.close();
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



// ############################ Function to get Form 1A2 participant data ############################
function getForm1A2ParticipantData(language, limit) {
    return new Promise((resolve, reject) => {

        const db = getDBConnection(); // Get the database connection


        const queryParams = [];

        // Construct the base query based on language
        let query = '';
        if (language === 'LA') {
            query = `
                    WITH NumberedParticipants AS (
                        SELECT
                            s.Id,
                            s.Uuid,
                            s.Start,
                            s.End,
                            s.Reporting_period,
                            s.Province,
                            s.District,
                            s.Village,
                            s.Subactivity,
                            s.Act_conduct_date1,
                            s.Act_conduct_date2,
                            s.Conducted_by,
                            s.Version,
                            s.Submission_time,
                            p.Id AS ParticipantId,
                            p.HaveHH_id,
                            p.HHId,
                            p.NameAndSurname,
                            p.Age,
                            p.Gender,
                            p.PWBWStatus,
                            p.Ethnicity,
                            p.Poverty_level,
                            p.Pwd_status,
                            p.Module_1,
                            p.Module_2,
                            p.Module_3,
                            p.Module_4,
                            p.Receive_Grant,
                            p.GrantUseFor,
                            p.IFAD,
                            p.MAF,
                            p.WFP,
                            p.GoL,
                            p.Ben,
                            p.OtherFund,
                            ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                        FROM tb_Form_1A2_Participant p
                        JOIN tb_Form_1A2_Submission s ON p.SubmissionId = s.Id
                    )
                    SELECT
                        np.Id AS SubmissionID,
                        np.Reporting_period AS 'ໄລຍະເວລາລາຍງານ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'ບ້ານ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Subactivity LIMIT 1) AS 'ກິດຈະກຳຍ່ອຍ',
                        np.Act_conduct_date1 AS 'ວັນເລີ່ມ',
                        np.Act_conduct_date2 AS 'ວັນສຳເລັດ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Conducted_by LIMIT 1) AS 'ຈັດຕັ້ງປະຕິບັດໂດຍ',

                        np.HHId AS 'ລະຫັດຄົວເຮືອນ',
                        np.NameAndSurname AS 'ຊື່ ແລະ ນາມສະກຸນ',
                        np.Age AS 'ອາຍຸ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.PWBWStatus LIMIT 1) AS 'ສະຖານະ PWBW',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'ຊົນເຜົ່າ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Poverty_level LIMIT 1) AS 'ລະດັບຄວາມທຸກຍາກ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Pwd_status LIMIT 1) AS 'ຜູ້ພິການ',
                        
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_1 LIMIT 1) AS 'Module 1',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_2 LIMIT 1) AS 'Module 2',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_2 LIMIT 1) AS 'Module 3',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_4 LIMIT 1) AS 'Module 4',

                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Receive_Grant LIMIT 1) AS 'ໄດ້ຮັບທຶນສວນຄົວບໍ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.GrantUseFor LIMIT 1) AS 'ນຳໃຊ້ທຶນເຮັດກິດຈະກຳຫຍັງ',

                        np.IFAD AS 'IFAD',
                        np.MAF AS 'MAF',
                        np.WFP AS 'WFP',
                        np.GoL AS 'GoL',
                        np.Ben AS 'Ben',
                        np.OtherFund AS 'Other Fund'
                    FROM NumberedParticipants np
                    ORDER BY np.Id DESC, np.rn
            `;
        } else if (language === 'EN') {
            // EN version
            query = `
                        WITH NumberedParticipants AS (
                            SELECT
                                s.Id,
                                s.Uuid,
                                s.Start,
                                s.End,
                                s.Reporting_period,
                                s.Province,
                                s.District,
                                s.Village,
                                s.Subactivity,
                                s.Act_conduct_date1,
                                s.Act_conduct_date2,
                                s.Conducted_by,
                                s.Version,
                                s.Submission_time,
                                p.Id AS ParticipantId,
                                p.HaveHH_id,
                                p.HHId,
                                p.NameAndSurname,
                                p.Age,
                                p.Gender,
                                p.PWBWStatus,
                                p.Ethnicity,
                                p.Poverty_level,
                                p.Pwd_status,
                                p.Module_1,
                                p.Module_2,
                                p.Module_3,
                                p.Module_4,
                                p.Receive_Grant,
                                p.GrantUseFor,
                                p.IFAD,
                                p.MAF,
                                p.WFP,
                                p.GoL,
                                p.Ben,
                                p.OtherFund,
                                ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                            FROM tb_Form_1A2_Participant p
                            JOIN tb_Form_1A2_Submission s ON p.SubmissionId = s.Id
                        )
                        SELECT
                            np.Id AS SubmissionID,
                            np.Reporting_period AS 'Reporting Period',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'Village',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Subactivity LIMIT 1) AS 'Sub-Activity',
                            np.Act_conduct_date1 AS 'Start Date',
                            np.Act_conduct_date2 AS 'End Date',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Conducted_by LIMIT 1) AS 'Conducted By',

                            np.HHId AS 'HH-ID',
                            np.NameAndSurname AS 'Grant receipient name',
                            np.Age AS 'Age',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.PWBWStatus LIMIT 1) AS 'PWBW Status',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'Ethnicity',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Poverty_level LIMIT 1) AS 'Poverty Level',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Pwd_status LIMIT 1) AS 'PWD Status',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_1 LIMIT 1) AS 'Module 1',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_2 LIMIT 1) AS 'Module 2',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_2 LIMIT 1) AS 'Module 3',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_4 LIMIT 1) AS 'Module 4',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Receive_Grant LIMIT 1) AS 'Received Grant',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.GrantUseFor LIMIT 1) AS 'IHHG Activities',

                            np.IFAD AS 'IFAD',
                            np.MAF AS 'MAF',
                            np.WFP AS 'WFP',
                            np.GoL AS 'GoL',
                            np.Ben AS 'Ben',
                            np.OtherFund AS 'Other Fund'
                        FROM NumberedParticipants np
                        ORDER BY np.Id DESC, np.rn
            `;
        }

        // If limit is provided and valid, append LIMIT clause
        let finalQuery = query;
        if (limit && !isNaN(limit)) {
            finalQuery += `LIMIT ?`;
            queryParams.push(Number(limit))
        }

        //db.all(query, [], (err, rows) => {
        db.all(finalQuery, queryParams, (err, rows) => {
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


// ############################ Function to get Form 1A2data by SubmissionId ############################
function getForm1A2ParticipantDataBySID(SubmissionId, language) {
    return new Promise((resolve, reject) => {

        const db = getDBConnection(); // Get the database connection

        let query = '';
        if (language === 'LA') {
            query = `
                    WITH NumberedParticipants AS (
                        SELECT
                            s.Id,
                            s.Uuid,
                            s.Start,
                            s.End,
                            s.Reporting_period,
                            s.Province,
                            s.District,
                            s.Village,
                            s.Subactivity,
                            s.Act_conduct_date1,
                            s.Act_conduct_date2,
                            s.Conducted_by,
                            s.Version,
                            s.Submission_time,
                            p.Id AS ParticipantId,
                            p.HaveHH_id,
                            p.HHId,
                            p.NameAndSurname,
                            p.Age,
                            p.Gender,
                            p.PWBWStatus,
                            p.Ethnicity,
                            p.Poverty_level,
                            p.Pwd_status,
                            p.Module_1,
                            p.Module_2,
                            p.Module_3,
                            p.Module_4,
                            p.Receive_Grant,
                            p.GrantUseFor,
                            p.IFAD,
                            p.MAF,
                            p.WFP,
                            p.GoL,
                            p.Ben,
                            p.OtherFund,
                            ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                        FROM tb_Form_1A2_Participant p
                        JOIN tb_Form_1A2_Submission s ON p.SubmissionId = s.Id
                        WHERE s.Id =?
                    )
                    SELECT
                        np.ParticipantId as PID,
                        np.Id AS SubmissionID,
                        np.Reporting_period AS 'ໄລຍະເວລາລາຍງານ',
                        np.Act_conduct_date1 AS 'ວັນເລີ່ມ',
                        np.Act_conduct_date2 AS 'ວັນສຳເລັດ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'ບ້ານ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Subactivity LIMIT 1) AS 'ກິດຈະກຳຍ່ອຍ',
                        
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Conducted_by LIMIT 1) AS 'ຈັດຕັ້ງປະຕິບັດໂດຍ',

                        np.HHId AS 'ລະຫັດຄົວເຮືອນ',
                        np.NameAndSurname AS 'ຊື່ ແລະ ນາມສະກຸນ',
                        np.Age AS 'ອາຍຸ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.PWBWStatus LIMIT 1) AS 'ສະຖານະ PWBW',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'ຊົນເຜົ່າ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Poverty_level LIMIT 1) AS 'ລະດັບຄວາມທຸກຍາກ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Pwd_status LIMIT 1) AS 'ຜູ້ພິການ',
                        
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_1 LIMIT 1) AS 'Module 1',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_2 LIMIT 1) AS 'Module 2',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_2 LIMIT 1) AS 'Module 3',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_4 LIMIT 1) AS 'Module 4',

                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Receive_Grant LIMIT 1) AS 'ໄດ້ຮັບທຶນສວນຄົວບໍ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.GrantUseFor LIMIT 1) AS 'ນຳໃຊ້ທຶນເຮັດກິດຈະກຳຫຍັງ',

                        np.IFAD AS 'IFAD',
                        np.MAF AS 'MAF',
                        np.WFP AS 'WFP',
                        np.GoL AS 'GoL',
                        np.Ben AS 'Ben',
                        np.OtherFund AS 'Other Fund'
                    FROM NumberedParticipants np
                    ORDER BY np.Id DESC, np.rn;

            `;
        } else if (language === 'EN') {
            // EN version
            query = `
                        WITH NumberedParticipants AS (
                            SELECT
                                s.Id,
                                s.Uuid,
                                s.Start,
                                s.End,
                                s.Reporting_period,
                                s.Province,
                                s.District,
                                s.Village,
                                s.Subactivity,
                                s.Act_conduct_date1,
                                s.Act_conduct_date2,
                                s.Conducted_by,
                                s.Version,
                                s.Submission_time,
                                p.Id AS ParticipantId,
                                p.HaveHH_id,
                                p.HHId,
                                p.NameAndSurname,
                                p.Age,
                                p.Gender,
                                p.PWBWStatus,
                                p.Ethnicity,
                                p.Poverty_level,
                                p.Pwd_status,
                                p.Module_1,
                                p.Module_2,
                                p.Module_3,
                                p.Module_4,
                                p.Receive_Grant,
                                p.GrantUseFor,
                                p.IFAD,
                                p.MAF,
                                p.WFP,
                                p.GoL,
                                p.Ben,
                                p.OtherFund,
                                ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                            FROM tb_Form_1A2_Participant p
                            JOIN tb_Form_1A2_Submission s ON p.SubmissionId = s.Id
                            WHERE s.Id =?
                        )
                        SELECT
                            np.ParticipantId as PID,
                            np.Id AS SubmissionID,
                            np.Reporting_period AS 'Reporting Period',
                            np.Act_conduct_date1 AS 'Start Date',
                            np.Act_conduct_date2 AS 'End Date',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'Village',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Subactivity LIMIT 1) AS 'Sub-Activity',
                            
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Conducted_by LIMIT 1) AS 'Conducted By',

                            np.HHId AS 'HH-ID',
                            np.NameAndSurname AS 'Grant receipient name',
                            np.Age AS 'Age',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.PWBWStatus LIMIT 1) AS 'PWBW Status',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'Ethnicity',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Poverty_level LIMIT 1) AS 'Poverty Level',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Pwd_status LIMIT 1) AS 'PWD Status',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_1 LIMIT 1) AS 'Module 1',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_2 LIMIT 1) AS 'Module 2',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_2 LIMIT 1) AS 'Module 3',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Module_4 LIMIT 1) AS 'Module 4',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.Receive_Grant LIMIT 1) AS 'Received Grant',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a2' AND ItemCode=np.GrantUseFor LIMIT 1) AS 'IHHG Activities',

                            np.IFAD AS 'IFAD',
                            np.MAF AS 'MAF',
                            np.WFP AS 'WFP',
                            np.GoL AS 'GoL',
                            np.Ben AS 'Ben',
                            np.OtherFund AS 'Other Fund'
                        FROM NumberedParticipants np
                        ORDER BY np.Id DESC, np.rn;
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














// ############################ Function to delete Form 1A2 submission data from both local database and KoboToolbox Online ############################
async function deleteForm1A2SubmissionInKoboAndDatabase(submissionId) {
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
            db.run("DELETE FROM tb_Form_1A2_Participant WHERE SubmissionId = ?", [submissionId], function (err) {
                if (err) return reject(err);

                // Then delete the submission itself
                db.run("DELETE FROM tb_Form_1A2_Submission WHERE Id = ?", [submissionId], function (err) {
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
async function getForm1A2SubmissionUUIDBySubmissionId(submissionId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Uuid FROM tb_Form_1A2_Submission WHERE Id = ?", [submissionId]);
    db.close();

    return row ? row.Uuid : null; // Return the UUID or null if not found

}
//function get new submissionID from local database by UUID
async function getForm1A2NewSubmissionIdByUUID(uuId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Id as SubmissionId FROM tb_Form_1A2_Submission WHERE Uuid = ?", [uuId]);
    db.close();

    return row ? row.SubmissionId : null; // Return the UUID or null if not found

}








// ############################ Delete only participant in local DB ############################
async function deleteOnlyForm1A2ParticipantInDB(participantId) {
    const db = getDBConnection();

    return new Promise((resolve, reject) => {
        db.run("DELETE FROM tb_Form_1A2_Participant WHERE Id = ?", [participantId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// ############################ Delete a submission in KoboToolbox ############################
async function deleteOnlyForm1A2SubmissionInKobo(submissionId) {
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
async function getRawForm1A2SubmissionAndParticipantsData(submissionId) {
    const db = getDBConnection();

    const submission = await runGet(db, "SELECT * FROM tb_Form_1A2_Submission WHERE Id = ?", [submissionId]);
    const participants = await runAll(db, "SELECT * FROM tb_Form_1A2_Participant WHERE SubmissionId = ?", [submissionId]);

    db.close();
    return { submission, participants };
}







// // ############################ Function to update KoboToolbox Existing data ############################
// // Not in used anymore
// async function updateKoboSubmission(submissionId, submissionData, participants) {
//     try {

//         //delete the existing submission from KoboToolbox and local database
//         await deleteSubmission(submissionId);
//     }
//     catch (error) {
//         console.error(`Error updating submission ${submissionId} in KoboToolbox:`, error);
//         throw error; // ✅ rethrow so Express knows it failed
//     }
// }


// ############################ Function to create Form 1A2 submission XML data to submit to KoboToolbox Online ############################
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
function buildForm1A2SubmissionXML(submission, participants) {
    const now = formatLocalISOWithOffset();
    const end = formatLocalISOWithOffset(new Date(Date.now() + 10 * 60000));

    const xml = [];
    xml.push(`<?xml version='1.0' encoding='UTF-8' ?>`);
    xml.push(`<data id='${KOBO_CB_FOR_1A2_FORM_ID}'>`);

    // Meta: Start / End / Reporting Period
    xml.push(`  <start>${now}</start>`);
    xml.push(`  <end>${end}</end>`);
    xml.push(`  <_reportingperiod>${escapeXML(submission.Reporting_period)}</_reportingperiod>`);

    // Location and general info
    xml.push(`  <select_one_province>${escapeXML(submission.Province)}</select_one_province>`);
    xml.push(`  <select_one_district>${escapeXML(submission.District)}</select_one_district>`);
    xml.push(`  <select_one_district_village>${escapeXML(submission.Village)}</select_one_district_village>`);
    xml.push(`  <_subactivity>${escapeXML(submission.Subactivity)}</_subactivity>`);
    xml.push(`  <_select_one_conductedby_01>${escapeXML(submission.Conducted_by)}</_select_one_conductedby_01>`);

    // Group: Activity Conduct Dates
    xml.push(`  <group_actconductdate_sa1oe86>`);
    xml.push(`    <date_ha2jz81>${escapeXML(submission.Act_conduct_date1)}</date_ha2jz81>`);
    xml.push(`    <date_up9xu24>${escapeXML(submission.Act_conduct_date2)}</date_up9xu24>`);
    xml.push(`  </group_actconductdate_sa1oe86>`);

    // Participants
    participants.forEach(p => {
        xml.push(`  <group_wi0we41>`);

        xml.push(`    <doyouhavehh_id>${escapeXML(p.HaveHH_id)}</doyouhavehh_id>`);
        xml.push(`    <mainhhid>${escapeXML(p.HHId)}</mainhhid>`);
        if (p.HaveHH_id === 'hhidyes') {
            xml.push(`    <select_one_mainNameAndSurname>${escapeXML(p.NameAndSurname)}</select_one_mainNameAndSurname>`);
        } else {
            xml.push(`    <text_hx6fh11>${escapeXML(p.NameAndSurname)}</text_hx6fh11>`);
        }

        xml.push(`    <age_selected>${escapeXML(p.Age)}</age_selected>`);
        xml.push(`    <gender_selected>${escapeXML(p.Gender)}</gender_selected>`);
        xml.push(`    <_PW_BW_PW_BW>${escapeXML(p.PWBWStatus)}</_PW_BW_PW_BW>`);
        xml.push(`    <ethnicity_selected>${escapeXML(p.Ethnicity)}</ethnicity_selected>`);
        xml.push(`    <poverty_selected>${escapeXML(p.Poverty_level)}</poverty_selected>`);
        xml.push(`    <mainPWD_selected>${escapeXML(p.Pwd_status)}</mainPWD_selected>`);

        // Module completion
        xml.push(`    <module_1>${escapeXML(p.Module_1)}</module_1>`);
        xml.push(`    <module_2>${escapeXML(p.Module_2)}</module_2>`);
        xml.push(`    <module_3>${escapeXML(p.Module_3)}</module_3>`);
        xml.push(`    <module_4>${escapeXML(p.Module_4)}</module_4>`);

        // Grant
        xml.push(`    <g_receive_Yes_No>${escapeXML(p.Receive_Grant)}</g_receive_Yes_No>`);
        xml.push(`    <select_one_qg7ja17>${escapeXML(p.GrantUseFor)}</select_one_qg7ja17>`);

        // Contribution group
        xml.push(`    <group_wz1ah68>`);
        xml.push(`      <_IFAD_>${p.IFAD || ''}</_IFAD_>`);
        xml.push(`      <_MAF_>${p.MAF || ''}</_MAF_>`);
        xml.push(`      <_WFP_>${p.WFP || ''}</_WFP_>`);
        xml.push(`      <_GoL_>${p.GoL || ''}</_GoL_>`);
        xml.push(`      <_Ben_>${p.Ben || ''}</_Ben_>`);
        xml.push(`      <integer_oz4sh88>${p.OtherFund || ''}</integer_oz4sh88>`);
        xml.push(`    </group_wz1ah68>`);

        xml.push(`  </group_wi0we41>`);
    });

    // Meta
    xml.push(`  <meta>`);
    xml.push(`    <instanceID>uuid:${escapeXML(submission.Uuid)}</instanceID>`);
    xml.push(`  </meta>`);

    xml.push(`</data>`);

    return xml.join('\n');
}



//############################ Function to submit new submission to KoboToolbox Online ############################
async function submitNewForm1A2SubmissionToKobo(xmlData) {
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

        ReportingPeriod: data["Reporting Period"] || data["ໄລຍະເວລາລາຍງານ"] || null,
        ConductDateStart: data["Start Date"] || data["ວັນເລີ່ມ"] || null,
        ConductDateEnd: data["End Date"] || data["ວັນສຳເລັດ"] || null,

        // // Basic identity
        // HHId: data["HHId"] || data["ລະຫັດຄົວເຮືອນ"],
        // NameAndSurname: data["NameAndSurname"] || data["ຊື່ ແລະ ນາມສະກຸນ"],
        Age: parseInt(data["Age"]) || parseInt(data["ອາຍຸ"]) || 0,
        // Gender: data["Gender"] || data["ເພດ"],
        // PWBWStatus: data["PWBWStatus"] || data["ສະຖານະ PWBW"],
        // Ethnicity: data["Ethnicity"] || data["ຊົນເຜົ່າ"],
        // Poverty_level: data["Poverty_level"] || data["ລະດັບຄວາມທຸກຍາກ"],
        // Pwd_status: data["Pwd_status"] || data["ຜູ້ພິການ"],

        // // Module participation
        // Module_1: data["Module 1"] || data["Module 1"],
        // Module_2: data["Module 2"] || data["Module 2"],
        // Module_3: data["Module 3"] || data["Module 3"],
        // Module_4: data["Module 4"] || data["Module 4"],

        // // Grant-related
        // Receive_Grant: data["Receive_Grant"] || data["ໄດ້ຮັບທຶນສົ່ງເສີມບໍ"],
        // GrantUseFor: data["GrantUseFor"] || data["ໃຊ້ທຶນໃນການປະກອບອາຊີບ"],

        // Contributions
        IFAD: isNaN(parseInt(data.IFAD)) ? null : parseInt(data.IFAD),
        MAF: isNaN(parseInt(data.MAF)) ? null : parseInt(data.MAF),
        WFP: isNaN(parseInt(data.WFP)) ? null : parseInt(data.WFP),
        GoL: isNaN(parseInt(data.GoL)) ? null : parseInt(data.GoL),
        Ben: isNaN(parseInt(data.Ben)) ? null : parseInt(data.Ben),
        OtherFund: isNaN(parseInt(data["Other Fund"])) ? null : parseInt(data["Other Fund"]),
    };
};



// ############################ Edit Submission and participation data ############################
async function editForm1A2SubmissionAndParticipants(data) {

    const db = getDBConnection();
    const d = normalizeKeys(data); // normalizeKeys should match Form 1A2 structure

    console.log("🔁 Received Data:", data);
    console.log("📦 Normalized Data:", d);

    try {
        // ✅ Update Participant Record
        await runQuery(db, `
            UPDATE tb_Form_1A2_Participant
            SET
                Age = ?,
                IFAD = ?,
                MAF = ?,
                WFP = ?,
                GoL = ?,
                Ben = ?,
                OtherFund = ?
            WHERE Id = ?;
        `, [
            d.Age,
            d.IFAD,
            d.MAF,
            d.WFP,
            d.GoL,
            d.Ben,
            d.OtherFund,
            d.PID

        ]);

        // ✅ Update Submission Record
        await runQuery(db, `
            UPDATE tb_Form_1A2_Submission
            SET
                Reporting_period = ?,
                Act_conduct_date1 = ?,
                Act_conduct_date2 = ?
            WHERE Id = ?;
        `, [
            d.ReportingPeriod,
            d.ConductDateStart,
            d.ConductDateEnd,
            d.SubmissionID
        ]);

        console.log("✅ Form 1A2 data updated successfully.");
    } catch (err) {
        console.error("❌ Failed to update Form 1A2 data:", err.message);
        throw err;
    } finally {
        if (db) await db.close();
    }

}




//Export component
export {
    downloadForm1A2SubmissionDataFromKoboToolbox,
    getForm1A2ParticipantData,
    getForm1A2ParticipantDataBySID,
    getForm1A2SubmissionUUIDBySubmissionId,
    getForm1A2NewSubmissionIdByUUID,
    deleteOnlyForm1A2ParticipantInDB,
    deleteOnlyForm1A2SubmissionInKobo,

    deleteForm1A2SubmissionInKoboAndDatabase,
    getRawForm1A2SubmissionAndParticipantsData,
    buildForm1A2SubmissionXML,
    submitNewForm1A2SubmissionToKobo,
    editForm1A2SubmissionAndParticipants

}
