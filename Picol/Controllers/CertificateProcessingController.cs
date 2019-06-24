// -----------------------------------------------------------------------
// <copyright file="CertificateProcessingController.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Web;
    using System.Web.Configuration;
    using System.Web.Mvc;
    using Elmah;
    using iTextSharp.text.pdf;
    using iTextSharp.text.pdf.parser;
    using Picol.Classes;
    using Picol.Classes.Uploads;
    using Picol.Decorators;
    using Picol.Models;

    /// <summary>Controller for administrative actions</summary>
    [WsuAuthenticate(Order = 1)]
    [AdminAuthorize(Order = 2)]
    [History(Order = 3)]
    public class CertificateProcessingController : Controller
    {
        /// <summary>Uploadeds this instance.</summary>
        /// <returns>A base view object</returns>
        public ActionResult Uploaded()
        {
            try
            {
                this.ViewBag.SelectedLink = "CertificateProcessing.Uploaded";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the uploads.</summary>
        /// <returns>A JSON encoded collection of uploaded files</returns>
        public JsonResult GetUploaded()
        {
            try
            {
                var farmContext = new PicolEntities();
                var washingtonFiles = new List<Certificate>();

                string path = this.Server.MapPath("../Files/Washington");
                List<string> files = Directory.GetFiles(path).ToList();

                foreach (var f in files)
                {
                    var nameParts = f.Split('\\').Last().Split('_');
                    Certificate file = new Certificate();
                    file.Format = nameParts.Count() == 4;

                    if (file.Format)
                    {
                        file.Name = nameParts[0];
                        file.Code = nameParts[1].PadLeft(5, '0');
                        file.Date = nameParts[2];
                        file.ThirdParty = nameParts[3].Contains("Wagn") ? true : false;

                        if (file.Code == "Corres")
                        {
                            continue;
                        }

                        int n;
                        if (!int.TryParse(file.Code, out n))
                        {
                            file.Format = false;
                        }

                        bool matching = (from l in farmContext.Registrants
                                         where l.Code == file.Code
                                         select l).Count() == 1;

                        file.Match = matching;
                        file.FileName = f.Split('\\').Last();
                        washingtonFiles.Add(file);
                    }
                }

                return new JsonNetResult { Data = new { Error = false, Certificates = washingtonFiles.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the labels." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Reviews the specified code.</summary>
        /// <param name="code">The code.</param>
        /// <param name="fileName">Name of the file.</param>
        /// <returns>A base view object</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2202:Do not dispose objects multiple times", Justification = "Unavoidable with nested using statements and stream - http://stackoverflow.com/a/3839419")]
        public ActionResult Review(string code, string fileName)
        {
            try
            {
                this.ViewBag.SelectedLink = "CertificateProcessing.Uploaded";
                var farmContext = new PicolEntities();
                var states = from r in farmContext.States
                             select new
                             {
                                 Id = r.Id,
                                 Name = r.Name
                             };

                this.ViewBag.States = new SelectList(states, "Id", "Name", states.First());

                int year = Convert.ToInt32((from r in farmContext.Settings
                               where r.Name == "RegistrationYear"
                               select r.Value).First());

                Dictionary<string, string> years = new Dictionary<string, string>();
                years.Add(Convert.ToString(year), Convert.ToString(year));
                years.Add(Convert.ToString(year + 1), Convert.ToString(year + 1));
                years.Add(Convert.ToString(year + 2), Convert.ToString(year + 2));
                years.Add(Convert.ToString(year + 3), Convert.ToString(year + 3));
                years.Add(Convert.ToString(year - 1), Convert.ToString(year - 1));
                years.Add(Convert.ToString(year - 2), Convert.ToString(year - 2));
                years.Add(Convert.ToString(year - 3), Convert.ToString(year - 3));

                this.ViewBag.Years = new SelectList(years.OrderBy(x => x.Key), "Key", "Value", year);

                var registrant = (from r in farmContext.Registrants
                                  where r.Code == code
                                  select r).Single();

                byte[] file;
                string path = this.Server.MapPath("../Files/Washington/" + fileName);
                using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read))
                {
                    using (var reader = new BinaryReader(stream))
                    {
                        file = reader.ReadBytes((int)stream.Length);
                    }
                }

                var uploadedFile = new UploadedFile();
                uploadedFile.Name = fileName;
                uploadedFile.Extension = ".pdf";
                uploadedFile.Data = file;
                uploadedFile.Revisions = 0;
                uploadedFile.Cancellations = 0;
                uploadedFile.Reviewed = false;
                uploadedFile.Transit = false;
                uploadedFile.Updated = DateTime.Now;
                uploadedFile.Created = DateTime.Now;
                farmContext.UploadedFiles.Add(uploadedFile);
                farmContext.SaveChanges();

                this.ViewBag.FileId = uploadedFile.Id;
                return this.View(registrant);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the labels by registrant.</summary>
        /// <param name="code">The code.</param>
        /// <returns>A collection of matched labels</returns>
        public JsonResult GetLabelsByRegistrant(string code)
        {
            try
            {
                return new JsonNetResult { Data = new { Error = false, Labels = new List<string>() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the labels." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Gets the reviewed.</summary>
        /// <param name="code">The code.</param>
        /// <param name="fileName">Name of the file.</param>
        /// <param name="fileId">The file identifier.</param>
        /// <returns>A JSON encoded collection of labels to review</returns>
        public JsonResult GetProductsByRegistrant(string code, string fileName, int fileId)
        {
            try
            {
                var picolContext = new PicolEntities();
                var file = (from f in picolContext.UploadedFiles
                            where f.Id == fileId
                            select f).Single();

                List<int> pages = new List<int>();
                using (PdfReader pdfReader = new PdfReader(file.Data))
                {
                    ITextExtractionStrategy strategy = new SimpleTextExtractionStrategy();
                    string pdfText = string.Empty;
                    bool newLabels = false;

                    for (int page = 1; page <= pdfReader.NumberOfPages; page++)
                    {
                        pdfText += PdfTextExtractor.GetTextFromPage(pdfReader, page, strategy);
                    }

                    if (pdfText.Contains(" N\nApproved"))
                    {
                        newLabels = true;
                    }

                    var registrantId = (from r in picolContext.Registrants
                                        where r.Code == code
                                        select r.Id).Single();

                    List<Product> labels = (from l in picolContext.Labels
                                            where l.RegistrantId == registrantId
                                            select new Product
                                            {
                                                Id = l.Id,
                                                Name = l.Name,
                                                EpaNumber = l.EpaFieldOne + "-" + l.EpaFieldTwo + "-" + l.EpaFieldThree,
                                                SupplementalName = l.SlnName,
                                                SupplementalNumber = l.Sln,
                                                Year = l.StateRecords.Where(x => x.Year == l.StateRecords.Max(y => y.Year)).FirstOrDefault() != null ? l.StateRecords.Where(x => x.Year == l.StateRecords.Max(y => y.Year)).FirstOrDefault().Year : 0,
                                                Reregister = false,
                                                Revised = false,
                                                Cancelled = false
                                            }).ToList();

                    int revisions = 0;
                    int cancellations = 0;

                    foreach (var l in labels)
                    {
                        l.EpaNumber = l.EpaNumber.Trim('-');

                        if (pdfText.Contains(l.EpaNumber))
                        {
                            int beginning = pdfText.IndexOf(l.EpaNumber);

                            while (beginning != -1)
                            {
                                int start = pdfText.IndexOf(l.EpaNumber, beginning);
                                int end = pdfText.IndexOf(':', start);
                                beginning = pdfText.IndexOf(l.EpaNumber, end);

                                string line = pdfText.Substring(start, end - start);
                                int lastBreak = line.LastIndexOf('\n');
                                char action = ' ';
                                string fileNumber = string.Empty;

                                if (lastBreak > 0)
                                {
                                    action = line.Substring(0, lastBreak).Trim().Last();
                                    string temp = line.Substring(0, lastBreak).Trim().Replace("R", string.Empty).Replace("N", string.Empty).Trim();
                                    int st = temp.LastIndexOf(" ");
                                    fileNumber = temp.Substring(st, temp.Length - st).Trim();
                                }

                                string parsedFileNum = string.Empty;

                                if (l.Name.Contains("["))
                                {
                                    parsedFileNum = l.Name.Split('[')[1].Split('-').First();
                                }

                                if (line != null)
                                {
                                    if (line.ElementAt(l.EpaNumber.Length) == ' ')
                                    {
                                        if (action == 'R' && line.ToUpper().Contains("APPROVED") && parsedFileNum == fileNumber)
                                        {
                                            l.Revised = true;
                                            l.Reregister = true;
                                            revisions++;
                                            break;
                                        }

                                        if (line.ToUpper().Contains("APPROVED") && parsedFileNum == fileNumber)
                                        {
                                            l.Reregister = true;
                                            break;
                                        }

                                        if (line.ToUpper().Contains("CANCELLED"))
                                        {
                                            l.Cancelled = true;
                                            cancellations++;
                                            continue;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    file.Revisions = revisions;
                    file.Cancellations = cancellations;
                    picolContext.SaveChanges();

                    return new JsonNetResult { Data = new { Error = false, Products = labels.ToList(), NewLabels = newLabels, Revisions = revisions, Cancellations = cancellations }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the labels." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Stamps the file.</summary>
        /// <param name="fileId">The file identifier.</param>
        /// <param name="message">The message.</param>
        /// <param name="state">The state.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult StampFile(int fileId, string message, string state)
        {
            try
            {
                HttpCookie authorizationCookie = this.HttpContext.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"];
                string logon = Encryption.UnprotectString(authorizationCookie["Logon"], new string[] { "Cookie" }, true);

                var farmContext = new PicolEntities();
                var file = (from f in farmContext.UploadedFiles
                            where f.Id == fileId
                            select f).Single();

                PdfReader pdfReader = new PdfReader(file.Data);
                MemoryStream pageOutput = new MemoryStream();
                PdfStamper stamper = new PdfStamper(pdfReader, pageOutput);

                for (int i = 0; i < stamper.Reader.NumberOfPages; i++)
                {
                    PdfContentByte pdfData = stamper.GetOverContent(i + 1);
                    BaseFont baseFont = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.EMBEDDED);
                    pdfData.BeginText();
                    pdfData.SetColorFill(CMYKColor.RED);
                    pdfData.SetFontAndSize(baseFont, 16);
                    pdfData.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, message + logon + " " + DateTime.Now.ToShortDateString(), 600, 730, 0);
                    pdfData.EndText();
                }

                stamper.Close();
                pdfReader.Close();
                file.Data = pageOutput.ToArray();
                file.Reviewed = state.ToLower() == "reviewed" ? true : false;
                file.Transit = state.ToLower() == "transit" ? true : false;
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to stamp the file." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Replaces the file.</summary>
        /// <param name="fileId">The file identifier.</param>
        /// <param name="fileData">The file data.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult ReplaceFile(int fileId, HttpPostedFileBase fileData)
        {
            try
            {
                var farmContext = new PicolEntities();
                var file = (from f in farmContext.UploadedFiles
                            where f.Id == fileId
                            select f).Single();

                if (fileData != null && file != null)
                {
                    if (fileData.ContentLength > 0)
                    {
                        byte[] buffer = new byte[fileData.ContentLength];
                        fileData.InputStream.Read(buffer, 0, fileData.ContentLength);

                        file.Data = buffer;
                        file.Updated = DateTime.Now;
                        farmContext.SaveChanges();
                    }
                }

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update file." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Downloads from database.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>Binary stream</returns>
        public ActionResult DownloadFromDatabase(int id)
        {
            try
            {
                var farmContext = new PicolEntities();
                var file = (from f in farmContext.UploadedFiles
                            where f.Id == id
                            select f).Single();

                return this.File(file.Data, "application/octet-stream", file.Name + file.Extension);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Json(new { Error = true, ErrorMessage = "Failed to retrieve file from the database." });
            }
        }

        /// <summary>Ins the transit.</summary>
        /// <returns>A base view object</returns>
        public ActionResult InTransit()
        {
            try
            {
                this.ViewBag.SelectedLink = "CertificateProcessing.InTransit";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the uploads.</summary>
        /// <returns>A JSON encoded collection of uploaded files</returns>
        public JsonResult GetInTransit()
        {
            try
            {
                var farmContext = new PicolEntities();
                var files = from f in farmContext.UploadedFiles
                            where f.Transit
                            select new
                            {
                                Id = f.Id,
                                Name = f.Name
                            };

                return new JsonNetResult { Data = new { Error = false, Files = files }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the labels." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Revieweds this instance.</summary>
        /// <returns>A base view object</returns>
        public ActionResult Reviewed()
        {
            try
            {
                this.ViewBag.SelectedLink = "CertificateProcessing.Reviewed";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the uploads.</summary>
        /// <returns>A JSON encoded collection of uploaded files</returns>
        public JsonResult GetReviewed()
        {
            try
            {
                var farmContext = new PicolEntities();
                var files = from f in farmContext.UploadedFiles
                            where f.Reviewed
                            select new
                            {
                                Id = f.Id,
                                Name = f.Name
                            };

                return new JsonNetResult { Data = new { Error = false, Files = files }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the labels." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Registers the label.</summary>
        /// <param name="id">The identifier.</param>
        /// <param name="state">The state.</param>
        /// <param name="year">The year.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult RegisterLabel(int id, int state, int year)
        {
            try
            {
                var picolContext = new PicolEntities();

                StateRecord record = new StateRecord();
                record.LabelId = id;
                record.StateId = state;
                record.Year = year;
                record.AgencyId = string.Empty;
                record.Version = "-1";
                record.Pdf = DateTime.Now;
                picolContext.StateRecords.Add(record);
                picolContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update file." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
