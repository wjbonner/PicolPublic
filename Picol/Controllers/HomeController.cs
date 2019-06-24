// -----------------------------------------------------------------------
// <copyright file="HomeController.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using Elmah;
    using Picol.Classes;
    using Picol.Decorators;
    using Picol.Models;

    /// <summary>
    /// Class that contains the home/public action implementations
    /// </summary>
    [History(Order = 1)]
    public class HomeController : Controller
    {
        /// <summary>This applications home page</summary>
        /// <returns>A default view object</returns>
        public ActionResult Index()
        {
            try
            {
                this.ViewBag.SelectedLink = "Home";
                var accountContext = new PicolEntities();
                var settings = (from l in accountContext.Settings
                               where l.Name == "HomePage"
                               select l).Single();

                this.ViewData["Source"] = settings.Value;
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Privacy Policy.</summary>
        /// <returns>A base view</returns>
        public ActionResult PrivacyPolicy()
        {
            try
            {
                this.ViewBag.SelectedLink = "PrivacyPolicy";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the state of the database.</summary>
        /// <returns>A JSON encoded state indicator</returns>
        public JsonResult GetDatabaseState()
        {
            try
            {
                var dataContext = new PicolEntities();
                var loadState = (from l in dataContext.Settings
                                where l.Name == "LoadState"
                                select l.Value).SingleOrDefault();

                // Default to offline, then check for online
                bool online = false;

                if (string.IsNullOrEmpty(loadState))
                {
                    // Counterintuitive, but if no state variable we assume it is online
                    online = true;
                }
                else if (loadState == "Complete")
                {
                    online = true;
                }

                return new JsonNetResult { Data = new { Error = false, Online = online }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the database load state." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
