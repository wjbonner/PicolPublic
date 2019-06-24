// -----------------------------------------------------------------------
// <copyright file="RegistrantController.cs" company="Washington State University">
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
    public class RegistrantController : Controller
    {
        /// <summary>Lists the registrants.</summary>
        /// <returns>A base view object</returns>
        public ActionResult List()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "Registrant.List";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the registrants.</summary>
        /// <returns>A JSON encoded collection of registrants</returns>
        public JsonResult Get()
        {
            try
            {
                var farmContext = new PicolEntities();
                var registrants = from l in farmContext.Registrants
                             select new
                             {
                                 Id = l.Id,
                                 Code = l.Code,
                                 Name = l.Name,
                                 AddressOne = l.AddressOne,
                                 AddressTwo = l.AddressTwo,
                                 City = l.City,
                                 State = l.State,
                                 Zip = l.Zip,
                                 Country = l.Country,
                                 Foreign = l.Foreign,
                                 Contact = l.Contact,
                                 Phone = l.Phone,
                                 EmergencyPhone = l.EmergencyPhone,
                                 Email = l.Email,
                                 Url = l.Url,
                                 Notes = l.Notes,
                                 Tier = l.Tier
                             };

                return new JsonNetResult { Data = new { Error = false, Registrants = registrants.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the registrants." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Creates the registrant.</summary>
        /// <param name="registrant">The registrant.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Create(Registrant registrant)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Registrants.Add(registrant);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false, Registrant = registrant }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed save registrant." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the registrant.</summary>
        /// <param name="registrant">The registrant.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Update(Registrant registrant)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Registrants.Attach(registrant);
                farmContext.Entry(registrant).State = System.Data.Entity.EntityState.Modified;
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update registrant." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the registrant.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Delete(int id)
        {
            try
            {
                var farmContext = new PicolEntities();
                var registrant = (from l in farmContext.Registrants
                             where l.Id == id
                             select l).Single();

                farmContext.Registrants.Remove(registrant);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to delete registrant." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
