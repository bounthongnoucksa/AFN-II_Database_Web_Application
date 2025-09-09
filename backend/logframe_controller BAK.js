// logframe_controller.js
//this backup file is before adding 2024-current as part of cumulative calculation
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

// Outreach Static results like 2023 and 2024-Current
const staticResults = {
  "1A1_Males": {
    "2023": 120,
    "2024-Current": 4564
  },
  "1A1_Females": {
    "2023": 273,
    "2024-Current": 5248
  },
  "1A1_Young_people": {
    "2023": 204,
    "2024-Current": 5039
  },
  "1A1_Indigenous_people": {
    "2023": 393,
    "2024-Current": 8778
  },
  "1A1_persons_received_services": {
    "2023": 393,
    "2024-Current": 9812
  },
  "1A1_pwd_number": {
    "2023": 0,
    "2024-Current": 0
  },
  "1A1_Households": {
    "2023": 393,
    "2024-Current": 3010
  },
  "1A1_Household_members": {
    "2023": 2358,
    "2024-Current": 18060
  }
};





//Outreach indicator metadata
// Gender mapping
const indicatorMeta = {
  "1A1_Males": {
    hierarchy: "Outreach",
    indicatorGroup: "1 Persons receiving services promoted or supported by the project",
    gender: "Male",
    baseline: 0,
    indicator: "Males",
    midTerm: 33600,
    endTarget: 84000,

  },
  "1A1_Females": {
    hierarchy: "Outreach",
    indicatorGroup: "1 Persons receiving services promoted or supported by the project",
    gender: "Female",
    baseline: 0,
    indicator: "Females",
    midTerm: 33600,
    endTarget: 84000,
  },
  "1A1_Young_people": {
    hierarchy: "Outreach",
    indicatorGroup: "1 Persons receiving services promoted or supported by the project",
    minAge: "15",
    maxAge: "35",
    baseline: 0,
    indicator: "Young people",
    midTerm: 16800,
    endTarget: 42000,
  }

  ,
  "1A1_Indigenous_people": {
    hierarchy: "Outreach",
    indicatorGroup: "1 Persons receiving services promoted or supported by the project",
    minAge: "15",
    maxAge: "35",
    baseline: 0,
    indicator: "Indigenous people",
    midTerm: 47040,
    endTarget: 117600,
  },
  "1A1_persons_received_services": {
    hierarchy: "Outreach",
    indicatorGroup: "1 Persons receiving services promoted or supported by the project",
    minAge: "15",
    maxAge: "35",
    baseline: 0,
    indicator: "Total number of persons receiving services",
    midTerm: 67200,
    endTarget: 168000,
  },
  "1A1_pwd_number": {
    hierarchy: "Outreach",
    indicatorGroup: "1 Persons receiving services promoted or supported by the project",
    minAge: "15",
    maxAge: "35",
    baseline: 0,
    indicator: "Persons with disabilities",
    midTerm: 1344,
    endTarget: 3360,
  },
  "1A1_Households": {
    hierarchy: "Outreach",
    indicatorGroup: "1 Persons receiving services promoted or supported by the project",
    minAge: "15",
    maxAge: "35",
    baseline: 0,
    indicator: "number of households reached",
    midTerm: 11200,
    endTarget: 28000,
  },
  "1A1_Household_members": {
    hierarchy: "Outreach",
    indicatorGroup: "1 Persons receiving services promoted or supported by the project",
    minAge: "15",
    maxAge: "35",
    baseline: 0,
    indicator: "total number of households members",
    midTerm: 67200,
    endTarget: 168000,
  }
};



















async function fetchIndicatorData() {
  const allTargets = JSON.parse(fs.readFileSync(targetsPath, 'utf-8'));

  const promises = Object.entries(allTargets).map(async ([indicatorKey, yearlyTargets]) => {
    const { gender, indicator, hierarchy, indicatorGroup,baseline , midTerm, endTarget} = indicatorMeta[indicatorKey];
    const resultsForIndicator = staticResults[indicatorKey] || {};

    let yearlyData = {};
    let cumulative = resultsForIndicator["2023"] || 0;

    for (const yearStr of Object.keys(yearlyTargets)) {
      let result = 0;

      if (yearStr === "2023") {
        result = resultsForIndicator["2023"] || 0;
      } else if (yearStr === "2024-current") {
        result = resultsForIndicator["2024-Current"] || 0;
      } else {
        const year = parseInt(yearStr);
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const query = `
          SELECT COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
          FROM tb_Form_1A1_Participant P
          JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
          WHERE P.Gender = ? AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
        `;

        const resultRow = await new Promise((resolve, reject) => {
          db.get(query, [gender, startDate, endDate], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        result = resultRow?.count || 0;
      }

      cumulative += result;

      yearlyData[yearStr] = {
        target: yearlyTargets[yearStr],
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
    console.log(JSON.stringify(finalData, null, 2));

    res.json(finalData);
  } catch (err) {
    console.error('Error fetching indicator data:', err);
    res.status(500).json({ error: 'Failed to fetch logframe data' });
  }
}

export {
  getIndicatorData,
  fetchIndicatorData
};
