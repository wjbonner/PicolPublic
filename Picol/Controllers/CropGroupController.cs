// -----------------------------------------------------------------------
// <copyright file="CropGroupController.cs" company="Washington State University">
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
    public class CropGroupController : Controller
    {
        /// <summary>Lists the cropGroups.</summary>
        /// <returns>A base view object</returns>
        public ActionResult List()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "CropGroup.List";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the cropGroups.</summary>
        /// <returns>A JSON encoded collection of cropGroups</returns>
        public JsonResult Get()
        {
            try
            {
                var farmContext = new PicolEntities();
                var cropGroups = from l in farmContext.CropGroups
                             select new
                             {
                                 Id = l.Id,
                                 Name = l.Name
                             };

                return new JsonNetResult { Data = new { Error = false, CropGroups = cropGroups.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the cropGroups." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Creates the cropGroup.</summary>
        /// <param name="cropGroup">The cropGroup.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Create(CropGroup cropGroup)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.CropGroups.Add(cropGroup);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false, CropGroup = cropGroup }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed save cropGroup." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the cropGroup.</summary>
        /// <param name="cropGroup">The cropGroup.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Update(CropGroup cropGroup)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.CropGroups.Attach(cropGroup);
                farmContext.Entry(cropGroup).State = System.Data.Entity.EntityState.Modified;
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update cropGroup." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the cropGroup.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Delete(int id)
        {
            try
            {
                var farmContext = new PicolEntities();
                var cropGroup = (from l in farmContext.CropGroups
                             where l.Id == id
                             select l).Single();

                farmContext.CropGroups.Remove(cropGroup);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to delete cropGroup." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
