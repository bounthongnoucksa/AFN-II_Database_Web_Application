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
const KOBO_DOWNLOAD_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_CB_FOR_1A1_FORM_ID}/data.json?limit=1000`; // KoboToolbox API endpoint for downloading submissions



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
                        VNCAvailable, NumberOfNewVNC, NumberOfRenovatedVNC, IFAD, MAF, WFP, GoL, Ben, OtherFund, Version, SubmissionTime)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                            NumberOfNewVNC=excluded.NumberOfNewVNC,
                            NumberOfRenovatedVNC=excluded.NumberOfRenovatedVNC,
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
                    el["number_vnc_new"] || null,
                    el["number_vnc_renovated"] || null,
                    parseInt(el["group_wz1ah68/_IFAD_"] || null),
                    parseInt(el["group_wz1ah68/_MAF_"] || null),
                    parseInt(el["group_wz1ah68/_WFP_"] || null),
                    parseInt(el["group_wz1ah68/_GoL_"] || null),
                    parseInt(el["group_wz1ah68/_Ben_"] || null),
                    parseInt(el["group_wz1ah68/integer_oz4sh88"] || null),
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
function getForm1A1ParticipantData(language, page, limit, filters = []) {
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
                            s.NumberOfNewVNC,
                            s.NumberOfRenovatedVNC,
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
                        ${whereSQL ? 'WHERE ' + whereClauses.join(' AND ') : ''}
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
                        --np.NumberOfNewVNC AS 'ຈຳນວນສູນໃໝ່',
                        --np.NumberOfRenovatedVNC AS 'ຈຳນວນສູນປັບປຸງ',
                        CASE WHEN np.rn = 1 THEN np.NumberOfNewVNC ELSE NULL END AS 'ຈຳນວນສູນໃໝ່',
                        CASE WHEN np.rn = 1 THEN np.NumberOfRenovatedVNC ELSE NULL END AS 'ຈຳນວນສູນປັບປຸງ',

                        CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                        CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                        CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                        CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                        CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                        CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS OtherFund
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
                                s.NumberOfNewVNC,
                                s.NumberOfRenovatedVNC,
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
                            ${whereSQL ? 'WHERE ' + whereClauses.join(' AND ') : ''}
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
                            --np.NumberOfNewVNC AS 'New VNC',
                            --np.NumberOfRenovatedVNC AS 'Renovated VNC',
                            CASE WHEN np.rn = 1 THEN np.NumberOfNewVNC ELSE NULL END AS 'New VNC',
                            CASE WHEN np.rn = 1 THEN np.NumberOfRenovatedVNC ELSE NULL END AS 'Renovated VNC',

                            CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                            CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                            CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                            CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                            CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                            CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS Other
                        FROM NumberedParticipants np
                        ORDER BY np.Id DESC, np.rn
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
        const countQuery = `SELECT COUNT(*) as total FROM tb_Form_1A1_Participant`;
        db.get(countQuery, [], (err, countRow) => {
            if (err) {
                db.close();
                return reject(err);
            }

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
                            s.NumberOfNewVNC,
                            s.NumberOfRenovatedVNC,
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
                        np.NumberOfNewVNC AS 'ຈຳນວນສູນໃໝ່',
                        np.NumberOfRenovatedVNC AS 'ຈຳນວນສູນປັບປຸງ',

                        --CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                        --CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                        --CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                        --CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                        --CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                        --CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS OtherFund
                        np.IFAD AS IFAD,
                        np.MAF AS MAF,
                        np.WFP AS WFP,
                        np.GoL AS GoL,
                        np.Ben AS Ben,
                        np.OtherFund AS OtherFund
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
                                s.NumberOfNewVNC,
                                s.NumberOfRenovatedVNC,
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
                            np.NumberOfNewVNC AS 'New VNC',
                            np.NumberOfRenovatedVNC AS 'Renovated VNC',

                            --CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                            --CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                            --CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                            --CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                            --CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                            --CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS Other
                            np.IFAD AS IFAD,
                            np.MAF AS MAF,
                            np.WFP AS WFP,
                            np.GoL AS GoL,
                            np.Ben AS Ben,
                            np.OtherFund AS OtherFund
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
async function deleteForm1A1SubmissionInKoboAndDatabase(submissionId) {
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
async function getRawForm1A1SubmissionAndParticipantsData(submissionId) {
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
function buildForm1A1SubmissionXML(submission, participants) {
    const now = formatLocalISOWithOffset();
    const end = formatLocalISOWithOffset(new Date(Date.now() + 10 * 60000));

    const xml = [];
    xml.push(`<?xml version='1.0' encoding='UTF-8' ?>`);
    xml.push(`<data id='${KOBO_CB_FOR_1A1_FORM_ID}'>`);

    // Metadata timestamps
    xml.push(`  <start>${now}</start>`);
    xml.push(`  <end>${end}</end>`);
    xml.push(`  <_reportingperiod>${escapeXML(submission.ReportingPeriod)}</_reportingperiod>`);

    // Location and general info
    xml.push(`  <select_one_province>${escapeXML(submission.Province)}</select_one_province>`);
    xml.push(`  <select_one_district>${escapeXML(submission.District)}</select_one_district>`);
    xml.push(`  <select_one_district_village>${escapeXML(submission.Village)}</select_one_district_village>`);
    xml.push(`  <_subacttype>${escapeXML(submission.ActivityType)}</_subacttype>`);
    xml.push(`  <select_one_ma0uf16>${escapeXML(submission.SubActivity)}</select_one_ma0uf16>`);

    // Group: Activity Conduct Dates
    xml.push(`  <group_actconductdate_sa1oe86>`);
    xml.push(`    <date_ha2jz81>${escapeXML(submission.ConductDateStart)}</date_ha2jz81>`);
    xml.push(`    <date_up9xu24>${escapeXML(submission.ConductDateEnd)}</date_up9xu24>`);
    xml.push(`  </group_actconductdate_sa1oe86>`);

    // Other information
    xml.push(`  <_select_one_conductedby_01>${escapeXML(submission.ConductedBy)}</_select_one_conductedby_01>`);
    xml.push(`  <_0_Not_1_New_2_Renovated>${escapeXML(submission.VNCAvailable)}</_0_Not_1_New_2_Renovated>`);
    xml.push(`  <number_vnc_new>${escapeXML(submission.NumberOfNewVNC)}</number_vnc_new>`);
    xml.push(`  <number_vnc_renovated>${escapeXML(submission.NumberOfRenovatedVNC)}</number_vnc_renovated>`);

    // Participants
    participants.forEach(p => {
        xml.push(`  <group_aa5jt12>`);

        xml.push(`    <doyouhavehh_id>${escapeXML(p.HaveHHId)}</doyouhavehh_id>`);
        xml.push(`    <mainhhid>${escapeXML(p.HHId)}</mainhhid>`);

        if (p.HaveHHId === 'hhidyes') {
            xml.push(`    <select_one_mainNameAndSurname>${escapeXML(p.NameAndSurname)}</select_one_mainNameAndSurname>`);
        } else {
            xml.push(`    <text_hx6fh11>${escapeXML(p.NameAndSurname)}</text_hx6fh11>`);
        }


        xml.push(`    <age_selected>${escapeXML(p.Age)}</age_selected>`);
        xml.push(`    <_Yes_No_>${escapeXML(p.WomanHead)}</_Yes_No_>`);
        xml.push(`    <_PW_BW_PW_BW_>${escapeXML(p.PWBWStatus)}</_PW_BW_PW_BW_>`);
        xml.push(`    <_main_participant_responsibili>${escapeXML(p.Responsibility)}</_main_participant_responsibili>`);
        xml.push(`    <gender_selected>${escapeXML(p.Gender)}</gender_selected>`);
        xml.push(`    <ethnicity_selected>${escapeXML(p.Ethnicity)}</ethnicity_selected>`);
        xml.push(`    <poverty_selected>${escapeXML(p.PovertyLevel)}</poverty_selected>`);
        xml.push(`    <mainPWD_selected>${escapeXML(p.PWD)}</mainPWD_selected>`);
        xml.push(`    <_mainAPGMember>${escapeXML(p.APGMember)}</_mainAPGMember>`);

        xml.push(`  </group_aa5jt12>`);
    });

    // Group: Contributions
    xml.push(`  <group_wz1ah68>`);
    xml.push(`    <_IFAD_>${submission.IFAD || ''}</_IFAD_>`);
    xml.push(`    <_MAF_>${submission.MAF || ''}</_MAF_>`);
    xml.push(`    <_WFP_>${submission.WFP || ''}</_WFP_>`);
    xml.push(`    <_GoL_>${submission.GoL || ''}</_GoL_>`);
    xml.push(`    <_Ben_>${submission.Ben || ''}</_Ben_>`);
    xml.push(`    <integer_oz4sh88>${submission.OtherFund || ''}</integer_oz4sh88>`);
    xml.push(`  </group_wz1ah68>`);

    // Meta
    xml.push(`  <meta>`);
    xml.push(`    <instanceID>uuid:${escapeXML(submission.Uuid)}</instanceID>`);
    xml.push(`  </meta>`);

    xml.push(`</data>`);

    return xml.join('\n');
}



//############################ Function to submit new submission to KoboToolbox Online ############################
async function submitNewForm1A1SubmissionToKobo(xmlData) {
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

        // Participant fields
        HaveHHId: data.HaveHHId || data["ມີລະຫັດຄົວເຮືອນບໍ"] || null,
        HHId: data.HHId || data["ລະຫັດຄົວເຮືອນ"] || null,
        NameAndSurname: data.NameAndSurname || data["Participant Name"] || data["ຊື່ ແລະ ນາມສະກຸນ"] || null,
        Age: parseInt(data.Age || data["ອາຍຸ"] || 0),
        Gender: data.Gender || data["ເພດ"] || null,
        WomanHead: data.WomanHead || data["ແມ່ຍິງຫົວໜ້າຄົວເຮືອນ"] || null,
        PWBWStatus: data.PWBWStatus || data["ສະຖານະ PWBW"] || null,
        Responsibility: data.Responsibility || data["Responsibility"] || data["ໜ້າທີ່"] || null,
        Ethnicity: data.Ethnicity || data["ຊົນເຜົ່າ"] || null,
        PovertyLevel: data.PovertyLevel || data["Poverty Level"] || data["ລະດັບຄວາມທຸກຍາກ"] || null,
        PWD: data.PWD || data["ຜູ້ພິການບໍ"] || null,
        APGMember: data.APGMember || data["APG Member"] || data["ເປັນສະມາຊິກກຸ່ມບໍ"] || null,

        // Submission fields
        ReportingPeriod: data.ReportingPeriod || data["ໄລຍະເວລາລາຍງານ"] || null,
        Province: data.Province || data["ແຂວງ"] || null,
        District: data.District || data["ເມືອງ"] || null,
        Village: data.Village || data["ບ້ານ"] || null,
        ActivityType: data.ActivityType || data["ປະເພດກິດຈະກຳ"] || data["Activity Type"] || null,
        SubActivity: data.SubActivity || data["ກິດຈະກຳຍ່ອຍ ທີ່ເຂົ້າຮ່ວມ"] || data["Sub-Activities"] || null,
        ConductDateStart: data.ConductDateStart || data["Start Date"] || data["ວັນເລີ່ມ"] || null,
        ConductDateEnd: data.ConductDateEnd || data["End Date"] || data["ວັນສຳເລັດ"] || null,
        ConductedBy: data.ConductedBy || data["ນຳພາຈັດຕັ້ງປະຕິບັດໂດຍ"] || data["Conducted By"] || null,
        VNCAvailable: data.VNCAvailable || data["ສ້າງສູນຮຽນຮູ້ແລ້ວບໍ"] || data["VNC Available"] || null,
        NumberOfNewVNC: data.NumberOfNewVNC || data["ຈຳນວນສູນໃໝ່"] || data["New VNC"] || null,
        NumberOfRenovatedVNC: data.NumberOfRenovatedVNC || data["ຈຳນວນສູນປັບປຸງ"] || data["Renovated VNC"] || null,

        // Financial support fields (optional chaining with fallback to 0)
        IFAD: isNaN(parseInt(data.IFAD)) ? null : parseInt(data.IFAD),
        MAF: isNaN(parseInt(data.MAF)) ? null : parseInt(data.MAF),
        WFP: isNaN(parseInt(data.WFP)) ? null : parseInt(data.WFP),
        GoL: isNaN(parseInt(data.GoL)) ? null : parseInt(data.GoL),
        Ben: isNaN(parseInt(data.Ben)) ? null : parseInt(data.Ben),
        OtherFund: isNaN(parseInt(data.OtherFund || data.Other | data["Other Fund"])) ? null : parseInt(data.OtherFund || data.Other | data["Other Fund"])
    };
};



// ############################ Edit Submission and participation data ############################
async function editForm1A1SubmissionAndParticipants(data) {

    const db = getDBConnection();
    const d = normalizeKeys(data);

    console.log("🔁 Received Data:", data);
    console.log("📦 Normalized Data:", d);

    try {
        // ✅ Update Participant Record
        await runQuery(db, `
            UPDATE tb_Form_1A1_Participant
            SET
                NameAndSurname = ?,
                Age = ?,
                WomanHead = ?,
                povertyLevel = ?,
                PWD = ?,
                Gender = ?,
                APGMember = ?
            WHERE Id = ?;
        `, [
            d.NameAndSurname,
            d.Age,
            d.WomanHead,
            d.PovertyLevel,
            d.PWD,
            d.Gender,
            d.APGMember,
            d.PID
        ]);

        // ✅ Update Submission Record
        await runQuery(db, `
            UPDATE tb_Form_1A1_Submission
            SET
                ReportingPeriod = ?,
                ConductDateStart = ?,
                ConductDateEnd = ?,
                VNCAvailable = ?,
                NumberOfNewVNC = ?,
                NumberOfRenovatedVNC = ?,
                IFAD = ?,
                MAF = ?,
                WFP = ?,
                GoL = ?,
                Ben = ?,
                OtherFund = ?
            WHERE Id = ?;
        `, [
            d.ReportingPeriod,
            d.ConductDateStart,
            d.ConductDateEnd,
            d.VNCAvailable,
            d.NumberOfNewVNC,
            d.NumberOfRenovatedVNC,
            d.IFAD,
            d.MAF,
            d.WFP,
            d.GoL,
            d.Ben,
            d.OtherFund,
            d.SubmissionID
        ]);

        console.log("✅ Form 1A1 data updated successfully.");

    } catch (err) {
        console.error("❌ Failed to update Form 1A1 data:", err.message);
        throw err;
    } finally {
        if (db) await db.close();
    }

}




export {
    downloadForm1A1SubmissionDataFromKoboToolbox,
    getForm1A1ParticipantData,
    getForm1A1ParticipantDataBySID,
    getForm1A1SubmissionUUIDBySubmissionId,
    getForm1A1NewSubmissionIdByUUID,
    deleteOnlyForm1A1ParticipantInDB,
    deleteOnlyForm1A1SubmissionInKobo,

    deleteForm1A1SubmissionInKoboAndDatabase,
    getRawForm1A1SubmissionAndParticipantsData,
    buildForm1A1SubmissionXML,
    submitNewForm1A1SubmissionToKobo,
    editForm1A1SubmissionAndParticipants
};