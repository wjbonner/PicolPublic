# PicolPublic
The Pesticide Information Center OnLine (PICOL) Database is a free, searchable database is operated by Washington State University through funding provided from the Washington State Department of Agriculture, the Oregon Department of Agriculture, Oregon State University, and WSU.  You can find the WSU run version of this site at https://picol.cahnrs.wsu.edu.

# License
Creative Commons License
PICOL by [Washington State University Extension](https://extension.wsu.edu) is licensed under a Creative Commons Attribution 4.0 International License.
Permissions beyond the scope of this license may be available at https://it.cahnrs.wsu.edu.

# Instructions
1. Install [MSSQL Express 2017](https://www.microsoft.com/en-us/sql-server/sql-server-editions-express) and [SSMS](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017).  Install using a default instance, and with AD authentication enabled (be sure that your local account is given access during setup).  NOTE:  You can also use an existing database server by specifying specific connection string information in a later step.

2. Install [Visual Studio Community](https://visualstudio.microsoft.com/downloads/) and include the web development packages during installation.  

NOTE: VS 2019 Community currently has a bug that excludes the "EntityFramework.SqlServerCompact.dll" from "C:\Program Files (x86)\Microsoft Visual Studio\2019\Professional\Common7\IDE" during install.  You can copy and paste this DLL to the directory from previous versions of VS Community by installing VS 2017 Community, and only install the module "Entity Framework 6 tools".

3. Clone the repository and open in VS.

4. Expand the "Models" folder in the solution explorer and double click "PicolModel".

5. Right click in the free space of the visual data model and click "Generate Database from Model"

6. In the wizard, select "New Connection" and specify the localhost MSSQL instance you installed (or use your own server).

7. Follow the rest of the wizard to generate the database.

8. Connect to your database using MSSQL Management Studio, and run the MSSQL script for [Elmah](https://elmah.github.io/downloads/#current-releases) against the database you created.

9. In the database table "Users" add in a record using your email address.

10. Go to Tools->NuGet Package Manager->Manage NuGet Packages for Solution.  Along the top of the package manager window will be a yellow bar asking if you want to restore missing packages.  Click "Restore" and let the packages install.

11. Build your application and start without debugging.

12. Navigate to the login page, and go through the account recovery process for the user account you inserted.
