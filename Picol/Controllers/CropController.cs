// -----------------------------------------------------------------------
// <copyright file="CropController.cs" company="Washington State University">
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
    public class CropController : Controller
    {
        /// <summary>Lists the crops.</summary>
        /// <returns>A base view object</returns>
        public ActionResult List()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "Crop.List";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the crops.</summary>
        /// <returns>A JSON encoded collection of crops</returns>
        public JsonResult Get()
        {
            try
            {
                var farmContext = new PicolEntities();
                var crops = from l in farmContext.Crops
                             select new
                             {
                                 Id = l.Id,
                                 Name = l.Name,
                                 Code = l.Code,
                                 Notes = l.Notes
                             };

                return new JsonNetResult { Data = new { Error = false, Crops = crops.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the crops." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Creates the crop.</summary>
        /// <param name="crop">The crop.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Create(Crop crop)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Crops.Add(crop);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false, Crop = crop }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed save crop." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the crop.</summary>
        /// <param name="crop">The crop.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Update(Crop crop)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Crops.Attach(crop);
                farmContext.Entry(crop).State = System.Data.Entity.EntityState.Modified;
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update crop." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the crop.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Delete(int id)
        {
            try
            {
                var farmContext = new PicolEntities();
                var crop = (from l in farmContext.Crops
                             where l.Id == id
                             select l).Single();

                farmContext.Crops.Remove(crop);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to delete crop." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
