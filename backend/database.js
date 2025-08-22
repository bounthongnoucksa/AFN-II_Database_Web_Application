import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('ME_Database.db');

db.serialize(() => {
    db.run(`
        -- CB for staff
        CREATE TABLE IF NOT EXISTS tb_CB_Staff_Submission (
            Id INTEGER PRIMARY KEY,
            Uuid TEXT, Start TEXT, End TEXT,
            ReportingPeriodDate TEXT, ActivityStartDate TEXT, ActivityEndDate TEXT,
            Category TEXT, Topic TEXT,ActivityLocation TEXT,
            IFAD INTEGER, MAF INTEGER, WFP INTEGER, GoL INTEGER, Ben INTEGER,
            Version TEXT, SubmissionTime TEXT
        );
  `);

    db.run(`
            CREATE TABLE IF NOT EXISTS tb_CB_Staff_Participant (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            SubmissionId INTEGER,
            Name TEXT, Responsibility TEXT,
            Office TEXT, StaffType TEXT, Gender TEXT,
            FOREIGN KEY (SubmissionId) REFERENCES tb_CB_Staff_Submission(Id)
        ); 
    
    `);

    //Translation data table
    db.run(`CREATE TABLE IF NOT EXISTS Translation_EN_LA (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            "FormName"	TEXT,
            "ItemGroup"	TEXT,
            "ItemCode"	TEXT,
            "Label_Lao"	TEXT,
            "Label_English"	TEXT,
            "Choice_Filter"	TEXT,
            "Choice_group"	TEXT
        );
        `);

    // CB for Villagers Submissions table
    db.run(`
            CREATE TABLE IF NOT EXISTS tb_CB_for_Villagers_Submission (
            Id INTEGER PRIMARY KEY,           -- from Kobo "_id"
            Uuid TEXT, -- from "_uuid"
            Start TEXT,
            End TEXT,
            ReportingPeriod TEXT,
            Province TEXT,
            District TEXT,
            Village TEXT,
            ActivityType TEXT,
            SpecializedTopic TEXT,
            ConductDateStart TEXT,
            ConductDateEnd TEXT,
            OtherLocation TEXT,
            ConductedBy TEXT,
            ActivityCode TEXT,
            IFAD INTEGER,
            MAF INTEGER,
            WFP INTEGER,
            GoL INTEGER,
            Version TEXT,
            SubmissionTime TEXT
            );
  `);

    // CB for Villagers Participants table
    db.run(`
            CREATE TABLE IF NOT EXISTS tb_CB_for_Villagers_Participant (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            SubmissionId INTEGER, -- foreign key to tb_CB_for_Villagers_Submission.Id
            HaveHHId TEXT,
            HHId TEXT,
            NameAndSurname TEXT,
            Age INTEGER,
            Gender TEXT,
            Responsibility TEXT,
            FromWhichLevel TEXT,
            Ethnicity TEXT,
            PovertyLevel TEXT,
            PWD TEXT,
            APGMember TEXT,
            FOREIGN KEY (SubmissionId) REFERENCES tb_CB_for_Villagers_Submission(Id)
            );
  `);

    //Form 1A1 submission table
    db.run(`
            CREATE TABLE IF NOT EXISTS tb_Form_1A1_Submission (
                Id                INTEGER PRIMARY KEY, -- _id
                Uuid              TEXT,           -- _uuid
                Start             TEXT,
                End               TEXT,
                ReportingPeriod   TEXT,
                Province          TEXT,
                District          TEXT,
                Village           TEXT,
                ActivityType      TEXT,
                SubActivity      TEXT,
                ConductDateStart  TEXT,
                ConductDateEnd    TEXT,
                ConductedBy       TEXT,
                VNCAvailable      TEXT,                --_0_Not_1_New_2_Renovated
                IFAD              INTEGER,
                MAF               INTEGER,
                WFP               INTEGER,
                GoL               INTEGER,
                Ben               INTEGER,
                OtherFund         INTEGER,
                Version           TEXT,
                SubmissionTime    TEXT
            );
        `);

    //Form 1A1 particiapnt table
    db.run(`
        CREATE TABLE IF NOT EXISTS tb_Form_1A1_Participant (
            Id                INTEGER PRIMARY KEY AUTOINCREMENT,
            SubmissionId      INTEGER,       -- FK to tb_Form_1A1_Submission.Id
            HaveHHId          TEXT,
            HHId              TEXT,
            NameAndSurname    TEXT,
            Age               INTEGER,
            Gender            TEXT,
            WomanHead         TEXT, --_Yes_No_
            PWBWStatus        TEXT, --_PW_BW_PW_BW_
            Responsibility    TEXT,
            Ethnicity         TEXT,
            PovertyLevel      TEXT,
            PWD               TEXT,
            APGMember         TEXT,
            FOREIGN KEY (SubmissionId) REFERENCES tb_Form_1A1_Submission(Id)
        );
        `);

});

export default db;