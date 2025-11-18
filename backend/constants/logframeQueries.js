// logframeQueries.js

export const indicatorQueryMap = {

    // Part 1: Outreach Indicators
    "Outreach_Males": {
        query: `
                    SELECT SUM(count) AS count 
                        FROM (
                            -- 1A1
                            --It was requested to combine counts from Form 1A.1 and CB for Villagers for indicator 1A.1 and 1A2 from M&E team
                            SELECT
                                A.Count_1A1_All_Participants + B.Count_cb_for_villagers_All_Participants AS count
                            FROM
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants                                    
                                FROM tb_Form_1A1_Participant P
                                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Gender = ?
                                And date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) A
                            CROSS JOIN
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants                                    
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE S.ActivityCode IN ('1A.1','1A.2')
                                And P.Gender = ?
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) B
                            
                            UNION ALL
                            
                            -- 1A4 (×2)
                            SELECT 
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                            FROM tb_Form_1A4_Participant P
                            JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Gender = ? 
                            AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
                            
                            UNION ALL
                            
                            -- 1BAct6 (×2)
                            SELECT 
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                            FROM tb_Form_1BAct6_Participant P
                            JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Gender = ? 
                            AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
                            
                            UNION ALL
                            
                            -- 1BAct8 (×2)
                            SELECT 
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                            FROM tb_Form_1BAct8_Participant P
                            JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
                            WHERE S.Subactivity IN ('con_irr', 'recon_irr')
                            AND P.Gender = ? 
                            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                            
                            UNION ALL
                            
                            -- 2Act1 (×3)
                            SELECT 
                                COUNT(DISTINCT COALESCE(TRIM(P.NameOfMSME_Owner), '')) * 3 AS count
                            FROM tb_Form_2Act1_Participant P
                            JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Gender = ? 
                            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                            
                            UNION ALL
                            
                            -- 2Act2 (×25)
                            SELECT 
                                COUNT(DISTINCT COALESCE(TRIM(P.NameAndSurname), '')) * 25 AS count
                            FROM tb_Form_2Act2_Participant P
                            JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Gender = ? 
                            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                            
                            UNION ALL
                            
                            -- 2Act3 (×6)
                            SELECT 
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '')) * 6 AS count
                            FROM tb_Form_2Act3_Participant P
                            JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
                            WHERE S.Subactivity IN ('accesstracks') 
                            AND P.Gender = ?
                            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                            
                            UNION ALL
                            
                            -- 3Act2 (×2)
                            SELECT 
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameOfAPG), '')) * 2 AS count
                            FROM tb_Form_3Act2_Participant P
                            JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
                            WHERE P.Gender = ? 
                            AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                        ) AS Combined_Counts;

    `,
        //getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],
        getParams: ({ gender, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 9; i++) {
                params.push(gender, startDate, endDate);
            }
            return params;
        }
    },

    "Outreach_Females": {
        query: `
            SELECT SUM(count) AS count
            FROM (
                -- 1A1
                --It was requested to combine counts from Form 1A.1 and CB for Villagers for indicator 1A.1 and 1A2 from M&E team
                            SELECT
                                A.Count_1A1_All_Participants + B.Count_cb_for_villagers_All_Participants AS count
                            FROM
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants                                    
                                FROM tb_Form_1A1_Participant P
                                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Gender = ?
                                And date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) A
                            CROSS JOIN
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants                                    
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE S.ActivityCode IN ('1A.1','1A.2')
                                And P.Gender = ?
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) B

                UNION ALL

                -- 1A4 (×2)
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                FROM tb_Form_1A4_Participant P
                JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
                WHERE P.Gender = ? 
                AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

                UNION ALL

                -- 1BAct6 (×2)
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                FROM tb_Form_1BAct6_Participant P
                JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
                WHERE P.Gender = ? 
                AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

                UNION ALL

                -- 1BAct8 (×2)
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                FROM tb_Form_1BAct8_Participant P
                JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
                WHERE S.Subactivity IN ('con_irr', 'recon_irr')
                AND P.Gender = ? 
                AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                UNION ALL

                -- 2Act1 (×3)
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.NameOfMSME_Owner), '')) * 3 AS count
                FROM tb_Form_2Act1_Participant P
                JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
                WHERE P.Gender = ? 
                AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                UNION ALL

                -- 2Act2 (×25)
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.NameAndSurname), '')) * 25 AS count
                FROM tb_Form_2Act2_Participant P
                JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
                WHERE P.Gender = ? 
                AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                UNION ALL

                -- 2Act3 (×6)
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '')) * 6 AS count
                FROM tb_Form_2Act3_Participant P
                JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
                WHERE S.Subactivity IN ('accesstracks')
                AND P.Gender = ?
                AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                UNION ALL

                -- 3Act2 (×2)
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameOfAPG), '')) * 2 AS count
                FROM tb_Form_3Act2_Participant P
                JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
                WHERE P.Gender = ? 
                AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
            ) AS Combined_Counts;
    `,
        //getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],
        getParams: ({ gender, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 9; i++) {
                params.push(gender, startDate, endDate);
            }
            return params;
        }
    },

    "Outreach_Young_people": {
        query: `
                SELECT SUM(count) AS count
                FROM (
                    -- 1A1
                    --It was requested to combine counts from Form 1A.1 and CB for Villagers for indicator 1A.1 and 1A2 from M&E team
                            SELECT
                                A.Count_1A1_All_Participants + B.Count_cb_for_villagers_All_Participants AS count
                            FROM
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants                                    
                                FROM tb_Form_1A1_Participant P
                                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Age BETWEEN ? AND ?
                                And date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) A
                            CROSS JOIN
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants                                    
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE S.ActivityCode IN ('1A.1','1A.2')
                                AND P.Age BETWEEN ? AND ?
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) B

                    UNION ALL

                    -- 1A4 (×2)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                    FROM tb_Form_1A4_Participant P
                    JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Age BETWEEN ? AND ?
                    AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 1BAct6 (×2)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                    FROM tb_Form_1BAct6_Participant P
                    JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Age BETWEEN ? AND ?
                    AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 1BAct8 (×2)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                    FROM tb_Form_1BAct8_Participant P
                    JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
                    WHERE S.Subactivity IN ('con_irr', 'recon_irr')
                    AND P.Age BETWEEN ? AND ?
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 2Act1 (×3)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.NameOfMSME_Owner), '')) * 3 AS count
                    FROM tb_Form_2Act1_Participant P
                    JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Age BETWEEN ? AND ?
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 2Act2 (×25)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.NameAndSurname), '')) * 25 AS count
                    FROM tb_Form_2Act2_Participant P
                    JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Age BETWEEN ? AND ?
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 2Act3 (×6)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '')) * 6 AS count
                    FROM tb_Form_2Act3_Participant P
                    JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
                    WHERE S.Subactivity IN ('accesstracks')
                    AND P.Age BETWEEN ? AND ?
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 3Act2 (×2)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameOfAPG), '')) * 2 AS count
                    FROM tb_Form_3Act2_Participant P
                    JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
                    WHERE P.Age BETWEEN ? AND ?
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                ) AS Combined_Counts;

    `,
        //getParams: ({ minAge, maxAge, startDate, endDate }) => [minAge, maxAge, startDate, endDate],
        getParams: ({ minAge, maxAge, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 9; i++) {
                params.push(minAge, maxAge, startDate, endDate);
            }
            return params;
        }
    },

    "Outreach_Indigenous_people": {
        query: `
                SELECT SUM(count) AS count
                FROM (
                    -- 1A1
                    --It was requested to combine counts from Form 1A.1 and CB for Villagers for indicator 1A.1 and 1A2 from M&E team
                            SELECT
                                A.Count_1A1_All_Participants + B.Count_cb_for_villagers_All_Participants AS count
                            FROM
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants                                    
                                FROM tb_Form_1A1_Participant P
                                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Ethnicity NOT IN (${'??'})
                                And date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) A
                            CROSS JOIN
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants                                    
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE S.ActivityCode IN ('1A.1','1A.2')
                                AND P.Ethnicity NOT IN (${'??'})
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) B

                    UNION ALL

                    -- 1A4 (×2)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                    FROM tb_Form_1A4_Participant P
                    JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Ethnicity NOT IN (${'??'})
                    AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 1BAct6 (×2)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                    FROM tb_Form_1BAct6_Participant P
                    JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Ethnicity NOT IN (${'??'})
                    AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 1BAct8 (×2)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                    FROM tb_Form_1BAct8_Participant P
                    JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
                    WHERE S.Subactivity IN ('con_irr', 'recon_irr')
                    AND P.Ethnicity NOT IN (${'??'})
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 2Act1 (×3)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.NameOfMSME_Owner), '')) * 3 AS count
                    FROM tb_Form_2Act1_Participant P
                    JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Ethnicity NOT IN (${'??'})
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 2Act2 (×25)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.NameAndSurname), '')) * 25 AS count
                    FROM tb_Form_2Act2_Participant P
                    JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Ethnicity NOT IN (${'??'})
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 2Act3 (×6)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '')) * 6 AS count
                    FROM tb_Form_2Act3_Participant P
                    JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
                    WHERE S.Subactivity IN ('accesstracks')
                    AND P.Ethnicity NOT IN (${'??'})
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    -- 3Act2 (×2)
                    SELECT 
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameOfAPG), '')) * 2 AS count
                    FROM tb_Form_3Act2_Participant P
                    JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
                    WHERE P.Ethnicity NOT IN (${'??'})
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                ) AS Combined_Counts;

    `,
        //getParams: ({ ethnicCodes, startDate, endDate }) => [startDate, endDate], // Will use direct injection for codes
        getParams: ({ ethnic, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 9; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },
    "Outreach_persons_received_services": {
        query: `
                SELECT SUM(count) AS count
                FROM (
                    --It was requested to combine counts from Form 1A.1 and CB for Villagers for indicator 1A.1 and 1A2 from M&E team
                            SELECT
                                A.Count_1A1_All_Participants + B.Count_cb_for_villagers_All_Participants AS count
                            FROM
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants                                    
                                FROM tb_Form_1A1_Participant P
                                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                                WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) A
                            CROSS JOIN
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants                                    
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE S.ActivityCode IN ('1A.1','1A.2')                                
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) B

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                    FROM tb_Form_1A4_Participant P
                    JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
                    WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                    FROM tb_Form_1BAct6_Participant P
                    JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
                    WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) * 2 AS count
                    FROM tb_Form_1BAct8_Participant P
                    JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
                    WHERE S.Subactivity IN ('con_irr', 'recon_irr')
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(P.NameOfMSME_Owner, '')) * 3 AS count
                    FROM tb_Form_2Act1_Participant P
                    JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
                    WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(P.NameAndSurname, '')) * 25 AS count
                    FROM tb_Form_2Act2_Participant P
                    JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
                    WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '')) * 6 AS count
                    FROM tb_Form_2Act3_Participant P
                    JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
                    WHERE S.Subactivity IN ('accesstracks')
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(P.HHId, '') || '_' || COALESCE(P.NameOfAPG, '')) * 2 AS count
                    FROM tb_Form_3Act2_Participant P
                    JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
                    WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                ) AS Combined_Counts;

    `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 9; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },

    "Outreach_pwd_number": {
        query: `
      -- Agree to not multyply results for PWD
                SELECT SUM(count) AS count
                FROM (
                    -- 1A1
                    --It was requested to combine counts from Form 1A.1 and CB for Villagers for indicator 1A.1 and 1A2 from M&E team
                            SELECT
                                A.Count_1A1_All_Participants + B.Count_cb_for_villagers_All_Participants AS count
                            FROM
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants                                    
                                FROM tb_Form_1A1_Participant P
                                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                                WHERE P.PWD = 'yes' AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) A
                            CROSS JOIN
                            (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants                                    
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE S.ActivityCode IN ('1A.1','1A.2')
                                AND P.PWD = 'yes' AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ) B

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) AS count
                    FROM tb_Form_1A4_Participant P
                    JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Pwd_status = 'yes' AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) AS count
                    FROM tb_Form_1BAct6_Participant P
                    JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Pwd_status = 'yes' AND date(S.Reporting_period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')) AS count
                    FROM tb_Form_1BAct8_Participant P
                    JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
                    WHERE S.Subactivity IN ('con_irr', 'recon_irr') 
                    AND P.Pwd_status = 'yes' AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(P.NameOfMSME_Owner,'')) AS count
                    FROM tb_Form_2Act1_Participant P
                    JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
                    WHERE P.Pwd_status = 'yes' AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                    UNION ALL

                    SELECT COUNT(DISTINCT COALESCE(P.HHId,'') || '_' || COALESCE(P.NameAndSurname,'')) AS count
                    FROM tb_Form_2Act3_Participant P
                    JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
                    WHERE S.Subactivity IN ('accesstracks') AND P.PWD = 'yes'
                    AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)
                ) AS Combined_Counts;

    `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 7; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },


    "Outreach_Households": {
        query: `
        -- Count Unique HH-ID across all relevant forms
      SELECT sum(count) AS count FROM (
            --1A1
            --It was requested to combine counts from Form 1A.1 and CB for Villagers for indicator 1A.1 and 1A2 from M&E team
                SELECT
                    A.Count_1A1_Unique_HH_ID + B.Count_cb_for_villagers_Unique_HH_ID AS count
                FROM
                (
                    SELECT 
                        COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
                    FROM tb_Form_1A1_Participant P
                    JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                    WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                ) A
                CROSS JOIN
                (
                    SELECT 
                        COUNT(DISTINCT P.HHId) AS Count_cb_for_villagers_Unique_HH_ID
                    FROM tb_CB_for_Villagers_Participant P
                    JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                    WHERE S.ActivityCode IN ('1A.1','1A.2')
                    AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                ) B
                    
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
            for (let i = 0; i < 9; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },
    "Outreach_Household_members": {
        query: `
        -- Overall result x Average Household Size (6)
                SELECT SUM(count) * 6 AS count FROM (
                --1A1
                --It was requested to combine counts from Form 1A.1 and CB for Villagers for indicator 1A.1 and 1A2 from M&E team
                SELECT
                    A.Count_1A1_Unique_HH_ID + B.Count_cb_for_villagers_Unique_HH_ID AS count
                FROM
                (
                    SELECT 
                        COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
                    FROM tb_Form_1A1_Participant P
                    JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                    WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                ) A
                CROSS JOIN
                (
                    SELECT 
                        COUNT(DISTINCT P.HHId) AS Count_cb_for_villagers_Unique_HH_ID
                    FROM tb_CB_for_Villagers_Participant P
                    JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                    WHERE S.ActivityCode IN ('1A.1','1A.2')
                    AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                ) B
                                
                UNION ALL
                --1A4
                SELECT COALESCE(COUNT(DISTINCT P.HHId), 0) AS count
                FROM tb_Form_1A4_Participant P
                JOIN tb_Form_1A4_Submission S ON P.SubmissionId = S.Id
                WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)

                UNION ALL
                --1BAct6
                SELECT COALESCE(COUNT(DISTINCT P.HHId), 0) AS count
                FROM tb_Form_1BAct6_Participant P
                JOIN tb_Form_1BAct6_Submission S ON P.SubmissionId = S.Id
                WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)

                UNION ALL
                --1BAct8
                SELECT COALESCE(COUNT(DISTINCT P.HHId), 0) AS count
                FROM tb_Form_1BAct8_Participant P
                JOIN tb_Form_1BAct8_Submission S ON P.SubmissionId = S.Id
                WHERE S.Subactivity IN ('con_irr', 'recon_irr')
                AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                UNION ALL
                --2Act1
                SELECT COALESCE(COUNT(DISTINCT P.NameOfMSME_Owner), 0) AS count
                FROM tb_Form_2Act1_Participant P
                JOIN tb_Form_2Act1_Submission S ON P.SubmissionId = S.Id
                WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                UNION ALL
                --2Act2
                SELECT COALESCE(COUNT(DISTINCT P.NameAndSurname), 0) AS count
                FROM tb_Form_2Act2_Participant P
                JOIN tb_Form_2Act2_Submission S ON P.SubmissionId = S.Id
                WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                UNION ALL
                --2Act3
                SELECT COALESCE(COUNT(DISTINCT P.HHId), 0) AS count
                FROM tb_Form_2Act3_Participant P
                JOIN tb_Form_2Act3_Submission S ON P.SubmissionId = S.Id
                WHERE S.Subactivity IN ('accesstracks')
                AND date(S.Reporting_Period) BETWEEN date(?) AND date(?)

                UNION ALL    
                --3Act2
                SELECT COALESCE(COUNT(DISTINCT P.HHId), 0) AS count
                FROM tb_Form_3Act2_Participant P
                JOIN tb_Form_3Act2_Submission S ON P.Submission_id = S.Id
                WHERE date(S.Reporting_Period) BETWEEN date(?) AND date(?)
            ) AS Combined_Counts;

    `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 9; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },


    //Part2: 1.1.8  Households provided with targeted support to improve their nutrition
    "1A1_Total_Persons": {
        query: `
        --1A1
            SELECT 
                COALESCE(
                    COUNT(DISTINCT 
                        COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
                    ), 
                0) AS count
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?);

    `,
        getParams: ({ startDate, endDate }) => [startDate, endDate],

    },
    "1A1_Males": {
        query: `
        --1A1
            SELECT 
                COALESCE(
                    COUNT(DISTINCT 
                        COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
                    ), 
                0) AS count
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? 
            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?);

    `,
        getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],

    },
    "1A1_Females": {
        query: `
        --1A1
            SELECT 
                COALESCE(
                    COUNT(DISTINCT 
                        COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
                    ), 
                0) AS count
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? 
            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?);
    `,
        getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],

    },
    "1A1_Households": {
        query: `
        --1A1
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
            COUNT(DISTINCT P.HHId) AS count
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
    `,
        getParams: ({ startDate, endDate }) => [startDate, endDate],

    },
    "1A1_persons_received_services": {
        query: `
        --1A1 (1A1_Households result x 6)
            SELECT
            COUNT(DISTINCT P.HHId) * 6 AS count
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
    `,
        getParams: ({ startDate, endDate }) => [startDate, endDate],

    },
    "1A1_Indigenous_people": {
        query: `
        --1A1
            SELECT 
                COALESCE(
                    COUNT(DISTINCT 
                        COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
                    ), 
                0) AS count
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Ethnicity NOT IN (${'??'}) AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
    `,
        getParams: ({ ethnic, startDate, endDate }) => [startDate, endDate],

    },
    "1A1_Young_people": {
        query: `
        --1A1
            SELECT 
                COALESCE(
                    COUNT(DISTINCT 
                        COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
                    ), 
                0) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A1_Unique_HH_ID
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE P.Age BETWEEN ? AND ? AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
    `,
        getParams: ({ minAge, maxAge, startDate, endDate }) => [minAge, maxAge, startDate, endDate],

    },
    "1A1_Women_headed_households": {
        query: `
        --1A1
            SELECT 
            --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
            COUNT(DISTINCT P.HHId) * 6 AS count
            FROM tb_Form_1A1_Participant P
            JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
            WHERE P.WomanHead = 'h_yes' AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
    `,
        getParams: ({ startDate, endDate }) => [startDate, endDate],

    },






    //Part3: Persons benefiting from cash or food-based transfers
    "1A2_Total_Persons": {
        query: `
        --1A2
            SELECT 
                COALESCE(
                    COUNT(DISTINCT 
                        COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
                    ), 
                0) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A2_Unique_HH_ID
            FROM tb_Form_1A2_Participant P
            JOIN tb_Form_1A2_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?)
    `,
        getParams: ({ startDate, endDate }) => [startDate, endDate],

    },
    "1A2_Males": {
        query: `
        --1A2
            SELECT 
                COALESCE(
                    COUNT(DISTINCT 
                        COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
                    ), 
                0) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A2_Unique_HH_ID
            FROM tb_Form_1A2_Participant P
            JOIN tb_Form_1A2_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
    `,
        getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],

    },
    "1A2_Females": {
        query: `
        --1A2
            SELECT 
                COALESCE(
                    COUNT(DISTINCT 
                        COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
                    ), 
                0) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A2_Unique_HH_ID
            FROM tb_Form_1A2_Participant P
            JOIN tb_Form_1A2_Submission S ON P.SubmissionId = S.Id
            WHERE P.Gender = ? AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
    `,
        getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],

    },
    "1A2_Females_Percent": {
        query: `
        --1A2
            SELECT
                ROUND(
                    100.0 * COUNT(DISTINCT CASE 
                                WHEN P.Gender = 'Female' 
                                THEN COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '') 
                            END)
                    / NULLIF(COUNT(DISTINCT COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')), 0)
                , 0) AS count
            FROM tb_Form_1A2_Participant P
            JOIN tb_Form_1A2_Submission S ON P.SubmissionId = S.Id
            WHERE date(S.Reporting_period) BETWEEN date(?) AND date(?);

    `,
        getParams: ({ startDate, endDate }) => [startDate, endDate],

    },
    "1A2_Young_people": {
        query: `
        --1A2
            SELECT 
                COALESCE(
                    COUNT(DISTINCT 
                        COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
                    ), 
                0) AS count
            --,COUNT(DISTINCT P.HHId) AS Count_1A2_Unique_HH_ID
            FROM tb_Form_1A2_Participant P
            JOIN tb_Form_1A2_Submission S ON P.SubmissionId = S.Id
            WHERE P.Age BETWEEN ? AND ? AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
    `,
        getParams: ({ minAge, maxAge, startDate, endDate }) => [minAge, maxAge, startDate, endDate],

    },









    //Part4: 1.1.4  Persons trained in production practices and/or technologies
    "cb_villagers_Total_Persons": {
        query: `
      SELECT 
          --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '')) AS count
          COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
      FROM tb_CB_for_Villagers_Participant P
      JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
      WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
  `,
        getParams: ({ startDate, endDate }) => [startDate, endDate],
    },

    "cb_villagers_Crop_Males": {
        query: `
                SELECT 
                        ROUND(
                                -- 100% of 2TC
                                (SELECT 
                                    --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Gender = ?
                                AND S.ActivityType = '2_tc'
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                                )
                                +
                                -- 50% of 2TL+TC
                                0.5 * (
                                    SELECT 
                                        --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                    FROM tb_CB_for_Villagers_Participant P
                                    JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                    WHERE P.Gender = ?
                                    AND S.ActivityType = '2_tl_tc'
                                    AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                                )
                        ,0) AS count
  `,
        //getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],
        getParams: ({ gender, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(gender, startDate, endDate);
            }
            return params;
        }
    },

    "cb_villagers_Crop_Females": {
        query: `
                SELECT 
                        ROUND(
                                -- 100% of 2TC
                                (SELECT 
                                    --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Gender = ?
                                AND S.ActivityType = '2_tc'
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                                )
                                +
                                -- 50% of 2TL+TC
                                0.5 * (
                                    SELECT 
                                        --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                    FROM tb_CB_for_Villagers_Participant P
                                    JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                    WHERE P.Gender = ?
                                    AND S.ActivityType = '2_tl_tc'
                                    AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                                )
                            ,0) AS count
  `,
        //getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],
        getParams: ({ gender, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(gender, startDate, endDate);
            }
            return params;
        }
    },

    "cb_villagers_Crop_Young_People": {
        query: `
      SELECT 
                ROUND(
                    -- 100% of 2TC
                    (SELECT 
                        --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                        COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                        FROM tb_CB_for_Villagers_Participant P
                        JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                        WHERE P.Age BETWEEN ? AND ?
                        AND S.ActivityType = '2_tc'
                        AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                        )
                        +
                        -- 50% of 2TL+TC
                        0.5 * (
                            SELECT 
                                --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                            FROM tb_CB_for_Villagers_Participant P
                            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Age BETWEEN ? AND ?
                            AND S.ActivityType = '2_tl_tc'
                            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                        )
                    ,0) AS count
  `,
        //getParams: ({ minAge, maxAge, startDate, endDate }) => [minAge, maxAge, startDate, endDate],
        getParams: ({ minAge, maxAge, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(minAge, maxAge, startDate, endDate);
            }
            return params;
        }
    },

    "cb_villagers_Crop_Indigenous_People": {
        query: `
            SELECT 
                    ROUND(
                        -- 100% of 2TC
                        (SELECT 
                            --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                            COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                        FROM tb_CB_for_Villagers_Participant P
                        JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                        WHERE P.Ethnicity NOT IN (??)
                        AND S.ActivityType = '2_tc'
                        AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                        )
                        +
                        -- 50% of 2TL+TC
                        0.5 * (
                            SELECT 
                                --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                            FROM tb_CB_for_Villagers_Participant P
                            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Ethnicity NOT IN (??)
                            AND S.ActivityType = '2_tl_tc'
                            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                        )
                    ,0) AS count
  `,
        //getParams: ({ ethnic, startDate, endDate }) => [ethnic, startDate, endDate],
        getParams: ({ ethnic, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push( startDate, endDate);
            }
            return params;
        }
    },

    "cb_villagers_Livestock_Males": {
        query: `
                SELECT 
                        ROUND(
                            -- 100% of 2TL
                            (SELECT 
                                --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                            FROM tb_CB_for_Villagers_Participant P
                            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Gender = ?
                            AND S.ActivityType = '2_tl'
                            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                            +
                            -- 50% of 2TL+TC
                            0.5 * (
                                SELECT 
                                    --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Gender = ?
                                AND S.ActivityType = '2_tl_tc'
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                        ,0) AS count
  `,
        //getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],
        getParams: ({ gender, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(gender, startDate, endDate);
            }
            return params;
        }
    },

    "cb_villagers_Livestock_Females": {
        query: `
                SELECT 
                        ROUND(
                            -- 100% of 2TL
                            (SELECT 
                                --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                            FROM tb_CB_for_Villagers_Participant P
                            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Gender = ?
                            AND S.ActivityType = '2_tl'
                            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                            +
                            -- 50% of 2TL+TC
                            0.5 * (
                                SELECT 
                                    --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Gender = ?
                                AND S.ActivityType = '2_tl_tc'
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                        ,0) AS count
  `,
        //getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate],
        getParams: ({ gender, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(gender, startDate, endDate);
            }
            return params;
        }
    },

    "cb_villagers_Livestock_Young_People": {
        query: `
                SELECT 
                        ROUND(
                            -- 100% of 2TL
                            (SELECT 
                                --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                            FROM tb_CB_for_Villagers_Participant P
                            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Age BETWEEN ? AND ?
                            AND S.ActivityType = '2_tl'
                            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                            +
                            -- 50% of 2TL+TC
                            0.5 * (
                                SELECT 
                                    --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Age BETWEEN ? AND ?
                                AND S.ActivityType = '2_tl_tc'
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                        ,0) AS count
  `,
        //getParams: ({ minAge, maxAge, startDate, endDate }) => [minAge, maxAge, startDate, endDate],
        getParams: ({ minAge, maxAge, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(minAge, maxAge, startDate, endDate);
            }
            return params;
        }
    },

    "cb_villagers_Livestock_Indigenous_People": {
        query: `
                SELECT 
                        ROUND(
                            -- 100% of 2TL
                            (SELECT 
                                --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                            FROM tb_CB_for_Villagers_Participant P
                            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Ethnicity NOT IN (??)
                            AND S.ActivityType = '2_tl'
                            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                            +
                            -- 50% of 2TL+TC
                            0.5 * (
                                SELECT 
                                    --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Ethnicity NOT IN (??)
                                AND S.ActivityType = '2_tl_tc'
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                        ,0) AS count
  `,
        //getParams: ({ ethnic, startDate, endDate }) => [ethnic, startDate, endDate],
        getParams: ({ ethnic, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },

    "cb_villagers_Total_Crop_Trained": {
        query: `
                SELECT 
                        (
                            -- 100% of 2TC
                            (SELECT 
                                --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                            FROM tb_CB_for_Villagers_Participant P
                            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Gender = 'Male'
                            AND S.ActivityType = '2_tc'
                            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                            +
                            -- 50% of 2TL+TC
                            ROUND(0.5 * (
                                SELECT 
                                    --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Gender = 'Male'
                                AND S.ActivityType = '2_tl_tc'
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ),0)
                            +
                            -- 100% of 2TC
                            (SELECT 
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                            FROM tb_CB_for_Villagers_Participant P
                            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Gender = 'Female'
                            AND S.ActivityType = '2_tc'
                            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                            +
                            -- 50% of 2TL+TC
                            ROUND(0.5 * (
                                SELECT 
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Gender = 'Female'
                                AND S.ActivityType = '2_tl_tc'
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ),0)		
                        ) AS count
  `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 4; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },

    "cb_villagers_Total_Livestock_Trained": {
        query: `
                SELECT 
                        (
                            -- 100% of 2TL
                            (SELECT 
                                --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                            FROM tb_CB_for_Villagers_Participant P
                            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Gender = 'Male'
                            AND S.ActivityType = '2_tl'
                            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                            +
                            -- 50% of 2TL+TL
                            ROUND(0.5 * (
                                SELECT 
                                    --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Gender = 'Male'
                                AND S.ActivityType = '2_tl_tc'
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ),0)
                            +
                            -- 100% of 2TL
                            (SELECT 
                                --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                            FROM tb_CB_for_Villagers_Participant P
                            JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                            WHERE P.Gender = 'Female'
                            AND S.ActivityType = '2_tl'
                            AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            )
                            +
                            -- 50% of 2TL+TC
                            ROUND(0.5 * (
                                SELECT 
                                    --COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), ''))
                                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS count
                                FROM tb_CB_for_Villagers_Participant P
                                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                                WHERE P.Gender = 'Female'
                                AND S.ActivityType = '2_tl_tc'
                                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
                            ),0)		
                        ) AS count
  `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 4; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },









    //Part 5:
    "1BAct7_Males": {
    query: `
      --1BAct7
      SELECT 
          COALESCE(
              COUNT(DISTINCT 
                  COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
              ), 
          0) AS count
      FROM tb_Form_1BAct7_Participant P
      JOIN tb_Form_1BAct7_Submission S ON P.SubmissionId = S.Id
      WHERE P.Gender = ? 
      AND date(S.Reporting_period) BETWEEN date(?) AND date(?);
    `,
    getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate]
  },

  "1BAct7_Females": {
    query: `
      --1BAct7
      SELECT 
          COALESCE(
              COUNT(DISTINCT 
                  COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
              ), 
          0) AS count
      FROM tb_Form_1BAct7_Participant P
      JOIN tb_Form_1BAct7_Submission S ON P.SubmissionId = S.Id
      WHERE P.Gender = ? 
      AND date(S.Reporting_period) BETWEEN date(?) AND date(?);
    `,
    getParams: ({ gender, startDate, endDate }) => [gender, startDate, endDate]
  },

  "1BAct7_Males_Percentage": {
    query: `
      --1BAct7
      SELECT ROUND(
        COALESCE(
          COUNT(DISTINCT COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')), 0
        ) * 100.0 / 
        (SELECT COALESCE(COUNT(DISTINCT COALESCE(P2.HHId, '') || '_' || COALESCE(P2.NameAndSurname, '') || '_' || COALESCE(TRIM(S2.Reporting_period), '') || '_' || COALESCE(TRIM(S2.Subactivity), '')), 0)
         FROM tb_Form_1BAct7_Participant P2
         JOIN tb_Form_1BAct7_Submission S2 ON P2.SubmissionId = S2.Id
         WHERE date(S2.Reporting_period) BETWEEN date(?) AND date(?)
        ), 0
      ) AS count
      FROM tb_Form_1BAct7_Participant P
      JOIN tb_Form_1BAct7_Submission S ON P.SubmissionId = S.Id
      WHERE P.Gender = 'Male' AND date(S.Reporting_period) BETWEEN date(?) AND date(?);
    `,
    //getParams: ({ startDate, endDate, gender }) => [startDate, endDate, startDate, endDate]
    getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
  },

  "1BAct7_Females_Percentage": {
    query: `
      --1BAct7
      SELECT ROUND(
        COALESCE(
          COUNT(DISTINCT COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.Reporting_period), '') || '_' || COALESCE(TRIM(S.Subactivity), '')), 0
        ) * 100.0 / 
        (SELECT COALESCE(COUNT(DISTINCT COALESCE(P2.HHId, '') || '_' || COALESCE(P2.NameAndSurname, '') || '_' || COALESCE(TRIM(S2.Reporting_period), '') || '_' || COALESCE(TRIM(S2.Subactivity), '')), 0)
         FROM tb_Form_1BAct7_Participant P2
         JOIN tb_Form_1BAct7_Submission S2 ON P2.SubmissionId = S2.Id
         WHERE date(S2.Reporting_period) BETWEEN date(?) AND date(?)
        ), 0
      ) AS count
      FROM tb_Form_1BAct7_Participant P
      JOIN tb_Form_1BAct7_Submission S ON P.SubmissionId = S.Id
      WHERE P.Gender = 'Female' AND date(S.Reporting_period) BETWEEN date(?) AND date(?);
    `,
    //getParams: ({ startDate, endDate }) => [startDate, endDate, startDate, endDate]
    getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
  },





    // Extend with more as needed...
};
