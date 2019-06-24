USE [Picol]
GO

DECLARE @currentYear int;
SELECT @currentYear = value FROM [Picol].dbo.Settings
where Name = 'CurrentSearchYear'

INSERT INTO [dbo].[LabelResults]
           ([Id]
           ,[Name]
           ,[WsdaLineNum]
           ,[OrPid]
           ,[CurrentlyRegisteredWashington]
           ,[CurrentlyRegisteredOregon]
           ,[Epa]
           ,[EpaOne]
           ,[EpaTwo]
           ,[EpaThree]
           ,[IntendedUser]
           ,[Ingredients]
           ,[ResistanceCode]
           ,[ResistanceSource]
           ,[Concentrations]
           ,[PesticideTypes]
           ,[RegistrantName]
           ,[Sln]
           ,[Supplemental]
           ,[Formulation]
           ,[SignalWord]
           ,[Usage]
           ,[SupplementalName]
           ,[SupplementalExpiration]
           ,[SlnName]
           ,[SlnExpiration]
           ,[Spanish]
           ,[Organic]
           ,[EsaNotice]
           ,[Section18]
           ,[Section18Expiration]
           ,[I502]
           ,[Essb]
           ,[WashingtonDownload]
           ,[OregonDownload]
		   ,[WashingtonRegistrationYear]
		   ,[OregonRegistrationYear])
    SELECT DISTINCT
	T1.Id,
	T1.Name,
	max(case when T3.Code = 'WA' then T2.AgencyId else '' end) AS WsdaLineNum,
	max(case when T3.Code = 'OR' then T2.AgencyId else '' end) AS OrPid,
	max(case when T3.Code = 'WA' AND T2.Year >= @currentYear then 1 else 0 end) AS CurrentlyRegisteredWashington,
	max(case when T3.Code = 'OR' AND T2.Year >= @currentYear then 1 else 0 end) AS CurrentlyRegisteredOregon,
	T1.Epa,
	T1.EpaFieldOne AS EpaOne,
	T1.EpaFieldTwo AS EpaTwo,
	T1.EpaFieldThree AS EpaThree,
	T4.Name AS IntendedUser,
	'' AS Ingredients,
	'' AS ResistanceCode,
	'' AS ResistanceSource,
	'' AS Concentrations,
	'' AS PesticideTypes,
	T7.Name AS RegistrantName,
	T1.Sln,
	T1.Supplemental,
	T8.Name AS Formulation,
	T9.Name AS SignalWordId,
	T10.Name AS Usage,
	T1.SupplementalName,
	CONVERT(varchar,T1.SupplementalExpiration,1),
	T1.SlnName,
	CONVERT(varchar,T1.SlnExpiration,1),
	T1.Spanish,
	T1.Organic,
	T1.EsaNotice,
	T1.Section18,
	CONVERT(varchar,T1.Section18Expiration,1),
	max(case when T3.Code = 'WA' AND T2.I502 = 1 then 1 else 0 end) AS I502,
	max(case when T3.Code = 'WA' AND T2.Essb6206 = 1  then 1 else 0 end) AS Essb,
	max(case when T3.Code = 'WA' and T2.StateId = T11.StateId and T11.Id is not null then concat('http://cru66.cahe.wsu.edu/~picol/pdf/WA/', T1.Pid, '.pdf') else '' end) AS WashingtonDownload,
	max(case when T3.Code = 'OR' and T2.StateId = T11.StateId and T11.Id is not null then concat('http://cru66.cahe.wsu.edu/~picol/pdf/OR/', T1.Pid, '.pdf') else '' end) AS OregonDownload,
	COALESCE(cast(max(case when T3.Code = 'WA' then T2.Year else null end) as varchar(8)), '') AS [WashingtonRegistrationYear],
	COALESCE(cast(max(case when T3.Code = 'OR' then T2.Year else null end) as varchar(8)), '') AS [OregonRegistrationYear]
  FROM [Picol].[dbo].[Labels] T1
  left join [Picol].[dbo].StateRecords T2 on T1.Id = T2.LabelId
  left join [Picol].[dbo].States T3 on T2.StateId = T3.Id
  left join [Picol].[dbo].IntendedUsers T4 on T1.IntendedUserId = T4.Id
  left join [Picol].[dbo].IngredientLabelPairs T5 on T1.Id = T5.LabelId
  left join [Picol].[dbo].Ingredients T6 on T5.IngredientId = T6.Id
  left join [Picol].[dbo].Registrants T7 on T1.RegistrantId = T7.Id
  left join [Picol].[dbo].Formulations T8 on T1.FormulationId = T8.Id
  left join [Picol].[dbo].SignalWords T9 on T1.SignalWordId = T9.Id
  left join [Picol].[dbo].Usages T10 on T1.UsageId = T10.Id
  left join [Picol].[dbo].LabelFiles T11 on T1.Id = T11.LabelId
  GROUP BY T1.Id, T1.Name, T1.Epa, T1.EpaFieldOne, T1.EpaFieldTwo, T1.EpaFieldThree, T4.Name, T7.Name, 
  T1.Sln, T1.Supplemental, T8.Name, T9.Name, T10.Name, T1.SupplementalName, T1.SupplementalExpiration, T1.SlnName, 
  T1.SlnExpiration, T1.Spanish, T1.Organic, T1.EsaNotice, T1.Section18, T1.Section18Expiration
go

WITH LabelIngredients AS
(
     SELECT DISTINCT T1.LabelId,
		T1.IngredientId,
		T2.Name
FROM [Picol].[dbo].IngredientLabelPairs T1
left join [Picol].[dbo].Ingredients T2 on T1.IngredientId = T2.Id
),
CteIngredients AS
(
SELECT DISTINCT
     LabelId, Names = STUFF(
         (SELECT ';' + Name
          FROM LabelIngredients
          WHERE LabelId = a.LabelId --AND IngredientId = a.IngredientId
		  ORDER BY Name asc
          FOR XML PATH (''))
          , 1, 1, '')
FROM LabelIngredients AS a
--GROUP BY LabelId, IngredientId
)

UPDATE [Picol].[dbo].[LabelResults]
   SET [Ingredients] = Names
   FROM CteIngredients
 WHERE Id = LabelId
GO




WITH LabelIngredients AS
(
     SELECT DISTINCT T1.LabelId,
		T1.IngredientId,
		T2.Name,
		T3.Code
FROM [Picol].[dbo].IngredientLabelPairs T1
left join [Picol].[dbo].Ingredients T2 on T1.IngredientId = T2.Id
left join [Picol].[dbo].Resistances T3 on T2.ResistanceId = T3.Id AND T3.Id is not null
),
CteIngredients AS
(
SELECT DISTINCT
     LabelId, Codes = STUFF(
         (SELECT ';' + Code
          FROM LabelIngredients
          WHERE LabelId = a.LabelId AND Code <> ''
		  ORDER BY Name asc
          FOR XML PATH (''))
          , 1, 1, '')
FROM LabelIngredients AS a
--GROUP BY LabelId, IngredientId
)

UPDATE [Picol].[dbo].[LabelResults]
   SET ResistanceCode = COALESCE(Codes, '')
   FROM CteIngredients
 WHERE Id = LabelId
GO

WITH LabelIngredients AS
(
     SELECT DISTINCT T1.LabelId,
		T1.IngredientId,
		T2.Name,
		T3.Source
FROM [Picol].[dbo].IngredientLabelPairs T1
left join [Picol].[dbo].Ingredients T2 on T1.IngredientId = T2.Id
left join [Picol].[dbo].Resistances T3 on T2.ResistanceId = T3.Id AND T3.Id is not null
),
CteIngredients AS
(
SELECT DISTINCT
     LabelId, Sources = STUFF(
         (SELECT ';' + Source
          FROM LabelIngredients
          WHERE LabelId = a.LabelId AND Source <> ''
		  ORDER BY Name asc
          FOR XML PATH (''))
          , 1, 1, '')
FROM LabelIngredients AS a
--GROUP BY LabelId, IngredientId
)

UPDATE [Picol].[dbo].[LabelResults]
   SET ResistanceSource = COALESCE(Sources, '')
   FROM CteIngredients
 WHERE Id = LabelId
GO


WITH LabelIngredients AS
(
     SELECT DISTINCT T1.LabelId,
		T1.IngredientId,
		T2.Name,
		T1.Concentration
FROM [Picol].[dbo].IngredientLabelPairs T1
left join [Picol].[dbo].Ingredients T2 on T1.IngredientId = T2.Id
),
CteIngredients AS
(
SELECT DISTINCT
     LabelId, Concentrations = STUFF(
         (SELECT ';' + Concentration
          FROM LabelIngredients
          WHERE LabelId = a.LabelId AND Concentration <> ''
		  ORDER BY Name asc
          FOR XML PATH (''))
          , 1, 1, '')
FROM LabelIngredients AS a
--GROUP BY LabelId, IngredientId
)

UPDATE [Picol].[dbo].[LabelResults]
   SET Concentrations = COALESCE(A.Concentrations, '')
   FROM CteIngredients AS A
 WHERE Id = A.LabelId
GO



WITH LabelPesticideTypes AS
(
     SELECT DISTINCT T1.LabelId,
		T1.PesticideTypeId,
		T2.Name
FROM [Picol].[dbo].LabelPesticideTypePairs T1
left join [Picol].[dbo].PesticideTypes T2 on T1.PesticideTypeId = T2.Id
),
CtePesticideTypes AS
(
SELECT DISTINCT
     LabelId, Names = STUFF(
         (SELECT ';' + Name
          FROM LabelPesticideTypes
          WHERE LabelId = a.LabelId AND Name <> ''
		  ORDER BY Name asc
          FOR XML PATH (''))
          , 1, 1, '')
FROM LabelPesticideTypes AS a
--GROUP BY LabelId, IngredientId
)

UPDATE [Picol].[dbo].[LabelResults]
   SET [PesticideTypes] = COALESCE(Names, '')
   FROM CtePesticideTypes
 WHERE Id = LabelId
GO