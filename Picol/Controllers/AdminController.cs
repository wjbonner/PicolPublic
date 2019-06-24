// -----------------------------------------------------------------------
// <copyright file="AdminController.cs" company="Washington State University">
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
    using Picol.Classes;
    using Picol.Decorators;
    using Picol.Models;

    /// <summary>Controller for administrative actions</summary>
    [WsuAuthenticate(Order = 1)]
    [AdminAuthorize(Order = 2)]
    [History(Order = 3)]
    public class AdminController : Controller
    {
        /// <summary>Data load view.</summary>
        /// <returns>A base view</returns>
        public ActionResult DataLoad()
        {
            try
            {
                this.ViewBag.SelectedLink = "Admin.DataLoad";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the state of the data load.</summary>
        /// <returns>A JSON encoded state indicator</returns>
        public JsonResult GetLoadState()
        {
            try
            {
                var dataContext = new PicolEntities();
                var loadState = (from l in dataContext.Settings
                                 where l.Name == "LoadState"
                                 select l.Value).SingleOrDefault();

                return new JsonNetResult { Data = new { Error = false, LoadState = loadState }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the users." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Starts the database load.</summary>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult StartDatabaseLoad()
        {
            try
            {
                var dataContext = new PicolDataLoaderEntities();
                dataContext.LaunchPicolLoad();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to start the database load." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Edits the home page contents</summary>
        /// <returns>A base view</returns>
        public ActionResult EditHome()
        {
            try
            {
                this.ViewBag.SelectedLink = "Admin.EditHome";

                var dataContext = new PicolEntities();
                var source = (from l in dataContext.Settings
                              where l.Name == "HomePage"
                              select l).SingleOrDefault();

                if (source == null)
                {
                    var setting = new Setting();
                    setting.Value = string.Empty;
                    setting.Name = "HomePage";
                    dataContext.Settings.Add(setting);
                    dataContext.SaveChanges();
                    source = (from l in dataContext.Settings
                              where l.Name == "HomePage"
                              select l).Single();
                }

                this.ViewData["Source"] = source.Value;
                this.ViewData["SettingId"] = source.Id;

                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Edits the API tos.</summary>
        /// <returns>A base view</returns>
        public ActionResult EditApiTos()
        {
            try
            {
                this.ViewBag.SelectedLink = "Admin.EditApiTos";

                var dataContext = new PicolEntities();
                var source = (from l in dataContext.Settings
                              where l.Name == "ApiTos"
                              select l).SingleOrDefault();

                if (source == null)
                {
                    var setting = new Setting();
                    setting.Value = string.Empty;
                    setting.Name = "ApiTos";
                    dataContext.Settings.Add(setting);
                    dataContext.SaveChanges();
                    source = (from l in dataContext.Settings
                              where l.Name == "ApiTos"
                              select l).Single();
                }

                this.ViewData["Source"] = source.Value;
                this.ViewData["SettingId"] = source.Id;

                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Edits the API use.</summary>
        /// <returns>A base view</returns>
        public ActionResult EditApiUse()
        {
            try
            {
                this.ViewBag.SelectedLink = "Admin.EditApiUse";

                var dataContext = new PicolEntities();
                var source = (from l in dataContext.Settings
                              where l.Name == "ApiUse"
                              select l).SingleOrDefault();

                if (source == null)
                {
                    var setting = new Setting();
                    setting.Value = string.Empty;
                    setting.Name = "ApiUse";
                    dataContext.Settings.Add(setting);
                    dataContext.SaveChanges();
                    source = (from l in dataContext.Settings
                              where l.Name == "ApiUse"
                              select l).Single();
                }

                this.ViewData["Source"] = source.Value;
                this.ViewData["SettingId"] = source.Id;

                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Edits the FAQ.</summary>
        /// <returns>A base view</returns>
        public ActionResult EditFaq()
        {
            try
            {
                this.ViewBag.SelectedLink = "Admin.EditFaq";

                var dataContext = new PicolEntities();
                var source = (from l in dataContext.Settings
                              where l.Name == "Faq"
                              select l).SingleOrDefault();

                if (source == null)
                {
                    var setting = new Setting();
                    setting.Value = string.Empty;
                    setting.Name = "Faq";
                    dataContext.Settings.Add(setting);
                    dataContext.SaveChanges();
                    source = (from l in dataContext.Settings
                              where l.Name == "Faq"
                              select l).Single();
                }

                this.ViewData["Source"] = source.Value;
                this.ViewData["SettingId"] = source.Id;

                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Edits the video tutorials page.</summary>
        /// <returns>A base view</returns>
        public ActionResult EditVideoTutorials()
        {
            try
            {
                this.ViewBag.SelectedLink = "Admin.EditVideoTutorials";

                var dataContext = new PicolEntities();
                var source = (from l in dataContext.Settings
                              where l.Name == "VideoTutorials"
                              select l).SingleOrDefault();

                if (source == null)
                {
                    var setting = new Setting();
                    setting.Value = string.Empty;
                    setting.Name = "VideoTutorials";
                    dataContext.Settings.Add(setting);
                    dataContext.SaveChanges();
                    source = (from l in dataContext.Settings
                              where l.Name == "VideoTutorials"
                              select l).Single();
                }

                this.ViewData["Source"] = source.Value;
                this.ViewData["SettingId"] = source.Id;

                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Lists the users.</summary>
        /// <returns>A base view object</returns>
        public ActionResult ListUsers()
        {
            try
            {
                this.ViewBag.SelectedLink = "Users";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the users.</summary>
        /// <returns>A JSON encoded collection of users</returns>
        public JsonResult GetUsers()
        {
            try
            {
                var accountContext = new PicolEntities();
                var users = from l in accountContext.Users
                            select new { Id = l.Id, Logon = l.Logon, FirstName = l.FirstName, LastName = l.LastName, Active = l.Active, Admin = l.Admin };

                return new JsonNetResult { Data = new { Error = false, Users = users.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the users." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Lists the API keys.</summary>
        /// <returns>A base view object</returns>
        public ActionResult ListApiKeys()
        {
            try
            {
                this.ViewBag.SelectedLink = "Admin.ApiKeys";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the API keys.</summary>
        /// <returns>A JSON encoded collection of API keys</returns>
        public JsonResult GetApiKeys()
        {
            try
            {
                var accountContext = new PicolEntities();
                var apiKeys = from l in accountContext.ApiKeys
                              select new
                              {
                                  Id = l.Id,
                                  Value = l.Value,
                                  User = l.User.Email,
                                  Active = l.Active,
                                  Approved = l.Approved
                              };

                return new JsonNetResult { Data = new { Error = false, ApiKeys = apiKeys.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the users." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>The API key details.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A view with an API key object</returns>
        public ActionResult ApiKeyDetails(int id)
        {
            try
            {
                this.ViewBag.SelectedLink = "Admin.ApiKeys";

                var accountContext = new PicolEntities();
                var apiKey = (from l in accountContext.ApiKeys
                              where l.Id == id
                              select l).Single();

                return this.View(apiKey);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>APIs the key active toggle.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult ApiKeyActiveToggle(int id)
        {
            try
            {
                var dataContext = new PicolEntities();
                var key = (from l in dataContext.ApiKeys
                               where l.Id == id
                               select l).Single();

                key.Active = !key.Active;
                dataContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to toggle active" }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>APIs the key approved toggle.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult ApiKeyApprovedToggle(int id)
        {
            try
            {
                int userId = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var dataContext = new PicolEntities();
                var key = (from l in dataContext.ApiKeys
                           where l.Id == id
                           select l).Single();

                List<string> adminAddresses = (from a in dataContext.Settings
                                              where a.Name == "AdminEmail"
                                              select a.Value).ToList();

                if (!key.Approved)
                {
                    List<string> recipients = new List<string>();
                    recipients.Add(key.User.Email);

                    string data = System.IO.File.ReadAllText(this.Server.MapPath("~/Content/templates/Picol_API Terms of Service.rtf"));
                    data = data.Replace("<RecipientName>", key.User.FirstName + " " + key.User.LastName);
                    data = data.Replace("<Date>", DateTime.Now.ToShortDateString());
                    data = data.Replace("<ApiKey>", key.Value);
                    data = data.Replace("<BaseUrl>", this.Request.Url.Scheme + "://" + this.Request.Url.Authority + this.Request.ApplicationPath.TrimEnd('/'));
                    byte[] bytes = System.Text.Encoding.ASCII.GetBytes(data);

                    using (Stream memStream = new MemoryStream(bytes))
                    {
                        List<System.Net.Mail.Attachment> attachments = new List<System.Net.Mail.Attachment>();
                        attachments.Add(new System.Net.Mail.Attachment(memStream, "Picol API Approval and Terms of Service.rtf", "text/csv"));
                        EmailHelper.SendEmail(recipients, adminAddresses, new List<string>(), "noreply@wsu.edu", "API key approved", key.User.FirstName + ",<br /><br />Your API key has been approved!  Please keep the attached notice of approval and terms of service for your records.<br /><br />The PICOL Team.", true, attachments);
                    }
                }

                key.Approved = !key.Approved;
                key.ApprovedBy = userId;
                key.ApprovalDate = DateTime.Now;
                dataContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to toggle approved" }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the API key notes.</summary>
        /// <param name="id">The identifier.</param>
        /// <param name="notes">The notes.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult UpdateApiKeyNotes(int id, string notes)
        {
            try
            {
                var dataContext = new PicolEntities();
                var key = (from l in dataContext.ApiKeys
                           where l.Id == id
                           select l).Single();

                key.Notes = notes;
                dataContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to toggle approved" }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Lists the settings.</summary>
        /// <returns>A base view object</returns>
        public ActionResult ListSettings()
        {
            try
            {
                this.ViewBag.SelectedLink = "Admin.Settings";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the settings.</summary>
        /// <returns>A JSON encoded collection of settings</returns>
        public JsonResult GetSettings()
        {
            try
            {
                var accountContext = new PicolEntities();
                var settings = from l in accountContext.Settings
                               select new
                               {
                                   Id = l.Id,
                                   Name = l.Name,
                                   Value = l.Value
                               };

                return new JsonNetResult { Data = new { Error = false, Settings = settings.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the users." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the setting.</summary>
        /// <param name="id">The identifier.</param>
        /// <param name="value">The value.</param>
        /// <returns>A JSON encoded success indicator</returns>
        [ValidateInput(false)]
        public JsonResult UpdateSetting(int id, string value)
        {
            try
            {
                var accountContext = new PicolEntities();
                var setting = (from l in accountContext.Settings
                               where l.Id == id
                               select l).Single();

                setting.Value = value;
                accountContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the users." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Creates the setting.</summary>
        /// <param name="name">The name.</param>
        /// <param name="value">The value.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult CreateSetting(string name, string value)
        {
            try
            {
                var accountContext = new PicolEntities();
                var setting = new Setting();
                setting.Value = value;
                setting.Name = name;
                accountContext.Settings.Add(setting);
                accountContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the users." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Uploads the image.</summary>
        /// <param name="file">The file.</param>
        /// <returns>A JSON encoded response with download link</returns>
        public JsonResult UploadFile(HttpPostedFileBase file)
        {
            try
            {
                string link = "/File/Download/";

                if (file != null)
                {
                    if (file.ContentLength > 0)
                    {
                        byte[] buffer = new byte[file.ContentLength];
                        file.InputStream.Read(buffer, 0, file.ContentLength);

                        var dataContext = new PicolEntities();
                        BinarySetting upload = new BinarySetting();
                        upload.Name = Path.GetFileNameWithoutExtension(file.FileName);
                        upload.Extension = Path.GetExtension(file.FileName);
                        upload.Value = buffer;
                        upload.Public = true;
                        upload.Manageable = true;
                        dataContext.BinarySettings.Add(upload);
                        dataContext.SaveChanges();

                        link += upload.Id;
                    }
                }

                return new JsonNetResult { Data = new { Error = false, link = link }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to save the image." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Uploads the home header.</summary>
        /// <param name="file">The file.</param>
        /// <returns>A JSON encoded success indicator and link</returns>
        public JsonResult UploadHomeHeader(HttpPostedFileBase file)
        {
            try
            {
                string link = "/File/Download/";

                if (file != null)
                {
                    if (file.ContentLength > 0)
                    {
                        byte[] buffer = new byte[file.ContentLength];
                        file.InputStream.Read(buffer, 0, file.ContentLength);

                        var dataContext = new PicolEntities();

                        var header = (from h in dataContext.BinarySettings
                                      where h.Name == "HomeHeader"
                                      select h).SingleOrDefault();

                        if (header == null)
                        {
                            BinarySetting upload = new BinarySetting();
                            upload.Name = "HomeHeader";
                            upload.Extension = Path.GetExtension(file.FileName);
                            upload.Value = buffer;
                            upload.Public = true;
                            upload.Manageable = false;
                            dataContext.BinarySettings.Add(upload);
                            dataContext.SaveChanges();

                            link += upload.Id;
                        }
                        else
                        {
                            header.Value = buffer;
                            dataContext.SaveChanges();

                            link += header.Id;
                        }
                    }
                }

                return new JsonNetResult { Data = new { Error = false, Link = link }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to save the image." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the image.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult DeleteFile(int id)
        {
            try
            {
                var dataContext = new PicolEntities();
                var file = (from i in dataContext.BinarySettings
                            where i.Id == id
                            select i).Single();

                dataContext.BinarySettings.Remove(file);
                dataContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the file." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Loads images for the Froala image manager</summary>
        /// <returns>JSON encoded Froala image manager array</returns>
        public ActionResult LoadImages()
        {
            try
            {
                List<string> extensions = new List<string>();
                extensions.Add(".jpg");
                extensions.Add(".jpeg");
                extensions.Add(".png");

                var dataContext = new PicolEntities();
                var files = from i in dataContext.BinarySettings
                            where extensions.Contains(i.Extension)
                            && i.Manageable
                            select new
                            {
                                id = i.Id,
                                url = "/File/Download/" + i.Id,
                                thumb = "/File/Download/" + i.Id,
                                tag = i.Name,
                                name = i.Name
                            };

                return new JsonNetResult { Data = files, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the file." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
