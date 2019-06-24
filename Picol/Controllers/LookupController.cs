// <copyright file="LookupController.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>

namespace Picol.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using Classes;
    using Elmah;
    using Models;
    using Picol.Decorators;

    /// <summary>Class for lookup actions</summary>
    /// <seealso cref="System.Web.Mvc.Controller" />
    [History(Order = 1)]
    public class LookupController : Controller
    {
        /// <summary>Resistances this instance.</summary>
        /// <returns>A base view object</returns>
        public ActionResult Resistance()
        {
            this.ViewBag.SelectedLink = "Lookup.Resistance";
            return this.View();
        }

        /// <summary>Gets the resistance.</summary>
        /// <returns>A JSON encoded collection of resistances</returns>
        public JsonResult GetResistanceCodes()
        {
            try
            {
                var dbContext = new PicolEntities();
                var resistanceCodes = (from r in dbContext.Resistances
                                      select new
                                      {
                                          Id = r.Id,
                                          Source = r.Source,
                                          Code = r.Code,
                                          Moa = r.MethodOfAction
                                      }).OrderBy(x => x.Source).ToList();

                return new JsonNetResult { Data = new { Error = false, ResistanceCodes = resistanceCodes }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Registrantses this instance.</summary>
        /// <returns>A base view object</returns>
        public ActionResult Registrants()
        {
            this.ViewBag.SelectedLink = "Lookup.Registrants";
            return this.View();
        }

        /// <summary>Gets the registrants.</summary>
        /// <returns>A JSON encoded collection of registrants</returns>
        public JsonResult GetRegistrants()
        {
            try
            {
                var dbContext = new PicolEntities();
                var registrants = (from r in dbContext.Registrants
                                       select new
                                       {
                                           Id = r.Id,
                                           Name = r.Name,
                                           Website = r.Url
                                       }).OrderBy(x => x.Name).ToList();

                return new JsonNetResult { Data = new { Error = false, Registrants = registrants }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Ingredient lookup.</summary>
        /// <returns>A base view object</returns>
        public ActionResult Ingredients()
        {
            this.ViewBag.SelectedLink = "Lookup.Ingredients";
            return this.View();
        }

        /// <summary>Gets the ingredients.</summary>
        /// <returns>A JSON encoded collection of ingredients</returns>
        public JsonResult GetIngredients()
        {
            try
            {
                var dbContext = new PicolEntities();
                var ingredients = (from r in dbContext.Ingredients
                                   select new
                                   {
                                       Id = r.Id,
                                       Name = r.Name,
                                       Code = r.Code,
                                       Notes = r.Notes,
                                       ResistanceSource = r.Resistance.Source,
                                       ResistanceCode = r.Resistance.Code,
                                       ResistanceMethodOfAction = r.Resistance.MethodOfAction
                                   }).OrderBy(x => x.Name).ToList();

                return new JsonNetResult { Data = new { Error = false, Ingredients = ingredients }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Lookup of Pesticide types.</summary>
        /// <returns>A base view object</returns>
        public ActionResult PesticideTypes()
        {
            this.ViewBag.SelectedLink = "Lookup.PesticideTypes";
            return this.View();
        }

        /// <summary>Gets the ingredients.</summary>
        /// <returns>A JSON encoded collection of ingredients</returns>
        public JsonResult GetPesticideTypes()
        {
            try
            {
                var dbContext = new PicolEntities();
                var pesticideTypes = (from r in dbContext.PesticideTypes
                                   select new
                                   {
                                       Id = r.Id,
                                       Name = r.Name,
                                       Code = r.Code
                                   }).OrderBy(x => x.Name).ToList();

                return new JsonNetResult { Data = new { Error = false, PesticideTypes = pesticideTypes }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Pests the types.</summary>
        /// <returns>A base view</returns>
        public ActionResult Pests()
        {
            this.ViewBag.SelectedLink = "Lookup.Pests";
            return this.View();
        }

        /// <summary>Gets the pests.</summary>
        /// <returns>A JSON encoded collection of pests</returns>
        public JsonResult GetPests()
        {
            try
            {
                var dbContext = new PicolEntities();
                var pests = (from r in dbContext.Pests
                                      select new
                                      {
                                          Id = r.Id,
                                          Name = r.Name,
                                          Code = r.Code,
                                          Notes = r.Notes
                                      }).OrderBy(x => x.Name).ToList();

                return new JsonNetResult { Data = new { Error = false, Pests = pests }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Lookup for the crops.</summary>
        /// <returns>A base view object</returns>
        public ActionResult Crops()
        {
            this.ViewBag.SelectedLink = "Lookup.Crops";
            return this.View();
        }

        /// <summary>Gets the crops.</summary>
        /// <returns>A JSON encoded collection of crops</returns>
        public JsonResult GetCrops()
        {
            try
            {
                var dbContext = new PicolEntities();
                var crops = (from r in dbContext.Crops
                             select new
                             {
                                 Id = r.Id,
                                 Name = r.Name,
                                 Code = r.Code,
                                 Notes = r.Notes
                             }).OrderBy(x => x.Name).ToList();

                return new JsonNetResult { Data = new { Error = false, Crops = crops }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Signals the words.</summary>
        /// <returns>A base view object</returns>
        public ActionResult SignalWords()
        {
            this.ViewBag.SelectedLink = "Lookup.SignalWords";
            return this.View();
        }

        /// <summary>Gets the signal words.</summary>
        /// <returns>A JSON encoded collection of signal words</returns>
        public JsonResult GetSignalWords()
        {
            try
            {
                var dbContext = new PicolEntities();
                var words = (from r in dbContext.SignalWords
                             select new
                             {
                                 Id = r.Id,
                                 Name = r.Name,
                                 Code = r.Code
                             }).OrderBy(x => x.Name).ToList();

                return new JsonNetResult { Data = new { Error = false, SignalWords = words }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Intendeds the users.</summary>
        /// <returns>A base view</returns>
        public ActionResult IntendedUsers()
        {
            this.ViewBag.SelectedLink = "Lookup.IntendedUsers";
            return this.View();
        }

        /// <summary>Gets the intended users.</summary>
        /// <returns>A JSON encoded collection of signal words</returns>
        public JsonResult GetIntendedUsers()
        {
            try
            {
                var dbContext = new PicolEntities();
                var users = (from r in dbContext.IntendedUsers
                             select new
                             {
                                 Id = r.Id,
                                 Name = r.Name,
                                 Code = r.Code
                             }).OrderBy(x => x.Name).ToList();

                return new JsonNetResult { Data = new { Error = false, IntendedUsers = users }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Applications lookup.</summary>
        /// <returns>A base view</returns>
        public ActionResult Applications()
        {
            this.ViewBag.SelectedLink = "Lookup.Applications";
            return this.View();
        }

        /// <summary>Gets the intended users.</summary>
        /// <returns>A JSON encoded collection of signal words</returns>
        public JsonResult GetApplications()
        {
            try
            {
                var dbContext = new PicolEntities();
                var applications = (from r in dbContext.Applications
                             select new
                             {
                                 Id = r.Id,
                                 Name = r.Name,
                                 Code = r.Code
                             }).OrderBy(x => x.Name).ToList();

                return new JsonNetResult { Data = new { Error = false, Applications = applications }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Formulationses this instance.</summary>
        /// <returns>A base view</returns>
        public ActionResult Formulations()
        {
            this.ViewBag.SelectedLink = "Lookup.Formulations";
            return this.View();
        }

        /// <summary>Gets the formulations.</summary>
        /// <returns>A JSON encoded collection of formulations</returns>
        public JsonResult GetFormulations()
        {
            try
            {
                var dbContext = new PicolEntities();
                var formulations = (from r in dbContext.Formulations
                                    select new
                                    {
                                        Id = r.Id,
                                        Name = r.Name,
                                        Code = r.Code,
                                        Notes = r.Notes
                                    }).OrderBy(x => x.Name).ToList();

                return new JsonNetResult { Data = new { Error = false, Formulations = formulations }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}