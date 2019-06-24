// -----------------------------------------------------------------------
// <copyright file="LabelController.cs" company="Washington State University">
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
    using Picol.Classes.Uploads;
    using Picol.Decorators;
    using Picol.Models;

    /// <summary>Controller for administrative actions</summary>
    [WsuAuthenticate(Order = 1)]
    [AdminAuthorize(Order = 2)]
    [History(Order = 3)]
    public class LabelController : Controller
    {
        /// <summary>Lists the labels.</summary>
        /// <returns>A base view object</returns>
        public ActionResult List()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "Label.List";

                // Create formulations dropdown
                var dbContext = new PicolEntities();
                var formulations = (from c in dbContext.Formulations
                                     select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                formulations.Insert(0, new { Id = -1, Name = "=== Choose a formulation ===" });
                this.ViewBag.Formulations = new SelectList(formulations, "Id", "Name");

                // Create states dropdown
                var intendedUsers = (from c in dbContext.IntendedUsers
                                     select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                intendedUsers.Insert(0, new { Id = -1, Name = "=== Choose a intended users ===" });
                this.ViewBag.IntendedUsers = new SelectList(intendedUsers, "Id", "Name");

                var registrants = (from c in dbContext.Registrants
                                     select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                registrants.Insert(0, new { Id = -1, Name = "=== Choose a registrants ===" });
                this.ViewBag.Registrants = new SelectList(registrants, "Id", "Name");

                var signalWords = (from c in dbContext.SignalWords
                                   select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                signalWords.Insert(0, new { Id = -1, Name = "=== Choose a signal word ===" });
                this.ViewBag.SignalWords = new SelectList(signalWords, "Id", "Name");

                var usages = (from c in dbContext.Usages
                                   select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                usages.Insert(0, new { Id = -1, Name = "=== Choose a usage ===" });
                this.ViewBag.Usages = new SelectList(usages, "Id", "Name");

                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the labels.</summary>
        /// <returns>A JSON encoded collection of labels</returns>
        public JsonResult Get()
        {
            try
            {
                var farmContext = new PicolEntities();
                var labels = from l in farmContext.Labels
                             select new
                             {
                                 Id = l.Id,
                                 Name = l.Name,
                                 Formulation = l.Formulation.Name,
                                 FormulationId = l.FormulationId,
                                 IntendedUser = l.IntendedUser.Name,
                                 IntendedUserId = l.IntendedUserId,
                                 Registrant = l.Registrant.Name,
                                 RegistrantId = l.RegistrantId,
                                 SignalWord = l.SignalWord.Name,
                                 SignalWordId = l.SignalWordId,
                                 Usage = l.Usage.Name,
                                 UsageId = l.Usage.Name
                             };

                return new JsonNetResult { Data = new { Error = false, Labels = labels.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the labels." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Creates a new label.</summary>
        /// <returns>A blank label to create</returns>
        public ActionResult Create()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "Label.Create";

                // Create formulations dropdown
                var dbContext = new PicolEntities();
                var formulations = (from c in dbContext.Formulations
                                    select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                formulations.Insert(0, new { Id = -1, Name = "=== Choose a formulation ===" });
                this.ViewBag.Formulations = new SelectList(formulations, "Id", "Name");

                // Create states dropdown
                var intendedUsers = (from c in dbContext.IntendedUsers
                                     select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                intendedUsers.Insert(0, new { Id = -1, Name = "=== Choose a intended users ===" });
                this.ViewBag.IntendedUsers = new SelectList(intendedUsers, "Id", "Name");

                var registrants = (from c in dbContext.Registrants
                                   select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                registrants.Insert(0, new { Id = -1, Name = "=== Choose a registrants ===" });
                this.ViewBag.Registrants = new SelectList(registrants, "Id", "Name");

                var signalWords = (from c in dbContext.SignalWords
                                   select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                signalWords.Insert(0, new { Id = -1, Name = "=== Choose a signal word ===" });
                this.ViewBag.SignalWords = new SelectList(signalWords, "Id", "Name");

                var usages = (from c in dbContext.Usages
                              select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                usages.Insert(0, new { Id = -1, Name = "=== Choose a usage ===" });
                this.ViewBag.Usages = new SelectList(usages, "Id", "Name");

                Label label = new Label();

                return this.View(label);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Creates the label.</summary>
        /// <param name="label">The label.</param>
        /// <returns>A JSON encoded success indicator</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult Create(Label label)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Labels.Add(label);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false, Label = label }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed save label." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the label.</summary>
        /// <param name="label">The label.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Update(Label label)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Labels.Attach(label);
                farmContext.Entry(label).State = System.Data.Entity.EntityState.Modified;
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update label." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the label.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Delete(int id)
        {
            try
            {
                var farmContext = new PicolEntities();
                var label = (from l in farmContext.Labels
                             where l.Id == id
                             select l).Single();

                farmContext.Labels.Remove(label);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to delete label." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Shows details of the specified label.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A label object</returns>
        public ActionResult Details(int id)
        {
            try
            {
                this.ViewBag.SelectedLink = "Label.List";
                var dataContext = new PicolEntities();
                var label = (from l in dataContext.Labels
                             where l.Id == id
                             select l).SingleOrDefault();

                var formulations = (from c in dataContext.Formulations
                                    select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                formulations.Insert(0, new { Id = -1, Name = "=== Choose formulation ===" });
                this.ViewBag.Formulations = new SelectList(formulations, "Id", "Name", label.FormulationId ?? -1);

                var intendedUsers = (from c in dataContext.IntendedUsers
                                     select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                intendedUsers.Insert(0, new { Id = -1, Name = "=== Choose intended user ===" });
                this.ViewBag.IntendedUsers = new SelectList(intendedUsers, "Id", "Name", label.IntendedUserId ?? -1);

                var registrants = (from c in dataContext.Registrants
                                   select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                registrants.Insert(0, new { Id = -1, Name = "=== Choose registrant ===" });
                this.ViewBag.Registrants = new SelectList(registrants, "Id", "Name", label.RegistrantId ?? -1);

                var signalWords = (from c in dataContext.SignalWords
                                   select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                signalWords.Insert(0, new { Id = -1, Name = "=== Choose signal words ===" });
                this.ViewBag.SignalWords = new SelectList(signalWords, "Id", "Name", label.SignalWordId ?? -1);

                var usages = (from c in dataContext.Usages
                              select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                usages.Insert(0, new { Id = -1, Name = "=== Choose usages ===" });
                this.ViewBag.Usages = new SelectList(usages, "Id", "Name", label.UsageId ?? -1);

                return this.View(label);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Uploads the label.</summary>
        /// <returns>A base view object</returns>
        public ActionResult Upload()
        {
            try
            {
                ////this.ViewBag.SelectedLink = "Label.Upload";
                ////var dataContext = new PicolEntities();

                ////string path = Server.MapPath("../Files/Oregon");
                ////List<string> oregonFiles = Directory.GetFiles(path).ToList();
                ////this.ViewBag.OregonFiles"] = oregonFiles;

                ////path = Server.MapPath("../Files/Washington");
                ////List<string> washingtonFiles = Directory.GetFiles(path).ToList();
                ////this.ViewBag.WashingtonFiles"] = washingtonFiles;
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
        public JsonResult GetUploads()
        {
            try
            {
                var farmContext = new PicolEntities();
                var washingtonFiles = new List<WashingtonFile>();

                string path = this.Server.MapPath("../Files/Washington");
                List<string> files = Directory.GetFiles(path).ToList();

                foreach (var f in files)
                {
                    var nameParts = f.Split('\\').Last().Split('_');
                    WashingtonFile file = new WashingtonFile();
                    file.Format = nameParts.Count() == 6;

                    if (file.Format)
                    {
                        file.Epa = nameParts[0];
                        file.Name = nameParts[1];
                        file.Date = nameParts[2];
                        file.Line = nameParts[3];
                        file.Registrant = nameParts[4];

                        bool matching = (from l in farmContext.Labels
                                         where l.Epa == file.Epa
                                         select l).Count() == 1;

                        file.Match = matching;
                    }

                    file.FileName = f.Split('\\').Last();
                    washingtonFiles.Add(file);
                }

                return new JsonNetResult { Data = new { Error = false, Labels = washingtonFiles.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the labels." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates string typed fields.</summary>
        /// <param name="id">The identifier.</param>
        /// <param name="field">The field.</param>
        /// <param name="value">The value.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public ActionResult UpdateStringField(int id, string field, string value)
        {
            try
            {
                var dataContext = new PicolEntities();
                var label = (from l in dataContext.Labels
                             where l.Id == id
                             select l).SingleOrDefault();

                System.Reflection.PropertyInfo propertyInfo = label.GetType().GetProperty(field);

                propertyInfo.SetValue(label, value, null);
                dataContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update user in database." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates integer typed fields.</summary>
        /// <param name="id">The identifier.</param>
        /// <param name="field">The field.</param>
        /// <param name="value">The value.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public ActionResult UpdateIntegerField(int id, string field, int value)
        {
            try
            {
                var dataContext = new PicolEntities();
                var label = (from l in dataContext.Labels
                             where l.Id == id
                             select l).SingleOrDefault();

                System.Reflection.PropertyInfo propertyInfo = label.GetType().GetProperty(field);

                propertyInfo.SetValue(label, value, null);
                dataContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update user in database." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
