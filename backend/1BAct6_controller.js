//backend/1BAct6_controller.js
import 'dotenv/config'; // Load environment variables from .env file
import axios from 'axios'; // Importing axios for HTTP requests
import { getDBConnection } from './getDBConnection.js'; // Importing the database connection helper

import FormData from 'form-data'; // Importing FormData for handling multipart/form-data requests
import fs from 'fs'; // Importing fs for file system operations

//require('dotenv').config(); // Load environment variables from .env file
const KOBO_API_KEY = process.env.KOBO_API_KEY; // KoboToolbox API key from environment variables
const KOBO_NEW_SUBMISSION_API = process.env.KOBO_NEW_SUBMISSION_API_URL; // KoboToolbox API endpoint for new submissions
const KOBO_FORM_1BAct6_FORM_ID = process.env.KOBO_FORM_1BAct6_UID;
//const KOBO_FORM_1BAct6_FORM_ID = process.env.KOBO_FORM_1BAct6_UID_TEST; // KoboToolbox form ID for CB for Villagers
const KOBO_DELETE_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_FORM_1BAct6_FORM_ID}/data/`; // KoboToolbox API endpoint for deleting submissions
const KOBO_DOWNLOAD_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_FORM_1BAct6_FORM_ID}/data.json`; // KoboToolbox API endpoint for downloading submissions


//Download new data from Kobo Toolbox
async function downloadForm1BAct6SubmissionDataFromKoboToolbox() {
    let db;
    try {
        db = getDBConnection();
        const headers = { Authorization: `Token ${KOBO_API_KEY}` };
        let nextUrl = KOBO_DOWNLOAD_SUBMISSION_API;

        // Clear old data
        await runQuery(db, "DELETE FROM tb_Form_1BAct6_Participant");
        await runQuery(db, "DELETE FROM tb_Form_1BAct6_Submission");

        while (nextUrl) {
            const resp = await axios.get(nextUrl, { headers });
            const root = resp.data;
            nextUrl = root.next;

            for (const el of root.results) {
                const submissionId = el["_id"];

                // Insert submission
                await runQuery(db, `
                    INSERT INTO tb_Form_1BAct6_Submission (
                        Id, Uuid, Start, End, Reporting_period,
                        Province, District, Village, SubActivity,
                        Conduct_Start, Conduct_End, CBOEstablish, Conducted_by,
                        CropType, CropQuantity, LivestockType, LivestockQuantity,
                        ForageQuantity, ACRegistered, GrantReceived,
                        IFAD, MAF, WFP, GoL, Ben, OtherFund,
                        Version, Submission_time
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    submissionId,
                    el["_uuid"] || el["formhub/uuid"] || null,
                    el["start"] || null,
                    el["end"] || null,
                    el["_reportingperiod"] || null,
                    el["select_one_province"] || null,
                    el["select_one_district"] || null,
                    el["select_one_district_village"] || null,
                    el["_select_one_subactivity"] || null,
                    el["group_actconductdate_sa1oe86/date_ha2jz81"] || null,
                    el["group_actconductdate_sa1oe86/date_up9xu24"] || null,
                    el["_1_2_"] || null,
                    el["_select_one_conductedby_01"] || null,
                    el["_foodcroptype"] || null,
                    parseInt(el["_foodcropamount"] || null),
                    el["_livestocktype"] || null,
                    parseInt(el["_livestockamount"] || null),
                    parseInt(el["_forageamount"] || null),
                    el["_ac_regis"] || null,
                    el["_grant_receive"] || null,
                    parseInt(el["group_wz1ah68/_IFAD_"] || null),
                    parseInt(el["group_wz1ah68/_MAF_"] || null),
                    parseInt(el["group_wz1ah68/_WFP_"] || null),
                    parseInt(el["group_wz1ah68/_GoL_"] || null),
                    parseInt(el["group_wz1ah68/_Ben_"] || null),
                    parseInt(el["group_wz1ah68/integer_oz4sh88"] || null),
                    el["__version__"] || null,
                    el["_submission_time"] || null
                ]);

                // Insert participants
                const participants = el["group_participantdetail_hp48r4"];
                if (Array.isArray(participants)) {
                    for (const p of participants) {
                        const haveHHId = p["group_participantdetail_hp48r4/doyouhavehh_id"];
                        const HHId = haveHHId === "hhidyes" ? p["group_participantdetail_hp48r4/mainhhid"] || null : null;
                        const NameAndSurname =
                            haveHHId === "hhidyes"
                                ? p["group_participantdetail_hp48r4/select_one_mainNameAndSurname"] || null
                                : p["group_participantdetail_hp48r4/text_hx6fh11"] || null;

                        await runQuery(db, `
                            INSERT INTO tb_Form_1BAct6_Participant (
                                SubmissionId, HaveHH_id, HHId, NameAndSurname,
                                Age, Gender, Ethnicity, Poverty_level, PWD_status, PositionInGroup, MSME
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `, [
                            submissionId,
                            haveHHId || null,
                            HHId,
                            NameAndSurname,
                            parseInt(p["group_participantdetail_hp48r4/_mainAge"] || 0),
                            p["group_participantdetail_hp48r4/_mainGender"] || null,
                            p["group_participantdetail_hp48r4/_mainEthnicity"] || null,
                            p["group_participantdetail_hp48r4/_mainPovertyLevel"] || null,
                            p["group_participantdetail_hp48r4/_mainPWD"] || null,
                            p["group_participantdetail_hp48r4/_group_position"] || null,
                            p["group_participantdetail_hp48r4/_MSME_Yes_No_"] || null
                        ]);
                    }
                }
            }
        }

        console.log("✅ Form 1BAct6 submission data downloaded and saved.");
    } catch (err) {
        console.error("❌ Error downloading Form 1BAct6 data:", err.message);
        throw err;
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



// ############################ Function to get Form 1A3b participant data ############################
function getForm1BAct6ParticipantData(language, page, limit, filters = []) {
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
                        s.Reporting_period,
                        s.Province,
                        s.District,
                        s.Village,
                        s.SubActivity,
                        s.Conduct_Start,
                        s.Conduct_End,
                        s.CBOEstablish,
                        s.Conducted_by,
                        s.CropType,
                        s.CropQuantity,
                        s.LivestockType,
                        s.LivestockQuantity,
                        s.ForageQuantity,
                        s.ACRegistered,
                        s.GrantReceived,
                        s.IFAD,
                        s.MAF,
                        s.WFP,
                        s.GoL,
                        s.Ben,
                        s.OtherFund,
                        s.Version,
                        s.Submission_time,
                        p.Id AS ParticipantId,
                        p.HaveHH_id,
                        p.HHId,
                        p.NameAndSurname,
                        p.Age,
                        p.Gender,
                        p.Ethnicity,
                        p.Poverty_level,
                        p.PWD_status,
                        p.PositionInGroup,
                        p.MSME,
                        ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                    FROM tb_Form_1BAct6_Participant p
                    JOIN tb_Form_1BAct6_Submission s ON p.SubmissionId = s.Id
                     ${whereSQL ? 'WHERE ' + whereClauses.join(' AND ') : ''}
                )
                SELECT 
                    np.Id AS SubmissionID,
                    np.Reporting_period AS 'ໄລຍະເວລາລາຍງານ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'ບ້ານ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.SubActivity LIMIT 1) AS 'ກິດຈະກຳຍ່ອຍທີ່ເຂົ້າຮ່ວມ',
                    --np.SubActivity AS 'ກິດຈະກຳຍ່ອຍທີ່ເຂົ້າຮ່ວມ',
                    np.Conduct_Start AS 'ວັນເລີ່ມ',
                    np.Conduct_End AS 'ວັນສຳເລັດ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.CBOEstablish LIMIT 1) AS 'ມີການຈັດຕັ້ງກຸ່ມຜະລິດບໍ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Conducted_by LIMIT 1) AS 'ຈັດຕັ້ງປະຕິບັດໂດຍ',
					np.HHId AS 'ລະຫັດຄົວເຮືອນ',
                    np.NameAndSurname AS 'ຊື່ ແລະ ນາມສະກຸນ',
                    np.Age AS 'ອາຍຸ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'ຊົນເຜົ່າ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Poverty_level LIMIT 1) AS 'ຖານະຄອບຄົວ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.PWD_status LIMIT 1) AS 'ເສຍອົງຄະບໍ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.PositionInGroup LIMIT 1) AS 'ຕຳແໜ່ງໃນກຸ່ມ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.MSME LIMIT 1) AS 'MSME Member',
					
					CASE WHEN np.rn = 1 THEN np.CropType ELSE NULL END AS 'ປະເພດພືດອາຫານ',
                    CASE WHEN np.rn = 1 THEN np.CropQuantity ELSE NULL END AS 'ປະລິມານພືດ (ກິໂລ)',
                    CASE WHEN np.rn = 1 THEN np.LivestockType ELSE NULL END AS 'ປະເພດສັດ',
                    CASE WHEN np.rn = 1 THEN np.LivestockQuantity ELSE NULL END AS 'ປະລິມານສັດ (ກິໂລ)',
                    CASE WHEN np.rn = 1 THEN np.ForageQuantity ELSE NULL END AS 'ພືດອາຫານສັດ (ກິໂລ)',
					
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.ACRegistered LIMIT 1) AS 'AC Registered',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.GrantReceived LIMIT 1) AS 'ໄດ້ຮັບທຶນ',
                    CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                    CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                    CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                    CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                    CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                    CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS 'Other Fund'
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
                        s.SubActivity,
                        s.Conduct_Start,
                        s.Conduct_End,
                        s.CBOEstablish,
                        s.Conducted_by,
                        s.CropType,
                        s.CropQuantity,
                        s.LivestockType,
                        s.LivestockQuantity,
                        s.ForageQuantity,
                        s.ACRegistered,
                        s.GrantReceived,
                        s.IFAD,
                        s.MAF,
                        s.WFP,
                        s.GoL,
                        s.Ben,
                        s.OtherFund,
                        s.Version,
                        s.Submission_time,
                        p.Id AS ParticipantId,
                        p.HaveHH_id,
                        p.HHId,
                        p.NameAndSurname,
                        p.Age,
                        p.Gender,
                        p.Ethnicity,
                        p.Poverty_level,
                        p.PWD_status,
                        p.PositionInGroup,
                        p.MSME,
                        ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                    FROM tb_Form_1BAct6_Participant p
                    JOIN tb_Form_1BAct6_Submission s ON p.SubmissionId = s.Id
                     ${whereSQL ? 'WHERE ' + whereClauses.join(' AND ') : ''}
                )
                SELECT 
                    np.Id AS SubmissionID,
                    np.Reporting_period AS 'Reporting Period',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'Village',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.SubActivity LIMIT 1) AS 'Sub-Activity',
                    --np.SubActivity AS 'Sub-Activity',
                    np.Conduct_Start AS 'Start Date',
                    np.Conduct_End AS 'End Date',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.CBOEstablish LIMIT 1) AS 'CBO Established',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Conducted_by LIMIT 1) AS 'Conducted By',
					np.HHId AS 'HH-ID',
                    np.NameAndSurname AS 'Participant Name',
                    np.Age AS 'Age',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'Ethnicity',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Poverty_level LIMIT 1) AS 'Poverty Level',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.PWD_status LIMIT 1) AS 'PWD Status',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.PositionInGroup LIMIT 1) AS 'Position in group',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.MSME LIMIT 1) AS 'MSME',
					CASE WHEN np.rn = 1 THEN np.CropType ELSE NULL END AS 'Crop Type',
                    CASE WHEN np.rn = 1 THEN np.CropQuantity ELSE NULL END AS 'Crop Qty (kg)',
                    CASE WHEN np.rn = 1 THEN np.LivestockType ELSE NULL END AS 'Livestock Type',
                    CASE WHEN np.rn = 1 THEN np.LivestockQuantity ELSE NULL END AS 'Livestock Qty (kg)',
                    CASE WHEN np.rn = 1 THEN np.ForageQuantity ELSE NULL END AS 'Forage Qty (kg)',
					
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.ACRegistered LIMIT 1) AS 'AC Registered',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.GrantReceived LIMIT 1) AS 'Grant Received',
                    
                    CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                    CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                    CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                    CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                    CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                    CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS 'Other Fund'
                FROM NumberedParticipants np
                ORDER BY np.Id DESC, np.rn
            `;
        }
        // If limit is provided and valid, append LIMIT clause
        let finalQuery = query;
        if (isPaginated) {
            finalQuery += `LIMIT ? OFFSET ?`;
            queryParams.push(Number(limit), offset);
        }

        // First: Get total count (needed for frontend)
        const countQuery = `SELECT COUNT(*) as total FROM tb_Form_1BAct6_Participant`;
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


// ############################ Function to get Form 1A3b data by SubmissionId ############################
function getForm1BAct6ParticipantDataBySID(SubmissionId, language) {
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
                        s.SubActivity,
                        s.Conduct_Start,
                        s.Conduct_End,
                        s.CBOEstablish,
                        s.Conducted_by,
                        s.CropType,
                        s.CropQuantity,
                        s.LivestockType,
                        s.LivestockQuantity,
                        s.ForageQuantity,
                        s.ACRegistered,
                        s.GrantReceived,
                        s.IFAD,
                        s.MAF,
                        s.WFP,
                        s.GoL,
                        s.Ben,
                        s.OtherFund,
                        s.Version,
                        s.Submission_time,
                        p.Id AS ParticipantId,
                        p.HaveHH_id,
                        p.HHId,
                        p.NameAndSurname,
                        p.Age,
                        p.Gender,
                        p.Ethnicity,
                        p.Poverty_level,
                        p.PWD_status,
                        p.PositionInGroup,
                        p.MSME,
                        ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                    FROM tb_Form_1BAct6_Participant p
                    JOIN tb_Form_1BAct6_Submission s ON p.SubmissionId = s.Id
					WHERE s.Id =?
                )
                SELECT 
                    np.ParticipantId as PID,
					np.Id AS SubmissionID,
                    np.Reporting_period AS 'ໄລຍະເວລາລາຍງານ',
					np.Conduct_Start AS 'ວັນເລີ່ມ',
                    np.Conduct_End AS 'ວັນສຳເລັດ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'ບ້ານ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.SubActivity LIMIT 1) AS 'ກິດຈະກຳຍ່ອຍທີ່ເຂົ້າຮ່ວມ',
                    --np.SubActivity AS 'ກິດຈະກຳຍ່ອຍທີ່ເຂົ້າຮ່ວມ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.CBOEstablish LIMIT 1) AS 'ມີການຕັ້ງກຸ່ມຜະລິດບໍ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Conducted_by LIMIT 1) AS 'ຈັດຕັ້ງປະຕິບັດໂດຍ',
					np.HHId AS 'ລະຫັດຄົວເຮືອນ',
                    np.NameAndSurname AS 'ຊື່ ແລະ ນາມສະກຸນ',
                    np.Age AS 'ອາຍຸ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'ຊົນເຜົ່າ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Poverty_level LIMIT 1) AS 'ຖານະຄອບຄົວ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.PWD_status LIMIT 1) AS 'ເສຍອົງຄະບໍ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.PositionInGroup LIMIT 1) AS 'ຕຳແໜ່ງໃນກຸ່ມ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.MSME LIMIT 1) AS 'MSME Member',
					
					--CASE WHEN np.rn = 1 THEN np.CropType ELSE NULL END AS 'ປະເພດພືດອາຫານ',
                    --CASE WHEN np.rn = 1 THEN np.CropQuantity ELSE NULL END AS 'ປະລິມານພືດ (ກິໂລ)',
                    --CASE WHEN np.rn = 1 THEN np.LivestockType ELSE NULL END AS 'ປະເພດສັດ',
                    --CASE WHEN np.rn = 1 THEN np.LivestockQuantity ELSE NULL END AS 'ປະລິມານສັດ (ກິໂລ)',
                    --CASE WHEN np.rn = 1 THEN np.ForageQuantity ELSE NULL END AS 'ພືດອາຫານສັດ (ກິໂລ)',
                    np.CropType AS 'ປະເພດພືດອາຫານ',
                    np.CropQuantity AS 'ປະລິມານພືດ (ກິໂລ)',
                    np.LivestockType AS 'ປະເພດສັດ',
                    np.LivestockQuantity AS 'ປລິມານສັດ (ກິໂລ)',
                    np.ForageQuantity AS 'ພືດອາຫານສັດ (ກິໂລ)',
					
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.ACRegistered LIMIT 1) AS 'AC Registered',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.GrantReceived LIMIT 1) AS 'ໄດ້ຮັບທຶນ',
                    --CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                    --CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                    --CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                    --CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                    --CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                    --CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS 'Other Fund'
                    np.IFAD AS IFAD,
                    np.MAF AS MAF,
                    np.WFP AS WFP,
                    np.GoL AS GoL,
                    np.Ben AS Ben,
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
                        s.SubActivity,
                        s.Conduct_Start,
                        s.Conduct_End,
                        s.CBOEstablish,
                        s.Conducted_by,
                        s.CropType,
                        s.CropQuantity,
                        s.LivestockType,
                        s.LivestockQuantity,
                        s.ForageQuantity,
                        s.ACRegistered,
                        s.GrantReceived,
                        s.IFAD,
                        s.MAF,
                        s.WFP,
                        s.GoL,
                        s.Ben,
                        s.OtherFund,
                        s.Version,
                        s.Submission_time,
                        p.Id AS ParticipantId,
                        p.HaveHH_id,
                        p.HHId,
                        p.NameAndSurname,
                        p.Age,
                        p.Gender,
                        p.Ethnicity,
                        p.Poverty_level,
                        p.PWD_status,
                        p.PositionInGroup,
                        p.MSME,
                        ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                    FROM tb_Form_1BAct6_Participant p
                    JOIN tb_Form_1BAct6_Submission s ON p.SubmissionId = s.Id
					WHERE s.Id =?
                )
                SELECT 
                    np.ParticipantId as PID,
					np.Id AS SubmissionID,
                    np.Reporting_period AS 'Reporting Period',
					np.Conduct_Start AS 'Start Date',
                    np.Conduct_End AS 'End Date',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'Village',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.SubActivity LIMIT 1) AS 'Sub-Activity',
                    --np.SubActivity AS 'Sub-Activity',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.CBOEstablish LIMIT 1) AS 'CBO Established',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Conducted_by LIMIT 1) AS 'Conducted By',
					np.HHId AS 'HH-ID',
                    np.NameAndSurname AS 'Participant Name',
                    np.Age AS 'Age',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'Ethnicity',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.Poverty_level LIMIT 1) AS 'Poverty Level',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.PWD_status LIMIT 1) AS 'PWD Status',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.PositionInGroup LIMIT 1) AS 'Position in group',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.MSME LIMIT 1) AS 'MSME',
					--CASE WHEN np.rn = 1 THEN np.CropType ELSE NULL END AS 'Crop Type',
                    --CASE WHEN np.rn = 1 THEN np.CropQuantity ELSE NULL END AS 'Crop Qty (kg)',
                    --CASE WHEN np.rn = 1 THEN np.LivestockType ELSE NULL END AS 'Livestock Type',
                    --CASE WHEN np.rn = 1 THEN np.LivestockQuantity ELSE NULL END AS 'Livestock Qty (kg)',
                    --CASE WHEN np.rn = 1 THEN np.ForageQuantity ELSE NULL END AS 'Forage Qty (kg)',
                    np.CropType AS 'Crop Type',
                    np.CropQuantity AS 'Crop Qty (kg)',
                    np.LivestockType AS 'Livestock Type',
                    np.LivestockQuantity AS 'Livestock Qty(kg)',
                    np.ForageQuantity AS 'Forage Qty (kg)',
					
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.ACRegistered LIMIT 1) AS 'AC Registered',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1bact6' AND ItemCode=np.GrantReceived LIMIT 1) AS 'Grant Received',
                    
                    --CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                    --CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                    --CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                    --CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL,
                    --CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS Ben,
                    --CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS 'Other Fund'
                    np.IFAD AS IFAD,
                    np.MAF AS MAF,
                    np.WFP AS WFP,
                    np.GoL AS GoL,
                    np.Ben AS Ben,
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














// ############################ Function to delete Form 1BAct6 submission data from both local database and KoboToolbox Online ############################
async function deleteForm1BAct6SubmissionInKoboAndDatabase(submissionId) {
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
            db.run("DELETE FROM tb_Form_1BAct6_Participant WHERE SubmissionId = ?", [submissionId], function (err) {
                if (err) return reject(err);

                // Then delete the submission itself
                db.run("DELETE FROM tb_Form_1BAct6_Submission WHERE Id = ?", [submissionId], function (err) {
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
async function getForm1BAct6SubmissionUUIDBySubmissionId(submissionId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Uuid FROM tb_Form_1BAct6_Submission WHERE Id = ?", [submissionId]);
    db.close();

    return row ? row.Uuid : null; // Return the UUID or null if not found

}
//function get new submissionID from local database by UUID
async function getForm1BAct6NewSubmissionIdByUUID(uuId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Id as SubmissionId FROM tb_Form_1BAct6_Submission WHERE Uuid = ?", [uuId]);
    db.close();

    return row ? row.SubmissionId : null; // Return the UUID or null if not found

}








// ############################ Delete only participant in local DB ############################
async function deleteOnlyForm1BAct6ParticipantInDB(participantId) {
    const db = getDBConnection();

    return new Promise((resolve, reject) => {
        db.run("DELETE FROM tb_Form_1BAct6_Participant WHERE Id = ?", [participantId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// ############################ Delete a submission in KoboToolbox ############################
async function deleteOnlyForm1BAct6SubmissionInKobo(submissionId) {
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
async function getRawForm1BAct6SubmissionAndParticipantsData(submissionId) {
    const db = getDBConnection();

    const submission = await runGet(db, "SELECT * FROM tb_Form_1BAct6_Submission WHERE Id = ?", [submissionId]);
    const participants = await runAll(db, "SELECT * FROM tb_Form_1BAct6_Participant WHERE SubmissionId = ?", [submissionId]);

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
function buildForm1BAct6SubmissionXML(submission, participants) {
    const now = formatLocalISOWithOffset();
    const end = formatLocalISOWithOffset(new Date(Date.now() + 10 * 60000)); // 10 mins later

    const xml = [];
    xml.push(`<?xml version='1.0' encoding='UTF-8' ?>`);
    xml.push(`<data id='${KOBO_FORM_1BAct6_FORM_ID}'>`);

    // Metadata timestamps
    xml.push(`  <start>${now}</start>`);
    xml.push(`  <end>${end}</end>`);
    xml.push(`  <_reportingperiod>${escapeXML(submission.Reporting_period)}</_reportingperiod>`);

    // Location and general info
    xml.push(`  <select_one_province>${escapeXML(submission.Province)}</select_one_province>`);
    xml.push(`  <select_one_district>${escapeXML(submission.District)}</select_one_district>`);
    xml.push(`  <select_one_district_village>${escapeXML(submission.Village)}</select_one_district_village>`);
    xml.push(`  <_select_one_subactivity>${escapeXML(submission.SubActivity)}</_select_one_subactivity>`);

    // Group: Activity Conduct Dates
    xml.push(`  <group_actconductdate_sa1oe86>`);
    xml.push(`    <date_ha2jz81>${escapeXML(submission.Conduct_Start)}</date_ha2jz81>`);
    xml.push(`    <date_up9xu24>${escapeXML(submission.Conduct_End)}</date_up9xu24>`);
    xml.push(`  </group_actconductdate_sa1oe86>`);

    // Other Information
    xml.push(`  <_1_2_>${escapeXML(submission.CBOEstablish)}</_1_2_>`);
    xml.push(`  <_select_one_conductedby_01>${escapeXML(submission.Conducted_by)}</_select_one_conductedby_01>`);

    // Group: Agricultural support
    xml.push(`  <_foodcroptype>${escapeXML(submission.CropType)}</_foodcroptype>`);
    xml.push(`  <_foodcropamount>${submission.CropQuantity || ''}</_foodcropamount>`);
    xml.push(`  <_livestocktype>${escapeXML(submission.LivestockType)}</_livestocktype>`);
    xml.push(`  <_livestockamount>${submission.LivestockQuantity || ''}</_livestockamount>`);
    xml.push(`  <_forageamount>${submission.ForageQuantity || ''}</_forageamount>`);

    xml.push(`  <_ac_regis>${escapeXML(submission.ACRegistered)}</_ac_regis>`);
    xml.push(`  <_grant_receive>${escapeXML(submission.GrantReceived)}</_grant_receive>`);

    // Participants (group_participantdetail_hp48r4)
    participants.forEach(p => {
        xml.push(`  <group_participantdetail_hp48r4>`);
        xml.push(`    <doyouhavehh_id>${escapeXML(p.HaveHH_id)}</doyouhavehh_id>`);
        xml.push(`    <mainhhid>${escapeXML(p.HHId)}</mainhhid>`);

        // Name field logic (you can adjust if you split later)
        if (p.HaveHH_id === 'hhidyes') {
            xml.push(`    <select_one_mainNameAndSurname>${escapeXML(p.NameAndSurname)}</select_one_mainNameAndSurname>`);
        } else {
            xml.push(`    <text_hx6fh11>${escapeXML(p.NameAndSurname)}</text_hx6fh11>`);
        }

        xml.push(`    <_mainAge>${p.Age || 0}</_mainAge>`);
        xml.push(`    <_mainGender>${escapeXML(p.Gender)}</_mainGender>`);
        xml.push(`    <_mainEthnicity>${escapeXML(p.Ethnicity)}</_mainEthnicity>`);
        xml.push(`    <_mainPovertyLevel>${escapeXML(p.Poverty_level)}</_mainPovertyLevel>`);
        xml.push(`    <_mainPWD>${escapeXML(p.PWD_status)}</_mainPWD>`);
        xml.push(`    <_group_position>${escapeXML(p.PositionInGroup)}</_group_position>`);
        xml.push(`    <_MSME_Yes_No_>${escapeXML(p.MSME)}</_MSME_Yes_No_>`);
        xml.push(`  </group_participantdetail_hp48r4>`);
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
async function submitNewForm1BAct6SubmissionToKobo(xmlData) {
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
        HHId: data.HHId || data["HH-ID"] || data["ລະຫັດຄົວເຮືອນ"] || null,
        NameAndSurname: data.NameAndSurname || data["Participant Name"] || data["ຊື່ ແລະ ນາມສະກຸນ"] || null,
        Age: parseInt(data.Age || data["ອາຍຸ"] || 0),
        Gender: data.Gender || data["Gender"] || data["ເພດ"] || null,
        Ethnicity: data.Ethnicity || data["Ethnicity"] || data["ຊົນເຜົ່າ"] || null,
        PovertyLevel: data.Poverty_level || data["Poverty Level"] || data["ຖານະຄອບຄົວ"] || null,
        PWD: data.PWD || data["PWD Status"] || data["ເສຍອົງຄະບໍ"] || null,
        PositionInGroup: data.PositionInGroup || data["Position in group"] || data["ຕຳແໜ່ງໃນກຸ່ມ"] || null,
        MSME: data.MSME || data["MSME"] || data["MSME Member"] || null,

        // Submission fields (use `rn = 1`-guarded ones where applicable)
        Reporting_period: data.ReportingPeriod || data["Reporting Period"] || data["ໄລຍະເວລາລາຍງານ"] || null,
        Province: data.Province || data["Province"] || data["ແຂວງ"] || null,
        District: data.District || data["District"] || data["ເມືອງ"] || null,
        Village: data.Village || data["Village"] || data["ບ້ານ"] || null,
        SubActivity: data.SubActivity || data["Sub-Activity"] || data["ກິດຈະກຳຍ່ອຍທີ່ເຂົ້າຮ່ວມ"] || null,
        Conduct_Start: data.Conduct_Start || data["Start Date"] || data["ວັນເລີ່ມ"] || null,
        Conduct_End: data.Conduct_End || data["End Date"] || data["ວັນສຳເລັດ"] || null,
        CBOEstablish: data.CBOEstablish || data["CBO Established"] || data["ມີການຈັດຕັ້ງກຸ່ມຜະລິດບໍ"] || null,
        Conducted_by: data.Conducted_by || data["Conducted By"] || data["ຈັດຕັ້ງປະຕິບັດໂດຍ"] || null,
        CropType: data.CropType || data["Crop Type"] || data["ປະເພດພືດອາຫານ"] || null,
        CropQuantity: isNaN(parseFloat(data.CropQuantity || data["Crop Qty (kg)"] || data["ປະລິມານພືດ (ກິໂລ)"])) ? null : parseFloat(data.CropQuantity || data["Crop Qty (kg)"] || data["ປະລິມານພືດ (ກິໂລ)"]),
        LivestockType: data.LivestockType || data["Livestock Type"] || data["ປະເພດສັດ"] || null,
        LivestockQuantity: isNaN(parseFloat(data.LivestockQuantity || data["Livestock Qty (kg)"] || data["ປະລິມານສັດ (ກິໂລ)"])) ? null : parseFloat(data.LivestockQuantity || data["Livestock Qty (kg)"] || data["ປະລິມານສັດ (ກິໂລ)"]),
        ForageQuantity: isNaN(parseFloat(data.ForageQuantity || data["Forage Qty (kg)"] || data["ພືດອາຫານສັດ (ກິໂລ)"])) ? null : parseFloat(data.ForageQuantity || data["Forage Qty (kg)"] || data["ພືດອາຫານສັດ (ກິໂລ)"]),
        ACRegistered: data.ACRegistered || data["AC Registered"] || null,
        GrantReceived: data.GrantReceived || data["ໄດ້ຮັບທຶນ"] || data["Grant Received"] || null,

        // Contribution values
        IFAD: isNaN(parseFloat(data.IFAD)) ? null : parseFloat(data.IFAD),
        MAF: isNaN(parseFloat(data.MAF)) ? null : parseFloat(data.MAF),
        WFP: isNaN(parseFloat(data.WFP)) ? null : parseFloat(data.WFP),
        GoL: isNaN(parseFloat(data.GoL)) ? null : parseFloat(data.GoL),
        Ben: isNaN(parseFloat(data.Ben)) ? null : parseFloat(data.Ben),
        OtherFund: isNaN(parseFloat(data.OtherFund || data.Other || data["Other Fund"])) ? null : parseFloat(data.OtherFund || data.Other || data["Other Fund"])

    };
};



// ############################ Edit Submission and participation data ############################
async function editForm1BAct6SubmissionAndParticipants(data) {

    const db = getDBConnection();
    const d = normalizeKeys(data);

    console.log("🔁 Received Data:", data);
    console.log("📦 Normalized Data:", d);

    try {
        // ✅ Update Participant Record
        await runQuery(db, `
            UPDATE tb_Form_1BAct6_Participant
            SET
                NameAndSurname = ?,    
                Age = ?,
                Gender = ?,
                Poverty_level = ?,
                PWD_status = ?,
                PositionInGroup = ?,
                MSME = ?               
            WHERE Id = ?;
        `, [
            d.NameAndSurname,
            d.Age,
            d.Gender,
            d.PovertyLevel,
            d.PWD,
            d.PositionInGroup,
            d.MSME,
            d.PID
        ]);

        // ✅ Update Submission Record (only once per submission ID)
        await runQuery(db, `
            UPDATE tb_Form_1BAct6_Submission
            SET
                Reporting_period = ?,
                Conduct_Start = ?,
                Conduct_End = ?,
                CropType = ?,
                CropQuantity = ?,
                LivestockType = ?,
                LivestockQuantity = ?,
                ForageQuantity = ?,
                ACRegistered = ?,
                GrantReceived = ?,
                IFAD = ?,
                MAF = ?,
                WFP = ?,
                GoL = ?,
                Ben = ?,
                OtherFund = ?
            WHERE Id = ?;
        `, [
            d.Reporting_period,
            d.Conduct_Start,
            d.Conduct_End,
            d.CropType,
            d.CropQuantity,
            d.LivestockType,
            d.LivestockQuantity,
            d.ForageQuantity,
            d.ACRegistered,
            d.GrantReceived,
            d.IFAD,
            d.MAF,
            d.WFP,
            d.GoL,
            d.Ben,
            d.OtherFund,
            d.SubmissionID
        ]);

        console.log("✅ Form 1BAct6 data updated successfully.");
    } catch (err) {
        console.error("❌ Failed to update Form 1BAct6 data:", err.message);
        throw err;
    } finally {
        if (db) await db.close();
    }

}




//Export component
export {
    downloadForm1BAct6SubmissionDataFromKoboToolbox,
    getForm1BAct6ParticipantData,
    getForm1BAct6ParticipantDataBySID,
    getForm1BAct6SubmissionUUIDBySubmissionId,
    getForm1BAct6NewSubmissionIdByUUID,
    deleteOnlyForm1BAct6ParticipantInDB,
    deleteOnlyForm1BAct6SubmissionInKobo,

    deleteForm1BAct6SubmissionInKoboAndDatabase,
    getRawForm1BAct6SubmissionAndParticipantsData,
    buildForm1BAct6SubmissionXML,
    submitNewForm1BAct6SubmissionToKobo,
    editForm1BAct6SubmissionAndParticipants

}
