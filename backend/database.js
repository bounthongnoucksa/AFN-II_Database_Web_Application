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

    //Form 1A5a submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS "tb_Form_1A5a_Submission" (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Uuid TEXT,
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    SubActivity TEXT,
                    Conduct_date1 TEXT,
                    Conduct_date2 TEXT,
                    Approach TEXT,
                    Conducted_by TEXT,
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

    //Form 1A5a particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS "tb_Form_1A5a_Participant" (
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
                    FOREIGN KEY(SubmissionId) REFERENCES tb_Form_1A5a_Submission(Id)
                );
            `);

    //Form 1A5b submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS "tb_Form_1A5b_Submission" (
                    Id INTEGER PRIMARY KEY,
                    Uuid TEXT,
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    SubActivity TEXT,
                    Conduct_date1 TEXT,
                    Conduct_date2 TEXT,
                    SchoolName TEXT,
                    Conducted_by TEXT,
                    MaleStudent INTEGER,
                    FemaleStudent INTEGER,
                    CropType TEXT,
                    CropQuantity INTEGER,
                    LivestockType TEXT,
                    LivestockQuantity INTEGER,
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

    //Form 1A5a particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS "tb_Form_1A5b_Participant" (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SubmissionId INTEGER,
                    NameAndSurname TEXT,
                    FOREIGN KEY(SubmissionId) REFERENCES tb_Form_1A5b_Submission(Id)
                );
            `);

    //Form 1BAct6 submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_1BAct6_Submission (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Uuid TEXT,
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    SubActivity TEXT,
                    Conduct_Start TEXT,
                    Conduct_End TEXT,
                    CBOEstablish TEXT,
                    Conducted_by TEXT,
                    CropType TEXT,
                    CropQuantity INTEGER,
                    LivestockType TEXT,
                    LivestockQuantity INTEGER,
                    ForageQuantity INTEGER,
                    ACRegistered TEXT,
                    GrantReceived TEXT,
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

    //Form 1BAct6 particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_1BAct6_Participant (
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
                    PositionInGroup TEXT,
                    MSME TEXT,
                    FOREIGN KEY (SubmissionId) REFERENCES tb_Form_1BAct6_Submission(Id)
                );

            `);

    //Form 1BAct7 submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_1BAct7_Submission (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Uuid TEXT,
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    SubActivity TEXT,
                    Conduct_Start TEXT,
                    Conduct_End TEXT,
                    Equipment_received TEXT,
                    Certified TEXT,
                    Engaged TEXT,
                    IFAD INTEGER,
                    MAF INTEGER,
                    WFP INTEGER,
                    GoL INTEGER,
                    Ben INTEGER,
                    Version TEXT,
                    Submission_time TEXT
                );
            `);

    //Form 1BAct7 particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_1BAct7_Participant (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SubmissionId INTEGER,
                    HaveHH_id TEXT,
                    HHId TEXT,
                    NameAndSurname TEXT,
                    Responsibility TEXT,
                    Age INTEGER,
                    Gender TEXT,
                    Ethnicity TEXT,
                    Poverty_level TEXT,
                    PWD_status TEXT,
                    FOREIGN KEY (SubmissionId) REFERENCES tb_Form_1BAct7_Submission(Id)
                );
            `);


    //Form 1BAct8 submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_1BAct8_Submission (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Uuid TEXT,
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    SubActivity TEXT,
                    Conduct_Start TEXT,
                    Conduct_End TEXT,
                    MUS_built TEXT,         -- _0_1_2_
                    Community_assigned TEXT,      -- _0_1_cominty
                    OM_Fund_Collected TEXT,            -- _No_Yes_
                    OM_Fund_Total_amount INTEGER,           -- _amount
                    Annual_cost INTEGER,            -- _annualcost
                    IFAD INTEGER,
                    MAF INTEGER,
                    WFP INTEGER,
                    GoL INTEGER,
                    Ben INTEGER,
                    OtherFund INTEGER,              -- integer_oz4sh88
                    Version TEXT,
                    Submission_time TEXT
                );
            `);

    //Form 1BAct8 particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_1BAct8_Participant (
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
                    AreaAmount REAL,     -- _amountofarea
                    FOREIGN KEY (SubmissionId) REFERENCES tb_Form_1BAct8_Submission(Id)
                );
            `);

    //Form 2Act1 submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_2Act1_Submission (
                    Id INTEGER PRIMARY KEY,
                    Uuid TEXT,
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    SubActivity TEXT,
                    Conduct_Start TEXT,
                    Conduct_End TEXT,
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

    //Form 2Act1 particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_2Act1_Participant (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SubmissionId INTEGER,
                    EstablishmentDate TEXT,
                    NameOfMSME_Owner TEXT,
                    Age INTEGER,
                    Gender TEXT,
                    Ethnicity TEXT,
                    PWD_status TEXT,
                    BusinessType TEXT,
                    Existing TEXT,
                    SUN_Member TEXT,
                    ContactWithOther TEXT,
                    DMY_Signed TEXT,
                    NameExistingMSME TEXT,
                    NameOfNewPartnershipBusiness TEXT,
                    AmountMSME_APGmembers INTEGER,
                    AccessFin TEXT,
                    AccessFinUnit TEXT,
                    AccessFinAmount INTEGER,
                    FOREIGN KEY (SubmissionId) REFERENCES tb_Form_2Act1_Submission(Id)
                );
            `);

    //Form 2Act2 submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_2Act2_Submission (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT, -- _id from API
                    Uuid TEXT,							-- _uuid
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    SubActivity TEXT,
                    Conduct_Start TEXT,
                    Conduct_End TEXT,
                    MSME_Invited INTEGER,
                    MSME_Selected INTEGER,
                    TypeOfContracted TEXT,		--Types of enteprises
                    DateApproved TEXT, 			--DMY of partnership
                    NumberOfMSME INTEGER, 		--MSME Number of APG engaged in the contract
                    TotalInvestment INTEGER,
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

    //Form 2Act2 particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_2Act2_Participant (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SubmissionId INTEGER,
                    HHId TEXT,
                    NameAndSurname TEXT,
                    TypeOfOrg TEXT,
                    Age INTEGER,
                    Gender TEXT,
                    Ethnicity TEXT,
                    WhatOrgDo TEXT, 			--Types of Enterprise sector direction
                    MSP TEXT,
                    BusinessPlan TEXT,
                    SUN_Member TEXT,
                    ContractedWithOther TEXT, 	--Currently Contracted with others
                    TypeOfPartner TEXT,
                    DMYPartnership TEXT,
                    FOREIGN KEY (SubmissionId) REFERENCES tb_Form_2Act2_Submission(Id)
                );
            `);


    //Form 2Act3 submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_2Act3_Submission (
                    Id INTEGER PRIMARY KEY,              -- _id from API
                    Uuid TEXT,                           -- _uuid
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    SubActivity TEXT,
                    Conduct_Start TEXT,
                    Conduct_End TEXT,
                    ConstructionStatus TEXT,
                    RoadLengthKM INTEGER,
                    PostHarvest INTEGER,
                    HaveOMCommity TEXT,
                    HaveOMFund TEXT,
                    TotalCost INTEGER,
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

    //Form 2Act3 particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_2Act3_Participant (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SubmissionId INTEGER,               -- Foreign key to the submission
                    HHId TEXT,
                    NameAndSurname TEXT,
                    Age INTEGER,
                    Gender TEXT,
                    Ethnicity TEXT,
                    PovertyLevel TEXT,
                    PWD TEXT,
                    FOREIGN KEY (SubmissionId) REFERENCES tb_Form_2Act3_Submission(Id)
                );
            `);

    //Form 3Act1a submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_3Act1a_Submission (
                    Id INTEGER PRIMARY KEY,
                    Uuid TEXT,
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    SubActivity TEXT,
                    Conduct_Start TEXT,
                    Conduct_End TEXT,
                    MeetingNo TEXT,
                    VDPApproval TEXT,
                    InvestmentItems TEXT, 			-- _actlist
                    OtherInfo,                      --_othersinfo
                    IFAD INTEGER DEFAULT 0,
                    MAF INTEGER DEFAULT 0,
                    WFP INTEGER DEFAULT 0,
                    GoL INTEGER DEFAULT 0,
                    Ben INTEGER DEFAULT 0,
                    OtherFund INTEGER DEFAULT 0,
                    Version TEXT,
                    Submission_time TEXT
                );
            `);

    //Form 3Act1a particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_3Act1a_Participant (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SubmissionId INTEGER,
                    HHId TEXT,
                    NameAndSurname TEXT,
                    Age INTEGER,
                    Gender TEXT,
                    Ethnicity TEXT,
                    PovertyLevel TEXT,
                    PWD TEXT,
                    FOREIGN KEY (SubmissionId) REFERENCES tb_Form_3Act1a_Submission(Id)
                );
            `);

    //Form 3Act1b submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_3Act1b_Submission (
                    Id INTEGER PRIMARY KEY,
                    Uuid TEXT,
                    start TEXT,
                    end TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Activity TEXT,
                    Conduct_date_1 TEXT,
                    Conduct_date_2 TEXT,
                    MeetingNo TEXT,
                    VDPApprovalNumber TEXT,
                    DNCPApproval TEXT,
                    DNCP_Item TEXT,						--_DNCP_item
                    EquiptSupported TEXT,
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

    //Form 3Act1b particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_3Act1b_Participant (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Submission_id INTEGER,
                    Full_name TEXT,
                    Office TEXT,
                    Age INTEGER,
                    Gender TEXT,
                    FOREIGN KEY(Submission_id) REFERENCES tb_Form_3Act1b_Submission(Id)
                );
            `);

    //Form 3Act2 submission table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_3Act2_Submission (
                    Id INTEGER PRIMARY KEY,
                    Uuid TEXT,
                    Start TEXT,
                    End TEXT,
                    Reporting_period TEXT,
                    Province TEXT,
                    District TEXT,
                    Village TEXT,
                    SubActivity TEXT,
                    Conduct_Start TEXT,
                    Conduct_End TEXT,
                    CSO_Est_Date TEXT,
                    CSO_Head_Name TEXT,
                    CSO_Head_Age INTEGER,
                    CSO_Head_Gender TEXT,
                    CSO_Head_Ethnicity TEXT,
                    CSO_Commitment TEXT,
                    BNetwork_Member TEXT,
                    BNContractWithOther TEXT,
                    CSO_approved_date TEXT,
                    APGs_Received_Support_From_CSO TEXT,
                    MAF INTEGER,
                    CSO_contribution INTEGER,
                    CSO_cash INTEGER,
                    OtherFund INTEGER,
                    Version TEXT,
                    Submission_time TEXT
                );
            `);

    //Form 3Act2 particiapnt table
    db.run(`
                CREATE TABLE IF NOT EXISTS tb_Form_3Act2_Participant (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Submission_id INTEGER,
                    HHId TEXT,
                    NameOfAPG TEXT,
                    Age INTEGER,
                    Gender TEXT,
                    Ethnicity TEXT,
                    FOREIGN KEY(Submission_id) REFERENCES tb_Form_3Act2_Submission(Id)
                );
            `);

});

export default db;