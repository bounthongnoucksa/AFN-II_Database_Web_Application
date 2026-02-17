WITH AllAPGs AS (
    SELECT DISTINCT
        s.Province,
        s.District,
        s.Village,
        p.NameAndSurname AS APG_Leader,
        s.IFAD,
        s.MAF,
        s.WFP,
        s.GoL,
        s.Ben,
        s.OtherFund
    FROM tb_Form_1BAct6_Participant p
    JOIN tb_Form_1BAct6_Submission s 
        ON p.SubmissionId = s.Id
    WHERE s.CBOEstablish IN (1,2)
      AND p.PositionInGroup = 'g_head'
)

SELECT
    Province,
    District,
    Village,
    APG_Leader,
	IFAD,
	Ben
FROM AllAPGs
WHERE IFAD > 0
   OR MAF > 0
   OR WFP > 0
   OR GoL > 0
   OR Ben > 0
   OR OtherFund > 0
--ORDER BY Province, District, Village;
ORDER BY APG_Leader ASC;
