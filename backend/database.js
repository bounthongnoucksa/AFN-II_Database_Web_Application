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



    //Form 1A2 submission table
    db.run(`
        CREATE TABLE IF NOT EXISTS tb_Form_1A2_Submission (
            Id INTEGER PRIMARY KEY, --_Id
            Uuid TEXT, --_uuid
            Start TEXT,
            End TEXT,
            Reporting_period TEXT,
            Province TEXT,
            District TEXT,
            Village TEXT,
            Subactivity TEXT,
            Act_conduct_date1 TEXT,
            Act_conduct_date2 TEXT,
            Conducted_by TEXT,
            Version TEXT, 
            Submission_time TEXT
        );
        `);

    //Form 1A2 particiapnt table
    db.run(`
        CREATE TABLE IF NOT EXISTS tb_Form_1A2_Participant (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            SubmissionId INTEGER,
            HaveHH_id TEXT,
            HHId TEXT, 				--mainhhid
            NameAndSurname TEXT,	--select_one_mainNameAndSurname
            Age INTEGER,
            Gender TEXT,
            PWBWStatus TEXT,
            Ethnicity TEXT,
            Poverty_level TEXT,
            Pwd_status TEXT,
            Module_1 TEXT,
            Module_2 TEXT,
            Module_3 TEXT,
            Module_4 TEXT,
            Receive_Grant TEXT,  	--g_receive_Yes_No
            GrantUseFor TEXT,		--select_one_qg7ja17
            IFAD INTEGER,
            MAF INTEGER,
            WFP INTEGER,
            GoL INTEGER,
            Ben INTEGER,
            OtherFund INTEGER,		--integer_oz4sh88
            FOREIGN KEY (SubmissionId) REFERENCES tb_Form_1A2_Submission(Id)
        );
        `);

    //Form 1A3a submission table
    db.run(`
        CREATE TABLE IF NOT EXISTS tb_Form_1A3a_Submission (
            Id INTEGER PRIMARY KEY, -- _id from API
            Uuid TEXT,              -- _uuid
            Start TEXT,
            End TEXT,
            Reporting_period TEXT,  -- _reportingperiod
            Province TEXT,          -- select_one_province
            District TEXT,          -- select_one_district
            Village TEXT,           -- select_one_district_village
            Subactivity TEXT,       -- _subactivity
            Act_conduct_date1 TEXT, -- group_actconductdate_sa1oe86/date_ha2jz81
            Act_conduct_date2 TEXT, -- group_actconductdate_sa1oe86/date_up9xu24
            Equipment_received TEXT, -- equipment_received
            Conducted_by TEXT,      -- _select_one_conductedby_01
            IFAD INTEGER,           -- group_wz1ah68/_IFAD_
            MAF INTEGER,            -- group_wz1ah68/_MAF_
            WFP INTEGER,            -- group_wz1ah68/_WFP_
            GoL INTEGER,            -- group_wz1ah68/_GoL_
            Ben INTEGER,            -- group_wz1ah68/_Ben_
            OtherFund INTEGER,      -- group_wz1ah68/integer_oz4sh88
            Version TEXT,           -- __version__
            Submission_time TEXT    -- _submission_time
        );

        `);


    //Form 1A3a particiapnt table
    db.run(`
        CREATE TABLE IF NOT EXISTS tb_Form_1A3a_Participant (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            SubmissionId INTEGER, -- foreign key to tb_Form_1A3a_Submission(Id)
            HaveHH_id TEXT,       -- group_participantdetail_hp48r4/doyouhavehh_id
            HHId TEXT,            -- group_participantdetail_hp48r4/mainhhid
            NameAndSurname TEXT,  -- group_participantdetail_hp48r4/select_one_mainNameAndSurname or text_hx6fh11
            Age INTEGER,          -- group_participantdetail_hp48r4/_mainAge
            Gender TEXT,          -- group_participantdetail_hp48r4/_mainGender
            Ethnicity TEXT,       -- group_participantdetail_hp48r4/_mainEthnicity
            Poverty_level TEXT,   -- group_participantdetail_hp48r4/_mainPovertyLevel
            Pwd_status TEXT,      -- group_participantdetail_hp48r4/_mainPWD
            FOREIGN KEY (SubmissionId) REFERENCES tb_Form_1A3a_Submission(Id)
        );

        `);

//Form 1A3b submission table
        db.run(`
            CREATE TABLE IF NOT EXISTS tb_Form_1A3b_Submission (
                Id INTEGER PRIMARY KEY,
                Uuid TEXT,
                Start TEXT,
                End TEXT,
                Reporting_period TEXT,
                Province TEXT,
                District TEXT,
                Village TEXT,
                Storage_built TEXT,
                Conduct_date1 TEXT,
                Conduct_date2 TEXT,
                Conducted_by TEXT,
                CommityExist TEXT,
                InitialRice INTEGER,
                RiceBorrowed INTEGER,
                RiceLeftInStock INTEGER,
                IFAD INTEGER,
                MAF INTEGER,
                WFP INTEGER,
                GoL INTEGER,
                Ben INTEGER,
                OtherFund INTEGER,
                Version TEXT,
                Submission_time TEXT
            );
            `);

            //Form 1A3b particiapnt table
        db.run(`
            CREATE TABLE IF NOT EXISTS tb_Form_1A3b_Participant (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                SubmissionId INTEGER,
                HaveHH_id TEXT,
                HHId TEXT,
                NameAndSurname TEXT,
                Age INTEGER,
                Gender TEXT,
                ParticipantRole TEXT,
                Ethnicity TEXT,
                Poverty_level TEXT,
                PWD_status TEXT,
                FOREIGN KEY (SubmissionId) REFERENCES tb_Form_1A3b_Submission(Id)
            );
            `);

            
            //Form 1A4 submission table
        db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_1A4_Submission (
                    Id INTEGER PRIMARY KEY,
                    Uuid TEXT,
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    DevPlan TEXT,
                    SubActivity TEXT,
                    Conduct_date1 TEXT,
                    Conduct_date2 TEXT,
                    Cons_identified INTEGER,
                    Cons_area INTEGER,
                    Conducted_by TEXT,
                    KeySpeciesConserved TEXT,
                    IFAD INTEGER,
                    MAF INTEGER,
                    WFP INTEGER,
                    GoL INTEGER,
                    Ben INTEGER,
                    OtherFund INTEGER,
                    Version TEXT,
                    Submission_time TEXT
                );
            `);

            //Form 1A4 particiapnt table
        db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_1A4_Participant (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SubmissionId INTEGER,
                    HaveHH_id TEXT,
                    HHId TEXT,
                    NameAndSurname TEXT,
                    Age INTEGER,
                    Gender TEXT,
                    Ethnicity TEXT,
                    Poverty_level TEXT,
                    PWD_status TEXT,
                    APGMember TEXT,
                    FOREIGN KEY (SubmissionId) REFERENCES tb_Form_1A4_Submission(Id)
                );
            `);

});

export default db;