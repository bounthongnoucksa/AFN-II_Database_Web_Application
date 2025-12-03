//backend/1A4_controller.js
import 'dotenv/config'; // Load environment variables from .env file
import axios from 'axios'; // Importing axios for HTTP requests
import { getDBConnection } from './getDBConnection.js'; // Importing the database connection helper

import FormData from 'form-data'; // Importing FormData for handling multipart/form-data requests
import fs from 'fs'; // Importing fs for file system operations

//require('dotenv').config(); // Load environment variables from .env file
const KOBO_API_KEY = process.env.KOBO_API_KEY; // KoboToolbox API key from environment variables
const KOBO_NEW_SUBMISSION_API = process.env.KOBO_NEW_SUBMISSION_API_URL; // KoboToolbox API endpoint for new submissions
const KOBO_FORM_1A4_FORM_ID = process.env.KOBO_FORM_1A4_UID;
//const KOBO_FORM_1A4_FORM_ID = process.env.KOBO_FORM_1A4_UID_TEST; // KoboToolbox form ID for CB for Villagers
const KOBO_DELETE_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_FORM_1A4_FORM_ID}/data/`; // KoboToolbox API endpoint for deleting submissions
const KOBO_DOWNLOAD_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_FORM_1A4_FORM_ID}/data.json`; // KoboToolbox API endpoint for downloading submissions


//Download new data from Kobo Toolbox
async function downloadForm1A4SubmissionDataFromKoboToolbox() {
    let db;
    try {
        db = getDBConnection();
        const headers = { Authorization: `Token ${KOBO_API_KEY}` };
        let nextUrl = KOBO_DOWNLOAD_SUBMISSION_API;

        // Clear old data
        await runQuery(db, "DELETE FROM tb_Form_1A4_Participant");
        await runQuery(db, "DELETE FROM tb_Form_1A4_Submission");

        while (nextUrl) {
            const resp = await axios.get(nextUrl, { headers });
            const root = resp.data;
            nextUrl = root.next;

            for (const el of root.results) {
                const submissionId = el["_id"];

                // Insert submission data
                await runQuery(db, `
                    INSERT INTO tb_Form_1A4_Submission (
                        Id, Uuid, Start, End, Reporting_period, Province, District, Village,
                        DevPlan, SubActivity, Conduct_date1, Conduct_date2, Cons_identified,
                        Cons_area, Conducted_by, KeySpeciesConserved,
                        IFAD, MAF, WFP, GoL, Ben, OtherFund,
                        Version, Submission_time
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(Id) DO UPDATE SET 
                        Uuid=excluded.Uuid,
                        Start=excluded.Start,
                        End=excluded.End,
                        Reporting_period=excluded.Reporting_period,
                        Province=excluded.Province,
                        District=excluded.District,
                        Village=excluded.Village,
                        DevPlan=excluded.DevPlan,
                        SubActivity=excluded.SubActivity,
                        Conduct_date1=excluded.Conduct_date1,
                        Conduct_date2=excluded.Conduct_date2,
                        Cons_identified=excluded.Cons_identified,
                        Cons_area=excluded.Cons_area,
                        Conducted_by=excluded.Conducted_by,
                        KeySpeciesConserved=excluded.KeySpeciesConserved,
                        IFAD=excluded.IFAD,
                        MAF=excluded.MAF,
                        WFP=excluded.WFP,
                        GoL=excluded.GoL,
                        Ben=excluded.Ben,
                        OtherFund=excluded.OtherFund,
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
                    el["_devplan"] || null,
                    el["_subactivity"] || null,
                    el["group_actconductdate_sa1oe86/date_ha2jz81"] || null,
                    el["group_actconductdate_sa1oe86/date_up9xu24"] || null,
                    parseInt(el["cons_area"] || 0),
                    parseInt(el["decimal_qs5co50"] || 0),
                    el["_select_one_conductedby_01"] || null,
                    el["text_zk0ie07"] || null,
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
                        const haveHH = p["group_participantdetail_hp48r4/doyouhavehh_id"] || null;
                        const name =
                            haveHH === "hhidyes"
                                ? p["group_participantdetail_hp48r4/select_one_mainNameAndSurname"]
                                : p["group_participantdetail_hp48r4/text_hx6fh11"];

                        await runQuery(db, `
                            INSERT INTO tb_Form_1A4_Participant (
                                SubmissionId, HaveHH_id, HHId, NameAndSurname,
                                Age, Gender, Ethnicity, Poverty_level, PWD_status, APGMember
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `, [
                            submissionId,
                            haveHH,
                            p["group_participantdetail_hp48r4/mainhhid"] || null,
                            name || null,
                            parseInt(p["group_participantdetail_hp48r4/_mainAge"] || 0),
                            p["group_participantdetail_hp48r4/_mainGender"] || null,
                            p["group_participantdetail_hp48r4/_mainEthnicity"] || null,
                            p["group_participantdetail_hp48r4/_mainPovertyLevel"] || null,
                            p["group_participantdetail_hp48r4/_mainPWD"] || null,
                            p["group_participantdetail_hp48r4/_mainAPGMember"] || null
                        ]);
                    }
                }
            }
        }

        console.log("✅ Form 1A4 submission data downloaded and saved to the database successfully.");
    } catch (err) {
        console.error("❌ Error downloading Form 1A4 data:", err.message);
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



// ############################ Function to get Form 1A3b participant data ############################
function getForm1A4ParticipantData(language, page, limit, filters = []) {
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
                                s.DevPlan,
                                s.SubActivity,
                                s.Conduct_date1,
                                s.Conduct_date2,
                                s.Cons_identified,
                                s.Cons_area,
                                s.Conducted_by,
                                s.KeySpeciesConserved,
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
                                p.APGMember,
                                ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                            FROM tb_Form_1A4_Participant p
                            JOIN tb_Form_1A4_Submission s ON p.SubmissionId = s.Id
                            ${whereSQL ? 'WHERE ' + whereClauses.join(' AND ') : ''}
                        )
                        SELECT
                            np.Id AS SubmissionID,
                            np.Reporting_period AS 'ໄລຍະເວລາລາຍງານ',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'ບ້ານ',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.DevPlan LIMIT 1) AS 'ນອນຢູ່ໃນແຜນພັດທະນາຂອງບ້ານບໍ',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.SubActivity LIMIT 1) AS 'ກິດຈະກຳຍ່ອຍທີ່ເຂົ້າຮ່ວມ',
                            np.Conduct_date1 AS 'ວັນເລີ່ມ',
                            np.Conduct_date2 AS 'ວັນສຳເລັດ',
                            CASE WHEN np.rn = 1 THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Cons_identified LIMIT 1) ELSE NULL END AS 'ໄດ້ກຳນົດໃຫ້ມີເຂດສະຫງວນບໍ',
                            CASE WHEN np.rn = 1 THEN np.Cons_area ELSE NULL END AS 'ຂະໜາດຂອງເຂດສະຫງວນ(ເຮັກຕາ)',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Conducted_by LIMIT 1) AS 'ຮັບຜິດຊອບໂດຍ',
                            CASE WHEN np.rn = 1 THEN np.KeySpeciesConserved ELSE NULL END AS 'ຊະນິດພັນ (ພືດ/ສັດນ້ຳ) ຕົ້ນຕໍທີ່ສະຫງວນ',
                            np.HHId AS 'ລະຫັດຄົວເຮືອນ',
                            np.NameAndSurname AS 'ຊື່ ແລະ ນາມສະກຸນ ຜູ້ໄດ້ເຂົ້າຮ່ວມ',
                            np.Age AS 'ອາຍຸ',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'ຊົນເຜົ່າ',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Poverty_level LIMIT 1) AS 'ລະດັບຄວາມທຸກຍາກ',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.PWD_status LIMIT 1) AS 'ຜູ້ພິການບໍ',
                            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.APGMember LIMIT 1) AS 'ເປັນສະມາຊິກກຸ່ມບໍ',

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
                            s.DevPlan,
                            s.SubActivity,
                            s.Conduct_date1,
                            s.Conduct_date2,
                            s.Cons_identified,
                            s.Cons_area,
                            s.Conducted_by,
                            s.KeySpeciesConserved,
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
                            p.APGMember,
                            ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                        FROM tb_Form_1A4_Participant p
                        JOIN tb_Form_1A4_Submission s ON p.SubmissionId = s.Id
                        ${whereSQL ? 'WHERE ' + whereClauses.join(' AND ') : ''}
                    )
                    SELECT
                        np.Id AS SubmissionID,
                        np.Reporting_period AS 'Reporting Period',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'Village',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.DevPlan LIMIT 1) AS 'community investment plan developed',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.SubActivity LIMIT 1) AS 'Sub-Activity',
                        np.Conduct_date1 AS 'Start Date',
                        np.Conduct_date2 AS 'End Date',
                        CASE WHEN np.rn = 1 THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Cons_identified LIMIT 1) ELSE NULL END AS 'Cons. Area identification',
                        CASE WHEN np.rn = 1 THEN np.Cons_area ELSE NULL END AS 'Conservation Area',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Conducted_by LIMIT 1) AS 'Conducted By',
                        CASE WHEN np.rn = 1 THEN np.KeySpeciesConserved ELSE NULL END AS 'Key Species Conserved',

                        np.HHId AS 'HH-ID',
                        np.NameAndSurname AS 'Participant Name',
                        np.Age AS 'Age',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'Ethnicity',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Poverty_level LIMIT 1) AS 'Poverty Level',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.PWD_status LIMIT 1) AS 'PWD Status',
                        (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.APGMember LIMIT 1) AS 'APG Member',

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
        // // If limit is provided and valid, append LIMIT clause
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
        const countQuery = `SELECT COUNT(*) as total FROM tb_Form_1A4_Participant`;
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
function getForm1A4ParticipantDataBySID(SubmissionId, language) {
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
                        s.DevPlan,
                        s.SubActivity,
                        s.Conduct_date1,
                        s.Conduct_date2,
                        s.Cons_identified,
                        s.Cons_area,
                        s.Conducted_by,
                        s.KeySpeciesConserved,
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
                        p.APGMember,
                        ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                    FROM tb_Form_1A4_Participant p
                    JOIN tb_Form_1A4_Submission s ON p.SubmissionId = s.Id
					WHERE s.Id =?
                )
                SELECT
					np.ParticipantId as PID,
                    np.Id AS SubmissionID,
                    np.Reporting_period AS 'ໄລຍະເວລາລາຍງານ',
                    np.Conduct_date1 AS 'ວັນເລີ່ມ',
                    np.Conduct_date2 AS 'ວັນສຳເລັດ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'ບ້ານ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.DevPlan LIMIT 1) AS 'ນອນຢູ່ໃນແຜນພັດທະນາຂອງບ້ານບໍ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.SubActivity LIMIT 1) AS 'ກິດຈະກຳຍ່ອຍ',
					CASE WHEN np.rn = 1 THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Cons_identified LIMIT 1) ELSE NULL END AS 'ໄດ້ກຳນົດໃຫ້ມີເຂດສະຫງວນບໍ',
					CASE WHEN np.rn = 1 THEN np.Cons_area ELSE NULL END AS 'ຂະໜາດຂອງເຂດສະຫງວນ(ເຮັກຕາ)',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Conducted_by LIMIT 1) AS 'ຮັບຜິດຊອບໂດຍ',
                    CASE WHEN np.rn = 1 THEN np.KeySpeciesConserved ELSE NULL END AS 'ຊະນິດພັນ (ພືດ/ສັດນ້ຳ) ຕົ້ນຕໍທີ່ສະຫງວນ',
                    np.HHId AS 'ລະຫັດຄົວເຮືອນ',
                    np.NameAndSurname AS 'ຊື່ ແລະ ນາມສະກຸນ ຜູ້ໄດ້ເຂົ້າຮ່ວມ',
                    np.Age AS 'ອາຍຸ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'ຊົນເຜົ່າ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Poverty_level LIMIT 1) AS 'ລະດັບຄວາມທຸກຍາກ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.PWD_status LIMIT 1) AS 'ຜູ້ພິການບໍ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.APGMember LIMIT 1) AS 'ເປັນສະມາຊິກກຸ່ມບໍ',

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
                        s.DevPlan,
                        s.SubActivity,
                        s.Conduct_date1,
                        s.Conduct_date2,
                        s.Cons_identified,
                        s.Cons_area,
                        s.Conducted_by,
                        s.KeySpeciesConserved,
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
                        p.APGMember,
                        ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                    FROM tb_Form_1A4_Participant p
                    JOIN tb_Form_1A4_Submission s ON p.SubmissionId = s.Id
					WHERE s.Id =?
                )
                SELECT
					np.ParticipantId as PID,
                    np.Id AS SubmissionID,
                    np.Reporting_period AS 'Reporting Period',
                    np.Conduct_date1 AS 'Start Date',
                    np.Conduct_date2 AS 'End Date',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'Village',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.DevPlan LIMIT 1) AS 'Community investment plan developed',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.SubActivity LIMIT 1) AS 'Sub-Activity',
					CASE WHEN np.rn = 1 THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Cons_identified LIMIT 1) ELSE NULL END AS 'Cons. Area identification',
					CASE WHEN np.rn = 1 THEN np.Cons_area ELSE NULL END AS 'Conservation Area',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Conducted_by LIMIT 1) AS 'Conducted By',
                    CASE WHEN np.rn = 1 THEN np.KeySpeciesConserved ELSE NULL END AS 'Key Species Conserved',

                    np.HHId AS 'HH-ID',
                    np.NameAndSurname AS 'Participant Name',
                    np.Age AS 'Age',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'Ethnicity',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.Poverty_level LIMIT 1) AS 'Poverty Level',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.PWD_status LIMIT 1) AS 'PWD Status',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_1a4' AND ItemCode=np.APGMember LIMIT 1) AS 'APG Member',

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














// ############################ Function to delete Form 1A4 submission data from both local database and KoboToolbox Online ############################
async function deleteForm1A4SubmissionInKoboAndDatabase(submissionId) {
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
            db.run("DELETE FROM tb_Form_1A4_Participant WHERE SubmissionId = ?", [submissionId], function (err) {
                if (err) return reject(err);

                // Then delete the submission itself
                db.run("DELETE FROM tb_Form_1A4_Submission WHERE Id = ?", [submissionId], function (err) {
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
async function getForm1A4SubmissionUUIDBySubmissionId(submissionId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Uuid FROM tb_Form_1A4_Submission WHERE Id = ?", [submissionId]);
    db.close();

    return row ? row.Uuid : null; // Return the UUID or null if not found

}
//function get new submissionID from local database by UUID
async function getForm1A4NewSubmissionIdByUUID(uuId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Id as SubmissionId FROM tb_Form_1A4_Submission WHERE Uuid = ?", [uuId]);
    db.close();

    return row ? row.SubmissionId : null; // Return the UUID or null if not found

}








// ############################ Delete only participant in local DB ############################
async function deleteOnlyForm1A4ParticipantInDB(participantId) {
    const db = getDBConnection();

    return new Promise((resolve, reject) => {
        db.run("DELETE FROM tb_Form_1A4_Participant WHERE Id = ?", [participantId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// ############################ Delete a submission in KoboToolbox ############################
async function deleteOnlyForm1A4SubmissionInKobo(submissionId) {
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
async function getRawForm1A4SubmissionAndParticipantsData(submissionId) {
    const db = getDBConnection();

    const submission = await runGet(db, "SELECT * FROM tb_Form_1A4_Submission WHERE Id = ?", [submissionId]);
    const participants = await runAll(db, "SELECT * FROM tb_Form_1A4_Participant WHERE SubmissionId = ?", [submissionId]);

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
function buildForm1A4SubmissionXML(submission, participants) {
    const now = formatLocalISOWithOffset();
    const end = formatLocalISOWithOffset(new Date(Date.now() + 10 * 60000));

    const xml = [];
    xml.push(`<?xml version='1.0' encoding='UTF-8' ?>`);
    xml.push(`<data id='${KOBO_FORM_1A4_FORM_ID}'>`);

    // Metadata timestamps
    xml.push(`  <start>${now}</start>`);
    xml.push(`  <end>${end}</end>`);
    xml.push(`  <_reportingperiod>${escapeXML(submission.Reporting_period)}</_reportingperiod>`);

    // Location and general info
    xml.push(`  <select_one_province>${escapeXML(submission.Province)}</select_one_province>`);
    xml.push(`  <select_one_district>${escapeXML(submission.District)}</select_one_district>`);
    xml.push(`  <select_one_district_village>${escapeXML(submission.Village)}</select_one_district_village>`);
    xml.push(`  <_devplan>${escapeXML(submission.DevPlan)}</_devplan>`);
    xml.push(`  <_subactivity>${escapeXML(submission.SubActivity)}</_subactivity>`);

    // Group: Activity Conduct Dates
    xml.push(`  <group_actconductdate_sa1oe86>`);
    xml.push(`    <date_ha2jz81>${escapeXML(submission.Conduct_date1)}</date_ha2jz81>`);
    xml.push(`    <date_up9xu24>${escapeXML(submission.Conduct_date2)}</date_up9xu24>`);
    xml.push(`  </group_actconductdate_sa1oe86>`);

    // Conservation Info
    xml.push(`  <cons_area>${submission.Cons_identified || 0}</cons_area>`);
    xml.push(`  <decimal_qs5co50>${submission.Cons_area || 0}</decimal_qs5co50>`);
    xml.push(`  <_select_one_conductedby_01>${escapeXML(submission.Conducted_by)}</_select_one_conductedby_01>`);
    xml.push(`  <text_zk0ie07>${escapeXML(submission.KeySpeciesConserved)}</text_zk0ie07>`);

    // Participants
    participants.forEach(p => {
        xml.push(`  <group_participantdetail_hp48r4>`);

        xml.push(`    <doyouhavehh_id>${escapeXML(p.HaveHH_id)}</doyouhavehh_id>`);
        xml.push(`    <mainhhid>${escapeXML(p.HHId)}</mainhhid>`);

        if (p.HaveHH_id === "hhidyes") {
            xml.push(`    <select_one_mainNameAndSurname>${escapeXML(p.NameAndSurname)}</select_one_mainNameAndSurname>`);

        } else {
            xml.push(`    <text_hx6fh11>${escapeXML(p.NameAndSurname)}</text_hx6fh11>`);
        }

        xml.push(`    <_mainAge>${escapeXML(p.Age)}</_mainAge>`);
        xml.push(`    <_mainGender>${escapeXML(p.Gender)}</_mainGender>`);
        xml.push(`    <_mainEthnicity>${escapeXML(p.Ethnicity)}</_mainEthnicity>`);
        xml.push(`    <_mainPovertyLevel>${escapeXML(p.Poverty_level)}</_mainPovertyLevel>`);
        xml.push(`    <_mainPWD>${escapeXML(p.PWD_status)}</_mainPWD>`);
        xml.push(`    <_mainAPGMember>${escapeXML(p.APGMember)}</_mainAPGMember>`);

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
async function submitNewForm1A4SubmissionToKobo(xmlData) {
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
        // IDs
        PID: data.PID || data.ParticipantId,
        SubmissionID: data.SubmissionID || data.Id || data["SubmissionID"],
        

        // Participant fields
        NameAndSurname: data.NameAndSurname || data["Participant Name"] || data["ຊື່ ແລະ ນາມສະກຸນ ຜູ້ໄດ້ເຂົ້າຮ່ວມ"] || null,
        Age: parseInt(data.Age || data["ອາຍຸ"] || 0),
        Gender: data.Gender || data["ເພດ"] || null,
        PovertyLevel: data.Poverty_level || data["ລະດັບຄວາມທຸກຍາກ"] || data["Poverty Level"] || null,
        PWD: data.PWD_status || data["ຜູ້ພິການບໍ"] || data["PWD Status"] || null,
        APGMember: data.APGMember || data["ເປັນສະມາຊິກກຸ່ມບໍ"] || data["APG Member"] || null,

        // Submission fields
        ReportingPeriod: data.ReportingPeriod || data["ໄລຍະເວລາລາຍງານ"] || data["Reporting Period"] || null,
        ConductDateStart: data.ConductDateStart || data["ວັນເລີ່ມ"] || data["Start Date"] || null,
        ConductDateEnd: data.ConductDateEnd || data["ວັນສຳເລັດ"] || data["End Date"] || null,
        DevPlan: data.DevPlan || data["ນອນຢູ່ໃນແຜນພັດທະນາຂອງບ້ານບໍ"] || data["Community investment plan developed"] || null,
        ConsArea: parseFloat(data.ConsArea || data["ຂະໜາດຂອງເຂດສະຫງວນ(ເຮັກຕາ)"] || data["Conservation Area"] || 0),
        KeySpeciesConserved: data.KeySpeciesConserved || data["ຊະນິດພັນ (ພືດ/ສັດນ້ຳ) ຕົ້ນຕໍທີ່ສະຫງວນ"] || data["Key Species Conserved"] || null,

        // Financial support fields
        IFAD: isNaN(parseInt(data.IFAD)) ? null : parseInt(data.IFAD),
        MAF: isNaN(parseInt(data.MAF)) ? null : parseInt(data.MAF),
        WFP: isNaN(parseInt(data.WFP)) ? null : parseInt(data.WFP),
        GoL: isNaN(parseInt(data.GoL)) ? null : parseInt(data.GoL),
        Ben: isNaN(parseInt(data.Ben)) ? null : parseInt(data.Ben),
        OtherFund: isNaN(parseInt(data.OtherFund || data["Other Fund"])) ? null : parseInt(data.OtherFund || data["Other Fund"])
    };
};



// ############################ Edit Submission and participation data ############################
async function editForm1A4SubmissionAndParticipants(data) {


    const db = getDBConnection();
    const d = normalizeKeys(data);

    console.log("🔁 Received Data:", data);
    console.log("📦 Normalized Data (1A4):", d);

    try {
        // ✅ Update Participant Record
        await runQuery(db, `
            UPDATE tb_Form_1A4_Participant
            SET
                NameAndSurname = ?,
                Age = ?,
                Gender = ?,
                Poverty_level = ?,    
                PWD_status = ?,
                APGMember = ?
                
            WHERE Id = ?;
        `, [
            d.NameAndSurname,
            d.Age,
            d.Gender,
            d.PovertyLevel,
            d.PWD,
            d.APGMember,
            d.PID
        ]);

        // ✅ Update Submission Record
        await runQuery(db, `
            UPDATE tb_Form_1A4_Submission
            SET
                Reporting_period = ?,
                Conduct_date1 = ?,
                Conduct_date2 = ?,
                DevPlan = ?,               
                Cons_area = ?,                
                KeySpeciesConserved = ?,
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
            d.DevPlan,
            d.ConsArea,
            d.KeySpeciesConserved,
            d.IFAD,
            d.MAF,
            d.WFP,
            d.GoL,
            d.Ben,
            d.OtherFund,
            d.SubmissionID
        ]);

        console.log("✅ Form 1A4 data updated successfully.");
    } catch (err) {
        console.error("❌ Failed to update Form 1A4 data:", err.message);
        throw err;
    } finally {
        if (db) await db.close();
    }

}




//Export component
export {
    downloadForm1A4SubmissionDataFromKoboToolbox,
    getForm1A4ParticipantData,
    getForm1A4ParticipantDataBySID,
    getForm1A4SubmissionUUIDBySubmissionId,
    getForm1A4NewSubmissionIdByUUID,
    deleteOnlyForm1A4ParticipantInDB,
    deleteOnlyForm1A4SubmissionInKobo,

    deleteForm1A4SubmissionInKoboAndDatabase,
    getRawForm1A4SubmissionAndParticipantsData,
    buildForm1A4SubmissionXML,
    submitNewForm1A4SubmissionToKobo,
    editForm1A4SubmissionAndParticipants

}
