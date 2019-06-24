// -----------------------------------------------------------------------
// <copyright file="UsageController.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace FarmFinder.Controllers
{
    using System;
    using System.Collections.Generic;
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
    public class UsageController : Controller
    {
        /// <summary>Lists the usages.</summary>
        /// <returns>A base view object</returns>
        public ActionResult List()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "Usage.List";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the usages.</summary>
        /// <returns>A JSON encoded collection of usages</returns>
        public JsonResult Get()
        {
            try
            {
                var farmContext = new PicolEntities();
                var usages = from l in farmContext.Usages
                             select new
                             {
                                 Id = l.Id,
                                 Name = l.Name,
                                 Code = l.Code
                             };

                return new JsonNetResult { Data = new { Error = false, Usages = usages.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the usages." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Creates the usage.</summary>
        /// <param name="usage">The usage.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Create(Usage usage)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Usages.Add(usage);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false, Usage = usage }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed save usage." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the usage.</summary>
        /// <param name="usage">The usage.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Update(Usage usage)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Usages.Attach(usage);
                farmContext.Entry(usage).State = System.Data.Entity.EntityState.Modified;
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update usage." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the usage.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Delete(int id)
        {
            try
            {
                var farmContext = new PicolEntities();
                var usage = (from l in farmContext.Usages
                             where l.Id == id
                             select l).Single();

                farmContext.Usages.Remove(usage);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to delete usage." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
