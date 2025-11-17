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
// function getCBForVillagersStatics() {
//     return new Promise((resolve, reject) => {
//         const db = getDBConnection(); // Get the database connection
//         const query = `
//                         WITH UniqueParticipants AS (
//                             SELECT
//                                 COALESCE(TRIM(HHId), '') AS HHId,
//                                 TRIM(NameAndSurname) AS NameAndSurname,
//                                 MAX(Age) AS Age,
//                                 MAX(Gender) AS Gender,
//                                 MAX(Ethnicity) AS Ethnicity,
//                                 MAX(PWD) AS PWD,
//                                 MAX(APGMember) AS APGMember
//                             FROM tb_CB_for_Villagers_Participant
//                             GROUP BY COALESCE(TRIM(HHId), ''), TRIM(NameAndSurname)
//                         )
//                         SELECT
//                             COUNT(*) AS Total_Farmers_Participants,
//                             SUM(CASE WHEN Gender = 'Female' THEN 1 ELSE 0 END) AS Women_Farmers_Participants,
//                             SUM(CASE WHEN Gender = 'Male' THEN 1 ELSE 0 END) AS Men_Farmer_Participants,
//                             SUM(CASE WHEN Age BETWEEN 15 AND 35 THEN 1 ELSE 0 END) AS Youth_Farmer_Participants,
//                             SUM(CASE WHEN Ethnicity NOT IN ('_e01','_e02','_e03','_e04','_e05','_e06','_e07','_e08') THEN 1 ELSE 0 END) AS Ethnic_Farmer_Participants,
//                             SUM(CASE WHEN PWD = 'yes' THEN 1 ELSE 0 END) AS PWD_Participants,
//                             SUM(CASE WHEN APGMember = 'yes' THEN 1 ELSE 0 END) AS APG_Member_Trained

//                         FROM UniqueParticipants;
//         `;
function getCBForVillagersStatics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                        WITH UniqueParticipants AS (
                                                    SELECT
                                                        COALESCE(TRIM(p.HHId), '') AS HHId,
                                                        TRIM(p.NameAndSurname) AS NameAndSurname,
                                                        s.ReportingPeriod,
                                                        s.SpecializedTopic,
                                                        MAX(p.Age) AS Age,
                                                        MAX(p.Gender) AS Gender,
                                                        MAX(p.Ethnicity) AS Ethnicity,
                                                        MAX(p.PWD) AS PWD,
                                                        MAX(p.APGMember) AS APGMember
                                                    FROM tb_CB_for_Villagers_Participant p
                                                    INNER JOIN tb_CB_for_Villagers_Submission s
                                                        ON p.SubmissionId = s.Id
                                                    GROUP BY 
                                                        COALESCE(TRIM(p.HHId), ''),
                                                        TRIM(p.NameAndSurname),
                                                        s.ReportingPeriod,
                                                        s.SpecializedTopic
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

//Get Form 1A4 Statistics
function getForm1A4Statics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                         WITH 
                            --  All unique participants
                            AllParticipants AS (
                                SELECT DISTINCT 
                                    s.Province || '|' || s.District || '|' || s.Village || '|' || p.HHId || '|' || p.NameAndSurname AS UniqueParticipant,
                                    s.Province,
                                    s.District,
                                    s.Village,
                                    p.Gender,
                                    p.Age,
                                    p.Ethnicity
                                FROM tb_Form_1A4_Participant p
                                JOIN tb_Form_1A4_Submission s ON p.SubmissionId = s.Id
                            ),

                            --  All unique conservation areas identified (1 or 2)
                            AllIdentifiedAreas AS (
                                SELECT DISTINCT 
                                    s.Province || '|' || s.District || '|' || s.Village || '|' || s.SubActivity || '|' || s.Cons_identified AS UniqueArea,
                                    s.Province,
                                    s.District,
                                    s.Village,
                                    s.SubActivity,
                                    s.Cons_identified
                                FROM tb_Form_1A4_Submission s
                                WHERE s.Cons_identified IN (1, 2)
                            ),

                            --  Wild plant conservation areas
                            WildPlantAreas AS (
                                SELECT DISTINCT 
                                    Province || '|' || District || '|' || Village || '|' || SubActivity || '|' || Cons_identified AS UniqueWildArea
                                FROM tb_Form_1A4_Submission
                                WHERE Cons_identified IN (1, 2)
                                AND SubActivity NOT IN ('__1', 'subact3', 'subact4', 'subact5')
                            ),

                            --  Aquatic conservation areas
                            AquaticAreas AS (
                                SELECT DISTINCT 
                                    Province || '|' || District || '|' || Village || '|' || SubActivity || '|' || Cons_identified AS UniqueAquaArea
                                FROM tb_Form_1A4_Submission
                                WHERE Cons_identified IN (1, 2)
                                AND SubActivity IN ('__1', 'subact3', 'subact4', 'subact5')
                            )

                            SELECT
                                --Number of Identified Names of the cone. Area
                                (SELECT COUNT(*) FROM AllIdentifiedAreas) AS Num_Identified_Cons_Areas,

                                --# of Wild Plant Cons. area established
                                (SELECT COUNT(*) FROM WildPlantAreas) AS Num_Wild_Plan_Cons_Area,

                                -- # of Aquatic Cons. area established
                                (SELECT COUNT(*) FROM AquaticAreas) AS Num_Aquatic_Cons_Area,

                                --# Total farmers participants
                                (SELECT COUNT(*) FROM AllParticipants) AS Total_Farmers,

                                --# Women farmers participants    
                                (SELECT COUNT(*) FROM AllParticipants WHERE Gender = 'Female') AS Num_Women_Farmers,

                                --#Youth farmers participants (Age between 15 and 35)
                                (SELECT COUNT(*) FROM AllParticipants WHERE Age BETWEEN 15 AND 35) AS Num_Youth_Farmers,

                                --# Ethnic minority farmers participants
                                    (SELECT COUNT(*) FROM AllParticipants 
                                    WHERE Ethnicity NOT IN ('_e01', '_e02', '_e03', '_e04', '_e05', '_e06', '_e07', '_e08')) AS Num_Ethnic_Farmers;
                        
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

//Get Form 1A5a Statistics
function getForm1A5aStatics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                      WITH 
                        --  All unique participants
                        AllParticipants AS (
                            SELECT DISTINCT 
                                s.Province,
                                s.District,
                                s.Village,
                                p.HHId,
                                p.NameAndSurname,
                                p.Gender,
                                p.Age,
                                p.Ethnicity
                            FROM tb_Form_1A5a_Participant p
                            JOIN tb_Form_1A5a_Submission s ON p.SubmissionId = s.Id
                        ),

                        --  All SBCC-related events conducted (SubActivity not empty)
                        AllSBCCEvents AS (
                            SELECT DISTINCT 
                                --s.Province,
                                --s.District,
                                --s.Village,
                                s.SubActivity
                            FROM tb_Form_1A5a_Submission s
                            WHERE s.SubActivity IS NOT NULL AND TRIM(s.SubActivity) <> ''
                        )

                        SELECT
                            -- 1️ # of SBCC-related events conducted
                            (SELECT COUNT(*) FROM AllSBCCEvents) AS Num_SBCC_Events,

                            -- 2️ Total participants
                            (SELECT COUNT(*) FROM AllParticipants) AS Total_Participants,

                            -- 3️ # Women participants
                            (SELECT COUNT(*) FROM AllParticipants WHERE Gender = 'Female') AS Num_Women_Participants,

                            -- 4️ # Youth participants (Age between 15 and 35)
                            (SELECT COUNT(*) FROM AllParticipants WHERE Age BETWEEN 15 AND 35) AS Num_Youth_Participants,

                            -- 5️ # Ethnic minority participants
                            (SELECT COUNT(*) FROM AllParticipants 
                            WHERE Ethnicity NOT IN ('_e01','_e02','_e03','_e04','_e05','_e06','_e07','_e08')) AS Num_Ethnic_Participants;
                     
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

//Get Form 1A5b Statistics
function getForm1A5bStatics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                      WITH 
                        -- All unique schools implementing HGSF activities
                        AllHGSFSchools AS (
                            SELECT DISTINCT 
                                s.Province,
                                s.District,
                                s.Village,
                                s.SchoolName,
                                s.MaleStudent,
                                s.FemaleStudent
                            FROM tb_Form_1A5b_Submission s
                            WHERE s.SchoolName IS NOT NULL AND TRIM(s.SchoolName) <> ''
                        )

                        SELECT
                            -- 1️ # Primary schools implemented HGSF activity
                            (SELECT COUNT(*) FROM AllHGSFSchools) AS Num_Schools_HGSF,

                            -- 2️ Total Male students (summed across unique schools)
                            (SELECT SUM(MaleStudent) FROM AllHGSFSchools) AS Total_Male_Students,

                            -- 3️ Total Female students (summed across unique schools)
                            (SELECT SUM(FemaleStudent) FROM AllHGSFSchools) AS Total_Female_Students;
                     
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

//Get Form 1BAct6 Statistics
function getForm1BAct6Statics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                      WITH 
                        --  Unique farmers/participants
                        AllParticipants AS (
                            SELECT DISTINCT
                                s.Province,
                                s.District,
                                s.Village,
                                p.HHId,
                                p.NameAndSurname,
                                p.Gender,
                                p.Age,
                                p.Ethnicity,
                                p.Poverty_level,
                                p.MSME
                            FROM tb_Form_1BAct6_Participant p
                            JOIN tb_Form_1BAct6_Submission s ON p.SubmissionId = s.Id
                        ),

                        --  Unique APGs
                        AllAPGs AS (
                            SELECT DISTINCT
                                Province,
                                District,
                                Village,
                                CBOEstablish,
                                GrantReceived,
                                IFAD,
                                MAF,
                                WFP,
                                GoL,
                                Ben,
                                OtherFund
                            FROM tb_Form_1BAct6_Submission
                            WHERE CBOEstablish IS NOT NULL AND CBOEstablish IN (1,2)
                        )

                        SELECT
                            -- 1️ Number of APG formulated
                            (SELECT COUNT(*) FROM AllAPGs) AS Num_APG_Formulated,

                            -- 2️ Number of APG received funds
                            (SELECT COUNT(*) FROM AllAPGs
                            WHERE GrantReceived = 'grant_yes'
                                OR IFAD > 0
                                OR MAF > 0
                                OR WFP > 0
                                OR GoL > 0
                                OR Ben > 0
                                OR OtherFund > 0
                            ) AS Num_APG_Received_Funds,

                            -- 3️ Total farmers participants
                            (SELECT COUNT(*) FROM AllParticipants) AS Total_Farmers,

                            -- 4️ Women farmers participants
                            (SELECT COUNT(*) FROM AllParticipants WHERE Gender = 'Female') AS Women_Farmers,

                            -- 5️ Numbers of poor HHs
                            (SELECT COUNT(DISTINCT Province || '|' || District || '|' || Village || '|' || HHId) 
                            FROM AllParticipants WHERE Poverty_level = 'p') AS Num_Poor_HHs,

                            -- 6️ Youth farmers participants
                            (SELECT COUNT(*) FROM AllParticipants WHERE Age BETWEEN 15 AND 35) AS Youth_Farmers,

                            -- 7️ Ethnic farmer participants
                            (SELECT COUNT(*) FROM AllParticipants 
                                WHERE Ethnicity NOT IN ('_e01','_e02','_e03','_e04','_e05','_e06','_e07','_e08')) AS Ethnic_Farmers,

                            -- 8️ HHs engaged in contract with MSMEs
                            (SELECT COUNT(DISTINCT Province || '|' || District || '|' || Village || '|' || HHId)
                            FROM AllParticipants WHERE MSME = 'yes') AS HHs_Engaged_MSME;

                     
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

//Get Form 1BAct7 Statistics
function getForm1BAct7Statics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                      WITH AllServiceProviders AS (
                            SELECT DISTINCT
                                s.Province,
                                s.District,
                                s.Village,
                                p.HHId,
                                p.NameAndSurname,
                                p.Responsibility,
                                p.Gender,
                                p.Age,
                                p.Ethnicity
                            FROM tb_Form_1BAct7_Participant p
                            JOIN tb_Form_1BAct7_Submission s ON p.SubmissionId = s.Id
                            WHERE p.Responsibility IN ('lf', 'lf_l', 'vvw', 'vf')
                        )

                        SELECT
                            -- 1️ Number of service providers (LF-C, LF-L, VVW, VF)
                            (SELECT COUNT(*) FROM AllServiceProviders) AS Num_Service_Providers,

                            -- 2️ Women of service providers
                            (SELECT COUNT(*) FROM AllServiceProviders WHERE Gender = 'Female') AS Women_Service_Providers,

                            -- 3️ Youth of service providers (age between 15-35)
                            (SELECT COUNT(*) FROM AllServiceProviders WHERE Age BETWEEN 15 AND 35) AS Youth_Service_Providers,

                            -- 4️ Ethnic service providers (not in main ethnic groups)
                            (SELECT COUNT(*) FROM AllServiceProviders 
                                WHERE Ethnicity NOT IN ('_e01','_e02','_e03','_e04','_e05','_e06','_e07','_e08')) AS Ethnic_Service_Providers,

                            -- 5️ Lead Farmers (LF-C, LF-L)
                            (SELECT COUNT(*) FROM AllServiceProviders WHERE Responsibility IN ('lf', 'lf_l')) AS Lead_Farmers,

                            -- 6️ Village Veterinary Workers (VVW)
                            (SELECT COUNT(*) FROM AllServiceProviders WHERE Responsibility = 'vvw') AS Village_Veterinary_Workers,

                            -- 7️ Village Facilitators (VF)
                            (SELECT COUNT(*) FROM AllServiceProviders WHERE Responsibility = 'vf') AS Village_Facilitators;                    
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

//Get Form 1BAct8 Statistics
function getForm1BAct8Statics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                    WITH 
                        --  Unique submissions for MUS and Irrigation
                        AllSubmissions AS (
                            SELECT DISTINCT
                                Province,
                                District,
                                Village,
                                SubActivity,
                                Community_assigned,
                                OM_Fund_Collected
                            FROM tb_Form_1BAct8_Submission
                        ),

                        --  Unique participants for MUS and Irrigation
                        AllParticipants AS (
                            SELECT DISTINCT
                                s.Province,
                                s.District,
                                s.Village,
                                s.SubActivity,
                                p.HHId,
                                p.NameAndSurname,
                                p.Gender
                            FROM tb_Form_1BAct8_Participant p
                            JOIN tb_Form_1BAct8_Submission s ON p.SubmissionId = s.Id
                            WHERE s.SubActivity IN ('con_mus','recon_mus','con_irr','recon_irr')
                        )

                        SELECT
                            -- =======================
                            -- MULTI-USE SYSTEM (MUS)
                            -- =======================
                            -- 1️ Total MUS
                            (SELECT COUNT(*) FROM AllSubmissions 
                                WHERE SubActivity IN ('con_mus','recon_mus')) AS Total_MUS,

                            -- 2️ New MUS built
                            (SELECT COUNT(*) FROM AllSubmissions 
                                WHERE SubActivity = 'con_mus') AS New_MUS,

                            -- 3️ Renovated MUS
                            (SELECT COUNT(*) FROM AllSubmissions 
                                WHERE SubActivity = 'recon_mus') AS Renovated_MUS,

                            -- 4️ O&M Committee assigned (MUS)
                            (SELECT COUNT(*) FROM AllSubmissions 
                                WHERE SubActivity IN ('con_mus','recon_mus') 
                                AND Community_assigned = 'comm_yes') AS OM_Committee_Assigned_MUS,

                            -- 5️ O&M Fund collected (MUS)
                            (SELECT COUNT(*) FROM AllSubmissions 
                                WHERE SubActivity IN ('con_mus','recon_mus') 
                                AND OM_Fund_Collected = 'yes') AS OM_Fund_Collected_MUS,

                            -- 6️ Total participants (MUS)
                            (SELECT COUNT(*) FROM AllParticipants 
                                WHERE SubActivity IN ('con_mus','recon_mus')) AS Total_Participants_MUS,

                            -- 7️ Women participants (MUS)
                            (SELECT COUNT(*) FROM AllParticipants 
                                WHERE SubActivity IN ('con_mus','recon_mus') AND Gender = 'Female') AS Women_Participants_MUS,


                            -- =======================
                            -- IRRIGATION
                            -- =======================
                            -- 8️ Total Irrigation
                            (SELECT COUNT(*) FROM AllSubmissions 
                                WHERE SubActivity IN ('con_irr','recon_irr')) AS Total_Irrigation,

                            -- 9️ New Irrigation
                            (SELECT COUNT(*) FROM AllSubmissions 
                                WHERE SubActivity = 'con_irr') AS New_Irrigation,

                            -- 10 Renovated Irrigation
                            (SELECT COUNT(*) FROM AllSubmissions 
                                WHERE SubActivity = 'recon_irr') AS Renovated_Irrigation,

                            -- 11️ O&M Committee assigned (Irrigation)
                            (SELECT COUNT(*) FROM AllSubmissions 
                                WHERE SubActivity IN ('con_irr','recon_irr') 
                                AND Community_assigned = 'comm_yes') AS OM_Committee_Assigned_Irrigation,

                            -- 12️ O&M Fund collected (Irrigation)
                            (SELECT COUNT(*) FROM AllSubmissions 
                                WHERE SubActivity IN ('con_irr','recon_irr') 
                                AND OM_Fund_Collected = 'yes') AS OM_Fund_Collected_Irrigation,

                            -- 13️ Total participants (Irrigation)
                            (SELECT COUNT(*) FROM AllParticipants 
                                WHERE SubActivity IN ('con_irr','recon_irr')) AS Total_Participants_Irrigation,

                            -- 14️ Women participants (Irrigation)
                            (SELECT COUNT(*) FROM AllParticipants 
                                WHERE SubActivity IN ('con_irr','recon_irr') AND Gender = 'Female') AS Women_Participants_Irrigation;                   
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

//Get Form 2Act1 Statistics
function getForm2Act1Statics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                    WITH 
                        -- Unique MSME records
                        AllMSMEs AS (
                            SELECT DISTINCT
                                p.EstablishmentDate,
                                p.NameOfMSME_Owner,
                                p.Gender,
                                p.Existing,
                                p.SUN_Member,
                                p.ContactWithOther,
                                p.AmountMSME_APGmembers
                            FROM tb_Form_2Act1_Participant p
                            JOIN tb_Form_2Act1_Submission s ON p.SubmissionId = s.Id
                            WHERE p.NameOfMSME_Owner IS NOT NULL AND TRIM(p.NameOfMSME_Owner) <> ''
                        )

                        SELECT
                            -- 1️ Number of MSMEs participated
                            (SELECT COUNT(*) FROM AllMSMEs) AS Num_MSME_Participated,

                            -- 2️ Existing MSMEs supported
                            (SELECT COUNT(*) FROM AllMSMEs WHERE Existing = 'e') AS Existing_MSME_Supported,

                            -- 3️ Newly created MSMEs (AFNII Supported)
                            (SELECT COUNT(*) FROM AllMSMEs WHERE Existing = 'n') AS Newly_Created_MSME,

                            -- 4️ MSMEs with SUN BN Membership
                            (SELECT COUNT(*) FROM AllMSMEs WHERE SUN_Member = 'sun_yes') AS MSME_SUN_Member,

                            -- 5️ New partnership businesses (proposal for matching grants)
                            (SELECT COUNT(*) FROM AllMSMEs WHERE ContactWithOther = 'con_yes') AS New_Partnership_Businesses,

                            -- 6️ APG members engaged in partnership contracts
                            (SELECT SUM(AmountMSME_APGmembers) FROM AllMSMEs) AS Num_APG_Members_Engaged;                
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

//Get Form 2Act2 Statistics
//** To be contineu when activity data is available**/

//Get Form 2Act3 Statistics
//** To be contineu when activity data is available**/

//Get Form 3Act1a Statistics
function getForm3Act1aStatics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                    WITH 
                        -- Unique meetings conducted
                        AllMeetings AS (
                            SELECT DISTINCT
                                Province,
                                District,
                                Village,
                                Conduct_Start,
                                MeetingNo,
                                VDPApproval
                            FROM tb_Form_3Act1a_Submission
                            WHERE MeetingNo IS NOT NULL AND TRIM(MeetingNo) <> ''
                        ),

                        -- Unique participants across meetings
                        AllParticipants AS (
                            SELECT DISTINCT
                                s.Province,
                                s.District,
                                s.Village,
                                p.HHId,
                                p.NameAndSurname,
                                p.Age,
                                p.Gender,
                                p.Ethnicity
                            FROM tb_Form_3Act1a_Participant p
                            JOIN tb_Form_3Act1a_Submission s ON p.SubmissionId = s.Id
                        )

                        SELECT
                            -- 1️ Number of Meetings conducted
                            (SELECT COUNT(*) FROM AllMeetings) AS Num_Meetings_Conducted,

                            -- 2️ Total participants
                            (SELECT COUNT(*) FROM AllParticipants) AS Total_Participants,

                            -- 3️ Female participants
                            (SELECT COUNT(*) FROM AllParticipants WHERE Gender = 'Female') AS Female_Participants,

                            -- 4️ Youth participants (age between 15-35)
                            (SELECT COUNT(*) FROM AllParticipants WHERE Age BETWEEN 15 AND 35) AS Youth_Participants,

                            -- 5️ Ethnic minority participants
                            (SELECT COUNT(*) FROM AllParticipants 
                                WHERE Ethnicity NOT IN ('_e01','_e02','_e03','_e04','_e05','_e06','_e07','_e08')) AS Ethnic_Participants,

                            -- 6️ VDP approved/endorsed
                            (SELECT COUNT(*) FROM AllMeetings WHERE VDPApproval = 'yes') AS VDP_Approved_Endorsed;
                 
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

//Get Form 3Act1b Statistics
function getForm3Act1bStatics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                    WITH 
                        --  Unique meetings conducted
                        AllMeetings AS (
                            SELECT DISTINCT
                                Province,
                                District,
                                Conduct_date_1,
                                MeetingNo
                            FROM tb_Form_3Act1b_Submission
                            WHERE MeetingNo IS NOT NULL AND TRIM(MeetingNo) <> ''
                        ),

                        --  Unique participants
                        AllParticipants AS (
                            SELECT DISTINCT
                                p.Full_name,
                                p.Office,
                                p.Gender
                            FROM tb_Form_3Act1b_Participant p
                            JOIN tb_Form_3Act1b_Submission s ON p.Submission_id = s.Id
                        )

                        SELECT
                            -- 1️ Number of meetings conducted
                            (SELECT COUNT(*) FROM AllMeetings) AS Num_Meetings_Conducted,

                            -- 2️ Total number of participants
                            (SELECT COUNT(*) FROM AllParticipants) AS Total_Participants,

                            -- 3️ Female participants
                            (SELECT COUNT(*) FROM AllParticipants WHERE Gender = 'Female') AS Female_Participants;
                 
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
//Get Form 3Act2 Statistics
function getForm3Act2Statics() {
    return new Promise((resolve, reject) => {
        const db = getDBConnection(); // Get the database connection
        const query = `
                    WITH 
                        -- 1️ Unique CSOs approved
                        UniqueCSOApproved AS (
                            SELECT DISTINCT
                                Province,
                                District,
                                CSO_Head_Name,
                                CSO_approved_date
                            FROM tb_Form_3Act2_Submission
                            WHERE CSO_Head_Name IS NOT NULL
                                AND TRIM(CSO_Head_Name) <> ''
                                AND CSO_approved_date IS NOT NULL
                                AND TRIM(CSO_approved_date) <> ''
                        ),

                        -- 2️ Unique Challenge Events / Sub-Activities Conducted
                        UniqueSubActivities AS (
                            SELECT DISTINCT
                                Province,
                                District,
                                SubActivity,
                                CSO_Head_Name,
                                CSO_approved_date
                            FROM tb_Form_3Act2_Submission
                            WHERE SubActivity IS NOT NULL
                                AND TRIM(SubActivity) <> ''
                        ),

                        -- 3️ Unique Fund Grants (for sum)
                        UniqueFunds AS (
                            SELECT DISTINCT
                                Province,
                                District,
                                CSO_Head_Name,
                                CSO_approved_date,
                                COALESCE(MAF, 0) AS MAF,
                                COALESCE(CSO_contribution, 0) AS CSO_contribution,
                                COALESCE(CSO_cash, 0) AS CSO_cash,
                                COALESCE(OtherFund, 0) AS OtherFund
                            FROM tb_Form_3Act2_Submission
                            WHERE CSO_Head_Name IS NOT NULL
                                AND TRIM(CSO_Head_Name) <> ''
                        ),

                        -- 4️ Villagers supported by CSO (join participants)
                        VillagersSupported AS (
                            SELECT DISTINCT
                                s.Province,
                                s.District,
                                s.Village,
                                p.HHId,
                                p.NameOfAPG AS NameAndSurname
                            FROM tb_Form_3Act2_Participant p
                            JOIN tb_Form_3Act2_Submission s ON p.Submission_id = s.Id
                            WHERE p.HHId IS NOT NULL
                                AND TRIM(p.HHId) <> ''
                        ),

                        -- 5️ Unique APGs supported
                        UniqueAPGsSupported AS (
                            SELECT DISTINCT
                                APGs_Received_Support_From_CSO
                            FROM tb_Form_3Act2_Submission
                            WHERE APGs_Received_Support_From_CSO IS NOT NULL
                                AND TRIM(APGs_Received_Support_From_CSO) <> ''
                        )

                    SELECT
                        -- 1️ Total number of CSOs approved
                        (SELECT COUNT(*) FROM UniqueCSOApproved) AS Total_CSOs_Approved,

                        -- 2️ Total challenge events / sub-activities conducted
                        (SELECT COUNT(*) FROM UniqueSubActivities) AS Total_SubActivities_Conducted,

                        -- 3️ Total amount of challenge funds granted
                        (SELECT SUM(MAF + CSO_contribution + CSO_cash + OtherFund) FROM UniqueFunds) AS Total_Challenge_Funds_Granted,

                        -- 4️ Total villagers supported by CSO
                        (SELECT COUNT(*) FROM VillagersSupported) AS Total_Villagers_Supported,

                        -- 5️ Total number of POs/APGs supported by CSO
                        (SELECT COUNT(*) FROM UniqueAPGsSupported) AS Total_APGs_Supported;
                 
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

export {
    getCBForStaffStatics,
    getCBForVillagersStatics,
    getForm1A1Statics,
    getForm1A2Statics,
    getForm1A3aStatics,
    getForm1A3bStatics,
    getForm1A4Statics,
    getForm1A5aStatics,
    getForm1A5bStatics,
    getForm1BAct6Statics,
    getForm1BAct7Statics,
    getForm1BAct8Statics,
    getForm2Act1Statics,

    getForm3Act1aStatics,
    getForm3Act1bStatics,
    getForm3Act2Statics
};