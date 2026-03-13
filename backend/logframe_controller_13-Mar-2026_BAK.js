// logframe_controller.js
import { getDBConnection } from './getDBConnection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { indicatorQueryMap } from './constants/logframeQueries.js';

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






async function fetchIndicatorData() {
  const allTargets = JSON.parse(fs.readFileSync(targetsPath, 'utf-8'));

  //Get Outreach indicator metadata from external file
  const indicatorMeta = JSON.parse(fs.readFileSync(indicatorMetaPath, 'utf-8'));

  //Get Logframe Static results like 2023 and 2024-Current
  const staticResults = JSON.parse(fs.readFileSync(staticResultPath, 'utf-8'));

  const promises = Object.entries(allTargets).map(async ([indicatorKey, yearlyTargets]) => {
    const meta = indicatorMeta[indicatorKey];
    //const { gender, indicator, hierarchy, indicatorGroup, baseline, midTerm, endTarget } = indicatorMeta[indicatorKey];
    const resultsForIndicator = staticResults[indicatorKey] || {};
    const queryObj = indicatorQueryMap[indicatorKey];

    const orderedYears = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

    let cumulative = 0;
    let yearlyData = {};

    for (const yearStr of orderedYears) {
      let result = 0;
      let target = yearlyTargets[yearStr] || 0;

      const year = parseInt(yearStr);
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const queryObj = indicatorQueryMap[indicatorKey];

      if (queryObj) {
        let { query, getParams } = queryObj;

        // Indigenous People modifications
        if (indicatorKey === 'Outreach_Indigenous_people' ||
          indicatorKey === '1A1_Indigenous_people' ||
          indicatorKey === 'cb_villagers_Crop_Indigenous_People' ||
          indicatorKey === 'cb_villagers_Livestock_Indigenous_People' ||
        indicatorKey === '1BAct6_Indigenous_people') {

          query = query.replace(/\?\?/g, meta.ethnic);
        }

        const params = getParams({
          ...meta,
          startDate,
          endDate
        });

        const resultRow = await new Promise((resolve, reject) => {
          db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        result = resultRow?.count || 0;
      }

      // New cumulative logic
      cumulative += result;

      yearlyData[yearStr] = { target, result, cumulative };
    }








    return {
      hierarchy: meta.hierarchy,
      indicatorGroup: meta.indicatorGroup,
      indicator: meta.indicator,
      baseline: meta.baseline,
      midTerm: meta.midTerm,
      endTarget: meta.endTarget,
      yearlyData,
    };
  });

  return Promise.all(promises);
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
    res.status(500).json({ error: 'Failed to fetch logframe data', detail: err.message });
  }
}

export {
  getIndicatorData
};
