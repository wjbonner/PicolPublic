// -----------------------------------------------------------------------
// <copyright file="RegulationAuthorityController.cs" company="Washington State University">
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
    public class RegulationAuthorityController : Controller
    {
        /// <summary>Lists the regulationAuthorities.</summary>
        /// <returns>A base view object</returns>
        public ActionResult List()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "RegulationAuthority.List";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the regulationAuthorities.</summary>
        /// <returns>A JSON encoded collection of regulationAuthorities</returns>
        public JsonResult Get()
        {
            try
            {
                var farmContext = new PicolEntities();
                var regulationAuthorities = from l in farmContext.RegulationAuthorities
                             select new
                             {
                                 Id = l.Id,
                                 Name = l.Name,
                                 Description = l.Description
                             };

                return new JsonNetResult { Data = new { Error = false, RegulationAuthorities = regulationAuthorities.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the regulationAuthorities." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Creates the regulationAuthority.</summary>
        /// <param name="regulationAuthority">The regulationAuthority.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Create(RegulationAuthority regulationAuthority)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.RegulationAuthorities.Add(regulationAuthority);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false, RegulationAuthority = regulationAuthority }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed save regulationAuthority." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the regulationAuthority.</summary>
        /// <param name="regulationAuthority">The regulationAuthority.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Update(RegulationAuthority regulationAuthority)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.RegulationAuthorities.Attach(regulationAuthority);
                farmContext.Entry(regulationAuthority).State = System.Data.Entity.EntityState.Modified;
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update regulationAuthority." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the regulationAuthority.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Delete(int id)
        {
            try
            {
                var farmContext = new PicolEntities();
                var regulationAuthority = (from l in farmContext.RegulationAuthorities
                             where l.Id == id
                             select l).Single();

                farmContext.RegulationAuthorities.Remove(regulationAuthority);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to delete regulationAuthority." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
