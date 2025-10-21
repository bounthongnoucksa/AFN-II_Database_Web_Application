//backend/3Act1b_controller.js
import 'dotenv/config'; // Load environment variables from .env file
import axios from 'axios'; // Importing axios for HTTP requests
import { getDBConnection } from './getDBConnection.js'; // Importing the database connection helper

import FormData from 'form-data'; // Importing FormData for handling multipart/form-data requests
import fs from 'fs'; // Importing fs for file system operations

//require('dotenv').config(); // Load environment variables from .env file
const KOBO_API_KEY = process.env.KOBO_API_KEY; // KoboToolbox API key from environment variables
const KOBO_NEW_SUBMISSION_API = process.env.KOBO_NEW_SUBMISSION_API_URL; // KoboToolbox API endpoint for new submissions
const KOBO_FORM_3Act1bFORM_ID = process.env.KOBO_FORM_3Act1b_UID;
//const KOBO_FORM_3Act1bFORM_ID = process.env.KOBO_FORM_3Act1b_UID_TEST; // KoboToolbox form ID for CB for Villagers
const KOBO_DELETE_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_FORM_3Act1bFORM_ID}/data/`; // KoboToolbox API endpoint for deleting submissions
const KOBO_DOWNLOAD_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_FORM_3Act1bFORM_ID}/data.json`; // KoboToolbox API endpoint for downloading submissions


//Download new data from Kobo Toolbox
async function downloadForm3Act1bSubmissionDataFromKoboToolbox() {
    let db;
    try {
        db = getDBConnection();

        const headers = {
            Authorization: `Token ${KOBO_API_KEY}`
        };

        let nextUrl = KOBO_DOWNLOAD_SUBMISSION_API;

        // Optional: clear old data
        await runQuery(db, "DELETE FROM tb_Form_3Act1b_Participant");
        await runQuery(db, "DELETE FROM tb_Form_3Act1b_Submission");

        while (nextUrl) {
            const resp = await axios.get(nextUrl, { headers });
            const root = resp.data;
            nextUrl = root.next;

            for (const el of root.results) {
                const submissionId = el["_id"];

                await runQuery(
                    db,
                    `INSERT OR REPLACE INTO tb_Form_3Act1b_Submission (
                        Id, Uuid, Start, End, Reporting_period, Province, District, Activity,
                        Conduct_date_1, Conduct_date_2, MeetingNo, VDPApprovalNumber,
                        DNCPApproval, DNCP_Item, EquiptSupported,
                        IFAD, MAF, WFP, GoL, Ben, OtherFund, Version, Submission_time
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        submissionId,
                        el["_uuid"] || null,
                        el["start"] || null,
                        el["end"] || null,
                        el["_reportingperiod"] || null,
                        el["select_one_province"] || null,
                        el["select_one_district"] || null,
                        el["_subactivity"] || null,
                        el["group_actconductdate_sa1oe86/date_ha2jz81"] || null,
                        el["group_actconductdate_sa1oe86/date_up9xu24"] || null,
                        el["_1_2_3"] || null,
                        el["_VDP_"] || null,
                        el["select_one_tb1ji94"] || null,
                        el["_DNCP_item"] || null,
                        el["_Yes_No_"] || null,
                        parseInt(el["group_wz1ah68/_IFAD_"] || null),
                        parseInt(el["group_wz1ah68/_MAF_"] || null),
                        parseInt(el["group_wz1ah68/_WFP_"] || null),
                        parseInt(el["group_wz1ah68/_GoL_"] || null),
                        parseInt(el["group_wz1ah68/_Ben_"] || null),
                        parseInt(el["group_wz1ah68/integer_oz4sh88"] || null),
                        el["__version__"] || null,
                        el["_submission_time"] || null
                    ]
                );

                // Handle participants
                const participants = el["group_participantdetail_hp48r4"];
                if (Array.isArray(participants)) {
                    for (const p of participants) {
                        await runQuery(
                            db,
                            `INSERT INTO tb_Form_3Act1b_Participant (
                                Submission_id, Full_name, Office, Age, Gender
                            ) VALUES (?, ?, ?, ?, ?)`,
                            [
                                submissionId,
                                p["group_participantdetail_hp48r4/text_xh9tx30"] || null,
                                p["group_participantdetail_hp48r4/_selectone_office"] || null,
                                parseInt(p["group_participantdetail_hp48r4/_mainAge"] || 0),
                                p["group_participantdetail_hp48r4/_mainGender"] || null
                            ]
                        );
                    }
                }
            }
        }

        console.log("✅ Form 3Act1b submission data downloaded and saved.");
    } catch (err) {
        console.error("❌ Error downloading Form 3Act1b data:", err.message);
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



// ############################ Function to get Form 1BAct8 participant data ############################
function getForm3Act1bParticipantData(language, limit) {
    return new Promise((resolve, reject) => {

        const db = getDBConnection(); // Get the database connection

        const queryParams = [];

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
                        s.Activity,
                        s.Conduct_date_1,
                        s.Conduct_date_2,
                        s.MeetingNo,
                        s.VDPApprovalNumber,
                        s.DNCPApproval,
                        s.DNCP_Item,
                        s.EquiptSupported,
                        s.IFAD,
                        s.MAF,
                        s.WFP,
                        s.GoL,
                        s.Ben,
                        s.OtherFund,
                        s.Version,
                        s.Submission_time,
                        p.Id AS ParticipantId,
                        p.Full_name,
                        p.Office,
                        p.Age,
                        p.Gender,
                        ROW_NUMBER() OVER (PARTITION BY p.Submission_id ORDER BY p.Id) AS rn
                    FROM tb_Form_3Act1b_Participant p
                    JOIN tb_Form_3Act1b_Submission s ON p.Submission_id = s.Id
                )
                SELECT
                    np.Id AS SubmissionID,
                    np.Reporting_period AS 'ໄລຍະເວລາລາຍງານ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
                    --(SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Activity LIMIT 1) AS 'ກິດຈະກຳ',
                    np.Activity AS 'ກິດຈະກຳຍ່ອຍທີ່ເຂົ້າຮ່ວມ',
                    np.Conduct_date_1 AS 'ວັນເລີ່ມ',
                    np.Conduct_date_2 AS 'ວັນສຳເລັດ',
                    CASE WHEN np.rn = 1 THEN np.MeetingNo ELSE NULL END AS 'ກອງປະຊຸມຄັ້ງທີ',
                    
                    np.Full_name AS 'ຊື່ ແລະ ນາມສະກຸນ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Office LIMIT 1) AS 'ມາຈາກຫ້ອງການ',
                    np.Age AS 'ອາຍຸ',
                    (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                    CASE WHEN np.rn = 1 THEN np.VDPApprovalNumber ELSE NULL END AS 'ຈ/ນ VDP ຮັບຮອງແລ້ວ',
                    CASE WHEN np.rn = 1 THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.DNCPApproval LIMIT 1) ELSE NULL END AS 'DNCP Approval',
                    -- CASE WHEN np.rn = 1 THEN np.DNCP_Item ELSE NULL END AS 'ບັນດາກິດຈະກໍາການລົງທຶນ ລວມຢູ່ໃນແຜນ DNCP',
                    CASE WHEN np.rn = 1 THEN TRIM(
                            (CASE WHEN np.DNCP_Item LIKE '%agr_production%' 
                                THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'agr_production') || ' ' 
                                ELSE '' END) ||
                            (CASE WHEN np.DNCP_Item LIKE '%infra%' 
                                THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'infra') || ' ' 
                                ELSE '' END) ||
                            (CASE WHEN np.DNCP_Item LIKE '%seed_funds%' 
                                THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'seed_funds') || ' ' 
                                ELSE '' END))
                        ELSE NULL 
                    END AS 'ບັນດາກິດຈະກໍາການລົງທຶນ ລວມຢູ່ໃນແຜນ DNCP',

                    CASE WHEN np.rn = 1 THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.EquiptSupported LIMIT 1) ELSE NULL END AS 'ວັດຖຸ/ປັດໃຈໄດ້ຮັບຈາກໂຄງການ',
                    CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS 'IFAD',
                    CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS 'MAF',
                    CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS 'WFP',
                    CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS 'GoL',
                    CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS 'Ben',
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
                        s.Activity,
                        s.Conduct_date_1,
                        s.Conduct_date_2,
                        s.MeetingNo,
                        s.VDPApprovalNumber,
                        s.DNCPApproval,
                        s.DNCP_Item,
                        s.EquiptSupported,
                        s.IFAD,
                        s.MAF,
                        s.WFP,
                        s.GoL,
                        s.Ben,
                        s.OtherFund,
                        s.Version,
                        s.Submission_time,
                        p.Id AS ParticipantId,
                        p.Full_name,
                        p.Office,
                        p.Age,
                        p.Gender,
                        ROW_NUMBER() OVER (PARTITION BY p.Submission_id ORDER BY p.Id) AS rn
                    FROM tb_Form_3Act1b_Participant p
                    JOIN tb_Form_3Act1b_Submission s ON p.Submission_id = s.Id
                )
                SELECT
                    np.Id AS SubmissionID,
                    np.Reporting_period AS 'Reporting Period',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
                    --(SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Activity LIMIT 1) AS 'Sub-Activity',
                    np.Activity AS 'Sub-Activity',
                    np.Conduct_date_1 AS 'Start',
                    np.Conduct_date_2 AS 'Completed',
                    CASE WHEN np.rn = 1 THEN np.MeetingNo ELSE NULL END AS 'Meeting No.',
                    
                    np.Full_name AS 'Participants to DNC Meeting',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Office LIMIT 1) AS 'Representation of line agencies',
                    np.Age AS 'Age',
                    (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                    CASE WHEN np.rn = 1 THEN np.VDPApprovalNumber ELSE NULL END AS 'VDP Approval No.',
                    CASE WHEN np.rn = 1 THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.DNCPApproval LIMIT 1) ELSE NULL END AS 'DNCP Approval',
                    -- CASE WHEN np.rn = 1 THEN np.DNCP_Item ELSE NULL END AS 'DNCP Items',
                    CASE 
                        WHEN np.rn = 1 THEN TRIM(
                            (CASE WHEN np.DNCP_Item LIKE '%agr_production%' 
                                THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'agr_production') || ' ' 
                                ELSE '' END) ||
                            (CASE WHEN np.DNCP_Item LIKE '%infra%' 
                                THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'infra') || ' ' 
                                ELSE '' END) ||
                            (CASE WHEN np.DNCP_Item LIKE '%seed_funds%' 
                                THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'seed_funds') || ' ' 
                                ELSE '' END)
                        )
                        ELSE NULL 
                    END AS 'DNCP Investment Activities',
                    
                    CASE WHEN np.rn = 1 THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.EquiptSupported LIMIT 1) ELSE NULL END AS 'Equip. Supported',
                    CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS 'IFAD',
                    CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS 'MAF',
                    CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS 'WFP',
                    CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS 'GoL',
                    CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS 'Ben',
                    CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS 'Other Fund'
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


// ############################ Function to get Form 3Act1b data by SubmissionId ############################
function getForm3Act1bParticipantDataBySID(SubmissionId, language) {
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
                s.Activity,
                s.Conduct_date_1,
                s.Conduct_date_2,
                s.MeetingNo,
                s.VDPApprovalNumber,
                s.DNCPApproval,
                s.DNCP_Item,
                s.EquiptSupported,
                s.IFAD,
                s.MAF,
                s.WFP,
                s.GoL,
                s.Ben,
                s.OtherFund,
                s.Version,
                s.Submission_time,
                p.Id AS ParticipantId,
                p.Full_name,
                p.Office,
                p.Age,
                p.Gender,
                ROW_NUMBER() OVER (PARTITION BY p.Submission_id ORDER BY p.Id) AS rn
            FROM tb_Form_3Act1b_Participant p
            JOIN tb_Form_3Act1b_Submission s ON p.Submission_id = s.Id
			WHERE s.Id =?
        )
        SELECT
            np.ParticipantId as PID,
			np.Id AS SubmissionID,
            np.Reporting_period AS 'ໄລຍະເວລາລາຍງານ',
			np.Conduct_date_1 AS 'ວັນເລີ່ມ',
            np.Conduct_date_2 AS 'ວັນສຳເລັດ',
            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
            --(SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Activity LIMIT 1) AS 'ກິດຈະກຳ',
			np.Activity AS 'ກິດຈະກຳຍ່ອຍທີ່ເຂົ້າຮ່ວມ',
            --CASE WHEN np.rn = 1 THEN np.MeetingNo ELSE NULL END AS 'ກອງປະຊຸມຄັ້ງທີ',
            np.MeetingNo AS 'ກອງປະຊຸມຄັ້ງທີ',
            
            np.Full_name AS 'ຊື່ ແລະ ນາມສະກຸນ',
            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Office LIMIT 1) AS 'ມາຈາກຫ້ອງການ',
            np.Age AS 'ອາຍຸ',
            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
			--CASE WHEN np.rn = 1 THEN np.VDPApprovalNumber ELSE NULL END AS 'ຈ/ນ VDP ຮັບຮອງ',
            --CASE WHEN np.rn = 1 THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.DNCPApproval LIMIT 1) ELSE NULL END AS 'DNCP Approval',
            np.VDPApprovalNumber AS 'ຈ/ນ VDP ຮັບຮອງ',
            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.DNCPApproval LIMIT 1) AS 'DNCP Approval',
            -- CASE WHEN np.rn = 1 THEN np.DNCP_Item ELSE NULL END AS 'ບັນດາກິດຈະກໍາການລົງທຶນ ລວມຢູ່ໃນແຜນ DNCP',
			CASE WHEN np.rn = 1 THEN TRIM(
					(CASE WHEN np.DNCP_Item LIKE '%agr_production%' 
						  THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'agr_production') || ' ' 
						  ELSE '' END) ||
					(CASE WHEN np.DNCP_Item LIKE '%infra%' 
						  THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'infra') || ' ' 
						  ELSE '' END) ||
					(CASE WHEN np.DNCP_Item LIKE '%seed_funds%' 
						  THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'seed_funds') || ' ' 
						  ELSE '' END))
				ELSE NULL 
			END AS 'ບັນດາກິດຈະກໍາການລົງທຶນ ລວມຢູ່ໃນແຜນ DNCP',

            --CASE WHEN np.rn = 1 THEN (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.EquiptSupported LIMIT 1) ELSE NULL END AS 'ວັດຖຸ/ປັດໃຈໄດ້ຮັບຈາກໂຄງການແລ້ວບໍ',
            --CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS 'IFAD',
            --CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS 'MAF',
            --CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS 'WFP',
            --CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS 'GoL',
            --CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS 'Ben',
            --CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS 'Other Fund'
            (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.EquiptSupported LIMIT 1) AS 'ວັດຖຸ/ປັດໃຈໄດ້ຮັບຈາກໂຄງການແລ້ວບໍ',
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
                s.Activity,
                s.Conduct_date_1,
                s.Conduct_date_2,
                s.MeetingNo,
                s.VDPApprovalNumber,
                s.DNCPApproval,
                s.DNCP_Item,
                s.EquiptSupported,
                s.IFAD,
                s.MAF,
                s.WFP,
                s.GoL,
                s.Ben,
                s.OtherFund,
                s.Version,
                s.Submission_time,
                p.Id AS ParticipantId,
                p.Full_name,
                p.Office,
                p.Age,
                p.Gender,
                ROW_NUMBER() OVER (PARTITION BY p.Submission_id ORDER BY p.Id) AS rn
            FROM tb_Form_3Act1b_Participant p
            JOIN tb_Form_3Act1b_Submission s ON p.Submission_id = s.Id
			WHERE s.Id =?
        )
        SELECT
            np.ParticipantId as PID,
			np.Id AS SubmissionID,
            np.Reporting_period AS 'Reporting Period',
			np.Conduct_date_1 AS 'Start',
            np.Conduct_date_2 AS 'Completed',
            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
            --(SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Activity LIMIT 1) AS 'Sub-Activity',
			np.Activity AS 'Sub-Activity',
            
            --CASE WHEN np.rn = 1 THEN np.MeetingNo ELSE NULL END AS 'Meeting No.',
            np.MeetingNo AS 'Meeting No.',
            
            np.Full_name AS 'Full Name',
            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Office LIMIT 1) AS 'Representation of line agencies',
            np.Age AS 'Age',
            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
			--CASE WHEN np.rn = 1 THEN np.VDPApprovalNumber ELSE NULL END AS 'VDP Approved',
            --CASE WHEN np.rn = 1 THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.DNCPApproval LIMIT 1) ELSE NULL END AS 'DNCP Approval',
            np.VDPApprovalNumber AS 'VDP Approved',
            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.DNCPApproval LIMIT 1) AS 'DNCP Approval',
            -- CASE WHEN np.rn = 1 THEN np.DNCP_Item ELSE NULL END AS 'DNCP Items',
			CASE 
				WHEN np.rn = 1 THEN TRIM(
					(CASE WHEN np.DNCP_Item LIKE '%agr_production%' 
						  THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'agr_production') || ' ' 
						  ELSE '' END) ||
					(CASE WHEN np.DNCP_Item LIKE '%infra%' 
						  THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'infra') || ' ' 
						  ELSE '' END) ||
					(CASE WHEN np.DNCP_Item LIKE '%seed_funds%' 
						  THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName = 'form_3act1b' AND ItemCode = 'seed_funds') || ' ' 
						  ELSE '' END)
				)
				ELSE NULL 
			END AS 'DNCP Investment Activities',
			
            --CASE WHEN np.rn = 1 THEN (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.EquiptSupported LIMIT 1) ELSE NULL END AS 'Equip. Supported',
            --CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS 'IFAD',
            --CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS 'MAF',
            --CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS 'WFP',
            --CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS 'GoL',
            --CASE WHEN np.rn = 1 THEN np.Ben ELSE NULL END AS 'Ben',
            --CASE WHEN np.rn = 1 THEN np.OtherFund ELSE NULL END AS 'Other Fund'
            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='form_3act1b' AND ItemCode=np.EquiptSupported LIMIT 1) AS 'Equip. Supported',
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














// ############################ Function to delete Form 3Act1b submission data from both local database and KoboToolbox Online ############################
async function deleteForm3Act1bSubmissionInKoboAndDatabase(submissionId) {
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
            db.run("DELETE FROM tb_Form_3Act1b_Participant WHERE Submission_id = ?", [submissionId], function (err) {
                if (err) return reject(err);

                // Then delete the submission itself
                db.run("DELETE FROM tb_Form_3Act1b_Submission WHERE Id = ?", [submissionId], function (err) {
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
async function getForm3Act1bSubmissionUUIDBySubmissionId(submissionId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Uuid FROM tb_Form_3Act1b_Submission WHERE Id = ?", [submissionId]);
    db.close();

    return row ? row.Uuid : null; // Return the UUID or null if not found

}
//function get new submissionID from local database by UUID
async function getForm3Act1bNewSubmissionIdByUUID(uuId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Id as SubmissionId FROM tb_Form_3Act1b_Submission WHERE Uuid = ?", [uuId]);
    db.close();

    return row ? row.SubmissionId : null; // Return the UUID or null if not found

}








// ############################ Delete only participant in local DB ############################
async function deleteOnlyForm3Act1bParticipantInDB(participantId) {
    const db = getDBConnection();

    return new Promise((resolve, reject) => {
        db.run("DELETE FROM tb_Form_3Act1b_Participant WHERE Id = ?", [participantId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// ############################ Delete a submission in KoboToolbox ############################
async function deleteOnlyForm3Act1bSubmissionInKobo(submissionId) {
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
async function getRawForm3Act1bSubmissionAndParticipantsData(submissionId) {
    const db = getDBConnection();

    const submission = await runGet(db, "SELECT * FROM tb_Form_3Act1b_Submission WHERE Id = ?", [submissionId]);
    const participants = await runAll(db, "SELECT * FROM tb_Form_3Act1b_Participant WHERE Submission_id = ?", [submissionId]);

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


// ############################ Function to create Form 2Act2 submission XML data to submit to KoboToolbox Online ############################
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
function buildForm3Act1bSubmissionXML(submission, participants) {
    const now = formatLocalISOWithOffset();
    const end = formatLocalISOWithOffset(new Date(Date.now() + 10 * 60000)); // 10 mins later

    const xml = [];
    xml.push(`<?xml version='1.0' encoding='UTF-8' ?>`);
    xml.push(`<data id='${KOBO_FORM_3Act1bFORM_ID}'>`);

    // Metadata timestamps
    xml.push(`  <start>${now}</start>`);
    xml.push(`  <end>${end}</end>`);
    xml.push(`  <_reportingperiod>${escapeXML(submission.Reporting_period)}</_reportingperiod>`);

    // Location and activity info
    xml.push(`  <select_one_province>${escapeXML(submission.Province)}</select_one_province>`);
    xml.push(`  <select_one_district>${escapeXML(submission.District)}</select_one_district>`);
    xml.push(`  <_subactivity>${escapeXML(submission.Activity)}</_subactivity>`);

    // Conduct dates
    xml.push(`  <group_actconductdate_sa1oe86>`);
    xml.push(`    <date_ha2jz81>${escapeXML(submission.Conduct_date_1)}</date_ha2jz81>`);
    xml.push(`    <date_up9xu24>${escapeXML(submission.Conduct_date_2)}</date_up9xu24>`);
    xml.push(`  </group_actconductdate_sa1oe86>`);

    // Other information
    xml.push(`  <_1_2_3>${escapeXML(submission.MeetingNo)}</_1_2_3>`);
    xml.push(`  <_VDP_>${escapeXML(submission.VDPApprovalNumber)}</_VDP_>`);
    xml.push(`  <select_one_tb1ji94>${escapeXML(submission.DNCPApproval)}</select_one_tb1ji94>`);
    xml.push(`  <_DNCP_item>${escapeXML(submission.DNCP_Item)}</_DNCP_item>`);
    xml.push(`  <_Yes_No_>${escapeXML(submission.EquiptSupported)}</_Yes_No_>`);

    // Participants
    participants.forEach(p => {
        xml.push(`  <group_participantdetail_hp48r4>`);
        xml.push(`    <text_xh9tx30>${escapeXML(p.Full_name)}</text_xh9tx30>`);
        xml.push(`    <_selectone_office>${escapeXML(p.Office)}</_selectone_office>`);
        xml.push(`    <_mainAge>${p.Age || 0}</_mainAge>`);
        xml.push(`    <_mainGender>${escapeXML(p.Gender)}</_mainGender>`);
        xml.push(`  </group_participantdetail_hp48r4>`);
    });

    // Contributions
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
async function submitNewForm3Act1bSubmissionToKobo(xmlData) {
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
        SubmissionID: data.SubmissionID || data.SubmissionId || data.Submission_id,

        // Participant fields
        Full_name: data.Full_name || data["Participants to DNC Meeting"] || data["ຊື່ ແລະ ນາມສະກຸນ"] || null,
        Office: data.Office || data["Representation of line agencies"] || data["ມາຈາກຫ້ອງການ"] || null,
        Age: parseInt(data.Age || data["Age"] || data["ອາຍຸ"] || 0),
        Gender: data.Gender || data["Gender"] || data["ເພດ"] || null,

        // Submission fields
        Reporting_period: data.Reporting_period || data["Reporting Period"] || data["ໄລຍະເວລາລາຍງານ"] || null,
        Province: data.Province || data["Province"] || data["ແຂວງ"] || null,
        District: data.District || data["District"] || data["ເມືອງ"] || null,
        Activity: data.Activity || data["Sub-Activity"] || data["ກິດຈະກຳຍ່ອຍທີ່ເຂົ້າຮ່ວມ"] || null,
        Conduct_date_1: data.Conduct_date_1 || data["Start"] || data["ວັນເລີ່ມ"] || null,
        Conduct_date_2: data.Conduct_date_2 || data["Completed"] || data["ວັນສຳເລັດ"] || null,
        MeetingNo: data.MeetingNo || data["Meeting No."] || data["ກອງປະຊຸມຄັ້ງທີ"] || null,
        VDPApprovalNumber: data.VDPApprovalNumber || data["VDP Approval No."] || data["ຈ/ນ VDP ຮັບຮອງ"] || null,
        DNCPApproval: data.DNCPApproval || data["DNCP Approval"] || null,
        DNCP_Item: data.DNCP_Item || data["DNCP Investment Activities"] || data["ບັນດາກິດຈະກໍາການລົງທຶນ ລວມຢູ່ໃນແຜນ DNCP"] || null,
        EquiptSupported: data.EquiptSupported || data["Equip. Supported"] || data["ວັດຖຸ/ປັດໃຈໄດ້ຮັບຈາກໂຄງການ"] || null,

        // Contribution values
        IFAD: isNaN(parseFloat(data.IFAD || data["IFAD"])) ? null : parseFloat(data.IFAD || data["IFAD"]),
        MAF: isNaN(parseFloat(data.MAF || data["MAF"])) ? null : parseFloat(data.MAF || data["MAF"]),
        WFP: isNaN(parseFloat(data.WFP || data["WFP"])) ? null : parseFloat(data.WFP || data["WFP"]),
        GoL: isNaN(parseFloat(data.GoL || data["GoL"])) ? null : parseFloat(data.GoL || data["GoL"]),
        Ben: isNaN(parseFloat(data.Ben || data["Ben"])) ? null : parseFloat(data.Ben || data["Ben"]),
        OtherFund: isNaN(parseFloat(data.OtherFund || data["Other Fund"])) ? null : parseFloat(data.OtherFund || data["Other Fund"]),
    };
};



// ############################ Edit Submission and participation data ############################
async function editForm3Act1bSubmissionAndParticipants(data) {
    const db = getDBConnection();
    const d = normalizeKeys(data);

    console.log("🔁 Received Data:", data);
    console.log("📦 Normalized Data:", d);

    try {
        // ✅ Update Participant Record
        await runQuery(db, `
            UPDATE tb_Form_3Act1b_Participant
            SET               
                Age = ?
            WHERE Id = ?;
        `, [
            d.Age,
            d.PID
        ]);

        // ✅ Update Submission Record
        await runQuery(db, `
            UPDATE tb_Form_3Act1b_Submission
            SET
                Reporting_period = ?,
                Activity = ?,
                Conduct_date_1 = ?,
                Conduct_date_2 = ?,
                MeetingNo = ?,
                VDPApprovalNumber = ?,
                IFAD = ?,
                MAF = ?,
                WFP = ?,
                GoL = ?,
                Ben = ?,
                OtherFund = ?
            WHERE Id = ?;
        `, [
            d.Reporting_period,
            d.Activity,
            d.Conduct_date_1,
            d.Conduct_date_2,
            d.MeetingNo,
            d.VDPApprovalNumber,
            d.IFAD,
            d.MAF,
            d.WFP,
            d.GoL,
            d.Ben,
            d.OtherFund,
            d.SubmissionID
        ]);

        console.log("✅ Form 3Act1b data updated successfully.");
    } catch (err) {
        console.error("❌ Failed to update Form 3Act1b data:", err.message);
        throw err;
    } finally {
        if (db) await db.close();
    }
}





//Export component
export {
    downloadForm3Act1bSubmissionDataFromKoboToolbox,
    getForm3Act1bParticipantData,
    getForm3Act1bParticipantDataBySID,
    getForm3Act1bSubmissionUUIDBySubmissionId,
    getForm3Act1bNewSubmissionIdByUUID,
    deleteOnlyForm3Act1bParticipantInDB,
    deleteOnlyForm3Act1bSubmissionInKobo,

    deleteForm3Act1bSubmissionInKoboAndDatabase,
    getRawForm3Act1bSubmissionAndParticipantsData,
    buildForm3Act1bSubmissionXML,
    submitNewForm3Act1bSubmissionToKobo,
    editForm3Act1bSubmissionAndParticipants

}
