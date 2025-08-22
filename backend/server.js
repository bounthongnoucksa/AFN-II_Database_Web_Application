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
import { getCBForStaffStatics, getCBForVillagersStatics, getForm1A1Statics } from './main_dashboard_controller.js';


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