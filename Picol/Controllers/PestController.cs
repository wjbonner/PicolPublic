// -----------------------------------------------------------------------
// <copyright file="PestController.cs" company="Washington State University">
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
    public class PestController : Controller
    {
        /// <summary>Lists the pests.</summary>
        /// <returns>A base view object</returns>
        public ActionResult List()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "Pest.List";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the pests.</summary>
        /// <returns>A JSON encoded collection of pests</returns>
        public JsonResult Get()
        {
            try
            {
                var farmContext = new PicolEntities();
                var pests = from l in farmContext.Pests
                             select new
                             {
                                 Id = l.Id,
                                 Name = l.Name,
                                 Code = l.Code,
                                 Notes = l.Notes
                             };

                return new JsonNetResult { Data = new { Error = false, Pests = pests.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the pests." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Creates the pest.</summary>
        /// <param name="pest">The pest.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Create(Pest pest)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Pests.Add(pest);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false, Pest = pest }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed save pest." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the pest.</summary>
        /// <param name="pest">The pest.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Update(Pest pest)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Pests.Attach(pest);
                farmContext.Entry(pest).State = System.Data.Entity.EntityState.Modified;
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update pest." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the pest.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Delete(int id)
        {
            try
            {
                var farmContext = new PicolEntities();
                var pest = (from l in farmContext.Pests
                             where l.Id == id
                             select l).Single();

                farmContext.Pests.Remove(pest);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to delete pest." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
