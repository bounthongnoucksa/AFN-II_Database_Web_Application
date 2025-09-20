//backend/cb_villagers_controller.js

import 'dotenv/config'; // Load environment variables from .env file
import axios from 'axios'; // Importing axios for HTTP requests
import { getDBConnection } from './getDBConnection.js'; // Importing the database connection helper

import FormData from 'form-data'; // Importing FormData for handling multipart/form-data requests
import fs from 'fs'; // Importing fs for file system operations

//require('dotenv').config(); // Load environment variables from .env file
const KOBO_API_KEY = process.env.KOBO_API_KEY; // KoboToolbox API key from environment variables
const KOBO_NEW_SUBMISSION_API = process.env.KOBO_NEW_SUBMISSION_API_URL; // KoboToolbox API endpoint for new submissions
const KOBO_CB_FOR_VILLAGERS_FORM_ID = process.env.KOBO_CB_FOR_VILLAGERS_UID;
//const KOBO_CB_FOR_VILLAGERS_FORM_ID = process.env.KOBO_CB_FOR_VILLAGERS_UID_TEST; // KoboToolbox form ID for CB for Villagers
const KOBO_DELETE_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_CB_FOR_VILLAGERS_FORM_ID}/data/`; // KoboToolbox API endpoint for deleting submissions
const KOBO_DOWNLOAD_SUBMISSION_API = `${process.env.KOBO_API_URL}/${KOBO_CB_FOR_VILLAGERS_FORM_ID}/data.json`; // KoboToolbox API endpoint for downloading submissions



//Download new data from Kobo Toolbox
async function downloadCBVillagersSubmissionDataFromKoboToolbox() {
    let db;
    try {
        db = getDBConnection();
        const headers = { Authorization: `Token ${KOBO_API_KEY}` };
        let nextUrl = KOBO_DOWNLOAD_SUBMISSION_API;

        // clear old data
        await runQuery(db, "DELETE FROM tb_CB_for_Villagers_Submission");
        await runQuery(db, "DELETE FROM tb_CB_for_Villagers_Participant");

        while (nextUrl) {
            const resp = await axios.get(nextUrl, { headers });
            const root = resp.data;
            nextUrl = root.next;

            for (const el of root.results) {
                const submissionId = el["_id"];

                // Insert Submission
                await runQuery(db, `
                    INSERT INTO tb_CB_for_Villagers_Submission 
                    (Id, Uuid, Start, End, ReportingPeriod, Province, District, Village, 
                     ActivityType, SpecializedTopic, ConductDateStart, ConductDateEnd, 
                     OtherLocation, ConductedBy, ActivityCode, IFAD, MAF, WFP, GoL, 
                     Version, SubmissionTime)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(Id) DO UPDATE SET 
                        Uuid=excluded.Uuid,
                        Start=excluded.Start,
                        End=excluded.End,
                        ReportingPeriod=excluded.ReportingPeriod,
                        Province=excluded.Province,
                        District=excluded.District,
                        Village=excluded.Village,
                        ActivityType=excluded.ActivityType,
                        SpecializedTopic=excluded.SpecializedTopic,
                        ConductDateStart=excluded.ConductDateStart,
                        ConductDateEnd=excluded.ConductDateEnd,
                        OtherLocation=excluded.OtherLocation,
                        ConductedBy=excluded.ConductedBy,
                        ActivityCode=excluded.ActivityCode,
                        IFAD=excluded.IFAD,
                        MAF=excluded.MAF,
                        WFP=excluded.WFP,
                        GoL=excluded.GoL,
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
                    el["select_one_cbactivitytype"] || null,
                    el["select_one_cbspecializedtopic"] || null,
                    el["group_actconductdate_sa1oe86/date_ha2jz81"] || null,
                    el["group_actconductdate_sa1oe86/date_up9xu24"] || null,
                    el["text_otherlocation_xi6ak40"] || null,
                    el["_select_one_conductedby_01"] || null,
                    el["_activitycode"] || null,
                    parseInt(el["group_wz1ah68/_IFAD_"] || 0),
                    parseInt(el["group_wz1ah68/_MAF_"] || 0),
                    parseInt(el["group_wz1ah68/_WFP_"] || 0),
                    parseInt(el["group_wz1ah68/_GoL_"] || 0),
                    el["__version__"] || null,
                    el["_submission_time"] || null
                ]);

                // Insert Participants
                if (Array.isArray(el["group_participantdetail_hp48r4"])) {
                    for (const p of el["group_participantdetail_hp48r4"]) {
                        await runQuery(db, `
                            INSERT INTO tb_CB_for_Villagers_Participant 
                            (SubmissionId, HaveHHId, HHId, NameAndSurname, Age, Gender, 
                             Responsibility, FromWhichLevel, Ethnicity, PovertyLevel, PWD, APGMember)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `, [
                            submissionId,
                            p["group_participantdetail_hp48r4/doyouhavehh_id"] || null,
                            p["group_participantdetail_hp48r4/mainhhid"] || null,
                            p["group_participantdetail_hp48r4/select_one_mainNameAndSurname"]
                            || p["group_participantdetail_hp48r4/_namenohhid"] || null,
                            parseInt(p["group_participantdetail_hp48r4/age_selected"]
                                || p["group_participantdetail_hp48r4/_mainAge"] || 0),
                            p["group_participantdetail_hp48r4/gender_selected"]
                            || p["group_participantdetail_hp48r4/_mainGender"] || null,
                            p["group_participantdetail_hp48r4/_main_participant_responsibili"] || null,
                            p["group_participantdetail_hp48r4/_mainFromWhichLevel"] || null,
                            p["group_participantdetail_hp48r4/ethnicity_selected"]
                            || p["group_participantdetail_hp48r4/_mainEthnicity"] || null,
                            p["group_participantdetail_hp48r4/poverty_selected"]
                            || p["group_participantdetail_hp48r4/_mainPovertyLevel"] || null,
                            p["group_participantdetail_hp48r4/mainPWD_selected"]
                            || p["group_participantdetail_hp48r4/_mainPWD"] || null,
                            p["group_participantdetail_hp48r4/_mainAPGMember"] || null
                        ]);
                    }
                }
            }
        }

        console.log("✅ CB Villagers submission data downloaded and saved to the database successfully.");

    } catch (err) {
        console.error("❌ Error downloading CB for Villagers data:", err.message);
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


// ############################ Function to get CB Villagers participant data ############################
function getCBVillagerParticipantData(language) {
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
                            s.SpecializedTopic,
                            s.ConductDateStart,
                            s.ConductDateEnd,
                            s.OtherLocation,
                            s.ConductedBy,
                            s.ActivityCode,
                            s.IFAD,
                            s.MAF,
                            s.WFP,
                            s.GoL,
                            s.SubmissionTime,
                            p.Id AS ParticipantId,
                            p.HHId,
                            p.NameAndSurname,
                            p.Age,
                            p.Gender,
                            p.Responsibility,
                            p.FromWhichLevel,
                            p.Ethnicity,
                            p.PovertyLevel,
                            p.PWD,
                            p.APGMember,
                            ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                        FROM tb_CB_for_Villagers_Participant p
                        JOIN tb_CB_for_Villagers_Submission s ON p.SubmissionId = s.Id
                    )
                    SELECT
                        np.Id AS SubmissionID,
                        np.ReportingPeriod AS 'ໄລຍະເວລາລາຍງານ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'ແຂວງ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'ເມືອງ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'ບ້ານ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.ActivityType LIMIT 1) AS 'ຮູບແບບການຝຶກ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.SpecializedTopic AND Choice_Filter=np.ActivityType LIMIT 1) AS 'ຫົວຂໍ້ສະເພາະດ້ານ',
                        np.ConductDateStart AS 'ວັນເລີ່ມ',
                        np.ConductDateEnd AS 'ວັນສຳເລັດ',
                        np.OtherLocation AS 'ສະຖານທີ່ອື່ນ (ນອກຈາກບ້ານ)',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.ConductedBy LIMIT 1) AS 'ຈັດຕັ້ງນຳພາ-ສິດສອນ-ເຜີຍແຜ່ ໂດຍ',
                        np.ActivityCode AS 'ກິດຈະກຳໃດ',
                        np.HHId AS 'ລະຫັດຄົວເຮືອນ',
                        np.NameAndSurname AS 'ຊື່ ແລະ ນາມສະກຸນ ຜູ້ເຂົ້າຮ່ວມ',
                        np.Age AS 'ອາຍຸ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.Responsibility LIMIT 1) AS 'ໜ້າທີ່ຮັບຜິດຊອບ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.FromWhichLevel LIMIT 1) AS 'ມາຈາກພາກສ່ວນ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'ຊົນເຜົ່າ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.PovertyLevel LIMIT 1) AS 'ລະດັບຄວາມທຸກຍາກ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.PWD LIMIT 1) AS 'ຜູ້ພິການ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.APGMember LIMIT 1) AS 'ສະມາຊິກກຸ່ມ APG',

                        CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                        CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                        CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                        CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL
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
                                s.SpecializedTopic,
                                s.ConductDateStart,
                                s.ConductDateEnd,
                                s.OtherLocation,
                                s.ConductedBy,
                                s.ActivityCode,
                                s.IFAD,
                                s.MAF,
                                s.WFP,
                                s.GoL,
                                s.SubmissionTime,
                                p.Id AS ParticipantId,
                                p.HHId,
                                p.NameAndSurname,
                                p.Age,
                                p.Gender,
                                p.Responsibility,
                                p.FromWhichLevel,
                                p.Ethnicity,
                                p.PovertyLevel,
                                p.PWD,
                                p.APGMember,
                                ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                            FROM tb_CB_for_Villagers_Participant p
                            JOIN tb_CB_for_Villagers_Submission s ON p.SubmissionId = s.Id
                        )
                        SELECT
                            np.Id AS SubmissionID,
                            np.ReportingPeriod AS 'Reporting Period',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Province LIMIT 1) AS 'Province',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.District LIMIT 1) AS 'District',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Village LIMIT 1) AS 'Village',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.ActivityType LIMIT 1) AS 'Training Type',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.SpecializedTopic AND Choice_Filter=np.ActivityType LIMIT 1) AS 'Specialized Topic',
                            np.ConductDateStart AS 'Start Date',
                            np.ConductDateEnd AS 'End Date',
                            np.OtherLocation AS 'Other venues than village',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.ConductedBy LIMIT 1) AS 'Conducted By',
                            np.ActivityCode AS 'Activity Code',
                            np.HHId AS 'HH-ID',
                            np.NameAndSurname AS 'Participant Name',
                            np.Age AS 'Age',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.Responsibility LIMIT 1) AS 'Responsibility',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.FromWhichLevel LIMIT 1) AS 'From which implementation level ',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'Ethnicity',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.PovertyLevel LIMIT 1) AS 'Poverty Level',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.PWD LIMIT 1) AS 'PWD',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.APGMember LIMIT 1) AS 'APG Member',

                            CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                            CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                            CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                            CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL
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


// ############################ Function to get CB Staff data by SubmissionId ############################
function getCBVillagersParticipantDataBySID(SubmissionId, language) {
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
                            s.SpecializedTopic,
                            s.ConductDateStart,
                            s.ConductDateEnd,
                            s.OtherLocation,
                            s.ConductedBy,
                            s.ActivityCode,
                            s.IFAD,
                            s.MAF,
                            s.WFP,
                            s.GoL,
                            s.SubmissionTime,
                            p.Id AS ParticipantId,
                            p.HHId,
                            p.NameAndSurname,
                            p.Age,
                            p.Gender,
                            p.Responsibility,
                            p.FromWhichLevel,
                            p.Ethnicity,
                            p.PovertyLevel,
                            p.PWD,
                            p.APGMember,
                            ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                        FROM tb_CB_for_Villagers_Participant p
                        JOIN tb_CB_for_Villagers_Submission s ON p.SubmissionId = s.Id
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
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.ActivityType LIMIT 1) AS 'ຮູບແບບການຝຶກ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.SpecializedTopic AND Choice_Filter=np.ActivityType LIMIT 1) AS 'ຫົວຂໍ້ສະເພາະດ້ານ',

                        np.OtherLocation AS 'ສະຖານທີ່ອື່ນ (ນອກຈາກບ້ານ)',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.ConductedBy LIMIT 1) AS 'ຈັດຕັ້ງນຳພາ-ສິດສອນ-ເຜີຍແຜ່ ໂດຍ',
                        np.ActivityCode AS 'ກິດຈະກຳໃດ',
                        np.HHId AS 'ລະຫັດຄົວເຮືອນ',
                        np.NameAndSurname AS 'ຊື່ ແລະ ນາມສະກຸນ ຜູ້ເຂົ້າຮ່ວມ',
                        np.Age AS 'ອາຍຸ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.Gender LIMIT 1) AS 'ເພດ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.Responsibility LIMIT 1) AS 'ໜ້າທີ່ຮັບຜິດຊອບ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.FromWhichLevel LIMIT 1) AS 'ມາຈາກພາກສ່ວນ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'ຊົນເຜົ່າ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.PovertyLevel LIMIT 1) AS 'ລະດັບຄວາມທຸກຍາກ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.PWD LIMIT 1) AS 'ຜູ້ພິການ',
                        (SELECT Label_Lao FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.APGMember LIMIT 1) AS 'ສະມາຊິກກຸ່ມ APG',

                        CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                        CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                        CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                        CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL
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
                                s.SpecializedTopic,
                                s.ConductDateStart,
                                s.ConductDateEnd,
                                s.OtherLocation,
                                s.ConductedBy,
                                s.ActivityCode,
                                s.IFAD,
                                s.MAF,
                                s.WFP,
                                s.GoL,
                                s.SubmissionTime,
                                p.Id AS ParticipantId,
                                p.HHId,
                                p.NameAndSurname,
                                p.Age,
                                p.Gender,
                                p.Responsibility,
                                p.FromWhichLevel,
                                p.Ethnicity,
                                p.PovertyLevel,
                                p.PWD,
                                p.APGMember,
                                ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                            FROM tb_CB_for_Villagers_Participant p
                            JOIN tb_CB_for_Villagers_Submission s ON p.SubmissionId = s.Id
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
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.ActivityType LIMIT 1) AS 'Training Type',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.SpecializedTopic AND Choice_Filter=np.ActivityType LIMIT 1) AS 'Specialized Topic',
                            
                            np.OtherLocation AS 'Other venues than village',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.ConductedBy LIMIT 1) AS 'Conducted By',
                            np.ActivityCode AS 'Activity Code',
                            np.HHId AS 'HH-ID',
                            np.NameAndSurname AS 'Participant Name',
                            np.Age AS 'Age',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.Gender LIMIT 1) AS 'Gender',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.Responsibility LIMIT 1) AS 'Responsibility',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.FromWhichLevel LIMIT 1) AS 'Implement level ',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='all_forms' AND ItemCode=np.Ethnicity LIMIT 1) AS 'Ethnicity',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.PovertyLevel LIMIT 1) AS 'Poverty Level',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.PWD LIMIT 1) AS 'PWD',
                            (SELECT Label_English FROM Translation_EN_LA WHERE FormName='cb_for_villagers' AND ItemCode=np.APGMember LIMIT 1) AS 'APG Member',

                            CASE WHEN np.rn = 1 THEN np.IFAD ELSE NULL END AS IFAD,
                            CASE WHEN np.rn = 1 THEN np.MAF ELSE NULL END AS MAF,
                            CASE WHEN np.rn = 1 THEN np.WFP ELSE NULL END AS WFP,
                            CASE WHEN np.rn = 1 THEN np.GoL ELSE NULL END AS GoL
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














// ############################ Function to delete CB villagers submission data from both local database and KoboToolbox Online ############################
async function deleteCBVillagerSubmissionInKoboAndDatabase(submissionId) {
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
            db.run("DELETE FROM tb_CB_for_Villagers_Participant WHERE SubmissionId = ?", [submissionId], function (err) {
                if (err) return reject(err);

                // Then delete the submission itself
                db.run("DELETE FROM tb_CB_for_Villagers_Submission WHERE Id = ?", [submissionId], function (err) {
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
async function getCBForVillagersSubmissionUUIDBySubmissionId(submissionId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Uuid FROM tb_CB_for_Villagers_Submission WHERE Id = ?", [submissionId]);
    db.close();

    return row ? row.Uuid : null; // Return the UUID or null if not found

}
//function get new submissionID from local database by UUID
async function getCBForVillagerNewSubmissionIdByUUID(uuId) {
    const db = getDBConnection();

    const row = await runGet(db, "SELECT Id as SubmissionId FROM tb_CB_for_Villagers_Submission WHERE Uuid = ?", [uuId]);
    db.close();

    return row ? row.SubmissionId : null; // Return the UUID or null if not found

}








// ############################ Delete only participant in local DB ############################
async function deleteOnlyCBForVillagersParticipantInDB(participantId) {
    const db = getDBConnection();

    return new Promise((resolve, reject) => {
        db.run("DELETE FROM tb_CB_for_Villagers_Participant WHERE Id = ?", [participantId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// ############################ Delete a submission in KoboToolbox ############################
async function deleteOnlyCBForVillagersSubmissionInKobo(submissionId) {
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
async function getRawCBVillagerSubmissionAndParticipantsData(submissionId) {
    const db = getDBConnection();

    const submission = await runGet(db, "SELECT * FROM tb_CB_for_Villagers_Submission WHERE Id = ?", [submissionId]);
    const participants = await runAll(db, "SELECT * FROM tb_CB_for_Villagers_Participant WHERE SubmissionId = ?", [submissionId]);

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
function buildCBVillagerSubmissionXML(submission, participants) {
    const now = formatLocalISOWithOffset();
    const end = formatLocalISOWithOffset(new Date(Date.now() + 10 * 60000));

    const xml = [];
    xml.push(`<?xml version='1.0' encoding='UTF-8' ?>`);
    xml.push(`<data id='${KOBO_CB_FOR_VILLAGERS_FORM_ID}'>`);

    // Metadata timestamps
    xml.push(`  <start>${now}</start>`);
    xml.push(`  <end>${end}</end>`);
    xml.push(`  <_reportingperiod>${escapeXML(submission.ReportingPeriod)}</_reportingperiod>`);

    // Location and general info
    xml.push(`  <select_one_province>${escapeXML(submission.Province)}</select_one_province>`);
    xml.push(`  <select_one_district>${escapeXML(submission.District)}</select_one_district>`);
    xml.push(`  <select_one_district_village>${escapeXML(submission.Village)}</select_one_district_village>`);
    xml.push(`  <select_one_cbactivitytype>${escapeXML(submission.ActivityType)}</select_one_cbactivitytype>`);
    xml.push(`  <select_one_cbspecializedtopic>${escapeXML(submission.SpecializedTopic)}</select_one_cbspecializedtopic>`);

    // Group: Activity Conduct Dates
    xml.push(`  <group_actconductdate_sa1oe86>`);
    xml.push(`    <date_ha2jz81>${escapeXML(submission.ConductDateStart)}</date_ha2jz81>`);
    xml.push(`    <date_up9xu24>${escapeXML(submission.ConductDateEnd)}</date_up9xu24>`);
    xml.push(`  </group_actconductdate_sa1oe86>`);

    xml.push(`  <text_otherlocation_xi6ak40>${escapeXML(submission.OtherLocation)}</text_otherlocation_xi6ak40>`);
    xml.push(`  <_select_one_conductedby_01>${escapeXML(submission.ConductedBy)}</_select_one_conductedby_01>`);
    xml.push(`  <_activitycode>${escapeXML(submission.ActivityCode)}</_activitycode>`);

    // Participants
    participants.forEach(p => {
        xml.push(`  <group_participantdetail_hp48r4>`);

        xml.push(`    <doyouhavehh_id>${escapeXML(p.HaveHHId)}</doyouhavehh_id>`);
        xml.push(`    <mainhhid>${escapeXML(p.HHId)}</mainhhid>`);
        xml.push(`    <select_one_mainNameAndSurname>${escapeXML(p.NameAndSurname)}</select_one_mainNameAndSurname>`);
        xml.push(`    <age_selected>${escapeXML(p.Age)}</age_selected>`);
        xml.push(`    <gender_selected>${escapeXML(p.Gender)}</gender_selected>`);
        xml.push(`    <_main_participant_responsibili>${escapeXML(p.Responsibility)}</_main_participant_responsibili>`);
        xml.push(`    <_mainFromWhichLevel>${escapeXML(p.FromWhichLevel)}</_mainFromWhichLevel>`);
        xml.push(`    <ethnicity_selected>${escapeXML(p.Ethnicity)}</ethnicity_selected>`);
        xml.push(`    <poverty_selected>${escapeXML(p.PovertyLevel)}</poverty_selected>`);
        xml.push(`    <mainPWD_selected>${escapeXML(p.PWD)}</mainPWD_selected>`);
        xml.push(`    <_mainAPGMember>${escapeXML(p.APGMember)}</_mainAPGMember>`);

        xml.push(`  </group_participantdetail_hp48r4>`);
    });

    // Group: Contributions
    xml.push(`  <group_wz1ah68>`);
    xml.push(`    <_IFAD_>${submission.IFAD || 0}</_IFAD_>`);
    xml.push(`    <_MAF_>${submission.MAF || 0}</_MAF_>`);
    xml.push(`    <_WFP_>${submission.WFP || 0}</_WFP_>`);
    xml.push(`    <_GoL_>${submission.GoL || 0}</_GoL_>`);
    xml.push(`  </group_wz1ah68>`);

    // Meta
    xml.push(`  <meta>`);
    xml.push(`    <instanceID>uuid:${escapeXML(submission.Uuid)}</instanceID>`);
    xml.push(`  </meta>`);

    xml.push(`</data>`);

    return xml.join('\n');
}


//############################ Function to submit new submission to KoboToolbox Online ############################
async function submitNewCBVillagerSubmissionToKobo(xmlData) {
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
        Age: parseInt(data["Age"] || data["ອາຍຸ"] || 0),

        ReportingPeriod: data["Reporting Period"] || data["ໄລຍະເວລາລາຍງານ"],
        StartDate: data["Start Date"] || data["ວັນເລີ່ມ"],
        EndDate: data["End Date"] || data["ວັນສຳເລັດ"],
        OtherLocation: data["Other venues than village"] || data["ສະຖານທີ່ອື່ນ (ນອກຈາກບ້ານ)"],
        ActivityCode: data["Activity Code"] || data["ກິດຈະກຳໃດ"],

        IFAD: parseInt(data.IFAD) || 0,
        MAF: parseInt(data.MAF) || 0,
        WFP: parseInt(data.WFP) || 0,
        GoL: parseInt(data.GoL) || 0
    };
};



// ############################ Edit Submission and participation data ############################
async function editCBVillagerSubmissionAndParticipants(data) {


    const db = getDBConnection();
    const d = normalizeKeys(data);

    console.log("Received:", data);
    console.log("Normalized:", d);

    try {
        // ✅ Update Participant Record
        await runQuery(db, `
            UPDATE tb_CB_for_Villagers_Participant
            SET
            
                Age = ?
                
            WHERE Id = ?;
        `, [
            
            d.Age,     
            d.PID
        ]);

        // ✅ Update Submission Record
        await runQuery(db, `
            UPDATE tb_CB_for_Villagers_Submission
            SET
                ReportingPeriod = ?,
                ConductDateStart = ?,
                ConductDateEnd = ?,
                OtherLocation = ?,
                ActivityCode = ?,
                IFAD = ?,
                MAF = ?,
                WFP = ?,
                GoL = ?
            WHERE Id = ?;
        `, [
            d.ReportingPeriod,
            d.StartDate,
            d.EndDate,
            d.OtherLocation,
            d.ActivityCode,
            d.IFAD,
            d.MAF,
            d.WFP,
            d.GoL,
            d.SubmissionID
        ]);

        console.log("✅ CB Villagers data updated successfully.");

    } catch (err) {
        console.error("❌ Failed to update Villager data:", err.message);
        throw err;
    } finally {
        if (db) await db.close();
    }

}




export {
    downloadCBVillagersSubmissionDataFromKoboToolbox,
    getCBVillagerParticipantData,
    getCBVillagersParticipantDataBySID,
    getCBForVillagersSubmissionUUIDBySubmissionId,
    getCBForVillagerNewSubmissionIdByUUID,
    deleteOnlyCBForVillagersParticipantInDB,
    deleteOnlyCBForVillagersSubmissionInKobo
,   deleteCBVillagerSubmissionInKoboAndDatabase,
    getRawCBVillagerSubmissionAndParticipantsData,
    buildCBVillagerSubmissionXML,
    submitNewCBVillagerSubmissionToKobo,
    editCBVillagerSubmissionAndParticipants
};