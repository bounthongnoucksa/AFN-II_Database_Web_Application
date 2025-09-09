// logframe_controller.js
import { getDBConnection } from './getDBConnection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = getDBConnection();

// Path to your targets JSON file
const targetsPath = path.join(__dirname, 'constants', 'logframeIndicatorTargets.json');

//Logframe indicator metadata path
const indicatorMetaPath = path.join(__dirname, 'constants', 'logframeIndicatorMetaData.json');

// Logframe Static results like 2023 and 2024-Current
const staticResultPath = path.join(__dirname, 'constants', 'logframeStaticData2023-2024.json');

// const staticResults = {
//   "1A1_Males": {
//     "2023": 120,
//     "2024-Current": 4564
//   },
//   "1A1_Females": {
//     "2023": 273,
//     "2024-Current": 5248
//   },
//   "1A1_Young_people": {
//     "2023": 204,
//     "2024-Current": 5039
//   },
//   "1A1_Indigenous_people": {
//     "2023": 393,
//     "2024-Current": 8778
//   },
//   "1A1_persons_received_services": {
//     "2023": 393,
//     "2024-Current": 9812
//   },
//   "1A1_pwd_number": {
//     "2023": 0,
//     "2024-Current": 0
//   },
//   "1A1_Households": {
//     "2023": 393,
//     "2024-Current": 3010
//   },
//   "1A1_Household_members": {
//     "2023": 2358,
//     "2024-Current": 18060
//   }
// };





// //Outreach indicator metadata
// // Gender mapping
// const indicatorMeta = {
//   "1A1_Males": {
//     hierarchy: "Outreach",
//     indicatorGroup: "1 Persons receiving services promoted or supported by the project",
//     gender: "Male",
//     baseline: 0,
//     indicator: "Males",
//     midTerm: 33600,
//     endTarget: 84000,

//   },
//   "1A1_Females": {
//     hierarchy: "Outreach",
//     indicatorGroup: "1 Persons receiving services promoted or supported by the project",
//     gender: "Female",
//     baseline: 0,
//     indicator: "Females",
//     midTerm: 33600,
//     endTarget: 84000,
//   },
//   "1A1_Young_people": {
//     hierarchy: "Outreach",
//     indicatorGroup: "1 Persons receiving services promoted or supported by the project",
//     minAge: "15",
//     maxAge: "35",
//     baseline: 0,
//     indicator: "Young people",
//     midTerm: 16800,
//     endTarget: 42000,
//   }

//   ,
//   "1A1_Indigenous_people": {
//     hierarchy: "Outreach",
//     indicatorGroup: "1 Persons receiving services promoted or supported by the project",
//     minAge: "15",
//     maxAge: "35",
//     baseline: 0,
//     indicator: "Indigenous people",
//     midTerm: 47040,
//     endTarget: 117600,
//   },
//   "1A1_persons_received_services": {
//     hierarchy: "Outreach",
//     indicatorGroup: "1 Persons receiving services promoted or supported by the project",
//     minAge: "15",
//     maxAge: "35",
//     baseline: 0,
//     indicator: "Total number of persons receiving services",
//     midTerm: 67200,
//     endTarget: 168000,
//   },
//   "1A1_pwd_number": {
//     hierarchy: "Outreach",
//     indicatorGroup: "1 Persons receiving services promoted or supported by the project",
//     minAge: "15",
//     maxAge: "35",
//     baseline: 0,
//     indicator: "Persons with disabilities",
//     midTerm: 1344,
//     endTarget: 3360,
//   },
//   "1A1_Households": {
//     hierarchy: "Outreach",
//     indicatorGroup: "1 Persons receiving services promoted or supported by the project",
//     minAge: "15",
//     maxAge: "35",
//     baseline: 0,
//     indicator: "number of households reached",
//     midTerm: 11200,
//     endTarget: 28000,
//   },
//   "1A1_Household_members": {
//     hierarchy: "Outreach",
//     indicatorGroup: "1 Persons receiving services promoted or supported by the project",
//     minAge: "15",
//     maxAge: "35",
//     baseline: 0,
//     indicator: "total number of households members",
//     midTerm: 67200,
//     endTarget: 168000,
//   }
// };










async function fetchIndicatorData() {
  const allTargets = JSON.parse(fs.readFileSync(targetsPath, 'utf-8'));

  //Get Outreach indicator metadata from external file
  const indicatorMeta = JSON.parse(fs.readFileSync(indicatorMetaPath, 'utf-8'));

  //Get Logframe Static results like 2023 and 2024-Current
const staticResults = JSON.parse(fs.readFileSync(staticResultPath, 'utf-8'));

  const promises = Object.entries(allTargets).map(async ([indicatorKey, yearlyTargets]) => {
    const { gender, indicator, hierarchy, indicatorGroup, baseline, midTerm, endTarget } = indicatorMeta[indicatorKey];
    const resultsForIndicator = staticResults[indicatorKey] || {};

    let yearlyData = {};

    const orderedYears = [
      '2023',
      '2024-current', // Static year
      '2024',
      '2025',
      '2026',
      '2027',
      '2028',
      '2029',
      '2030'
    ];

    let cumulative = 0;
    let cumulative_2024_current = 0;

    for (const yearStr of orderedYears) {
      let result = 0;
      let target = yearlyTargets[yearStr] || 0;

      if (yearStr === '2023') {
        result = resultsForIndicator['2023'] || 0;
        cumulative = result;
      } else if (yearStr === '2024-current') {
        result = resultsForIndicator['2024-Current'] || 0;
        cumulative += result;
        cumulative_2024_current = cumulative; // Save for later years
      } else if (yearStr === '2024') {
        // Separate year (DB-based)
        const year = parseInt(yearStr);
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const query = `
          SELECT sum(count) AS Total_Outreach_Males FROM (
            --1A1
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                  
            UNION ALL
            --1A4
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A4_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1A4_Unique_HH_ID
            FROM tb_Form_1A4_Participant P
            JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL

            --1BAct6
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct6_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct6_Unique_HH_ID
            FROM tb_Form_1BAct6_Participant P
            JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL
            --1BAct8
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct8_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct8_Unique_HH_ID
            FROM tb_Form_1BAct8_Participant P
            JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('con_irr', 'recon_irr')
            AND P.Gender = ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act1
            SELECT 
            COUNT(DISTINCT P.NameOfMSME_Owner) AS Count_2Act1_Unique_MSME_Owner
            FROM tb_Form_2Act1_Participant P
            JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act2
            SELECT 
            COUNT(DISTINCT P.NameAndSurname) AS Count_2Act2_Unique_MSME_Owner
            FROM tb_Form_2Act2_Participant P
            JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
              
            UNION ALL
              
            --2Act3
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_2Act3_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_2Act3_Unique_HH_ID
            FROM tb_Form_2Act3_Participant P
            JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('accesstracks') AND P.Gender = ?
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                
            UNION ALL	
            --3Act2
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameOfAPG) AS Count_3Act2_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_3Act2_Unique_HH_ID
            FROM tb_Form_3Act2_Participant P
            JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
            ) AS Combined_Counts;

        `;

        // Create array with 24 parameters (8 × [gender, startDate, endDate])
        const params = [];
        for (let i = 0; i < 8; i++) {
          params.push(gender, startDate, endDate);
        }

        //Test:
          console.log(params);

        //run the query
        const resultRow = await new Promise((resolve, reject) => {
          //db.get(query, [gender, startDate, endDate], (err, row) => {
            db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        result = resultRow?.count || 0;
        cumulative = (resultsForIndicator['2023'] || 0) + result;
      } else {
        // 2025–2030 use DB data and cumulative_2024_current
        const year = parseInt(yearStr);
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const query = `
          SELECT sum(count) AS Total_Outreach_Males FROM (
            --1A1
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                  
            UNION ALL
            --1A4
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A4_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1A4_Unique_HH_ID
            FROM tb_Form_1A4_Participant P
            JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL

            --1BAct6
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct6_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct6_Unique_HH_ID
            FROM tb_Form_1BAct6_Participant P
            JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL
            --1BAct8
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct8_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct8_Unique_HH_ID
            FROM tb_Form_1BAct8_Participant P
            JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('con_irr', 'recon_irr')
            AND P.Gender = ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act1
            SELECT 
            COUNT(DISTINCT P.NameOfMSME_Owner) AS Count_2Act1_Unique_MSME_Owner
            FROM tb_Form_2Act1_Participant P
            JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act2
            SELECT 
            COUNT(DISTINCT P.NameAndSurname) AS Count_2Act2_Unique_MSME_Owner
            FROM tb_Form_2Act2_Participant P
            JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
              
            UNION ALL
              
            --2Act3
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_2Act3_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_2Act3_Unique_HH_ID
            FROM tb_Form_2Act3_Participant P
            JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('accesstracks') AND P.Gender = ?
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                
            UNION ALL	
            --3Act2
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameOfAPG) AS Count_3Act2_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_3Act2_Unique_HH_ID
            FROM tb_Form_3Act2_Participant P
            JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
            ) AS Combined_Counts;

        `;

        // Create array with 24 parameters (8 × [gender, startDate, endDate])
        const params = [];
        for (let i = 0; i < 8; i++) {
          params.push(gender, startDate, endDate);
        }

        //run the query
        const resultRow = await new Promise((resolve, reject) => {
          //db.get(query, [gender, startDate, endDate], (err, row) => {
            db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        result = resultRow?.count || 0;


        
        // For 2025, start from cumulative_2024_current
        if (yearStr === '2025') {
          cumulative = cumulative_2024_current + result;
        } else {
          cumulative += result; // for 2026+, just add to previous cumulative
        }
      }

      yearlyData[yearStr] = {
        target,
        result,
        cumulative
      };
    }







    return {
      hierarchy,
      indicatorGroup,
      indicator,
      baseline,
      midTerm,
      endTarget,
      yearlyData
    };
  });

  return await Promise.all(promises);
}



// Route handler
async function getIndicatorData(req, res) {
  try {
    const finalData = await fetchIndicatorData();
    //Test:
    //console.log(JSON.stringify(finalData, null, 2));

    res.json(finalData);
  } catch (err) {
    console.error('Error fetching indicator data:', err);
    res.status(500).json({ error: 'Failed to fetch logframe data' });
  }
}

export {
    getIndicatorData
};
