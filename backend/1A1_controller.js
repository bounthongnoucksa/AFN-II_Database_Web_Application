//backend/1A1_controller.js
import 'dotenv/config'; // Load environment variables from .env file
import axios from 'axios'; // Importing axios for HTTP requests
import { getDBConnection } from './getDBConnection.js'; // Importing the database connection helper

import FormData from 'form-data'; // Importing FormData for handling multipart/form-data requests
import fs from 'fs'; // Importing fs for file system operations

//require('dotenv').config(); // Load environment variables from .env file
const KOBO_API_KEY = process.env.KOBO_API_KEY; // KoboToolbox API key from environment variables
const KOBO_NEW_SUBMISSION_API = process.env.KOBO_NEW_SUBMISSION_API_URL; // KoboToolbox API endpoint for new submissions
const KOBO_CB_FOR_1A1_FORM_ID = process.env.KOBO_CB_FOR_1A1_UID;
//const KOBO_CB_FOR_1A1_FORM_ID = process.env.KOBO_CB_FOR_1A1_UID_TEST; // KoboToolbox form ID for 1A1
const KOBO_DELETE_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_CB_FOR_1A1_FORM_ID}/data/`; // KoboToolbox API endpoint for deleting submissions
const KOBO_DOWNLOAD_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_CB_FOR_1A1_FORM_ID}/data.json`; // KoboToolbox API endpoint for downloading submissions



//Download new data from Kobo Toolbox
async function downloadForm1A1SubmissionDataFromKoboToolbox() {
    let db;
    try {
        db = getDBConnection();
        const headers = { Authorization: `Token ${KOBO_API_KEY}` };
        let nextUrl = KOBO_DOWNLOAD_SUBMISSION_API;

        // clear old data
        await runQuery(db, "DELETE FROM tb_Form_1A1_Submission");
        await runQuery(db, "DELETE FROM tb_Form_1A1_Participant");

        while (nextUrl) {
            const resp = await axios.get(nextUrl, { headers });
            const root = resp.data;
            nextUrl = root.next;

            for (const el of root.results) {
                const submissionId = el["_id"];

                // Insert Submission
                await runQuery(db, `
                    INSERT INTO tb_Form_1A1_Submission 
                        (Id, Uuid, Start, End, ReportingPeriod, Province, District, Village, 
                        ActivityType, SubActivity, ConductDateStart, ConductDateEnd, ConductedBy, 
                        VNCAvailable, IFAD, MAF, WFP, GoL, Ben, OtherFund, Version, SubmissionTime)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(Id) DO UPDATE SET 
                            Uuid=excluded.Uuid,
                            Start=excluded.Start,
                            End=excluded.End,
                            ReportingPeriod=excluded.ReportingPeriod,
                            Province=excluded.Province,
                            District=excluded.District,
                            Village=excluded.Village,
                            ActivityType=excluded.ActivityType,
                            ConductDateStart=excluded.ConductDateStart,
                            ConductDateEnd=excluded.ConductDateEnd,
                            ConductedBy=excluded.ConductedBy,
                            VNCAvailable=excluded.VNCAvailable,
                            IFAD=excluded.IFAD,
                            MAF=excluded.MAF,
                            WFP=excluded.WFP,
                            GoL=excluded.GoL,
                            Ben=excluded.Ben,
                            OtherFund=excluded.OtherFund,
                            Version=excluded.Version,
                            SubmissionTime=excluded.SubmissionTime
                `, [
                    submissionId,
                    el["_uuid"] || el["formhub/uuid"] || null,
                    el["start"] || null,
                    el["end"] || null,
                    el["_reportingperiod"] || null,
                    el["select_one_province"] || null,
                    el["select_one_district"] || null,
                    el["select_one_district_village"] || null,
                    el["_subacttype"] || null,
                    el["select_one_ma0uf16"] || null,
                    el["group_actconductdate_sa1oe86/date_ha2jz81"] || null,
                    el["group_actconductdate_sa1oe86/date_up9xu24"] || null,
                    el["_select_one_conductedby_01"] || null,
                    el["_0_Not_1_New_2_Renovated"] || null,
                    parseInt(el["group_wz1ah68/_IFAD_"] || 0),
                    parseInt(el["group_wz1ah68/_MAF_"] || 0),
                    parseInt(el["group_wz1ah68/_WFP_"] || 0),
                    parseInt(el["group_wz1ah68/_GoL_"] || 0),
                    parseInt(el["group_wz1ah68/_Ben_"] || 0),
                    parseInt(el["group_wz1ah68/integer_oz4sh88"] || 0),
                    el["__version__"] || null,
                    el["_submission_time"] || null,
                ]);

                // Insert Participants
                if (Array.isArray(el["group_aa5jt12"])) {
                    for (const p of el["group_aa5jt12"]) {
                        await runQuery(db, `
                            INSERT INTO tb_Form_1A1_Participant 
                            (SubmissionId, HaveHHId, HHId, NameAndSurname, Age, WomanHead, PWBWStatus, Responsibility, 
                            Gender, Ethnicity, PovertyLevel, PWD, APGMember)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `, [
                            submissionId,
                            p["group_aa5jt12/doyouhavehh_id"] || null,
                            p["group_aa5jt12/mainhhid"] || null,
                            p["group_aa5jt12/select_one_mainNameAndSurname"] ||
                            p["group_aa5jt12/text_hx6fh11"] ||
                            null,
                            parseInt(
                                p["group_aa5jt12/age_selected"] ||
                                p["group_aa5jt12/_mainAge"] ||
                                0
                            ),
                            p["group_aa5jt12/_Yes_No_"] || null,
                            p["group_aa5jt12/_PW_BW_PW_BW_"] || null,
                            p["group_aa5jt12/_main_participant_responsibili"] || null,
                            p["group_aa5jt12/gender_selected"] ||
                            p["group_aa5jt12/_mainGender"] ||
                            null,
                            p["group_aa5jt12/ethnicity_selected"] ||
                            p["group_aa5jt12/_mainEthnicity"] ||
                            null,
                            p["group_aa5jt12/poverty_selected"] ||
                            p["group_aa5jt12/_mainPovertyLevel"] ||
                            null,
                            p["group_aa5jt12/mainPWD_selected"] ||
                            p["group_aa5jt12/_mainPWD"] ||
                            null,
                            p["group_aa5jt12/_mainAPGMember"] || null,
                        ]);
                    }
                }
            }
        }

        console.log("✅ Form 1A1 submission data downloaded and saved to the database successfully.");

    } catch (err) {
        console.error("❌ Error downloading data:", err.message);
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


// ############################ Function to get Form 1A1 participant data ############################
function getForm1A1ParticipantData(language) {
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
                            s.ReportingPeriod,
                            s.Province,
                            s.District,
                            s.Village,
                            s.ActivityType,
                            s.SubActivity,
                            s.ConductDateStart,
                            s.ConductDateEnd,
                            s.ConductedBy,
                            s.VNCAvailable,
                            s.IFAD,
                            s.MAF,
                            s.WFP,
                            s.GoL,
                            s.Ben,
                            s.OtherFund,
                            s.Version,
                            s.SubmissionTime,
                            p.Id AS ParticipantId,
                            p.HHId,
                            p.NameAndSurname,
                            p.Age,
                            p.Gender,
                            p.WomanHead,
                            p.PWBWStatus,
                            p.Responsibility,
                            p.Ethnicity,
                            p.PovertyLevel,
                            p.PWD,
                            p.APGMember,
                            ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                        FROM tb_Form_1A1_Participant p
                        JOIN tb_Form_1A1_Submission s ON p.SubmissionId = s.Id
                    )
                    SELECT
                        np.Id AS SubmissionID,
                        np.ReportingPeriod AS 'ໄລຍະເວລາລາຍງານ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'ບ້ານ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.ActivityType LIMIT 1) AS 'ປະເພດກິດຈະກຳ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.SubActivity LIMIT 1) AS 'ກິດຈະກຳຍ່ອຍ ທີ່ເຂົ້າຮ່ວມ',
                        np.ConductDateStart AS 'ວັນເລີ່ມ',
                        np.ConductDateEnd AS 'ວັນສຳເລັດ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.ConductedBy LIMIT 1) AS 'ນຳພາຈັດຕັ້ງປະຕິບັດໂດຍ',
                        

                        np.HHId AS 'ລະຫັດຄົວເຮືອນ',
                        np.NameAndSurname AS 'ຊື່ ແລະ ນາມສະກຸນ',
                        np.Age AS 'ອາຍຸ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.WomanHead LIMIT 1) AS 'ແມ່ຍິງເປັນຫົວໜ້າຄົວເຮືອນບໍ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PWBWStatus LIMIT 1) AS 'ສະຖານະ PWBW',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.Responsibility LIMIT 1) AS 'ໜ້າທີ່',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'ຊົນເຜົ່າ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PovertyLevel LIMIT 1) AS 'ລະດັບຄວາມທຸກຍາກ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PWD LIMIT 1) AS 'ຜູ້ພິການບໍ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.APGMember LIMIT 1) AS 'ເປັນສະມາຊິກກຸ່ມບໍ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.VNCAvailable LIMIT 1) AS 'ສ້າງສູນຮຽນຮູ້ແລ້ວບໍ',

                        CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                        CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                        CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                        CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                        CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                        CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS OtherFund
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
                                s.ReportingPeriod,
                                s.Province,
                                s.District,
                                s.Village,
                                s.ActivityType,
                                s.SubActivity,
                                s.ConductDateStart,
                                s.ConductDateEnd,
                                s.ConductedBy,
                                s.VNCAvailable,
                                s.IFAD,
                                s.MAF,
                                s.WFP,
                                s.GoL,
                                s.Ben,
                                s.OtherFund,
                                s.Version,
                                s.SubmissionTime,
                                p.Id AS ParticipantId,
                                p.HHId,
                                p.NameAndSurname,
                                p.Age,
                                p.Gender,
                                p.WomanHead,
                                p.PWBWStatus,
                                p.Responsibility,
                                p.Ethnicity,
                                p.PovertyLevel,
                                p.PWD,
                                p.APGMember,
                                ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                            FROM tb_Form_1A1_Participant p
                            JOIN tb_Form_1A1_Submission s ON p.SubmissionId = s.Id
                        )
                        SELECT
                            np.Id AS SubmissionID,
                            np.ReportingPeriod AS 'Reporting Period',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'Village',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.ActivityType LIMIT 1) AS 'Activity Type',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.SubActivity LIMIT 1) AS 'Sub-Activities',
                            np.ConductDateStart AS 'Start Date',
                            np.ConductDateEnd AS 'End Date',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.ConductedBy LIMIT 1) AS 'Conducted By',
                            

                            np.HHId AS 'HH-ID',
                            np.NameAndSurname AS 'Participant Name',
                            np.Age AS 'Age',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.WomanHead LIMIT 1) AS 'Female Headed HH',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PWBWStatus LIMIT 1) AS 'PWBW Status',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.Responsibility LIMIT 1) AS 'Responsibility',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'Ethnicity',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PovertyLevel LIMIT 1) AS 'Poverty Level',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PWD LIMIT 1) AS 'PWD',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.APGMember LIMIT 1) AS 'APG Member',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.VNCAvailable LIMIT 1) AS 'VNC Available',

                            CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                            CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                            CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                            CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                            CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                            CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS Other
                        FROM NumberedParticipants np
                        ORDER BY np.Id DESC, np.rn;
            `;
        }

        db.all(query, [], (err, rows) => {
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


// ############################ Function to get Form 1A1 data by SubmissionId ############################
function getForm1A1ParticipantDataBySID(SubmissionId, language) {
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
                            s.ReportingPeriod,
                            s.Province,
                            s.District,
                            s.Village,
                            s.ActivityType,
                            s.SubActivity,
                            s.ConductDateStart,
                            s.ConductDateEnd,
                            s.ConductedBy,
                            s.VNCAvailable,
                            s.IFAD,
                            s.MAF,
                            s.WFP,
                            s.GoL,
                            s.Ben,
                            s.OtherFund,
                            s.Version,
                            s.SubmissionTime,
                            p.Id AS ParticipantId,
                            p.HHId,
                            p.NameAndSurname,
                            p.Age,
                            p.Gender,
                            p.WomanHead,
                            p.PWBWStatus,
                            p.Responsibility,
                            p.Ethnicity,
                            p.PovertyLevel,
                            p.PWD,
                            p.APGMember,
                            ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                        FROM tb_Form_1A1_Participant p
                        JOIN tb_Form_1A1_Submission s ON p.SubmissionId = s.Id
                        WHERE s.Id =?
                    )
                    SELECT
                        np.ParticipantId as PID,    
                        np.Id AS SubmissionID,
                        np.ReportingPeriod AS 'ໄລຍະເວລາລາຍງານ',
                        np.ConductDateStart AS 'ວັນເລີ່ມ',
                        np.ConductDateEnd AS 'ວັນສຳເລັດ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'ບ້ານ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.ActivityType LIMIT 1) AS 'ປະເພດກິດຈະກຳ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.SubActivity LIMIT 1) AS 'ກິດຈະກຳຍ່ອຍ ທີ່ເຂົ້າຮ່ວມ',
                        
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.ConductedBy LIMIT 1) AS 'ຈັດຕັ້ງປະຕິບັດໂດຍ',
                        

                        np.HHId AS 'ລະຫັດຄົວເຮືອນ',
                        np.NameAndSurname AS 'ຊື່ ແລະ ນາມສະກຸນ',
                        np.Age AS 'ອາຍຸ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.WomanHead LIMIT 1) AS 'ແມ່ຍິງຫົວໜ້າຄົວເຮືອນ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PWBWStatus LIMIT 1) AS 'ສະຖານະ PWBW',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.Responsibility LIMIT 1) AS 'ໜ້າທີ່',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'ຊົນເຜົ່າ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PovertyLevel LIMIT 1) AS 'ລະດັບຄວາມທຸກຍາກ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PWD LIMIT 1) AS 'ຜູ້ພິການບໍ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.APGMember LIMIT 1) AS 'ເປັນສະມາຊິກກຸ່ມບໍ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.VNCAvailable LIMIT 1) AS 'ສ້າງສູນຮຽນຮູ້ແລ້ວບໍ',

                        CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                        CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                        CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                        CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                        CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                        CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS OtherFund
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
                                s.ReportingPeriod,
                                s.Province,
                                s.District,
                                s.Village,
                                s.ActivityType,
                                s.SubActivity,
                                s.ConductDateStart,
                                s.ConductDateEnd,
                                s.ConductedBy,
                                s.VNCAvailable,
                                s.IFAD,
                                s.MAF,
                                s.WFP,
                                s.GoL,
                                s.Ben,
                                s.OtherFund,
                                s.Version,
                                s.SubmissionTime,
                                p.Id AS ParticipantId,
                                p.HHId,
                                p.NameAndSurname,
                                p.Age,
                                p.Gender,
                                p.WomanHead,
                                p.PWBWStatus,
                                p.Responsibility,
                                p.Ethnicity,
                                p.PovertyLevel,
                                p.PWD,
                                p.APGMember,
                                ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                            FROM tb_Form_1A1_Participant p
                            JOIN tb_Form_1A1_Submission s ON p.SubmissionId = s.Id
                            WHERE s.Id =?
                        )
                        SELECT
                            np.ParticipantId as PID,    
                            np.Id AS SubmissionID,
                            np.ReportingPeriod AS 'Reporting Period',
                            np.ConductDateStart AS 'Start Date',
                            np.ConductDateEnd AS 'End Date',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'Village',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.ActivityType LIMIT 1) AS 'Activity Type',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.SubActivity LIMIT 1) AS 'Sub-Activities',
                            
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.ConductedBy LIMIT 1) AS 'Conducted By',
                            

                            np.HHId AS 'HH-ID',
                            np.NameAndSurname AS 'Participant Name',
                            np.Age AS 'Age',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.WomanHead LIMIT 1) AS 'Female Headed',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PWBWStatus LIMIT 1) AS 'PWBW Status',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.Responsibility LIMIT 1) AS 'Responsibility',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'Ethnicity',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PovertyLevel LIMIT 1) AS 'Poverty Level',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.PWD LIMIT 1) AS 'PWD',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.APGMember LIMIT 1) AS 'APG Member',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a1' AND ItemCode=np.VNCAvailable LIMIT 1) AS 'VNC Available',

                            CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                            CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                            CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                            CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                            CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                            CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS Other
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














// ############################ Function to delete Form 1A1 submission data from both local database and KoboToolbox Online ############################
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
            db.run("DELETE FROM tb_Form_1A1_Participant WHERE SubmissionId = ?", [submissionId], function (err) {
                if (err) return reject(err);

                // Then delete the submission itself
                db.run("DELETE FROM tb_Form_1A1_Submission WHERE Id = ?", [submissionId], function (err) {
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
async function getForm1A1SubmissionUUIDBySubmissionId(submissionId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Uuid FROM tb_Form_1A1_Submission WHERE Id = ?", [submissionId]);
    db.close();

    return row ? row.Uuid : null; // Return the UUID or null if not found

}
//function get new submissionID from local database by UUID
async function getForm1A1NewSubmissionIdByUUID(uuId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Id as SubmissionId FROM tb_Form_1A1_Submission WHERE Uuid = ?", [uuId]);
    db.close();

    return row ? row.SubmissionId : null; // Return the UUID or null if not found

}








// ############################ Delete only participant in local DB ############################
async function deleteOnlyForm1A1ParticipantInDB(participantId) {
    const db = getDBConnection();

    return new Promise((resolve, reject) => {
        db.run("DELETE FROM tb_Form_1A1_Participant WHERE Id = ?", [participantId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// ############################ Delete a submission in KoboToolbox ############################
async function deleteOnlyForm1A1SubmissionInKobo(submissionId) {
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

    const submission = await runGet(db, "SELECT * FROM tb_Form_1A1_Submission WHERE Id = ?", [submissionId]);
    const participants = await runAll(db, "SELECT * FROM tb_Form_1A1_Participant WHERE SubmissionId = ?", [submissionId]);

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
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
}



// //############################ XML Builder function: ############################
// function buildSubmissionXML(submission, participants) {
//     const now = formatLocalISOWithOffset();
//     const end = formatLocalISOWithOffset(new Date(Date.now() + 10 * 60000));

//     // console.log("Participants from DB:", participants);
//     // console.log("Type of participants:", typeof participants);
//     // console.log("IsArray?", Array.isArray(participants));

//     const xml = [];
//     xml.push(`<?xml version='1.0' encoding='UTF-8' ?>`);
//     xml.push(`<data id='${KOBO_CB_FOR_STAFF_FORM_ID}'>`);
//     xml.push(`  <start>${now}</start>`);
//     xml.push(`  <end>${end}</end>`);
//     xml.push(`  <date_lv6zg63>${escapeXML(submission.ReportingPeriodDate)}</date_lv6zg63>`);

//     xml.push(`  <group_of5oy77>`);
//     xml.push(`    <date_mg3ho62>${escapeXML(submission.ActivityStartDate)}</date_mg3ho62>`);
//     xml.push(`    <date_pg0bf05>${escapeXML(submission.ActivityEndDate)}</date_pg0bf05>`);
//     xml.push(`  </group_of5oy77>`);

//     xml.push(`  <select_one_category>${escapeXML(submission.Category)}</select_one_category>`);
//     xml.push(`  <select_one_topic>${escapeXML(submission.Topic)}</select_one_topic>`);
//     xml.push(`  <_act_location>${escapeXML(submission.ActivityLocation)}</_act_location>`);

//     participants.forEach(p => {
//         xml.push(`  <group_ap1ti89>`);
//         xml.push(`    <_participation_name>${escapeXML(p.Name)}</_participation_name>`);
//         xml.push(`    <_reponsibility>${escapeXML(p.Responsibility)}</_reponsibility>`);
//         xml.push(`    <_office>${escapeXML(p.Office)}</_office>`);
//         xml.push(`    <_type_of_staff>${escapeXML(p.StaffType)}</_type_of_staff>`);
//         xml.push(`    <_gender>${escapeXML(p.Gender)}</_gender>`);
//         xml.push(`  </group_ap1ti89>`);
//     });

//     xml.push(`  <group_kw0iz30>`);
//     xml.push(`    <_IFAD_>${submission.IFAD || ''}</_IFAD_>`);
//     xml.push(`    <_MAF_>${submission.MAF || ''}</_MAF_>`);
//     xml.push(`    <_WFP_>${submission.WFP || ''}</_WFP_>`);
//     xml.push(`    <_GoL_>${submission.GoL || ''}</_GoL_>`);
//     xml.push(`    <_Ben_>${submission.Ben || ''}</_Ben_>`);
//     xml.push(`  </group_kw0iz30>`);

//     xml.push(`  <meta>`);
//     xml.push(`    <instanceID>uuid:${submission.Uuid}</instanceID>`);
//     xml.push(`  </meta>`);
//     xml.push(`</data>`);

//     return xml.join('\n');
// }


// //############################ Function to submit new submission to KoboToolbox Online ############################
// async function submitNewSubmissionToKobo(xmlData) {
//     const form = new FormData();
//     form.append('xml_submission_file', xmlData, { filename: 'submission.xml' });

//     await axios.post(KOBO_NEW_SUBMISSION_API, form, {
//         headers: {
//             ...form.getHeaders(),
//             Authorization: `Token ${KOBO_API_KEY}`
//         }
//     });
// }

// //Due to the issue of database column return from frontend has 2 langues switch so the column is is dynamic
// //so we need to normalized it before running SQL command
// // Map localized keys to English DB column names
// const normalizeKeys = (data) => {
//     return {
//         PID: data.PID || data.ParticipantId,
//         SubmissionID: data.SubmissionID || data.SubmissionId,
//         Name: data["Name"] || data["ຊື່ ແລະ ນາມສະກຸນ ຜູ້ເຂົ້າຮ່ວມ"],
//         Responsibility: data["Responsibility"] || data["ໜ້າທີ່ຮັບຜິດຊອບ"],
//         Office: data["Office"] || data["ມາຈາກຫ້ອງການ"],
//         StaffType: data["StaffType"] || data["ເປັນພະນັກງານຂອງ"],
//         Gender: data["Gender"] || data["ເພດ"],
//         Category: data["Category"] || data["ຮູບແບບການຝຶກ"],
//         Topic: data["Topic"] || data["ຫົວຂໍ້ສະເພາະດ້ານໃດ"],
//         ActivityLocation: data["ActivityLocation"] || data["ສະຖານທີ ຈັດປະຊຸມ ຫຼື ຝຶກອົບຮົມ"],
//         ReportingPeriod: data["ReportingPeriod"] || data["ໄລຍະເວລາລາຍງານ"],
//         StartDate: data["StartDate"] || data["ວັນເລີ່ມ"],
//         EndDate: data["EndDate"] || data["ວັນສຳເລັດ"],
//         IFAD: parseInt(data.IFAD) || 0,
//         MAF: parseInt(data.MAF) || 0,
//         WFP: parseInt(data.WFP) || 0,
//         GoL: parseInt(data.GoL) || 0,
//         Ben: parseInt(data.Ben) || 0,
//     };
// };



// // ############################ Edit Submission and participation data ############################
// async function editSubmissionAndParticipants(data) {


//     const db = getDBConnection();
//     const d = normalizeKeys(data);

//     console.log("Data received:", data);
//     console.log("NormalizedKeys", d);
//     try {
//         // Update participant
//         await runQuery(db, `
//         UPDATE tb_CB_Staff_Participant
//         SET
//         Name = ?,
//         Responsibility = ?
//         WHERE Id = ?; `
//             , [d.Name, d.Responsibility, d.PID]);

//         // Update submission
//         await runQuery(db, `
//         UPDATE tb_CB_Staff_Submission
//         SET
//         ReportingPeriodDate = ?,
//         ActivityStartDate = ?,
//         ActivityEndDate = ?,
//         ActivityLocation = ?,
//         IFAD = ?,
//         MAF = ?,
//         WFP = ?,
//         GoL = ?,
//         Ben = ?
//         WHERE Id = ?;`,
//             [d.ReportingPeriod,
//             d.StartDate,
//             d.EndDate,
//             d.ActivityLocation,
//             d.IFAD,
//             d.MAF,
//             d.WFP,
//             d.GoL,
//             d.Ben,
//             d.SubmissionID]);

//         console.log("Update cb staff data to database success.");

//     } catch (error) {
//         console.error("Error updating data to database from backend", error.message);
//     } finally {
//         if (db) db.close();
//     }

// }




export {
    downloadForm1A1SubmissionDataFromKoboToolbox,
    getForm1A1ParticipantData,
    getForm1A1ParticipantDataBySID,
    getForm1A1SubmissionUUIDBySubmissionId,
    getForm1A1NewSubmissionIdByUUID,
    deleteOnlyForm1A1ParticipantInDB,
    deleteOnlyForm1A1SubmissionInKobo
};