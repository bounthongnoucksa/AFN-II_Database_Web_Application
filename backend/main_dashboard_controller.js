// backend/main_dashboard_controller.js
import { getDBConnection } from './getDBConnection.js'; // Importing the database connection helper

//CB For Staff dashboard
function getCBForStaffStatics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
        WITH NumberedParticipants AS (
                                SELECT
                                    s.Id,
                                    s.ReportingPeriodDate,
                                    s.ActivityStartDate,
                                    s.ActivityEndDate,
                                    p.Name,
                                    p.Responsibility,
                                    p.Office,
                                    p.StaffType,
                                    p.Gender,             
                                    s.Category,
                                    s.Topic,
                                    s.ActivityLocation,
                                    s.IFAD,
                                    s.MAF,
                                    s.WFP,
                                    s.GoL,
                                    s.Ben,
                                    p.SubmissionId,
                                    ROW_NUMBER() OVER (PARTITION BY p.SubmissionId ORDER BY p.Id) AS rn
                                FROM tb_CB_Staff_Participant p
                                JOIN tb_CB_Staff_Submission s ON p.SubmissionId = s.Id
                            ),
                            FinalResult AS (
                                SELECT
                                    Id,
                                    ReportingPeriodDate,
                                    ActivityStartDate,
                                    ActivityEndDate,
                                    Name,
                                    Responsibility,
                                    Office,
                                    StaffType,
                                    Gender,
                                    Category,
                                    Topic,
                                    ActivityLocation,
                                    CASE WHEN rn = 1 THEN IFAD ELSE NULL END AS IFAD,
                                    CASE WHEN rn = 1 THEN MAF ELSE NULL END AS MAF,
                                    CASE WHEN rn = 1 THEN WFP ELSE NULL END AS WFP,
                                    CASE WHEN rn = 1 THEN GoL ELSE NULL END AS GoL,
                                    CASE WHEN rn = 1 THEN Ben ELSE NULL END AS Ben
                                FROM NumberedParticipants
                            )

                            SELECT
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' AND StaffType = 'afn_ii_staff' THEN Name END) AS ContractedStaffTrained,
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' AND StaffType = 'gol_staff' THEN Name END) AS GovStaffTrained,
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' AND Gender = '_male' THEN Name END) AS MenStaffParticipants,
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' AND Gender = '_female' THEN Name END) AS WomenStaffParticipants,
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' THEN Name END) AS TotalStaffTrained,
                                COUNT(DISTINCT CASE WHEN Category <> '6_meeting' THEN Topic END) AS TotalSubjectsTrained
                            FROM FinalResult;
        `;


        db.get(query, [], (err, row) => {
            db.close();
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });

    })
}


//CB for villagers dashboard
function getCBForVillagersStatics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                        WITH UniqueParticipants AS (
                            SELECT
                                COALESCE(HHId, '') AS HHId,
                                NameAndSurname,
                                MAX(Age) AS Age,
                                MAX(Gender) AS Gender,
                                MAX(Ethnicity) AS Ethnicity,
                                MAX(PWD) AS PWD,
                                MAX(APGMember) AS APGMember
                            FROM tb_CB_for_Villagers_Participant
                            GROUP BY COALESCE(HHId, ''), NameAndSurname
                        )
                        SELECT
                            COUNT(*) AS Total_Farmers_Participants,
                            SUM(CASE WHEN Gender = 'Female' THEN 1 ELSE 0 END) AS Women_Farmers_Participants,
                            SUM(CASE WHEN Gender = 'Male' THEN 1 ELSE 0 END) AS Men_Farmer_Participants,
                            SUM(CASE WHEN Age BETWEEN 15 AND 35 THEN 1 ELSE 0 END) AS Youth_Farmer_Participants,
                            SUM(CASE WHEN Ethnicity NOT IN ('_e01','_e02','_e03','_e04','_e05','_e06','_e07','_e08') THEN 1 ELSE 0 END) AS Ethnic_Farmer_Participants,
                            SUM(CASE WHEN PWD = 'yes' THEN 1 ELSE 0 END) AS PWD_Participants,
                            SUM(CASE WHEN APGMember = 'yes' THEN 1 ELSE 0 END) AS APG_Member_Trained
                            
                        FROM UniqueParticipants;
        `;


        db.get(query, [], (err, row) => {
            db.close();
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });

    })
}

//Get Form 1A1 Statistics
function getForm1A1Statics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                        WITH UniqueVillages AS (
                            SELECT DISTINCT Province, District, Village, VNCAvailable
                            FROM tb_Form_1A1_Submission
                        ),
                        UniqueParticipants AS (
                            SELECT DISTINCT
                                COALESCE(HHId, '') || '_' || NameAndSurname AS ParticipantKey,
                                Age,
                                Gender,
                                Responsibility,
                                Ethnicity,
                                PWBWStatus
                            FROM tb_Form_1A1_Participant
                        )
                        SELECT
                            -- Village Nutrition Centers
                            COUNT(DISTINCT CASE WHEN VNCAvailable IN ('1','2') THEN Province||District||Village END) AS Total_VNC,
                            COUNT(DISTINCT CASE WHEN VNCAvailable = '1' THEN Province||District||Village END) AS New_Construction,
                            COUNT(DISTINCT CASE WHEN VNCAvailable = '2' THEN Province||District||Village END) AS Renovation,

                            -- Village Facilitators
                            COUNT(DISTINCT CASE WHEN Responsibility = 'vnf' THEN ParticipantKey END) AS VF_Total,
                            COUNT(DISTINCT CASE WHEN Responsibility = 'vnf' AND Gender = 'Female' THEN ParticipantKey END) AS VF_Female,

                            -- FNS Participants
                            COUNT(DISTINCT ParticipantKey) AS Total_Participants,
                            COUNT(DISTINCT CASE WHEN Gender = 'Female' THEN ParticipantKey END) AS Women_Participants,
                            COUNT(DISTINCT CASE WHEN Age BETWEEN 15 AND 35 THEN ParticipantKey END) AS Youth_Participants,
                            COUNT(DISTINCT CASE WHEN Ethnicity NOT IN ('_e01','_e02','_e03','_e04','_e05','_e06','_e07','_e08')
                                                THEN ParticipantKey END) AS Ethnic_Participants,

                            -- PW / BW / PBW
                            COUNT(DISTINCT CASE WHEN PWBWStatus = 'pw' THEN ParticipantKey END) AS Pregnant_Women,
                            COUNT(DISTINCT CASE WHEN PWBWStatus = 'bw' THEN ParticipantKey END) AS Breastfeeding_Women,
                            COUNT(DISTINCT CASE WHEN PWBWStatus = 'pw_1' THEN ParticipantKey END) AS PBW_Women
                        FROM UniqueVillages
                        LEFT JOIN UniqueParticipants ON 1=1;

        `;


        db.get(query, [], (err, row) => {
            db.close();
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });

    })
}

//Get Form 1A2 Statistics
function getForm1A2Statics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                        SELECT
                            COUNT(DISTINCT CASE 
                                WHEN Receive_Grant = 'g_yes' 
                                THEN HHId || '|' || NameAndSurname 
                            END) AS Grant_Recipients,

                            COUNT(DISTINCT CASE 
                                WHEN Gender = 'Female' AND PWBWStatus = 'pw' 
                                THEN HHId || '|' || NameAndSurname 
                            END) AS Pregnant_Women,

                            COUNT(DISTINCT CASE 
                                WHEN Gender = 'Female' AND PWBWStatus = 'bw' 
                                THEN HHId || '|' || NameAndSurname 
                            END) AS Breastfeeding_Women,

                            COUNT(DISTINCT CASE 
                                WHEN Gender = 'Female' AND PWBWStatus = 'pw_1' 
                                THEN HHId || '|' || NameAndSurname 
                            END) AS Pregnant_Breastfeeding_Women,

                            COUNT(DISTINCT CASE 
                                WHEN Receive_Grant = 'g_yes' AND Age BETWEEN 15 AND 35 
                                THEN HHId || '|' || NameAndSurname 
                            END) AS Youth_Grant_Recipients

                        FROM tb_Form_1A2_Participant;
        `;


        db.get(query, [], (err, row) => {
            db.close();
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });

    })
}


//Get Form 1A3a Statistics
function getForm1A3aStatics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                        WITH AllParticipants AS (
                            SELECT DISTINCT 
                                s.Province || '|' || s.District || '|' || s.Village || '|' || p.HHId || '|' || p.NameAndSurname AS UniqueParticipant,
                                p.Gender,
                                p.Age,
                                p.Ethnicity
                            FROM tb_Form_1A3a_Participant p
                            JOIN tb_Form_1A3a_Submission s ON p.SubmissionId = s.Id
                        ),
                        AllVillagesWithEquipment AS (
                            SELECT DISTINCT 
                                Province || '|' || District || '|' || Village AS UniqueVillage
                            FROM tb_Form_1A3a_Submission
                            WHERE Equipment_received = 'yes'
                        )

                        SELECT
                            -- 1. # of Villages Received Equipment
                            (SELECT COUNT(*) FROM AllVillagesWithEquipment) AS Villages_Received_Equipment,

                            -- 2. Total Farmers Participants
                            (SELECT COUNT(*) FROM AllParticipants) AS Total_Farmers,

                            -- 3. % Women Farmers
                            ROUND(100.0 * (SELECT COUNT(*) FROM AllParticipants WHERE Gender = 'Female') 
                                / (SELECT COUNT(*) FROM AllParticipants), 2) AS Percent_Women_Farmers,

                            -- 4. % Youth Farmers
                            ROUND(100.0 * (SELECT COUNT(*) FROM AllParticipants WHERE Age BETWEEN 15 AND 35) 
                                / (SELECT COUNT(*) FROM AllParticipants), 2) AS Percent_Youth_Farmers,

                            -- 5. % Ethnic Minority Farmers
                            ROUND(100.0 * (SELECT COUNT(*) FROM AllParticipants 
                                        WHERE Ethnicity NOT IN ('_e01', '_e02', '_e03', '_e04', '_e05', '_e06', '_e07', '_e08')) 
                                / (SELECT COUNT(*) FROM AllParticipants), 2) AS Percent_Ethnic_Minority_Farmers;
        `;
        db.get(query, [], (err, row) => {
            db.close();
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });

    })
}


//Get Form 1A3b Statistics
function getForm1A3bStatics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                        WITH ValidStorages AS (
                            SELECT DISTINCT Province || '|' || District || '|' || Village AS UniqueLocation
                            FROM tb_Form_1A3b_Submission
                            WHERE Storage_built IN ('construction', 'Rehabilitation')
                        ),

                        ValidCommittees AS (
                            SELECT DISTINCT Province || '|' || District || '|' || Village AS UniqueLocation
                            FROM tb_Form_1A3b_Submission
                            WHERE Storage_built IN ('construction', 'Rehabilitation') AND CommityExist = 'yes'
                        ),

                        AllParticipants AS (
                            SELECT DISTINCT 
                                HHId || '|' || NameAndSurname AS UniqueParticipant,
                                Gender,
                                Age,
                                Ethnicity,
                                ParticipantRole
                            FROM tb_Form_1A3b_Participant
                        ),

                        BorrowerHHs AS (
                            SELECT DISTINCT HHId || '|' || NameAndSurname AS UniqueBorrower
                            FROM tb_Form_1A3b_Participant
                            WHERE ParticipantRole IN ('2', '3')
                        ),

                        InitialRiceByLocation AS (
                            SELECT DISTINCT Province || '|' || District || '|' || Village AS UniqueLocation, InitialRice
                            FROM tb_Form_1A3b_Submission
                            WHERE InitialRice IS NOT NULL
                        )

                        SELECT
                            -- 1. # of Rice Storages Built
                            (SELECT COUNT(*) FROM ValidStorages) AS Num_Storages_Built,

                            -- 2. # of Rice Bank Committees
                            (SELECT COUNT(*) FROM ValidCommittees) AS Num_RiceBank_Committees,

                            -- 3. Total Farmer Participants
                            (SELECT COUNT(*) FROM AllParticipants) AS Total_Farmers,

                            -- 4. % Women Participants
                            ROUND(
                                100.0 * (SELECT COUNT(*) FROM AllParticipants WHERE Gender = 'Female') /
                                (SELECT COUNT(*) FROM AllParticipants),
                                2
                            ) AS Percent_Women,

                            -- 5. % Youth Participants
                            ROUND(
                                100.0 * (SELECT COUNT(*) FROM AllParticipants WHERE Age BETWEEN 15 AND 35) /
                                (SELECT COUNT(*) FROM AllParticipants),
                                2
                            ) AS Percent_Youth,

                            -- 6. % Ethnic Minority Participants
                            ROUND(
                                100.0 * (SELECT COUNT(*) FROM AllParticipants 
                                        WHERE Ethnicity NOT IN ('_e01', '_e02', '_e03', '_e04', '_e05', '_e06', '_e07', '_e08')) /
                                (SELECT COUNT(*) FROM AllParticipants),
                                2
                            ) AS Percent_Ethnic,

                            -- 7. Cumulative Borrower HHs
                            (SELECT COUNT(*) FROM BorrowerHHs) AS Cumulative_Borrower_HHs,

                            -- 8. Initial Amount of Rice (Tons)
                            Round(((SELECT SUM(InitialRice) FROM InitialRiceByLocation))/1000, 2) AS Total_Initial_Rice_Tons;
        `;
        db.get(query, [], (err, row) => {
            db.close();
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });

    })
}




export { getCBForStaffStatics, getCBForVillagersStatics, getForm1A1Statics, getForm1A2Statics, getForm1A3aStatics, getForm1A3bStatics };