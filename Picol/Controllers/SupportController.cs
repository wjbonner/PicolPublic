// -----------------------------------------------------------------------
// <copyright file="SupportController.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Controllers
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

    /// <summary>
    /// Class that contains the home/public action implementations
    /// </summary>
    [History(Order = 3)]
    public class SupportController : Controller
    {
        /// <summary>This applications home page</summary>
        /// <returns>A default view object</returns>
        public ActionResult Faq()
        {
            try
            {
                this.ViewBag.SelectedLink = "Help.Faq";
                var picolContext = new PicolEntities();
                var faqSetting = (from l in picolContext.Settings
                                  where l.Name == "Faq"
                                  select l).SingleOrDefault();

                this.ViewData["Faq"] = faqSetting.Value;
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Videoes the tutorials.</summary>
        /// <returns>A base view</returns>
        public ActionResult VideoTutorials()
        {
            try
            {
                this.ViewBag.SelectedLink = "Help.VideoTutorials";
                var picolContext = new PicolEntities();
                var videoSetting = (from l in picolContext.Settings
                                  where l.Name == "VideoTutorials"
                                  select l).SingleOrDefault();

                this.ViewData["VideoTutorials"] = videoSetting.Value;
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
    }
}
