// logframeQueries.js

export const indicatorQueryMap = {
    "1A1_Males": {
        query: `
      SELECT sum(count) AS count FROM (
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

    `,
        //getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],
        getParams: ({ gender, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 8; i++) {
                params.push(gender, startDate, endDate);
            }
            return params;
        }
    },

    "1A1_Females": {
        query: `
      SELECT sum(count) AS count FROM (
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

    `,
        //getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],
        getParams: ({ gender, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 8; i++) {
                params.push(gender, startDate, endDate);
            }
            return params;
        }
    },

    "1A1_Young_people": {
        query: `
      SELECT sum(count) AS count FROM (
            --1A1
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Age BETWEEN ? AND ? AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                    
            UNION ALL
            --1A4
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A4_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1A4_Unique_HH_ID
            FROM tb_Form_1A4_Participant P
            JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
            WHERE P.Age BETWEEN ? AND ? AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL

            --1BAct6
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct6_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct6_Unique_HH_ID
            FROM tb_Form_1BAct6_Participant P
            JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
            WHERE P.Age BETWEEN ? AND ? AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL
            --1BAct8
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct8_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct8_Unique_HH_ID
            FROM tb_Form_1BAct8_Participant P
            JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('con_irr', 'recon_irr')
            AND P.Age BETWEEN ? AND ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act1
            SELECT 
            COUNT(DISTINCT P.NameOfMSME_Owner) AS Count_2Act1_Unique_MSME_Owner
            FROM tb_Form_2Act1_Participant P
            JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Age BETWEEN ? AND ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act2
            SELECT 
            COUNT(DISTINCT P.NameAndSurname) AS Count_2Act2_Unique_MSME_Owner
            FROM tb_Form_2Act2_Participant P
            JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
            WHERE P.Age BETWEEN ? AND ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                
            UNION ALL
                
            --2Act3
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_2Act3_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_2Act3_Unique_HH_ID
            FROM tb_Form_2Act3_Participant P
            JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('accesstracks') AND P.Age BETWEEN ? AND ?
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                    
            UNION ALL	
            --3Act2
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameOfAPG) AS Count_3Act2_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_3Act2_Unique_HH_ID
            FROM tb_Form_3Act2_Participant P
            JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
            WHERE P.Age BETWEEN ? AND ? AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
            ) AS Combined_Counts;
    `,
        //getParams: ({ minAge, maxAge, startDate, endDate }) => [minAge, maxAge, startDate, endDate],
        getParams: ({ minAge, maxAge, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 8; i++) {
                params.push(minAge, maxAge, startDate, endDate);
            }
            return params;
        }
    },

    "1A1_Indigenous_people": {
        query: `
      SELECT sum(count) AS count FROM (
            --1A1
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Ethnicity NOT IN (${'??'}) AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                    
            UNION ALL
            --1A4
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A4_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1A4_Unique_HH_ID
            FROM tb_Form_1A4_Participant P
            JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
            WHERE P.Ethnicity NOT IN (${'??'}) AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL

            --1BAct6
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct6_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct6_Unique_HH_ID
            FROM tb_Form_1BAct6_Participant P
            JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
            WHERE P.Ethnicity NOT IN (${'??'}) AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL
            --1BAct8
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct8_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct8_Unique_HH_ID
            FROM tb_Form_1BAct8_Participant P
            JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('con_irr', 'recon_irr')
            AND P.Ethnicity NOT IN (${'??'}) AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act1
            SELECT 
            COUNT(DISTINCT P.NameOfMSME_Owner) AS Count_2Act1_Unique_MSME_Owner
            FROM tb_Form_2Act1_Participant P
            JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Ethnicity NOT IN (${'??'}) AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act2
            SELECT 
            COUNT(DISTINCT P.NameAndSurname) AS Count_2Act2_Unique_MSME_Owner
            FROM tb_Form_2Act2_Participant P
            JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
            WHERE P.Ethnicity NOT IN (${'??'}) AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                
            UNION ALL
                
            --2Act3
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_2Act3_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_2Act3_Unique_HH_ID
            FROM tb_Form_2Act3_Participant P
            JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('accesstracks') AND P.Ethnicity NOT IN (${'??'})
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                    
            UNION ALL	
            --3Act2
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameOfAPG) AS Count_3Act2_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_3Act2_Unique_HH_ID
            FROM tb_Form_3Act2_Participant P
            JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
            WHERE P.Ethnicity NOT IN (${'??'}) AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
            ) AS Combined_Counts;
    `,
        //getParams: ({ ethnicCodes, startDate, endDate }) => [startDate, endDate], // Will use direct injection for codes
        getParams: ({ ethnic, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 8; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },
    "1A1_persons_received_services": {
        query: `
      SELECT sum(count) AS count FROM (
            --1A1
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                    
            UNION ALL
            --1A4
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A4_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1A4_Unique_HH_ID
            FROM tb_Form_1A4_Participant P
            JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL

            --1BAct6
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct6_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct6_Unique_HH_ID
            FROM tb_Form_1BAct6_Participant P
            JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL
            --1BAct8
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct8_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct8_Unique_HH_ID
            FROM tb_Form_1BAct8_Participant P
            JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('con_irr', 'recon_irr')
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act1
            SELECT 
            COUNT(DISTINCT P.NameOfMSME_Owner) AS Count_2Act1_Unique_MSME_Owner
            FROM tb_Form_2Act1_Participant P
            JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act2
            SELECT 
            COUNT(DISTINCT P.NameAndSurname) AS Count_2Act2_Unique_MSME_Owner
            FROM tb_Form_2Act2_Participant P
            JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                
            UNION ALL
                
            --2Act3
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_2Act3_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_2Act3_Unique_HH_ID
            FROM tb_Form_2Act3_Participant P
            JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('accesstracks')
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                    
            UNION ALL	
            --3Act2
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameOfAPG) AS Count_3Act2_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_3Act2_Unique_HH_ID
            FROM tb_Form_3Act2_Participant P
            JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
            WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
            ) AS Combined_Counts;
    `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 8; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },

    "1A1_pwd_number": {
        query: `
      SELECT sum(count) AS count FROM (
            --1A1
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE P.PWD = 'yes' AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                    
            UNION ALL
            --1A4
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A4_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1A4_Unique_HH_ID
            FROM tb_Form_1A4_Participant P
            JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
            WHERE P.Pwd_status = 'yes' AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL

            --1BAct6
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct6_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct6_Unique_HH_ID
            FROM tb_Form_1BAct6_Participant P
            JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
            WHERE P.Pwd_status = 'yes' AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL
            --1BAct8
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct8_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_1BAct8_Unique_HH_ID
            FROM tb_Form_1BAct8_Participant P
            JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('con_irr', 'recon_irr')
            AND P.Pwd_status = 'yes' AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act1
            SELECT 
            COUNT(DISTINCT P.NameOfMSME_Owner) AS Count_2Act1_Unique_MSME_Owner
            FROM tb_Form_2Act1_Participant P
            JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Pwd_status = 'yes' AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act2 No PWD
                            
            --2Act3
            SELECT 
            COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_2Act3_All_Participants
            --,COUNT(DISTINCT P.HHId) AS Count_2Act3_Unique_HH_ID
            FROM tb_Form_2Act3_Participant P
            JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('accesstracks') AND P.PWD = 'yes'
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                    
            --3Act2 No PWD
           
            ) AS Combined_Counts;
    `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 6; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },


    "1A1_Households": {
        query: `
      SELECT sum(count) AS count FROM (
            --1A1
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
            COUNT(DISTINCT P.HHId) AS count
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                    
            UNION ALL
            --1A4
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A4_All_Participants
            COUNT(DISTINCT P.HHId) AS Count_1A4_Unique_HH_ID
            FROM tb_Form_1A4_Participant P
            JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL

            --1BAct6
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct6_All_Participants
            COUNT(DISTINCT P.HHId) AS Count_1BAct6_Unique_HH_ID
            FROM tb_Form_1BAct6_Participant P
            JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL
            --1BAct8
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct8_All_Participants
            COUNT(DISTINCT P.HHId) AS Count_1BAct8_Unique_HH_ID
            FROM tb_Form_1BAct8_Participant P
            JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('con_irr', 'recon_irr')
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act1
            SELECT 
            COUNT(DISTINCT P.NameOfMSME_Owner) AS Count_2Act1_Unique_MSME_Owner
            FROM tb_Form_2Act1_Participant P
            JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act2
            SELECT 
            COUNT(DISTINCT P.NameAndSurname) AS Count_2Act2_Unique_MSME_Owner
            FROM tb_Form_2Act2_Participant P
            JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                
            UNION ALL
                
            --2Act3
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_2Act3_All_Participants
            COUNT(DISTINCT P.HHId) AS Count_2Act3_Unique_HH_ID
            FROM tb_Form_2Act3_Participant P
            JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('accesstracks')
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                    
            UNION ALL	
            --3Act2
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameOfAPG) AS Count_3Act2_All_Participants
            COUNT(DISTINCT P.HHId) AS Count_3Act2_Unique_HH_ID
            FROM tb_Form_3Act2_Participant P
            JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
            WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
            ) AS Combined_Counts;
    `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 8; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },
    "1A1_Household_members": {
        query: `
      SELECT sum(count) AS count FROM (
            --1A1
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
            COUNT(DISTINCT P.HHId) AS count
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                    
            UNION ALL
            --1A4
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1A4_All_Participants
            COUNT(DISTINCT P.HHId) AS Count_1A4_Unique_HH_ID
            FROM tb_Form_1A4_Participant P
            JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL

            --1BAct6
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct6_All_Participants
            COUNT(DISTINCT P.HHId) AS Count_1BAct6_Unique_HH_ID
            FROM tb_Form_1BAct6_Participant P
            JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)

            UNION ALL
            --1BAct8
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_1BAct8_All_Participants
            COUNT(DISTINCT P.HHId) AS Count_1BAct8_Unique_HH_ID
            FROM tb_Form_1BAct8_Participant P
            JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('con_irr', 'recon_irr')
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act1
            SELECT 
            COUNT(DISTINCT P.NameOfMSME_Owner) AS Count_2Act1_Unique_MSME_Owner
            FROM tb_Form_2Act1_Participant P
            JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)

            UNION ALL

            --2Act2
            SELECT 
            COUNT(DISTINCT P.NameAndSurname) AS Count_2Act2_Unique_MSME_Owner
            FROM tb_Form_2Act2_Participant P
            JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                
            UNION ALL
                
            --2Act3
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS Count_2Act3_All_Participants
            COUNT(DISTINCT P.HHId) AS Count_2Act3_Unique_HH_ID
            FROM tb_Form_2Act3_Participant P
            JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
            WHERE S.Subactivity IN ('accesstracks')
            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                    
            UNION ALL	
            --3Act2
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameOfAPG) AS Count_3Act2_All_Participants
            COUNT(DISTINCT P.HHId) AS Count_3Act2_Unique_HH_ID
            FROM tb_Form_3Act2_Participant P
            JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
            WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
            ) AS Combined_Counts;
    `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 8; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },

    // Extend with more as needed...
};
