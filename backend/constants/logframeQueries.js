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











    //##################### SurveyID1 ######################
    //Assessment Survey Part: 
    // SurveyID1 : 16,800 households with increased incomes by 20% (GAFSP Tier 1 indicator)
    
    // "SurveyID1_Question1_Number_of_Households" : {
    // query: `

    // `,
    // getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID1_Question2_Households_Percentage" : {
    // query: `

    // `,
    // getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },









    //##################### SurveyID2 ######################
    //Assessment Survey Part: 
    // SurveyID2 : 16,800 households with decreased food insecurity by 20% measured by Food Insecurity Experience Scale (FIES) - GAFSP Tier 1 indicator
    
    //"SurveyID2_Question1_Number_of_Households" : {
    // query: `

    // `,
    // getParams: ({ startDate, endDate }) => [startDate, endDate],
    //},
    //"SurveyID2_Question2_Households_Number_of_people" : {
    // query: `

    // `,
    // getParams: ({ startDate, endDate }) => [startDate, endDate],
    //},
    //"SurveyID2_Question3_Households_Percentage" : {
    // query: `

    // `,
    // getParams: ({ startDate, endDate }) => [startDate, endDate],
    //},











    //##################### SurveyID3 ######################
    //Assessment Survey Part: 
    // SurveyID3 : 1.2.8  Women reporting minimum dietary diversity (MDDW)
//   "SurveyID3_Question1_Women_Percentage" : {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },
//   "SurveyID3_Question2_Households_Number_of_Women" : {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },
//   "SurveyID3_Question3_Households_Percentage" : {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },
//   "SurveyID3_Question4_Number_of_Households" : {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },
//   "SurveyID3_Question5_Number_of_Household_members" : {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },
//   "SurveyID3_Question6_Number_of_Women_headed_households" : {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },










//##################### SurveyID4 ######################
    //Assessment Survey Part: 
    // SurveyID4 : 16,800 households with increased climate change resilience by 30%
    
    // "SurveyID4_Question1_Number_of_Households" : {
    // query: `

    // `,
    // getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID4_Question2_Households_Percentage" : {
    // query: `

    // `,
    // getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },








    //##################### SurveyID5 ######################
    //Assessment Survey Part: 
    // SurveyID5 : IE.2.1 Individuals demonstrating an improvement in empowerment

    // "SurveyID5_Question1_Total_Persons_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID5_Question2_Total_Number_of_Persons" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID5_Question3_Females_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID5_Question4_Females_Number" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID5_Question5_Males_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID5_Question6_Males_Number" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },








    //##################### SurveyID6 ######################
    //Assessment Survey Part: 
    // SurveyID6 : 1.2.9  Households with improved nutrition Knowledge Attitudes and Practices  (KAP)

    // "SurveyID6_Question1_Number_of_Households" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID6_Question2_Households_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID6_Question3_Number_of_Household_members" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },







    //##################### SurveyID7 ######################
    //Assessment Survey Part: 
    // SurveyID7 : 1.2.9  Proportion of children 6-23 months of age who receive a Minimum Acceptable Diet (MAD)

    // "SurveyID7_Question1_Number_of_Households" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID7_Question2_Households_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID7_Question3_Children_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID7_Question4_Number_of_Children" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },







    //##################### SurveyID8 ######################
    //Assessment Survey Part: 
    // SurveyID8 : 3.2.2  Households reporting adoption of environmentally sustainable and climate-resilient technologies and practices

    // "SurveyID8_Question1_Number_of_Household_members" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID8_Question2_Households_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID8_Question3_Number_of_Households" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },








    //##################### SurveyID9 ######################
    //Assessment Survey Part: 
    // SurveyID9 : SF.2.1 Households satisfied with project-supported services

    // "SurveyID9_Question1_Number_of_Household_members" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID9_Question2_Households_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID9_Question3_Number_of_Households" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },









    //##################### SurveyID10 ######################
    //Assessment Survey Part: 
    // SurveyID10 : SF.2.2 Households reporting they can influence decision-making of local authorities and project-supported service providers

    // "SurveyID10_Question1_Number_of_Household_members" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID10_Question2_Households_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID10_Question3_Number_of_Households" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },






    //##################### SurveyID11 ######################
    //Assessment Survey Part: 
    // SurveyID11 : 2.2.6  Households reporting improved physical access to markets, processing and storage facilities

    // "SurveyID11_Question1_Households_reporting_improved_physical_access_to_markets_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID11_Question2_Households_Number" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID11_Question3_Households_reporting_improved_physical_access_to_processing_facilities_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID11_Question4_Households_reporting_improved_physical_access_to_storage_facilities_Percentage" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID11_Question5_Households_reporting_improved_physical_access_to_markets_Households" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID11_Question6_Households_reporting_improved_physical_access_to_processing_facilities_Households" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID11_Question7_Households_reporting_improved_physical_access_to_storage_facilities_Households" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },





    //##################### SurveyID12 ######################
    //Assessment Survey Part: 
    // SurveyID12 : CI 2.2.3: Rural producers’ organizations engaged in formal partnerships/agreements or contracts with public or private entities

    // "SurveyID12_Question1_Number_of_POs" : {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID12_Question2_Total_Number_of_POs_members": {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID12_Question3_Number_of_Women_PO_members": {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID12_Question4_Number_of_Men_PO_members": {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID12_Question5_Number_of_Young_PO_members": {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },
    // "SurveyID12_Question6_Number_of_IP_PO_members": {
    //     query: `

    //     `,
    //     getParams: ({ startDate, endDate }) => [startDate, endDate],
    // },











    


    //Part 2: 1.1.8  Households provided with targeted support to improve their nutrition
    //It was requested from M&E team to include 1A1, CB for Villagers with activity code 1A.1, 1A.2, and 1A3a for this indicator (23-Nov-2025)
    "1A1_Total_Persons": {
        //     query: `
        //     --1A1
        //         SELECT 
        //             COALESCE(
        //                 COUNT(DISTINCT 
        //                     COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
        //                 ), 
        //             0) AS count
        //         FROM tb_Form_1A1_Participant P
        //         JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
        //         WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?);

        // `
        query: `
        --1A1
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
                WHERE S.ActivityCode IN ('1A.1','1A.2','1A.3a')
                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
            ) B
    `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }

    },
    "1A1_Males": {
        query: `
        --1A1
            SELECT
                A.Count_1A1_All_Participants + B.Count_cb_for_villagers_All_Participants AS count
            FROM
            (
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants                                    
                FROM tb_Form_1A1_Participant P
                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                WHERE P.Gender = ?
                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
            ) A
            CROSS JOIN
            (
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants                                    
                FROM tb_CB_for_Villagers_Participant P
                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                WHERE S.ActivityCode IN ('1A.1','1A.2','1A.3a')
                AND P.Gender = ?
                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
            ) B

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
    "1A1_Females": {
        query: `
        --1A1
            SELECT
                A.Count_1A1_All_Participants + B.Count_cb_for_villagers_All_Participants AS count
            FROM
            (
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants                                    
                FROM tb_Form_1A1_Participant P
                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                WHERE P.Gender = ?
                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
            ) A
            CROSS JOIN
            (
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants                                    
                FROM tb_CB_for_Villagers_Participant P
                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                WHERE S.ActivityCode IN ('1A.1','1A.2','1A.3a')
                AND P.Gender = ?
                AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
            ) B
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
    "1A1_Households": {
        //     query: `
        //     --1A1
        //         SELECT 
        //         --COUNT(DISTINCT P.HHId || '_' || P.NameAndSurname) AS count
        //         COUNT(DISTINCT P.HHId) AS count
        //         FROM tb_Form_1A1_Participant P
        //         JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
        //         WHERE date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
        // `
        query: `
        --1A1
            SELECT COUNT(DISTINCT HHId) AS count
            FROM (
                -- Source 1
                SELECT TRIM(P.HHId) AS HHId
                FROM tb_Form_1A1_Participant P
                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                WHERE DATE(S.ReportingPeriod) BETWEEN DATE(?) AND DATE(?)

                UNION   -- UNION removes duplicates between the two tables

                -- Source 2
                SELECT TRIM(P.HHId) AS HHId
                FROM tb_CB_for_Villagers_Participant P
                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                WHERE S.ActivityCode IN ('1A.1','1A.2','1A.3a')
                AND DATE(S.ReportingPeriod) BETWEEN DATE(?) AND DATE(?)
            ) combined;
    `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }

    },
    "1A1_persons_received_services": {
        query: `
        --1A1 (1A1_Households result x 6)
            SELECT COUNT(DISTINCT HHId) * 6 AS count
            FROM (
                -- Source 1
                SELECT TRIM(P.HHId) AS HHId
                FROM tb_Form_1A1_Participant P
                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                WHERE DATE(S.ReportingPeriod) BETWEEN DATE(?) AND DATE(?)

                UNION   -- UNION removes duplicates between the two tables

                -- Source 2
                SELECT TRIM(P.HHId) AS HHId
                FROM tb_CB_for_Villagers_Participant P
                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                WHERE S.ActivityCode IN ('1A.1','1A.2','1A.3a')
                AND DATE(S.ReportingPeriod) BETWEEN DATE(?) AND DATE(?)
            ) combined;
    `,
        //getParams: ({ startDate, endDate }) => [startDate, endDate],
        getParams: ({ startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }

    },
    "1A1_Indigenous_people": {
        //     query: `
        //     --1A1
        //         SELECT 
        //             COALESCE(
        //                 COUNT(DISTINCT 
        //                     COALESCE(P.HHId, '') || '_' || COALESCE(P.NameAndSurname, '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.Subactivity), '')
        //                 ), 
        //             0) AS count
        //         FROM tb_Form_1A1_Participant P
        //         JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
        //         WHERE P.Ethnicity NOT IN (${'??'}) AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
        // `
        query: `
        --1A1
            SELECT
                A.Count_1A1_All_Participants + B.Count_cb_for_villagers_All_Participants AS count
            FROM
            (
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants                                    
                FROM tb_Form_1A1_Participant P
                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                WHERE P.Ethnicity NOT IN (${'??'}) AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
            ) A
            CROSS JOIN
            (
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants                                    
                FROM tb_CB_for_Villagers_Participant P
                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                WHERE S.ActivityCode IN ('1A.1','1A.2','1A.3a')
                AND P.Ethnicity NOT IN (${'??'}) AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
            ) B
    `,
        //getParams: ({ ethnic, startDate, endDate }) => [startDate, endDate],
        getParams: ({ ethnic, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 2; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }

    },
    "1A1_Young_people": {
        query: `
        --1A1
            SELECT
                A.Count_1A1_All_Participants + B.Count_cb_for_villagers_All_Participants AS count
            FROM
            (
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '')|| '_' || COALESCE(TRIM(S.Subactivity), '')) AS Count_1A1_All_Participants                                    
                FROM tb_Form_1A1_Participant P
                JOIN tb_Form_1A1_Submission S ON P.SubmissionId = S.Id
                WHERE P.Age BETWEEN ? AND ? AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
            ) A
            CROSS JOIN
            (
                SELECT 
                    COUNT(DISTINCT COALESCE(TRIM(P.HHId), '') || '_' || COALESCE(TRIM(P.NameAndSurname), '') || '_' || COALESCE(TRIM(S.ReportingPeriod), '') || '_' || COALESCE(TRIM(S.SpecializedTopic), '')) AS Count_cb_for_villagers_All_Participants                                    
                FROM tb_CB_for_Villagers_Participant P
                JOIN tb_CB_for_Villagers_Submission S ON P.SubmissionId = S.Id
                WHERE S.ActivityCode IN ('1A.1','1A.2','1A.3a')
                AND P.Age BETWEEN ? AND ? AND date(S.ReportingPeriod) BETWEEN date(?) AND date(?)
            ) B
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






    //Part 3: Persons benefiting from cash or food-based transfers
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









    //Part 4: 1.1.4  Persons trained in production practices and/or technologies
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
                params.push(startDate, endDate);
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









    //Part 5: Number of farmers receiving inputs or services on climate resilient or sustainable agriculture practices (GAFSP Tier 2 indicator #13)
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








    //Part 6: 3.1.4  Land brought under climate-resilient practices
    "1BAct8_Total_Area": {
        query: `
      --1BAct8
        SELECT SUM(AreaAmount) AS count
        FROM (
            SELECT p.HHId, SUM(p.AreaAmount) AS AreaAmount
            FROM tb_Form_1BAct8_Participant p
            JOIN tb_Form_1BAct8_Submission s
            ON p.SubmissionId = s.Id
            WHERE date(s.Reporting_period) BETWEEN date(?) AND date(?)
            GROUP BY p.HHId
        ) AS UniqueHouseholds;
    `,
        getParams: ({ startDate, endDate }) => [startDate, endDate]
    },









    //Part 7: Persons receiving capacity development support (GAFSP Tier 2 Indicator #10)
    "cb_staff_Males": {
    query: `
        SELECT 
            COALESCE(
                COUNT(DISTINCT 
                    COALESCE(TRIM(S.ReportingPeriodDate), '') || '_' ||
                    COALESCE(P.Name, '') || '_' ||
                    COALESCE(P.Office, '') || '_' ||
                    COALESCE(S.Topic, '')
                ),
            0) AS count
        FROM tb_CB_Staff_Participant P
        JOIN tb_CB_Staff_Submission S ON P.SubmissionId = S.Id
        WHERE P.Gender = '_male'
          AND S.Category <> '6_meeting'
          AND date(S.ReportingPeriodDate) BETWEEN date(?) AND date(?)
    `,
    getParams: ({ startDate, endDate }) => [startDate, endDate],
},

"cb_staff_Females": {
    query: `
        SELECT 
            COALESCE(
                COUNT(DISTINCT 
                    COALESCE(TRIM(S.ReportingPeriodDate), '') || '_' ||
                    COALESCE(P.Name, '') || '_' ||
                    COALESCE(P.Office, '') || '_' ||
                    COALESCE(S.Topic, '')
                ),
            0) AS count
        FROM tb_CB_Staff_Participant P
        JOIN tb_CB_Staff_Submission S ON P.SubmissionId = S.Id
        WHERE P.Gender = '_female'
          AND S.Category <> '6_meeting'
          AND date(S.ReportingPeriodDate) BETWEEN date(?) AND date(?)
    `,
    getParams: ({ startDate, endDate }) => [startDate, endDate],
},

"cb_staff_Males_Percent": {
    query: `
        SELECT
            ROUND(
                100.0 * COUNT(DISTINCT CASE
                    WHEN P.Gender = '_male' THEN
                        COALESCE(TRIM(S.ReportingPeriodDate), '') || '_' ||
                        COALESCE(P.Name, '') || '_' ||
                        COALESCE(P.Office, '') || '_' ||
                        COALESCE(S.Topic, '')
                END)
                / NULLIF(
                    COUNT(DISTINCT
                        COALESCE(TRIM(S.ReportingPeriodDate), '') || '_' ||
                        COALESCE(P.Name, '') || '_' ||
                        COALESCE(P.Office, '') || '_' ||
                        COALESCE(S.Topic, '')
                    ), 0
                ),
            0) AS count
        FROM tb_CB_Staff_Participant P
        JOIN tb_CB_Staff_Submission S ON P.SubmissionId = S.Id
        WHERE S.Category <> '6_meeting'
          AND date(S.ReportingPeriodDate) BETWEEN date(?) AND date(?)
    `,
    getParams: ({ startDate, endDate }) => [startDate, endDate],
},

"cb_staff_Females_Percent": {
    query: `
        SELECT
            ROUND(
                100.0 * COUNT(DISTINCT CASE
                    WHEN P.Gender = '_female' THEN
                        COALESCE(TRIM(S.ReportingPeriodDate), '') || '_' ||
                        COALESCE(P.Name, '') || '_' ||
                        COALESCE(P.Office, '') || '_' ||
                        COALESCE(S.Topic, '')
                END)
                / NULLIF(
                    COUNT(DISTINCT
                        COALESCE(TRIM(S.ReportingPeriodDate), '') || '_' ||
                        COALESCE(P.Name, '') || '_' ||
                        COALESCE(P.Office, '') || '_' ||
                        COALESCE(S.Topic, '')
                    ), 0
                ),
            0) AS count
        FROM tb_CB_Staff_Participant P
        JOIN tb_CB_Staff_Submission S ON P.SubmissionId = S.Id
        WHERE S.Category <> '6_meeting'
          AND date(S.ReportingPeriodDate) BETWEEN date(?) AND date(?)
    `,
    getParams: ({ startDate, endDate }) => [startDate, endDate],
},

"cb_staff_Young_people": {
    query: `
        SELECT 
            COALESCE(
                COUNT(DISTINCT 
                    COALESCE(TRIM(S.ReportingPeriodDate), '') || '_' ||
                    COALESCE(P.Name, '') || '_' ||
                    COALESCE(P.Office, '') || '_' ||
                    COALESCE(S.Topic, '')
                ),
            0) AS count
        FROM tb_CB_Staff_Participant P
        JOIN tb_CB_Staff_Submission S ON P.SubmissionId = S.Id
        WHERE P.Age BETWEEN ? AND ?
          AND S.Category <> '6_meeting'
          AND date(S.ReportingPeriodDate) BETWEEN date(?) AND date(?)
    `,
    getParams: ({ minAge, maxAge, startDate, endDate }) => [
        minAge,
        maxAge,
        startDate,
        endDate
    ],
},














//Part8: 2.1.3  Rural producers’ organizations supported
"1BAct6_Total_size_of_PO": {
    query: `
        SELECT COUNT(*) AS count
    FROM (
    SELECT DISTINCT
        COALESCE(P.HHId, '') AS HHId,
        TRIM(COALESCE(P.NameAndSurname, '')) AS NameAndSurname,
        TRIM(COALESCE(S.Reporting_period, '')) AS Reporting_period,
        TRIM(COALESCE(S.Province, '')) AS Province,
        TRIM(COALESCE(S.District, '')) AS District,
        TRIM(COALESCE(S.Village, '')) AS Village,
        TRIM(COALESCE(S.SubActivity, '')) AS SubActivity,
        COALESCE(S.IFAD, 0) AS IFAD,
        COALESCE(S.MAF, 0) AS MAF,
        COALESCE(S.WFP, 0) AS WFP,
        COALESCE(S.GoL, 0) AS GoL,
        COALESCE(S.Ben, 0) AS Ben,
        COALESCE(S.OtherFund, 0) AS OtherFund
		
		
    FROM tb_Form_1BAct6_Participant P
    JOIN tb_Form_1BAct6_Submission S 
        ON P.SubmissionId = S.Id
    WHERE 
        (
            S.IFAD > 0
            OR S.MAF > 0
            OR S.WFP > 0
            OR S.GoL > 0
            OR S.Ben > 0
            OR S.OtherFund > 0
        )
        AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
);
    `,
    getParams: ({ startDate, endDate }) => [startDate, endDate],
},

"1BAct6_Rural_POs_supported": {
    query: `
        SELECT COUNT(*) AS count
    FROM (
    SELECT DISTINCT
        TRIM(COALESCE(s.Province, '')) AS Province,
        TRIM(COALESCE(s.District, '')) AS District,
        TRIM(COALESCE(s.Village, '')) AS Village,
        COALESCE(s.CBOEstablish, '') AS CBOEstablish,
        TRIM(COALESCE(p.NameAndSurname, '')) AS NameAndSurname,
        TRIM(COALESCE(p.PositionInGroup, '')) AS PositionInGroup,
        COALESCE(s.IFAD, 0) AS IFAD,
        COALESCE(s.MAF, 0) AS MAF,
        COALESCE(s.WFP, 0) AS WFP,
        COALESCE(s.GoL, 0) AS GoL,
        COALESCE(s.Ben, 0) AS Ben,
        COALESCE(s.OtherFund, 0) AS OtherFund
    FROM tb_Form_1BAct6_Participant p
    JOIN tb_Form_1BAct6_Submission s 
        ON p.SubmissionId = s.Id
    WHERE 
        (
            S.IFAD > 0
            OR S.MAF > 0
            OR S.WFP > 0
            OR S.GoL > 0
            OR S.Ben > 0
            OR S.OtherFund > 0
        )	
        AND s.CBOEstablish IS NOT NULL
        AND s.CBOEstablish IN (1,2)
        AND p.PositionInGroup = 'g_head'
		AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
);
    `,
    getParams: ({ startDate, endDate }) => [startDate, endDate],
},

"1BAct6_Males": {
    query: `
    SELECT COUNT(*) AS count
    FROM (
    SELECT DISTINCT
        COALESCE(P.HHId, '') AS HHId,
        TRIM(COALESCE(P.NameAndSurname, '')) AS NameAndSurname,
		TRIM(COALESCE(P.Gender, '')) AS Gender,
        TRIM(COALESCE(S.Reporting_period, '')) AS Reporting_period,
        TRIM(COALESCE(S.Province, '')) AS Province,
        TRIM(COALESCE(S.District, '')) AS District,
        TRIM(COALESCE(S.Village, '')) AS Village,
        TRIM(COALESCE(S.SubActivity, '')) AS SubActivity,
        COALESCE(S.IFAD, 0) AS IFAD,
        COALESCE(S.MAF, 0) AS MAF,
        COALESCE(S.WFP, 0) AS WFP,
        COALESCE(S.GoL, 0) AS GoL,
        COALESCE(S.Ben, 0) AS Ben,
        COALESCE(S.OtherFund, 0) AS OtherFund
    FROM tb_Form_1BAct6_Participant P
    JOIN tb_Form_1BAct6_Submission S 
        ON P.SubmissionId = S.Id
    WHERE 
        (
            S.IFAD > 0
            OR S.MAF > 0
            OR S.WFP > 0
            OR S.GoL > 0
            OR S.Ben > 0
            OR S.OtherFund > 0
        )
        AND P.Gender = 'Male'
        AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
    );
    `,
    getParams: ({ startDate, endDate }) => [startDate, endDate],
},

"1BAct6_Females": {
    query: `
    SELECT COUNT(*) AS count
    FROM (
    SELECT DISTINCT
        COALESCE(P.HHId, '') AS HHId,
        TRIM(COALESCE(P.NameAndSurname, '')) AS NameAndSurname,
		TRIM(COALESCE(P.Gender, '')) AS Gender,
        TRIM(COALESCE(S.Reporting_period, '')) AS Reporting_period,
        TRIM(COALESCE(S.Province, '')) AS Province,
        TRIM(COALESCE(S.District, '')) AS District,
        TRIM(COALESCE(S.Village, '')) AS Village,
        TRIM(COALESCE(S.SubActivity, '')) AS SubActivity,
        COALESCE(S.IFAD, 0) AS IFAD,
        COALESCE(S.MAF, 0) AS MAF,
        COALESCE(S.WFP, 0) AS WFP,
        COALESCE(S.GoL, 0) AS GoL,
        COALESCE(S.Ben, 0) AS Ben,
        COALESCE(S.OtherFund, 0) AS OtherFund
    FROM tb_Form_1BAct6_Participant P
    JOIN tb_Form_1BAct6_Submission S 
        ON P.SubmissionId = S.Id
    WHERE 
        (
            S.IFAD > 0
            OR S.MAF > 0
            OR S.WFP > 0
            OR S.GoL > 0
            OR S.Ben > 0
            OR S.OtherFund > 0
        )
        AND P.Gender = 'Female'
        AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
    );
    `,
    getParams: ({ startDate, endDate }) => [startDate, endDate],
},

"1BAct6_Young": {
    query: `
    SELECT COUNT(*) AS count
    FROM (
    SELECT DISTINCT
        COALESCE(P.HHId, '') AS HHId,
        TRIM(COALESCE(P.NameAndSurname, '')) AS NameAndSurname,
		TRIM(COALESCE(P.Age, '')) AS Age,
        TRIM(COALESCE(S.Reporting_period, '')) AS Reporting_period,
        TRIM(COALESCE(S.Province, '')) AS Province,
        TRIM(COALESCE(S.District, '')) AS District,
        TRIM(COALESCE(S.Village, '')) AS Village,
        TRIM(COALESCE(S.SubActivity, '')) AS SubActivity,
        COALESCE(S.IFAD, 0) AS IFAD,
        COALESCE(S.MAF, 0) AS MAF,
        COALESCE(S.WFP, 0) AS WFP,
        COALESCE(S.GoL, 0) AS GoL,
        COALESCE(S.Ben, 0) AS Ben,
        COALESCE(S.OtherFund, 0) AS OtherFund
    FROM tb_Form_1BAct6_Participant P
    JOIN tb_Form_1BAct6_Submission S 
        ON P.SubmissionId = S.Id
    WHERE 
        (
            S.IFAD > 0
            OR S.MAF > 0
            OR S.WFP > 0
            OR S.GoL > 0
            OR S.Ben > 0
            OR S.OtherFund > 0
        )
        AND P.Age BETWEEN ? AND ?
        AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
    );
    `,
    getParams: ({ minAge, maxAge, startDate, endDate }) => [
        minAge,
        maxAge,
        startDate,
        endDate
    ],
},

"1BAct6_Indigenous_people": {
        query: `
    SELECT COUNT(*) AS count
    FROM (
    SELECT DISTINCT
        COALESCE(P.HHId, '') AS HHId,
        TRIM(COALESCE(P.NameAndSurname, '')) AS NameAndSurname,
        TRIM(COALESCE(S.Reporting_period, '')) AS Reporting_period,
        TRIM(COALESCE(S.Province, '')) AS Province,
        TRIM(COALESCE(S.District, '')) AS District,
        TRIM(COALESCE(S.Village, '')) AS Village,
        TRIM(COALESCE(S.SubActivity, '')) AS SubActivity,
        COALESCE(S.IFAD, 0) AS IFAD,
        COALESCE(S.MAF, 0) AS MAF,
        COALESCE(S.WFP, 0) AS WFP,
        COALESCE(S.GoL, 0) AS GoL,
        COALESCE(S.Ben, 0) AS Ben,
        COALESCE(S.OtherFund, 0) AS OtherFund
    FROM tb_Form_1BAct6_Participant P
    JOIN tb_Form_1BAct6_Submission S 
        ON P.SubmissionId = S.Id
    WHERE 
        (
            S.IFAD > 0
            OR S.MAF > 0
            OR S.WFP > 0
            OR S.GoL > 0
            OR S.Ben > 0
            OR S.OtherFund > 0
        )
        AND P.Ethnicity NOT IN (${'??'})
        AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
    );
  `,
        getParams: ({ ethnic, startDate, endDate }) => {
            const params = [];
            for (let i = 0; i < 1; i++) {
                params.push(startDate, endDate);
            }
            return params;
        }
    },

    "1BAct6_Rural_POs_supported_women_headed": {
    query: `
    SELECT COUNT(*) AS count
    FROM (
    SELECT DISTINCT
        TRIM(COALESCE(s.Province, '')) AS Province,
        TRIM(COALESCE(s.District, '')) AS District,
        TRIM(COALESCE(s.Village, '')) AS Village,
        COALESCE(s.CBOEstablish, '') AS CBOEstablish,
        TRIM(COALESCE(p.NameAndSurname, '')) AS NameAndSurname,
		TRIM(COALESCE(p.Gender, '')) AS Gender,
        TRIM(COALESCE(p.PositionInGroup, '')) AS PositionInGroup,
        COALESCE(s.IFAD, 0) AS IFAD,
        COALESCE(s.MAF, 0) AS MAF,
        COALESCE(s.WFP, 0) AS WFP,
        COALESCE(s.GoL, 0) AS GoL,
        COALESCE(s.Ben, 0) AS Ben,
        COALESCE(s.OtherFund, 0) AS OtherFund
    FROM tb_Form_1BAct6_Participant p
    JOIN tb_Form_1BAct6_Submission s 
        ON p.SubmissionId = s.Id
    WHERE
        (
            S.IFAD > 0
            OR S.MAF > 0
            OR S.WFP > 0
            OR S.GoL > 0
            OR S.Ben > 0
            OR S.OtherFund > 0
        )	
        AND s.CBOEstablish IS NOT NULL
        AND s.CBOEstablish IN (1,2)
        AND p.PositionInGroup = 'g_head'
		AND p.Gender = 'Female'
		AND date(S.Reporting_period) BETWEEN date(?) AND date(?)
    );

    `,
    getParams: ({ startDate, endDate }) => [startDate, endDate],
},


//Part 9 has 2 sub indicator group:
//Part 9: 2.1.6 Market, processing or storage facilities constructed or rehabilitated
//Part 9: CI 2.1.5: Roads constructed, rehabilitated or upgraded

//######## This part has no data yet on 2Act3. to add SQL queries once data is available.#########

//   "2Act3_Total_number_of_facilities": {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },
//   "2Act3_Market_facilities_constructed_rehabilitated": {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },
//   "2Act3_Processing_facilities_constructed_rehabilitated": {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },
//   "2Act3_Storage_facilities_constructed_rehabilitated": {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },
//   "2Act3_Length_of_roads": {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },












//Part 9: Number of MSMEs joining the SUN Business Network as new members
//######## This part has no data yet on 2Act1. to add SQL queries once data is available.#########

// "2Act1_Number_of_MSMEs_joining": {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },









//Part 10: Number of nutrition plans developed and endorsed
// in involve in 2 tables: 2Act1a: Nutrition plans developed, 2Act1b: Nutrition plans endorsed

// "3Act1a_Nutrition_plans_developed": {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },
// "3Act1b_Nutrition_plans_endorsed": {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },










//This part is from survey data:
//Part 11: Policy 1 Policy-relevant knowledge products completed
//######## This part has no data yet on survey table. to add SQL queries once data is available.#########

// "SurveyID13_Question1_Policy_relevant_knowledge_products_completed_Number_of_Knowledge_Products": {
//     query: `

//     `,
//     getParams: ({ startDate, endDate }) => [startDate, endDate],
//   },


    // Extend with more as needed...
};
