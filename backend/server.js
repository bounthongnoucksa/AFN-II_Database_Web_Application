// backend/server.js
//to created database automatically if not exist
import './database.js';

// This is the main server file for the backend of the AFN-II Database Web Application
import express from 'express';
const app = express();

import cors from 'cors';
import ExcelJS from 'exceljs'; // For Excel file handling
import path from 'path'; // give path to this file server.js
import { fileURLToPath } from 'url';


// Import your controller functions using ES module syntax
//Import statistics data for chart
import { getCBForStaffStatics, getCBForVillagersStatics, getForm1A1Statics, getForm1A2Statics, getForm1A3aStatics, getForm1A3bStatics } from './main_dashboard_controller.js';

//Import outreach report functions
import { get1A1OutreachData, get1A4OutreachData, get1BAct6OutreachData, get1BAct8OutreachData, get2Act1OutreachData, get2Act2OutreachData, get2Act3OutreachData, get3Act2OutreachData } from './outreach_controller.js';

//Import logframe functions
 import { getIndicatorData } from './logframe_controller.js';

//Import CB for staff functions
import {
    getCBStaffParticipantData,
    getCBStaffParticipantDataBySID,
    downloadCBStaffSubmissionDataFromKoboToolbox,
    deleteSubmissionInKoboAndDatabase,
    deleteOnlyParticipantInDB,
    deleteOnlySubmissionInKobo,
    updateKoboSubmission,
    buildSubmissionXML,
    submitNewSubmissionToKobo,
    getRawSubmissionAndParticipantsData,
    getSubmissionUUIDBySubmissionId,
    getNewSubmissionIdByUUID,
    editSubmissionAndParticipants
} from './cb_staff_controller.js'; // Note the .js extension


//Import CB for villagers functions
import {
    downloadCBVillagersSubmissionDataFromKoboToolbox,
    getCBVillagerParticipantData,
    getCBVillagersParticipantDataBySID,
    getCBForVillagersSubmissionUUIDBySubmissionId,
    getCBForVillagerNewSubmissionIdByUUID,
    deleteOnlyCBForVillagersParticipantInDB,
    deleteOnlyCBForVillagersSubmissionInKobo
} from './cb_villagers_controller.js';

//Import Form 1A1 functions
import {
    downloadForm1A1SubmissionDataFromKoboToolbox,
    getForm1A1NewSubmissionIdByUUID,
    getForm1A1ParticipantData,
    getForm1A1ParticipantDataBySID,
    getForm1A1SubmissionUUIDBySubmissionId

} from './1A1_controller.js';

//Import Form 1A2 functions
import {
    downloadForm1A2SubmissionDataFromKoboToolbox,
    getForm1A2ParticipantData,
    getForm1A2ParticipantDataBySID,
    getForm1A2SubmissionUUIDBySubmissionId,
    getForm1A2NewSubmissionIdByUUID,
    deleteOnlyForm1A2ParticipantInDB,
    deleteOnlyForm1A2SubmissionInKobo

} from './1A2_controller.js'

//Import Form 1A3a functions
import {
    downloadForm1A3aSubmissionDataFromKoboToolbox,
    getForm1A3aParticipantData,
    getForm1A3aParticipantDataBySID,
    getForm1A3aSubmissionUUIDBySubmissionId,
    getForm1A3aNewSubmissionIdByUUID,
    deleteOnlyForm1A3aParticipantInDB,
    deleteOnlyForm1A3aSubmissionInKobo
} from './1A3a_controller.js'

//Import Form 1A3b functions
import {
    downloadForm1A3bSubmissionDataFromKoboToolbox,
    getForm1A3bParticipantData,
    getForm1A3bParticipantDataBySID,
    getForm1A3bSubmissionUUIDBySubmissionId,
    getForm1A3bNewSubmissionIdByUUID,
    deleteOnlyForm1A3bParticipantInDB,
    deleteOnlyForm1A3bSubmissionInKobo
} from './1A3b_controller.js'

////Import Form 1A4 functions
import{
    downloadForm1A4SubmissionDataFromKoboToolbox,
    getForm1A4ParticipantData,
    getForm1A4ParticipantDataBySID,
    getForm1A4SubmissionUUIDBySubmissionId,
    getForm1A4NewSubmissionIdByUUID,
    deleteOnlyForm1A4ParticipantInDB,
    deleteOnlyForm1A4SubmissionInKobo
} from './1A4_controller.js'

//Import Form 1A5a functions
import {
    downloadForm1A5aSubmissionDataFromKoboToolbox,
    getForm1A5aParticipantData,
    getForm1A5aParticipantDataBySID,
    getForm1A5aSubmissionUUIDBySubmissionId,
    getForm1A5aNewSubmissionIdByUUID,
    deleteOnlyForm1A5aParticipantInDB,
    deleteOnlyForm1A5aSubmissionInKobo
} from './1A5a_controller.js'

//Import Form 1A5b functions
import {
    downloadForm1A5bSubmissionDataFromKoboToolbox,
    getForm1A5bParticipantData,
    getForm1A5bParticipantDataBySID,
    getForm1A5bSubmissionUUIDBySubmissionId,
    getForm1A5bNewSubmissionIdByUUID,
    deleteOnlyForm1A5bParticipantInDB,
    deleteOnlyForm1A5bSubmissionInKobo
} from './1A5b_controller.js'

//Import Form 1BAct6 functions
import {
    downloadForm1BAct6SubmissionDataFromKoboToolbox,
    getForm1BAct6ParticipantData,
    getForm1BAct6ParticipantDataBySID,
    getForm1BAct6SubmissionUUIDBySubmissionId,
    getForm1BAct6NewSubmissionIdByUUID,
    deleteOnlyForm1BAct6ParticipantInDB,
    deleteOnlyForm1BAct6SubmissionInKobo
} from './1BAct6_controller.js'

//Import Form 1BAct7 functions
import { 
    downloadForm1BAct7SubmissionDataFromKoboToolbox,
    getForm1BAct7ParticipantData,
    getForm1BAct7ParticipantDataBySID,
    getForm1BAct7SubmissionUUIDBySubmissionId,
    getForm1BAct7NewSubmissionIdByUUID,
    deleteOnlyForm1BAct7ParticipantInDB,
    deleteOnlyForm1BAct7SubmissionInKobo
} from './1BAct7_controller.js';

//Import Form 1BAct8 functions
import { 
    downloadForm1BAct8SubmissionDataFromKoboToolbox,
    getForm1BAct8ParticipantData,
    getForm1BAct8ParticipantDataBySID,
    getForm1BAct8SubmissionUUIDBySubmissionId,
    getForm1BAct8NewSubmissionIdByUUID,
    deleteOnlyForm1BAct8ParticipantInDB,
    deleteOnlyForm1BAct8SubmissionInKobo
 } from './1BAct8_controller.js';

//Import Form 2Act1 functions
 import { 
    downloadForm2Act1SubmissionDataFromKoboToolbox,
    getForm2Act1ParticipantData,
    getForm2Act1ParticipantDataBySID,
    getForm2Act1SubmissionUUIDBySubmissionId,
    getForm2Act1NewSubmissionIdByUUID,
    deleteOnlyForm2Act1ParticipantInDB,
    deleteOnlyForm2Act1SubmissionInKobo
 } from './2Act1_controller.js';

//Import Form 2Act2 functions
import { 
    downloadForm2Act2SubmissionDataFromKoboToolbox,
    getForm2Act2ParticipantData,
    getForm2Act2ParticipantDataBySID,
    getForm2Act2SubmissionUUIDBySubmissionId,
    getForm2Act2NewSubmissionIdByUUID,
    deleteOnlyForm2Act2ParticipantInDB,
    deleteOnlyForm2Act2SubmissionInKobo
} from './2Act2_controller.js';

//Import Form 2Act3 functions
import { 
    downloadForm2Act3SubmissionDataFromKoboToolbox,
    getForm2Act3ParticipantData,
    getForm2Act3ParticipantDataBySID,
    getForm2Act3SubmissionUUIDBySubmissionId,
    getForm2Act3NewSubmissionIdByUUID,
    deleteOnlyForm2Act3ParticipantInDB,
    deleteOnlyForm2Act3SubmissionInKobo
 } from './2Act3_controller.js';

//Import Form 3Act1a functions
 import { 
    downloadForm3Act1aSubmissionDataFromKoboToolbox,
    getForm3Act1aParticipantData,
    getForm3Act1aParticipantDataBySID,
    getForm3Act1aSubmissionUUIDBySubmissionId,
    getForm3Act1aNewSubmissionIdByUUID,
    deleteOnlyForm3Act1aParticipantInDB,
    deleteOnlyForm3Act1aSubmissionInKobo
 } from './3Act1a_controller.js';

//Import Form 3Act1b functions
 import { 
    downloadForm3Act1bSubmissionDataFromKoboToolbox,
    getForm3Act1bParticipantData,
    getForm3Act1bParticipantDataBySID,
    getForm3Act1bSubmissionUUIDBySubmissionId,
    getForm3Act1bNewSubmissionIdByUUID,
    deleteOnlyForm3Act1bParticipantInDB,
    deleteOnlyForm3Act1bSubmissionInKobo
 } from './3Act1b_controller.js';

//Import Form 3Act2 functions
 import { 
    downloadForm3Act2SubmissionDataFromKoboToolbox,
    getForm3Act2ParticipantData,
    getForm3Act2ParticipantDataBySID,
    getForm3Act2SubmissionUUIDBySubmissionId,
    getForm3Act2NewSubmissionIdByUUID,
    deleteOnlyForm3Act2ParticipantInDB,
    deleteOnlyForm3Act2SubmissionInKobo
 } from './3Act2_controller.js';






//##########################################################################
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.use(cors()); // allow cross-origin requests from frontend to backend
app.use(express.json());
//###########################################################################










//##################### Function to handle all Outreach Report data #####################
app.get('/api/form1A1/getOutreachData', async (req, res) => {
    
    const { reportingPeriod, reportYear } = req.query;
    if (!reportingPeriod || !reportYear) {
        return res.status(400).json({ error: 'Missing ReportYear or ReportingPeriod' });
    }

    try {
        const data = await get1A1OutreachData(reportingPeriod, reportYear);
        res.json({ success: true, data }); // send result data and status code 200 to frontend

    } catch (err) {
        console.err('error getting 1A1 Outreach data', err);
        res.status(500).json({ success: false, message: 'Internal Server Error',error: err.message  });
    }
});

app.get('/api/form1A4/getOutreachData', async (req, res) => {
    
    const { reportingPeriod, reportYear } = req.query;
    if (!reportingPeriod || !reportYear) {
        return res.status(400).json({ error: 'Missing ReportYear or ReportingPeriod' });
    }

    try {
        const data = await get1A4OutreachData(reportingPeriod, reportYear);
        res.json({ success: true, data }); // send result data and status code 200 to frontend

    } catch (err) {
        console.err('error getting 1A4 Outreach data', err);
        res.status(500).json({ success: false, message: 'Internal Server Error',error: err.message  });
    }
});

app.get('/api/form1BAct6/getOutreachData', async (req, res) => {
    
    const { reportingPeriod, reportYear } = req.query;
    if (!reportingPeriod || !reportYear) {
        return res.status(400).json({ error: 'Missing ReportYear or ReportingPeriod' });
    }

    try {
        const data = await get1BAct6OutreachData(reportingPeriod, reportYear);
        res.json({ success: true, data }); // send result data and status code 200 to frontend

    } catch (err) {
        console.err('error getting 1BAct6 Outreach data', err);
        res.status(500).json({ success: false, message: 'Internal Server Error',error: err.message  });
    }
});

app.get('/api/form1BAct8/getOutreachData', async (req, res) => {
    
    const { reportingPeriod, reportYear } = req.query;
    if (!reportingPeriod || !reportYear) {
        return res.status(400).json({ error: 'Missing ReportYear or ReportingPeriod' });
    }

    try {
        const data = await get1BAct8OutreachData(reportingPeriod, reportYear);
        res.json({ success: true, data }); // send result data and status code 200 to frontend

    } catch (err) {
        console.err('error getting 1BAct8 Outreach data', err);
        res.status(500).json({ success: false, message: 'Internal Server Error',error: err.message  });
    }
});

app.get('/api/form2Act1/getOutreachData', async (req, res) => {
    
    const { reportingPeriod, reportYear } = req.query;
    if (!reportingPeriod || !reportYear) {
        return res.status(400).json({ error: 'Missing ReportYear or ReportingPeriod' });
    }

    try {
        const data = await get2Act1OutreachData(reportingPeriod, reportYear);
        res.json({ success: true, data }); // send result data and status code 200 to frontend

    } catch (err) {
        console.err('error getting 2Act1 Outreach data', err);
        res.status(500).json({ success: false, message: 'Internal Server Error',error: err.message  });
    }
});

app.get('/api/form2Act2/getOutreachData', async (req, res) => {
    
    const { reportingPeriod, reportYear } = req.query;
    if (!reportingPeriod || !reportYear) {
        return res.status(400).json({ error: 'Missing ReportYear or ReportingPeriod' });
    }

    try {
        const data = await get2Act2OutreachData(reportingPeriod, reportYear);
        res.json({ success: true, data }); // send result data and status code 200 to frontend

    } catch (err) {
        console.err('error getting 2Act2 Outreach data', err);
        res.status(500).json({ success: false, message: 'Internal Server Error',error: err.message  });
    }
});

app.get('/api/form2Act3/getOutreachData', async (req, res) => {
    
    const { reportingPeriod, reportYear } = req.query;
    if (!reportingPeriod || !reportYear) {
        return res.status(400).json({ error: 'Missing ReportYear or ReportingPeriod' });
    }

    try {
        const data = await get2Act3OutreachData(reportingPeriod, reportYear);
        res.json({ success: true, data }); // send result data and status code 200 to frontend

    } catch (err) {
        console.err('error getting 2Act3 Outreach data', err);
        res.status(500).json({ success: false, message: 'Internal Server Error',error: err.message  });
    }
});

app.get('/api/form3Act2/getOutreachData', async (req, res) => {
    
    const { reportingPeriod, reportYear } = req.query;
    if (!reportingPeriod || !reportYear) {
        return res.status(400).json({ error: 'Missing ReportYear or ReportingPeriod' });
    }

    try {
        const data = await get3Act2OutreachData(reportingPeriod, reportYear);
        res.json({ success: true, data }); // send result data and status code 200 to frontend

    } catch (err) {
        console.err('error getting 3Act2 Outreach data', err);
        res.status(500).json({ success: false, message: 'Internal Server Error',error: err.message  });
    }
});

//##################### End Function to handle all Outreach Report data #####################


















//##################### Function to handle all Logframe Report data #########################
app.get('/api/all/getLogframeData', getIndicatorData); //testing

// app.get('/api/all/getLogframeData', async (req, res) => {
    

//     try {
//         const data = await fetchIndicatorData();
//         res.json({ success: true, data }); // send result data and status code 200 to frontend

//     } catch (err) {
//         console.error('error getting Logframe report data', err);
//         res.status(500).json({ success: false, message: 'Internal Server Error',error: err.message  });
//     }
// });




//##################### End Function to handle all Logframe Report data #####################















//##################### Function to handle all Main Dashboard statistics data #####################
app.get('/api/cbForStaff/getDashboardData', async (req, res) => {
    try {
        const data = await getCBForStaffStatics();
        res.json(data); // send result data to frontend

    } catch (err) {
        console.err('rror getting CB for staff dashboard data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/cbForVillagers/getDashboardData', async (req, res) => {
    try {
        const data = await getCBForVillagersStatics();
        res.json(data); // send result data to frontend

    } catch (err) {
        console.err('rror getting CB for villagers dashboard data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/form1A1/getDashboardData', async (req, res) => {
    try {
        const data = await getForm1A1Statics();
        res.json(data); // send result data to frontend

    } catch (err) {
        console.err('rror getting Form 1A1 dashboard data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/form1A2/getDashboardData', async (req, res) => {
    try {
        const data = await getForm1A2Statics();
        res.json(data); // send result data to frontend

    } catch (err) {
        console.err('rror getting Form 1A2 dashboard data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/form1A3a/getDashboardData', async (req, res) => {
    try {
        const data = await getForm1A3aStatics();
        res.json(data); // send result data to frontend

    } catch (err) {
        console.err('rror getting Form 1A3a dashboard data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/form1A3b/getDashboardData', async (req, res) => {
    try {
        const data = await getForm1A3bStatics();
        res.json(data); // send result data to frontend

    } catch (err) {
        console.err('rror getting Form 1A3b dashboard data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//###################################################################################################











//##################### Function to handle cb for statff #####################
// API endpoint to get CB Staff data
//The endpoint supports GET /api/getCBStaffParticipantData?lang=LA to fetch Lao or English data
app.get('/api/cbForStaff/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getCBStaffParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching CB Staff data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch CB Staff data', error: error.message });
    }
});

// API endpoint to get CB Staff data by Submission ID
// The endpoint supports GET /api/getCBStaffParticipantDataBySID?submissionId=123&lang=LA to fetch data for a specific submission
app.get('/api/cbForStaff/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getCBStaffParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching CB Staff data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch CB Staff data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/cbForStaff/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/CB_for_staff_Export_Template.xlsx');

    try {
        const rows = await getCBStaffParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 6;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=CB_for_Staff_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export CB Staff data to Excel');
    }
});

app.get('/api/cbForStaff/downloadFromKoboToolbox', async (req, res) => {
    try {
        // Call the function to download data from KoboToolbox
        await downloadCBStaffSubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox:', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});

app.delete('/api/cbForStaff/deleteSubmission', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to delete the submission
        await deleteSubmissionInKoboAndDatabase(submissionId);
        res.json({ success: true, message: 'Submission deleted successfully' });
    } catch (error) {

        console.error('Error deleting submission:', error);
        res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

    }
});

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/cbForStaff/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getSubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/cbForStaff/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getNewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


//delete a participant and update the submission in KoboToolbox
app.post('/api/cbForStaff/deleteParticipant', async (req, res) => {
    const { participantId, submissionId } = req.body;
    try {
        await deleteOnlyParticipantInDB(participantId);
        await deleteOnlySubmissionInKobo(submissionId);

        const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
        const xmlData = buildSubmissionXML(submission, participants);
        await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }

});

// Function to update participant data and submission in local database and KoboToolbox
app.post('/api/cbForStaff/updateParticipantAndSubmissionData', async (req, res) => {
    const data = req.body;
    if (!data.PID || !data.SubmissionID) {
        return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

    }
    try {
        //update new data to local database
        await editSubmissionAndParticipants(data);


        //delete submission data in Kobo
        await deleteOnlySubmissionInKobo(data.SubmissionID);

        //Submit new submission data from local database to Kobo
        const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
        const xmlData = buildSubmissionXML(submission, participants);
        await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
        res.json({ success: true, message: 'Participant and submission data updated successfully' });



    } catch (error) {
        console.error('Error updating participant and submission data at backend:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
    }
});

//############################ End Function to handle cb for statff ####################################################################
















//##################### Function to handle cb for villagers ####################################
app.get('/api/cbForVillagers/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadCBVillagersSubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/cbForVillagers/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getCBVillagerParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching CB Villagers data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch CB Villagers data', error: error.message });
    }
});


// API endpoint to get CB Villagers data by Submission ID
app.get('/api/cbForVillagers/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getCBVillagersParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching CB Villagers data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch CB Villagers data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/cbForVillagers/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/CB_for_Villagers_Export_Template.xlsx');

    try {
        const rows = await getCBVillagerParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 7;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=CB_for_Villagers_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export CB Villagers data to Excel');
    }
});


// app.delete('/api/cbForStaff/deleteSubmission', async (req, res) => {
//     try {
//         const submissionId = req.query.submissionId;
//         if (!submissionId) {
//             return res.status(400).json({ success: false, message: 'Submission ID is required' });
//         }

//         // Call the function to delete the submission
//         await deleteSubmissionInKoboAndDatabase(submissionId);
//         res.json({ success: true, message: 'Submission deleted successfully' });
//     } catch (error) {

//         console.error('Error deleting submission:', error);
//         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

//     }
// });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/cbForVillagers/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getCBForVillagersSubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/cbForVillagers/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getCBForVillagerNewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// //delete a participant and update the submission in KoboToolbox
// app.post('/api/cbForStaff/deleteParticipant', async (req, res) => {
//     const { participantId, submissionId } = req.body;
//     try {
//         await deleteOnlyParticipantInDB(participantId);
//         await deleteOnlySubmissionInKobo(submissionId);

//         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
//         const xmlData = buildSubmissionXML(submission, participants);
//         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
//         res.json({ success: true });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, error: err.message });
//     }

// });

// // Function to update participant data and submission in local database and KoboToolbox
// app.post('/api/cbForStaff/updateParticipantAndSubmissionData', async (req, res) => {
//     const data = req.body;
//     if (!data.PID || !data.SubmissionID) {
//         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

//     }
//     try {
//         //update new data to local database
//         await editSubmissionAndParticipants(data);


//         //delete submission data in Kobo
//         await deleteOnlySubmissionInKobo(data.SubmissionID);

//         //Submit new submission data from local database to Kobo
//         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
//         const xmlData = buildSubmissionXML(submission, participants);
//         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
//         res.json({ success: true, message: 'Participant and submission data updated successfully' });



//     } catch (error) {
//         console.error('Error updating participant and submission data at backend:', error.message);
//         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
//     }
// });


//###################### End Function to handle cb for villagers ################################


















//##################### Function to handle Form 1A1 ####################################
app.get('/api/form1A1/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm1A1SubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form1A1/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A1ParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A1 data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A1 data', error: error.message });
    }
});


// API endpoint to get Form 1A1 data by Submission ID
app.get('/api/form1A1/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A1ParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A1 data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A1 data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form1A1/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_1A1_Export_Template.xlsx');

    try {
        const rows = await getForm1A1ParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_1A1_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 1A1 data to Excel');
    }
});


// // app.delete('/api/cbForStaff/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form1A1/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm1A1SubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form1A1/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm1A1NewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/cbForStaff/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/cbForStaff/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 1A1 ################################




















//##################### Function to handle Form 1A2 ####################################
app.get('/api/form1A2/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm1A2SubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form1A2/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A2ParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A2 data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A2 data', error: error.message });
    }
});


// API endpoint to get Form 1A1 data by Submission ID
app.get('/api/form1A2/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A2ParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A2 data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A2 data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form1A2/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_1A2_Export_Template.xlsx');

    try {
        const rows = await getForm1A2ParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 7;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_1A2_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 1A1 data to Excel');
    }
});


// // // app.delete('/api/cbForStaff/deleteSubmission', async (req, res) => {
// // //     try {
// // //         const submissionId = req.query.submissionId;
// // //         if (!submissionId) {
// // //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// // //         }

// // //         // Call the function to delete the submission
// // //         await deleteSubmissionInKoboAndDatabase(submissionId);
// // //         res.json({ success: true, message: 'Submission deleted successfully' });
// // //     } catch (error) {

// // //         console.error('Error deleting submission:', error);
// // //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// // //     }
// // // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form1A2/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm1A2SubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form1A2/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm1A2NewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // // //delete a participant and update the submission in KoboToolbox
// // // app.post('/api/cbForStaff/deleteParticipant', async (req, res) => {
// // //     const { participantId, submissionId } = req.body;
// // //     try {
// // //         await deleteOnlyParticipantInDB(participantId);
// // //         await deleteOnlySubmissionInKobo(submissionId);

// // //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// // //         const xmlData = buildSubmissionXML(submission, participants);
// // //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// // //         res.json({ success: true });
// // //     } catch (err) {
// // //         console.error(err);
// // //         res.status(500).json({ success: false, error: err.message });
// // //     }

// // // });

// // // // Function to update participant data and submission in local database and KoboToolbox
// // // app.post('/api/cbForStaff/updateParticipantAndSubmissionData', async (req, res) => {
// // //     const data = req.body;
// // //     if (!data.PID || !data.SubmissionID) {
// // //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// // //     }
// // //     try {
// // //         //update new data to local database
// // //         await editSubmissionAndParticipants(data);


// // //         //delete submission data in Kobo
// // //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// // //         //Submit new submission data from local database to Kobo
// // //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// // //         const xmlData = buildSubmissionXML(submission, participants);
// // //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// // //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// // //     } catch (error) {
// // //         console.error('Error updating participant and submission data at backend:', error.message);
// // //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// // //     }
// // // });


// // //###################### End Function to handle Form 1A2 ################################
















//##################### Function to handle Form 1A3a ####################################
app.get('/api/form1A3a/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm1A3aSubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form1A3a/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A3aParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A3a data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A3a data', error: error.message });
    }
});


// API endpoint to get Form 1A1 data by Submission ID
app.get('/api/form1A3a/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A3aParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A3a data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A3a data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form1A3a/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_1A3a_Export_Template.xlsx');

    try {
        const rows = await getForm1A3aParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_1A3a_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 1A3a data to Excel');
    }
});


// // app.delete('/api/form1A3a/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form1A3a/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm1A3aSubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form1A3a/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm1A3aNewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form1A3a/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form1A3a/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 1A3a ################################
















//##################### Function to handle Form 1A3b ####################################
app.get('/api/form1A3b/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm1A3bSubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form1A3b/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A3bParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A3b data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A3b data', error: error.message });
    }
});


// API endpoint to get Form 1A1 data by Submission ID
app.get('/api/form1A3b/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A3bParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A3b data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A3b data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form1A3b/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_1A3b_Export_Template.xlsx');

    try {
        const rows = await getForm1A3bParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_1A3b_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 1A3b data to Excel');
    }
});


// // app.delete('/api/form1A3b/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form1A3b/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm1A3bSubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form1A3b/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm1A3bNewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form1A3b/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form1A3b/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 1A3b ################################




















//##################### Function to handle Form 1A4 ####################################
app.get('/api/form1A4/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm1A4SubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form1A4/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A4ParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A3b data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A3b data', error: error.message });
    }
});


// API endpoint to get Form 1A1 data by Submission ID
app.get('/api/form1A4/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A4ParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A4 data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A4 data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form1A4/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_1A4_Export_Template.xlsx');

    try {
        const rows = await getForm1A4ParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_1A4_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 1A4 data to Excel');
    }
});


// // app.delete('/api/form1A4/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form1A4/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm1A4SubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form1A4/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm1A4NewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form1A4/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form1A4/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 1A4 ################################














//##################### Function to handle Form 1A5a ####################################
app.get('/api/form1A5a/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm1A5aSubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form1A5a/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A5aParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A5a data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A5a data', error: error.message });
    }
});


// API endpoint to get Form 1A1 data by Submission ID
app.get('/api/form1A5a/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A5aParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A5a data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A5a data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form1A5a/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_1A5a_Export_Template.xlsx');

    try {
        const rows = await getForm1A5aParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_1A5a_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 1A5a data to Excel');
    }
});


// // app.delete('/api/form1A5a/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form1A5a/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm1A5aSubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form1A5a/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm1A5aNewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form1A5a/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form1A5a/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 1A5a ################################














//##################### Function to handle Form 1A5b ####################################
app.get('/api/form1A5b/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm1A5bSubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form1A5b/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A5bParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A5b data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A5b data', error: error.message });
    }
});


// API endpoint to get Form 1A5b data by Submission ID
app.get('/api/form1A5b/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1A5bParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1A5b data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1A5b data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form1A5b/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_1A5b_Export_Template.xlsx');

    try {
        const rows = await getForm1A5bParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_1A5b_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 1A5b data to Excel');
    }
});


// // app.delete('/api/form1A5b/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form1A5b/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm1A5bSubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form1A5b/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm1A5bNewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form1A5b/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form1A5b/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 1A5b ################################
















//##################### Function to handle Form 1BAct6 ####################################
app.get('/api/form1BAct6/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm1BAct6SubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form1BAct6/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1BAct6ParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1BAct6 data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1BAct6 data', error: error.message });
    }
});


// API endpoint to get Form 1A5b data by Submission ID
app.get('/api/form1BAct6/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1BAct6ParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1BAct6 data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1BAct6 data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form1BAct6/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_1BAct6_Export_Template.xlsx');

    try {
        const rows = await getForm1BAct6ParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_1BAct6_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 1BAct6 data to Excel');
    }
});


// // app.delete('/api/form1BAct6/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form1BAct6/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm1BAct6SubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form1BAct6/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm1BAct6NewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form1BAct6/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form1BAct6/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 1BAct6 ################################

















//##################### Function to handle Form 1BAct7 ####################################
app.get('/api/form1BAct7/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm1BAct7SubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form1BAct7/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1BAct7ParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1BAct7 data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1BAct7 data', error: error.message });
    }
});


// API endpoint to get Form 1BAct7 data by Submission ID
app.get('/api/form1BAct7/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1BAct7ParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1BAct7 data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1BAct7 data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form1BAct7/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_1BAct7_Export_Template.xlsx');

    try {
        const rows = await getForm1BAct7ParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_1BAct7_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 1BAct7 data to Excel');
    }
});


// // app.delete('/api/form1BAct7/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form1BAct7/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm1BAct7SubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form1BAct7/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm1BAct7NewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form1BAct7/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form1BAct7/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 1BAct7 ################################

















//##################### Function to handle Form 1BAct8 ####################################
app.get('/api/form1BAct8/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm1BAct8SubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form1BAct8/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1BAct8ParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1BAct8 data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1BAct8 data', error: error.message });
    }
});


// API endpoint to get Form 1BAct8 data by Submission ID
app.get('/api/form1BAct8/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm1BAct8ParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 1BAct8 data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 1BAct8 data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form1BAct8/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_1BAct8_Export_Template.xlsx');

    try {
        const rows = await getForm1BAct8ParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_1BAct8_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 1BAct8 data to Excel');
    }
});


// // app.delete('/api/form1BAct8/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form1BAct8/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm1BAct8SubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form1BAct8/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm1BAct8NewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form1BAct8/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form1BAct8/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 1BAct8 ################################



















//##################### Function to handle Form 2Act1 ####################################
app.get('/api/form2Act1/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm2Act1SubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form2Act1/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm2Act1ParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 2Act1 data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 2Act1 data', error: error.message });
    }
});


// API endpoint to get Form 2Act1 data by Submission ID
app.get('/api/form2Act1/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm2Act1ParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 2Act1 data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 2Act1 data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form2Act1/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_2Act1_Export_Template.xlsx');

    try {
        const rows = await getForm2Act1ParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_2Act1_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 2Act1 data to Excel');
    }
});


// // app.delete('/api/form2Act1/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form2Act1/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm2Act1SubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form2Act1/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm2Act1NewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form2Act1/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form2Act1/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 2Act1 ################################




















//##################### Function to handle Form 2Act2 ####################################
app.get('/api/form2Act2/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm2Act2SubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form2Act2/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm2Act2ParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 2Act2 data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 2Act2 data', error: error.message });
    }
});


// API endpoint to get Form 2Act2 data by Submission ID
app.get('/api/form2Act2/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm2Act2ParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 2Act2 data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 2Act2 data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form2Act2/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_2Act2_Export_Template.xlsx');

    try {
        const rows = await getForm2Act2ParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_2Act2_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 2Act1 data to Excel');
    }
});


// // app.delete('/api/form2Act2/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form2Act2/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm2Act2SubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form2Act2/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm2Act2NewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form2Act2/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form2Act2/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 2Act2 ################################















//##################### Function to handle Form 2Act3 ####################################
app.get('/api/form2Act3/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm2Act3SubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form2Act3/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm2Act3ParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 2Act3 data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 2Act3 data', error: error.message });
    }
});


// API endpoint to get Form 2Act3 data by Submission ID
app.get('/api/form2Act3/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm2Act3ParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 2Act3 data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 2Act3 data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form2Act3/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_2Act3_Export_Template.xlsx');

    try {
        const rows = await getForm2Act3ParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_2Act3_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 2Act3 data to Excel');
    }
});


// // app.delete('/api/form2Act3/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form2Act3/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm2Act3SubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form2Act3/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm2Act3NewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form2Act3/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form2Act3/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 2Act3 ################################

















//##################### Function to handle Form 3Act1a ####################################
app.get('/api/form3Act1a/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm3Act1aSubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form3Act1a/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm3Act1aParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 3Act1a data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 3Act1a data', error: error.message });
    }
});


// API endpoint to get Form 3Act1a data by Submission ID
app.get('/api/form3Act1a/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm3Act1aParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 3Act1a data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 3Act1a data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form3Act1a/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_3Act1a_Export_Template.xlsx');

    try {
        const rows = await getForm3Act1aParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_3Act1a_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 3Act1a data to Excel');
    }
});


// // app.delete('/api/form3Act1a/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form3Act1a/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm3Act1aSubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form3Act1a/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm3Act1aNewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form3Act1a/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form3Act1a/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 3Act1a ################################























//##################### Function to handle Form 3Act1b ####################################
app.get('/api/form3Act1b/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm3Act1bSubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form3Act1b/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm3Act1bParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 3Act1b data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 3Act1b data', error: error.message });
    }
});


// API endpoint to get Form 3Act1a data by Submission ID
app.get('/api/form3Act1b/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm3Act1bParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 3Act1b data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 3Act1b data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form3Act1b/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_3Act1b_Export_Template.xlsx');

    try {
        const rows = await getForm3Act1bParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_3Act1b_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 3Act1b data to Excel');
    }
});


// // app.delete('/api/form3Act1b/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form3Act1b/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm3Act1bSubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form3Act1b/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm3Act1bNewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form3Act1b/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form3Act1b/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 3Act1b ################################





















//##################### Function to handle Form 3Act2 ####################################
app.get('/api/form3Act2/downloadFromKoboToolbox', async (req, res) => {
    try {
        //Call the function to download data from KoboToolbox
        await downloadForm3Act2SubmissionDataFromKoboToolbox();
        res.json({ success: true, message: 'Data downloaded successfully from KoboToolbox' });
    } catch (error) {
        console.error('Error downloading data from KoboToolbox', error);
        res.status(500).json({ success: false, message: 'Failed to download data from KoboToolbox', error: error.message });
    }
});


app.get('/api/form3Act2/getParticipantData', async (req, res) => {
    try {
        // Optional: language query parameter (default to LA)
        const language = req.query.lang || 'LA';
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm3Act2ParticipantData(language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 3Act2 data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 3Act2 data', error: error.message });
    }
});


// API endpoint to get Form 3Act2 data by Submission ID
app.get('/api/form3Act2/getParticipantDataBySID', async (req, res) => {
    try {
        // Get the submissionId from query parameters
        const language = req.query.lang || 'LA';
        const submissionId = req.query.submissionId;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }
        if (!language) {
            return res.status(400).json({ success: false, message: 'Language is required' });
        }

        const data = await getForm3Act2ParticipantDataBySID(submissionId, language);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching Form 3Act2 data by Submission ID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Form 3Act2 data by Submission ID', error: error.message });
    }
});



// Excel Export Endpoint
app.get('/api/form3Act2/exportToExcel', async (req, res) => {
    // Optional: language query parameter (default to LA)
    const language = req.query.lang || 'LA';
    if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
    }

    const templatePath = path.join(__dirname, 'templates/Form_3Act2_Export_Template.xlsx');

    try {
        const rows = await getForm3Act2ParticipantData(language);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const worksheet = workbook.getWorksheet('Sheet1');
        const startRow = 8;
        const startCol = 2;


        //check if the value is a date string
        const isDateString = (str) => {
            // Checks if string matches YYYY-MM-DD
            return /^\d{4}-\d{2}-\d{2}$/.test(str);
        };

        // Write data to worksheet
        rows.forEach((row, rowIndex) => {
            Object.values(row).forEach((value, colIndex) => {
                const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);

                if (value === null || value === undefined) {
                    cell.value = '';
                } else if (value instanceof Date) {
                    cell.value = value;
                    // cell.numFmt = 'yyyy-MM-dd';
                    cell.numFmt = 'dd/MM/yyyy';
                } else if (typeof value === 'number') {
                    cell.value = value;
                } else if (typeof value === 'string' && isDateString(value)) {
                    // Convert to Date object
                    const jsDate = new Date(value + 'T00:00:00'); // safe for Excel
                    cell.value = jsDate;
                    cell.numFmt = 'dd/mm/yyyy';  // Excel format
                } else {
                    cell.value = value.toString();
                }
            });
        });

        // Add borders (optional)
        const endRow = startRow + rows.length;
        const endCol = startCol + Object.keys(rows[0] || {}).length - 1;

        for (let r = startRow + 1; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cell = worksheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }

        // Send file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Form_3Act2_Exported_Report.xlsx');

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Export to Excel failed:', error);
        res.status(500).send('Failed to export Form 3Act2 data to Excel');
    }
});


// // app.delete('/api/form3Act2/deleteSubmission', async (req, res) => {
// //     try {
// //         const submissionId = req.query.submissionId;
// //         if (!submissionId) {
// //             return res.status(400).json({ success: false, message: 'Submission ID is required' });
// //         }

// //         // Call the function to delete the submission
// //         await deleteSubmissionInKoboAndDatabase(submissionId);
// //         res.json({ success: true, message: 'Submission deleted successfully' });
// //     } catch (error) {

// //         console.error('Error deleting submission:', error);
// //         res.status(500).json({ success: false, message: 'Failed to delete submission hahaha', error: error.message });

// //     }
// // });

// API endpoint to get UUID of a submission the UUID is important to get new submission ID from KoboToolbox when a previous submission is deleted
app.get('/api/form3Act2/getUUID', async (req, res) => {
    try {
        const submissionId = req.query.submissionId;
        if (!submissionId) {
            return res.status(400).json({ success: false, message: 'Submission ID is required' });
        }

        // Call the function to get the UUID
        const uuid = await getForm3Act2SubmissionUUIDBySubmissionId(submissionId);
        if (!uuid) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, uuid });

    } catch (error) {
        console.error('Error fetching UUID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch UUID', error: error.message });
    }
})

//get new submission ID by UUID above function
app.get('/api/form3Act2/getNewSubmissionID', async (req, res) => {
    try {
        const uuid = req.query.Uuid;
        if (!uuid) {
            return res.status(400).json({ success: false, message: 'UUID is required' });
        }

        // Call the function to get the UUID
        const newSubmissionId = await getForm3Act2NewSubmissionIdByUUID(uuid);
        if (!newSubmissionId) {
            return res.status(404).json({ success: false, message: 'UUID not found for the given submission ID' });
        }

        res.json({ success: true, newSubmissionId });

    } catch (error) {
        console.error('Error fetching New SubmissionID:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch New SubmissionID', error: error.message });
    }
})


// // //delete a participant and update the submission in KoboToolbox
// // app.post('/api/form3Act2/deleteParticipant', async (req, res) => {
// //     const { participantId, submissionId } = req.body;
// //     try {
// //         await deleteOnlyParticipantInDB(participantId);
// //         await deleteOnlySubmissionInKobo(submissionId);

// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(submissionId);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ success: false, error: err.message });
// //     }

// // });

// // // Function to update participant data and submission in local database and KoboToolbox
// // app.post('/api/form3Act2/updateParticipantAndSubmissionData', async (req, res) => {
// //     const data = req.body;
// //     if (!data.PID || !data.SubmissionID) {
// //         return res.status(400).json({ success: false, message: 'Participant ID and Submission ID are required' });

// //     }
// //     try {
// //         //update new data to local database
// //         await editSubmissionAndParticipants(data);


// //         //delete submission data in Kobo
// //         await deleteOnlySubmissionInKobo(data.SubmissionID);

// //         //Submit new submission data from local database to Kobo
// //         const { submission, participants } = await getRawSubmissionAndParticipantsData(data.SubmissionID);
// //         const xmlData = buildSubmissionXML(submission, participants);
// //         await submitNewSubmissionToKobo(xmlData); //submit the updated submission to KoboToolbox
// //         res.json({ success: true, message: 'Participant and submission data updated successfully' });



// //     } catch (error) {
// //         console.error('Error updating participant and submission data at backend:', error.message);
// //         res.status(500).json({ success: false, message: 'Failed to update participant and submission data', error: error.message });
// //     }
// // });


// //###################### End Function to handle Form 3Act2 ################################