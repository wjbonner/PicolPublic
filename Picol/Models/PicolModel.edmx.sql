
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 06/17/2019 12:55:08
-- Generated from EDMX file: C:\Users\bbonner\Source\Repos\PicolPublic\Picol\Models\PicolModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [Picol];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_ApiKeys_Users]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ApiKeys] DROP CONSTRAINT [FK_ApiKeys_Users];
GO
IF OBJECT_ID(N'[dbo].[FK_ApiKeys_Users_Approver]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ApiKeys] DROP CONSTRAINT [FK_ApiKeys_Users_Approver];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_ApplicationLabelPairs_Applications]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[ApplicationLabelPairs] DROP CONSTRAINT [FK_ApplicationLabelPairs_Applications];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_ApplicationLabelPairs_Labels]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[ApplicationLabelPairs] DROP CONSTRAINT [FK_ApplicationLabelPairs_Labels];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_CropGroupPairs_CropGroups]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[CropGroupPairs] DROP CONSTRAINT [FK_CropGroupPairs_CropGroups];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_CropGroupPairs_Crops]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[CropGroupPairs] DROP CONSTRAINT [FK_CropGroupPairs_Crops];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_IngredientLabelPairs_Ingredients]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[IngredientLabelPairs] DROP CONSTRAINT [FK_IngredientLabelPairs_Ingredients];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_IngredientLabelPairs_Labels]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[IngredientLabelPairs] DROP CONSTRAINT [FK_IngredientLabelPairs_Labels];
GO
IF OBJECT_ID(N'[dbo].[FK_Ingredients_Resistances]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Ingredients] DROP CONSTRAINT [FK_Ingredients_Resistances];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_LabelCropPestTriples_Crops]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[LabelCropPestTriples] DROP CONSTRAINT [FK_LabelCropPestTriples_Crops];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_LabelCropPestTriples_Labels]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[LabelCropPestTriples] DROP CONSTRAINT [FK_LabelCropPestTriples_Labels];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_LabelCropPestTriples_Pests]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[LabelCropPestTriples] DROP CONSTRAINT [FK_LabelCropPestTriples_Pests];
GO
IF OBJECT_ID(N'[dbo].[FK_LabelFiles_Labels]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[LabelFiles] DROP CONSTRAINT [FK_LabelFiles_Labels];
GO
IF OBJECT_ID(N'[dbo].[FK_LabelFiles_States]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[LabelFiles] DROP CONSTRAINT [FK_LabelFiles_States];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_LabelPesticideTypePairs_Labels]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[LabelPesticideTypePairs] DROP CONSTRAINT [FK_LabelPesticideTypePairs_Labels];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_LabelPesticideTypePairs_PesticideTypes]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[LabelPesticideTypePairs] DROP CONSTRAINT [FK_LabelPesticideTypePairs_PesticideTypes];
GO
IF OBJECT_ID(N'[dbo].[FK_Labels_Formulations]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Labels] DROP CONSTRAINT [FK_Labels_Formulations];
GO
IF OBJECT_ID(N'[dbo].[FK_Labels_IntendedUsers]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Labels] DROP CONSTRAINT [FK_Labels_IntendedUsers];
GO
IF OBJECT_ID(N'[dbo].[FK_Labels_Registrants]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Labels] DROP CONSTRAINT [FK_Labels_Registrants];
GO
IF OBJECT_ID(N'[dbo].[FK_Labels_SignalWords]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Labels] DROP CONSTRAINT [FK_Labels_SignalWords];
GO
IF OBJECT_ID(N'[dbo].[FK_Labels_Usages]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Labels] DROP CONSTRAINT [FK_Labels_Usages];
GO
IF OBJECT_ID(N'[dbo].[FK_Passwords_Users]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Passwords] DROP CONSTRAINT [FK_Passwords_Users];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_RegulationAuthorityUsagePairs_RegulationAuthorities]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[RegulationAuthorityUsagePairs] DROP CONSTRAINT [FK_RegulationAuthorityUsagePairs_RegulationAuthorities];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[FK_RegulationAuthorityUsagePairs_Usages]', 'F') IS NOT NULL
    ALTER TABLE [PicolModelStoreContainer].[RegulationAuthorityUsagePairs] DROP CONSTRAINT [FK_RegulationAuthorityUsagePairs_Usages];
GO
IF OBJECT_ID(N'[dbo].[FK_Searches_Users]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Searches] DROP CONSTRAINT [FK_Searches_Users];
GO
IF OBJECT_ID(N'[dbo].[FK_StateRecords_Labels]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[StateRecords] DROP CONSTRAINT [FK_StateRecords_Labels];
GO
IF OBJECT_ID(N'[dbo].[FK_StateRecords_States]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[StateRecords] DROP CONSTRAINT [FK_StateRecords_States];
GO
IF OBJECT_ID(N'[dbo].[FK_UserPreferences_Users]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[UserPreferences] DROP CONSTRAINT [FK_UserPreferences_Users];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[ApiKeys]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ApiKeys];
GO
IF OBJECT_ID(N'[dbo].[Applications]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Applications];
GO
IF OBJECT_ID(N'[dbo].[BinarySettings]', 'U') IS NOT NULL
    DROP TABLE [dbo].[BinarySettings];
GO
IF OBJECT_ID(N'[dbo].[CropGroups]', 'U') IS NOT NULL
    DROP TABLE [dbo].[CropGroups];
GO
IF OBJECT_ID(N'[dbo].[Crops]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Crops];
GO
IF OBJECT_ID(N'[dbo].[Formulations]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Formulations];
GO
IF OBJECT_ID(N'[dbo].[Ingredients]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Ingredients];
GO
IF OBJECT_ID(N'[dbo].[IntendedUsers]', 'U') IS NOT NULL
    DROP TABLE [dbo].[IntendedUsers];
GO
IF OBJECT_ID(N'[dbo].[LabelFiles]', 'U') IS NOT NULL
    DROP TABLE [dbo].[LabelFiles];
GO
IF OBJECT_ID(N'[dbo].[LabelResults]', 'U') IS NOT NULL
    DROP TABLE [dbo].[LabelResults];
GO
IF OBJECT_ID(N'[dbo].[Labels]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Labels];
GO
IF OBJECT_ID(N'[dbo].[Passwords]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Passwords];
GO
IF OBJECT_ID(N'[dbo].[PesticideTypes]', 'U') IS NOT NULL
    DROP TABLE [dbo].[PesticideTypes];
GO
IF OBJECT_ID(N'[dbo].[Pests]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Pests];
GO
IF OBJECT_ID(N'[dbo].[Registrants]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Registrants];
GO
IF OBJECT_ID(N'[dbo].[RegulationAuthorities]', 'U') IS NOT NULL
    DROP TABLE [dbo].[RegulationAuthorities];
GO
IF OBJECT_ID(N'[dbo].[Resistances]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Resistances];
GO
IF OBJECT_ID(N'[dbo].[Searches]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Searches];
GO
IF OBJECT_ID(N'[dbo].[Settings]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Settings];
GO
IF OBJECT_ID(N'[dbo].[SignalWords]', 'U') IS NOT NULL
    DROP TABLE [dbo].[SignalWords];
GO
IF OBJECT_ID(N'[dbo].[StateRecords]', 'U') IS NOT NULL
    DROP TABLE [dbo].[StateRecords];
GO
IF OBJECT_ID(N'[dbo].[States]', 'U') IS NOT NULL
    DROP TABLE [dbo].[States];
GO
IF OBJECT_ID(N'[dbo].[UploadedFiles]', 'U') IS NOT NULL
    DROP TABLE [dbo].[UploadedFiles];
GO
IF OBJECT_ID(N'[dbo].[Usages]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Usages];
GO
IF OBJECT_ID(N'[dbo].[UserPreferences]', 'U') IS NOT NULL
    DROP TABLE [dbo].[UserPreferences];
GO
IF OBJECT_ID(N'[dbo].[Users]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Users];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[ApplicationLabelPairs]', 'U') IS NOT NULL
    DROP TABLE [PicolModelStoreContainer].[ApplicationLabelPairs];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[CropGroupPairs]', 'U') IS NOT NULL
    DROP TABLE [PicolModelStoreContainer].[CropGroupPairs];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[IngredientLabelPairs]', 'U') IS NOT NULL
    DROP TABLE [PicolModelStoreContainer].[IngredientLabelPairs];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[LabelCropPestTriples]', 'U') IS NOT NULL
    DROP TABLE [PicolModelStoreContainer].[LabelCropPestTriples];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[LabelPesticideTypePairs]', 'U') IS NOT NULL
    DROP TABLE [PicolModelStoreContainer].[LabelPesticideTypePairs];
GO
IF OBJECT_ID(N'[PicolModelStoreContainer].[RegulationAuthorityUsagePairs]', 'U') IS NOT NULL
    DROP TABLE [PicolModelStoreContainer].[RegulationAuthorityUsagePairs];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Applications'
CREATE TABLE [dbo].[Applications] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Code] char(1)  NOT NULL,
    [Name] varchar(32)  NOT NULL
);
GO

-- Creating table 'Crops'
CREATE TABLE [dbo].[Crops] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Code] varchar(16)  NOT NULL,
    [Name] varchar(128)  NOT NULL,
    [Notes] varchar(256)  NOT NULL
);
GO

-- Creating table 'Formulations'
CREATE TABLE [dbo].[Formulations] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Code] varchar(8)  NOT NULL,
    [Name] varchar(64)  NOT NULL,
    [Notes] varchar(256)  NOT NULL
);
GO

-- Creating table 'Ingredients'
CREATE TABLE [dbo].[Ingredients] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [ResistanceId] int  NOT NULL,
    [Code] varchar(12)  NOT NULL,
    [Name] varchar(85)  NOT NULL,
    [Notes] varchar(200)  NOT NULL,
    [ManagementCode] varchar(10)  NULL
);
GO

-- Creating table 'IntendedUsers'
CREATE TABLE [dbo].[IntendedUsers] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Code] varchar(8)  NOT NULL,
    [Name] varchar(64)  NOT NULL
);
GO

-- Creating table 'Passwords'
CREATE TABLE [dbo].[Passwords] (
    [UserId] int  NOT NULL,
    [Hash] varchar(2048)  NOT NULL,
    [LastSet] datetime  NOT NULL
);
GO

-- Creating table 'Pests'
CREATE TABLE [dbo].[Pests] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Code] varchar(16)  NOT NULL,
    [Name] varchar(128)  NOT NULL,
    [Notes] varchar(256)  NOT NULL
);
GO

-- Creating table 'Registrants'
CREATE TABLE [dbo].[Registrants] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Code] varchar(8)  NOT NULL,
    [Name] varchar(128)  NOT NULL,
    [AddressOne] varchar(128)  NOT NULL,
    [AddressTwo] varchar(128)  NOT NULL,
    [City] varchar(64)  NOT NULL,
    [State] varchar(32)  NOT NULL,
    [Zip] varchar(16)  NOT NULL,
    [Country] varchar(16)  NULL,
    [Foreign] smallint  NOT NULL,
    [Contact] varchar(64)  NOT NULL,
    [Phone] varchar(32)  NOT NULL,
    [EmergencyPhone] varchar(32)  NOT NULL,
    [Email] varchar(64)  NOT NULL,
    [Url] varchar(128)  NOT NULL,
    [Notes] varchar(256)  NOT NULL,
    [Tier] int  NOT NULL
);
GO

-- Creating table 'Resistances'
CREATE TABLE [dbo].[Resistances] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Source] varchar(8)  NULL,
    [Code] varchar(8)  NULL,
    [MethodOfAction] varchar(128)  NULL,
    [Rid] int  NULL
);
GO

-- Creating table 'SignalWords'
CREATE TABLE [dbo].[SignalWords] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Code] varchar(8)  NOT NULL,
    [Name] varchar(64)  NOT NULL
);
GO

-- Creating table 'Users'
CREATE TABLE [dbo].[Users] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Logon] varchar(64)  NOT NULL,
    [FirstName] varchar(64)  NULL,
    [LastName] varchar(64)  NULL,
    [Email] varchar(128)  NOT NULL,
    [Verified] bit  NOT NULL,
    [Active] bit  NOT NULL,
    [Admin] bit  NOT NULL,
    [LastLogin] datetime  NOT NULL
);
GO

-- Creating table 'IngredientLabelPairs'
CREATE TABLE [dbo].[IngredientLabelPairs] (
    [LabelId] int  NOT NULL,
    [IngredientId] int  NOT NULL,
    [Concentration] varchar(32)  NOT NULL
);
GO

-- Creating table 'LabelCropPestTriples'
CREATE TABLE [dbo].[LabelCropPestTriples] (
    [LabelId] int  NOT NULL,
    [CropId] int  NOT NULL,
    [PestId] int  NOT NULL
);
GO

-- Creating table 'Usages'
CREATE TABLE [dbo].[Usages] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Code] varchar(8)  NOT NULL,
    [Name] varchar(64)  NOT NULL
);
GO

-- Creating table 'RegulationAuthorities'
CREATE TABLE [dbo].[RegulationAuthorities] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] varchar(128)  NOT NULL,
    [Description] varchar(128)  NOT NULL
);
GO

-- Creating table 'CropGroups'
CREATE TABLE [dbo].[CropGroups] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] varchar(128)  NOT NULL
);
GO

-- Creating table 'States'
CREATE TABLE [dbo].[States] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] varchar(32)  NOT NULL,
    [Code] varchar(4)  NOT NULL
);
GO

-- Creating table 'UploadedFiles'
CREATE TABLE [dbo].[UploadedFiles] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] varchar(128)  NOT NULL,
    [Extension] varchar(8)  NOT NULL,
    [Data] varbinary(max)  NOT NULL,
    [Revisions] int  NOT NULL,
    [Cancellations] int  NOT NULL,
    [Reviewed] bit  NOT NULL,
    [Transit] bit  NOT NULL,
    [Updated] datetime  NOT NULL,
    [Created] datetime  NOT NULL
);
GO

-- Creating table 'PesticideTypes'
CREATE TABLE [dbo].[PesticideTypes] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Code] varchar(8)  NOT NULL,
    [Name] varchar(64)  NOT NULL,
    [Prefix] varchar(8)  NULL
);
GO

-- Creating table 'StateRecords'
CREATE TABLE [dbo].[StateRecords] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [StateId] int  NOT NULL,
    [LabelId] int  NOT NULL,
    [AgencyId] varchar(128)  NOT NULL,
    [Version] varchar(32)  NOT NULL,
    [Year] int  NOT NULL,
    [Pdf] datetime  NOT NULL,
    [I502] bit  NOT NULL,
    [Essb6206] bit  NOT NULL
);
GO

-- Creating table 'LabelFiles'
CREATE TABLE [dbo].[LabelFiles] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [LabelId] int  NOT NULL,
    [StateId] int  NOT NULL,
    [Name] varchar(128)  NOT NULL,
    [Extension] varchar(8)  NOT NULL,
    [Data] varbinary(max)  NOT NULL
);
GO

-- Creating table 'Labels'
CREATE TABLE [dbo].[Labels] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Pid] int  NULL,
    [FormulationId] int  NULL,
    [IntendedUserId] int  NULL,
    [RegistrantId] int  NULL,
    [SignalWordId] int  NULL,
    [UsageId] int  NULL,
    [Name] varchar(85)  NULL,
    [Supplemental] varchar(20)  NULL,
    [SupplementalName] varchar(150)  NULL,
    [SupplementalExpiration] datetime  NULL,
    [Epa] varchar(20)  NULL,
    [Sln] varchar(20)  NULL,
    [SlnName] varchar(150)  NULL,
    [SlnExpiration] datetime  NULL,
    [Ground] bit  NULL,
    [EpaFieldOne] int  NULL,
    [EpaFieldTwo] int  NULL,
    [EpaFieldThree] int  NULL,
    [Spanish] bit  NULL,
    [Organic] bit  NULL,
    [MasterLabel] varchar(5)  NULL,
    [EsaNotice] bit  NULL,
    [Section18] varchar(50)  NULL,
    [Section18Expiration] datetime  NULL,
    [AlsInhib] varchar(3)  NULL,
    [Created] datetime  NULL,
    [Updated] datetime  NULL,
    [Processed] bit  NULL,
    [Active] bit  NULL
);
GO

-- Creating table 'UserPreferences'
CREATE TABLE [dbo].[UserPreferences] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [UserId] int  NOT NULL,
    [Name] varchar(64)  NOT NULL,
    [Value] varchar(max)  NOT NULL
);
GO

-- Creating table 'Settings'
CREATE TABLE [dbo].[Settings] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] varchar(32)  NOT NULL,
    [Value] varchar(max)  NOT NULL
);
GO

-- Creating table 'ApiKeys'
CREATE TABLE [dbo].[ApiKeys] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [UserId] int  NOT NULL,
    [Name] varchar(64)  NOT NULL,
    [Value] varchar(128)  NOT NULL,
    [TermsOfService] varchar(max)  NOT NULL,
    [DateAccepted] datetime  NOT NULL,
    [ProposedUse] varchar(max)  NOT NULL,
    [Approved] bit  NOT NULL,
    [ApprovedBy] int  NULL,
    [ApprovalDate] datetime  NULL,
    [Active] bit  NOT NULL,
    [Notes] varchar(512)  NOT NULL
);
GO

-- Creating table 'BinarySettings'
CREATE TABLE [dbo].[BinarySettings] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] varchar(64)  NOT NULL,
    [Value] varbinary(max)  NOT NULL,
    [Public] bit  NOT NULL,
    [Extension] varchar(8)  NOT NULL,
    [Manageable] bit  NOT NULL
);
GO

-- Creating table 'LabelResults'
CREATE TABLE [dbo].[LabelResults] (
    [Id] int  NOT NULL,
    [Name] varchar(128)  NULL,
    [WsdaLineNum] varchar(64)  NULL,
    [OrPid] varchar(64)  NULL,
    [CurrentlyRegisteredWashington] bit  NULL,
    [CurrentlyRegisteredOregon] bit  NULL,
    [Epa] varchar(32)  NULL,
    [EpaOne] varchar(32)  NULL,
    [EpaTwo] varchar(32)  NULL,
    [EpaThree] varchar(32)  NULL,
    [IntendedUser] varchar(32)  NULL,
    [Ingredients] varchar(512)  NULL,
    [ResistanceCode] varchar(512)  NULL,
    [ResistanceSource] varchar(512)  NULL,
    [Concentrations] varchar(512)  NULL,
    [PesticideTypes] varchar(128)  NULL,
    [RegistrantName] varchar(128)  NULL,
    [Sln] varchar(192)  NULL,
    [Supplemental] varchar(64)  NULL,
    [Formulation] varchar(64)  NULL,
    [SignalWord] varchar(64)  NULL,
    [Usage] varchar(64)  NULL,
    [SupplementalName] varchar(192)  NULL,
    [SupplementalExpiration] varchar(64)  NULL,
    [SlnName] varchar(192)  NULL,
    [SlnExpiration] varchar(64)  NULL,
    [Spanish] bit  NULL,
    [Organic] bit  NULL,
    [EsaNotice] bit  NULL,
    [Section18] varchar(64)  NULL,
    [Section18Expiration] varchar(64)  NULL,
    [I502] bit  NULL,
    [Essb] bit  NULL,
    [WashingtonDownload] varchar(128)  NULL,
    [OregonDownload] varchar(128)  NULL,
    [WashingtonRegistrationYear] varchar(8)  NULL,
    [OregonRegistrationYear] varchar(8)  NULL
);
GO

-- Creating table 'Searches'
CREATE TABLE [dbo].[Searches] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [UserId] int  NOT NULL,
    [Name] varchar(128)  NOT NULL,
    [Parameters] varchar(max)  NOT NULL,
    [Path] varchar(32)  NOT NULL
);
GO

-- Creating table 'RegulationAuthorityUsagePairs'
CREATE TABLE [dbo].[RegulationAuthorityUsagePairs] (
    [RegulationAuthorities_Id] int  NOT NULL,
    [Usages_Id] int  NOT NULL
);
GO

-- Creating table 'CropGroupPairs'
CREATE TABLE [dbo].[CropGroupPairs] (
    [CropGroups_Id] int  NOT NULL,
    [Crops_Id] int  NOT NULL
);
GO

-- Creating table 'ApplicationLabelPairs'
CREATE TABLE [dbo].[ApplicationLabelPairs] (
    [Applications_Id] int  NOT NULL,
    [Labels_Id] int  NOT NULL
);
GO

-- Creating table 'LabelPesticideTypePairs'
CREATE TABLE [dbo].[LabelPesticideTypePairs] (
    [Labels_Id] int  NOT NULL,
    [PesticideTypes_Id] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Applications'
ALTER TABLE [dbo].[Applications]
ADD CONSTRAINT [PK_Applications]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Crops'
ALTER TABLE [dbo].[Crops]
ADD CONSTRAINT [PK_Crops]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Formulations'
ALTER TABLE [dbo].[Formulations]
ADD CONSTRAINT [PK_Formulations]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Ingredients'
ALTER TABLE [dbo].[Ingredients]
ADD CONSTRAINT [PK_Ingredients]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'IntendedUsers'
ALTER TABLE [dbo].[IntendedUsers]
ADD CONSTRAINT [PK_IntendedUsers]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [UserId] in table 'Passwords'
ALTER TABLE [dbo].[Passwords]
ADD CONSTRAINT [PK_Passwords]
    PRIMARY KEY CLUSTERED ([UserId] ASC);
GO

-- Creating primary key on [Id] in table 'Pests'
ALTER TABLE [dbo].[Pests]
ADD CONSTRAINT [PK_Pests]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Registrants'
ALTER TABLE [dbo].[Registrants]
ADD CONSTRAINT [PK_Registrants]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Resistances'
ALTER TABLE [dbo].[Resistances]
ADD CONSTRAINT [PK_Resistances]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'SignalWords'
ALTER TABLE [dbo].[SignalWords]
ADD CONSTRAINT [PK_SignalWords]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Users'
ALTER TABLE [dbo].[Users]
ADD CONSTRAINT [PK_Users]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [LabelId], [IngredientId], [Concentration] in table 'IngredientLabelPairs'
ALTER TABLE [dbo].[IngredientLabelPairs]
ADD CONSTRAINT [PK_IngredientLabelPairs]
    PRIMARY KEY CLUSTERED ([LabelId], [IngredientId], [Concentration] ASC);
GO

-- Creating primary key on [LabelId], [CropId], [PestId] in table 'LabelCropPestTriples'
ALTER TABLE [dbo].[LabelCropPestTriples]
ADD CONSTRAINT [PK_LabelCropPestTriples]
    PRIMARY KEY CLUSTERED ([LabelId], [CropId], [PestId] ASC);
GO

-- Creating primary key on [Id] in table 'Usages'
ALTER TABLE [dbo].[Usages]
ADD CONSTRAINT [PK_Usages]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'RegulationAuthorities'
ALTER TABLE [dbo].[RegulationAuthorities]
ADD CONSTRAINT [PK_RegulationAuthorities]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'CropGroups'
ALTER TABLE [dbo].[CropGroups]
ADD CONSTRAINT [PK_CropGroups]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'States'
ALTER TABLE [dbo].[States]
ADD CONSTRAINT [PK_States]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'UploadedFiles'
ALTER TABLE [dbo].[UploadedFiles]
ADD CONSTRAINT [PK_UploadedFiles]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'PesticideTypes'
ALTER TABLE [dbo].[PesticideTypes]
ADD CONSTRAINT [PK_PesticideTypes]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'StateRecords'
ALTER TABLE [dbo].[StateRecords]
ADD CONSTRAINT [PK_StateRecords]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'LabelFiles'
ALTER TABLE [dbo].[LabelFiles]
ADD CONSTRAINT [PK_LabelFiles]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Labels'
ALTER TABLE [dbo].[Labels]
ADD CONSTRAINT [PK_Labels]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'UserPreferences'
ALTER TABLE [dbo].[UserPreferences]
ADD CONSTRAINT [PK_UserPreferences]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Settings'
ALTER TABLE [dbo].[Settings]
ADD CONSTRAINT [PK_Settings]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ApiKeys'
ALTER TABLE [dbo].[ApiKeys]
ADD CONSTRAINT [PK_ApiKeys]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'BinarySettings'
ALTER TABLE [dbo].[BinarySettings]
ADD CONSTRAINT [PK_BinarySettings]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'LabelResults'
ALTER TABLE [dbo].[LabelResults]
ADD CONSTRAINT [PK_LabelResults]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Searches'
ALTER TABLE [dbo].[Searches]
ADD CONSTRAINT [PK_Searches]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [RegulationAuthorities_Id], [Usages_Id] in table 'RegulationAuthorityUsagePairs'
ALTER TABLE [dbo].[RegulationAuthorityUsagePairs]
ADD CONSTRAINT [PK_RegulationAuthorityUsagePairs]
    PRIMARY KEY CLUSTERED ([RegulationAuthorities_Id], [Usages_Id] ASC);
GO

-- Creating primary key on [CropGroups_Id], [Crops_Id] in table 'CropGroupPairs'
ALTER TABLE [dbo].[CropGroupPairs]
ADD CONSTRAINT [PK_CropGroupPairs]
    PRIMARY KEY CLUSTERED ([CropGroups_Id], [Crops_Id] ASC);
GO

-- Creating primary key on [Applications_Id], [Labels_Id] in table 'ApplicationLabelPairs'
ALTER TABLE [dbo].[ApplicationLabelPairs]
ADD CONSTRAINT [PK_ApplicationLabelPairs]
    PRIMARY KEY CLUSTERED ([Applications_Id], [Labels_Id] ASC);
GO

-- Creating primary key on [Labels_Id], [PesticideTypes_Id] in table 'LabelPesticideTypePairs'
ALTER TABLE [dbo].[LabelPesticideTypePairs]
ADD CONSTRAINT [PK_LabelPesticideTypePairs]
    PRIMARY KEY CLUSTERED ([Labels_Id], [PesticideTypes_Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [CropId] in table 'LabelCropPestTriples'
ALTER TABLE [dbo].[LabelCropPestTriples]
ADD CONSTRAINT [FK_LabelCropPestTriples_Crops]
    FOREIGN KEY ([CropId])
    REFERENCES [dbo].[Crops]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_LabelCropPestTriples_Crops'
CREATE INDEX [IX_FK_LabelCropPestTriples_Crops]
ON [dbo].[LabelCropPestTriples]
    ([CropId]);
GO

-- Creating foreign key on [IngredientId] in table 'IngredientLabelPairs'
ALTER TABLE [dbo].[IngredientLabelPairs]
ADD CONSTRAINT [FK_IngredientLabelPairs_Ingredients]
    FOREIGN KEY ([IngredientId])
    REFERENCES [dbo].[Ingredients]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_IngredientLabelPairs_Ingredients'
CREATE INDEX [IX_FK_IngredientLabelPairs_Ingredients]
ON [dbo].[IngredientLabelPairs]
    ([IngredientId]);
GO

-- Creating foreign key on [ResistanceId] in table 'Ingredients'
ALTER TABLE [dbo].[Ingredients]
ADD CONSTRAINT [FK_Ingredients_Resistances]
    FOREIGN KEY ([ResistanceId])
    REFERENCES [dbo].[Resistances]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Ingredients_Resistances'
CREATE INDEX [IX_FK_Ingredients_Resistances]
ON [dbo].[Ingredients]
    ([ResistanceId]);
GO

-- Creating foreign key on [UserId] in table 'Passwords'
ALTER TABLE [dbo].[Passwords]
ADD CONSTRAINT [FK_Passwords_Users]
    FOREIGN KEY ([UserId])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [PestId] in table 'LabelCropPestTriples'
ALTER TABLE [dbo].[LabelCropPestTriples]
ADD CONSTRAINT [FK_LabelCropPestTriples_Pests]
    FOREIGN KEY ([PestId])
    REFERENCES [dbo].[Pests]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_LabelCropPestTriples_Pests'
CREATE INDEX [IX_FK_LabelCropPestTriples_Pests]
ON [dbo].[LabelCropPestTriples]
    ([PestId]);
GO

-- Creating foreign key on [RegulationAuthorities_Id] in table 'RegulationAuthorityUsagePairs'
ALTER TABLE [dbo].[RegulationAuthorityUsagePairs]
ADD CONSTRAINT [FK_RegulationAuthorityUsagePairs_RegulationAuthority]
    FOREIGN KEY ([RegulationAuthorities_Id])
    REFERENCES [dbo].[RegulationAuthorities]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Usages_Id] in table 'RegulationAuthorityUsagePairs'
ALTER TABLE [dbo].[RegulationAuthorityUsagePairs]
ADD CONSTRAINT [FK_RegulationAuthorityUsagePairs_Usage]
    FOREIGN KEY ([Usages_Id])
    REFERENCES [dbo].[Usages]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_RegulationAuthorityUsagePairs_Usage'
CREATE INDEX [IX_FK_RegulationAuthorityUsagePairs_Usage]
ON [dbo].[RegulationAuthorityUsagePairs]
    ([Usages_Id]);
GO

-- Creating foreign key on [CropGroups_Id] in table 'CropGroupPairs'
ALTER TABLE [dbo].[CropGroupPairs]
ADD CONSTRAINT [FK_CropGroupPairs_CropGroup]
    FOREIGN KEY ([CropGroups_Id])
    REFERENCES [dbo].[CropGroups]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Crops_Id] in table 'CropGroupPairs'
ALTER TABLE [dbo].[CropGroupPairs]
ADD CONSTRAINT [FK_CropGroupPairs_Crop]
    FOREIGN KEY ([Crops_Id])
    REFERENCES [dbo].[Crops]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_CropGroupPairs_Crop'
CREATE INDEX [IX_FK_CropGroupPairs_Crop]
ON [dbo].[CropGroupPairs]
    ([Crops_Id]);
GO

-- Creating foreign key on [StateId] in table 'StateRecords'
ALTER TABLE [dbo].[StateRecords]
ADD CONSTRAINT [FK_StateRecords_States]
    FOREIGN KEY ([StateId])
    REFERENCES [dbo].[States]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_StateRecords_States'
CREATE INDEX [IX_FK_StateRecords_States]
ON [dbo].[StateRecords]
    ([StateId]);
GO

-- Creating foreign key on [StateId] in table 'LabelFiles'
ALTER TABLE [dbo].[LabelFiles]
ADD CONSTRAINT [FK_LabelFiles_States]
    FOREIGN KEY ([StateId])
    REFERENCES [dbo].[States]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_LabelFiles_States'
CREATE INDEX [IX_FK_LabelFiles_States]
ON [dbo].[LabelFiles]
    ([StateId]);
GO

-- Creating foreign key on [FormulationId] in table 'Labels'
ALTER TABLE [dbo].[Labels]
ADD CONSTRAINT [FK_Labels_Formulations]
    FOREIGN KEY ([FormulationId])
    REFERENCES [dbo].[Formulations]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Labels_Formulations'
CREATE INDEX [IX_FK_Labels_Formulations]
ON [dbo].[Labels]
    ([FormulationId]);
GO

-- Creating foreign key on [IntendedUserId] in table 'Labels'
ALTER TABLE [dbo].[Labels]
ADD CONSTRAINT [FK_Labels_IntendedUsers]
    FOREIGN KEY ([IntendedUserId])
    REFERENCES [dbo].[IntendedUsers]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Labels_IntendedUsers'
CREATE INDEX [IX_FK_Labels_IntendedUsers]
ON [dbo].[Labels]
    ([IntendedUserId]);
GO

-- Creating foreign key on [LabelId] in table 'LabelFiles'
ALTER TABLE [dbo].[LabelFiles]
ADD CONSTRAINT [FK_LabelFiles_Labels]
    FOREIGN KEY ([LabelId])
    REFERENCES [dbo].[Labels]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_LabelFiles_Labels'
CREATE INDEX [IX_FK_LabelFiles_Labels]
ON [dbo].[LabelFiles]
    ([LabelId]);
GO

-- Creating foreign key on [LabelId] in table 'IngredientLabelPairs'
ALTER TABLE [dbo].[IngredientLabelPairs]
ADD CONSTRAINT [FK_IngredientLabelPairs_Labels]
    FOREIGN KEY ([LabelId])
    REFERENCES [dbo].[Labels]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [LabelId] in table 'LabelCropPestTriples'
ALTER TABLE [dbo].[LabelCropPestTriples]
ADD CONSTRAINT [FK_LabelCropPestTriples_Labels]
    FOREIGN KEY ([LabelId])
    REFERENCES [dbo].[Labels]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [RegistrantId] in table 'Labels'
ALTER TABLE [dbo].[Labels]
ADD CONSTRAINT [FK_Labels_Registrants]
    FOREIGN KEY ([RegistrantId])
    REFERENCES [dbo].[Registrants]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Labels_Registrants'
CREATE INDEX [IX_FK_Labels_Registrants]
ON [dbo].[Labels]
    ([RegistrantId]);
GO

-- Creating foreign key on [SignalWordId] in table 'Labels'
ALTER TABLE [dbo].[Labels]
ADD CONSTRAINT [FK_Labels_SignalWords]
    FOREIGN KEY ([SignalWordId])
    REFERENCES [dbo].[SignalWords]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Labels_SignalWords'
CREATE INDEX [IX_FK_Labels_SignalWords]
ON [dbo].[Labels]
    ([SignalWordId]);
GO

-- Creating foreign key on [UsageId] in table 'Labels'
ALTER TABLE [dbo].[Labels]
ADD CONSTRAINT [FK_Labels_Usages]
    FOREIGN KEY ([UsageId])
    REFERENCES [dbo].[Usages]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Labels_Usages'
CREATE INDEX [IX_FK_Labels_Usages]
ON [dbo].[Labels]
    ([UsageId]);
GO

-- Creating foreign key on [LabelId] in table 'StateRecords'
ALTER TABLE [dbo].[StateRecords]
ADD CONSTRAINT [FK_StateRecords_Labels]
    FOREIGN KEY ([LabelId])
    REFERENCES [dbo].[Labels]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_StateRecords_Labels'
CREATE INDEX [IX_FK_StateRecords_Labels]
ON [dbo].[StateRecords]
    ([LabelId]);
GO

-- Creating foreign key on [Applications_Id] in table 'ApplicationLabelPairs'
ALTER TABLE [dbo].[ApplicationLabelPairs]
ADD CONSTRAINT [FK_ApplicationLabelPairs_Application]
    FOREIGN KEY ([Applications_Id])
    REFERENCES [dbo].[Applications]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Labels_Id] in table 'ApplicationLabelPairs'
ALTER TABLE [dbo].[ApplicationLabelPairs]
ADD CONSTRAINT [FK_ApplicationLabelPairs_Label]
    FOREIGN KEY ([Labels_Id])
    REFERENCES [dbo].[Labels]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ApplicationLabelPairs_Label'
CREATE INDEX [IX_FK_ApplicationLabelPairs_Label]
ON [dbo].[ApplicationLabelPairs]
    ([Labels_Id]);
GO

-- Creating foreign key on [Labels_Id] in table 'LabelPesticideTypePairs'
ALTER TABLE [dbo].[LabelPesticideTypePairs]
ADD CONSTRAINT [FK_LabelPesticideTypePairs_Label]
    FOREIGN KEY ([Labels_Id])
    REFERENCES [dbo].[Labels]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [PesticideTypes_Id] in table 'LabelPesticideTypePairs'
ALTER TABLE [dbo].[LabelPesticideTypePairs]
ADD CONSTRAINT [FK_LabelPesticideTypePairs_PesticideType]
    FOREIGN KEY ([PesticideTypes_Id])
    REFERENCES [dbo].[PesticideTypes]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_LabelPesticideTypePairs_PesticideType'
CREATE INDEX [IX_FK_LabelPesticideTypePairs_PesticideType]
ON [dbo].[LabelPesticideTypePairs]
    ([PesticideTypes_Id]);
GO

-- Creating foreign key on [UserId] in table 'UserPreferences'
ALTER TABLE [dbo].[UserPreferences]
ADD CONSTRAINT [FK_UserPreferences_Users]
    FOREIGN KEY ([UserId])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_UserPreferences_Users'
CREATE INDEX [IX_FK_UserPreferences_Users]
ON [dbo].[UserPreferences]
    ([UserId]);
GO

-- Creating foreign key on [UserId] in table 'ApiKeys'
ALTER TABLE [dbo].[ApiKeys]
ADD CONSTRAINT [FK_ApiKeys_Users]
    FOREIGN KEY ([UserId])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ApiKeys_Users'
CREATE INDEX [IX_FK_ApiKeys_Users]
ON [dbo].[ApiKeys]
    ([UserId]);
GO

-- Creating foreign key on [ApprovedBy] in table 'ApiKeys'
ALTER TABLE [dbo].[ApiKeys]
ADD CONSTRAINT [FK_ApiKeys_Users_Approver]
    FOREIGN KEY ([ApprovedBy])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ApiKeys_Users_Approver'
CREATE INDEX [IX_FK_ApiKeys_Users_Approver]
ON [dbo].[ApiKeys]
    ([ApprovedBy]);
GO

-- Creating foreign key on [UserId] in table 'Searches'
ALTER TABLE [dbo].[Searches]
ADD CONSTRAINT [FK_Searches_Users]
    FOREIGN KEY ([UserId])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Searches_Users'
CREATE INDEX [IX_FK_Searches_Users]
ON [dbo].[Searches]
    ([UserId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------