// -----------------------------------------------------------------------
// <copyright file="AdminAuthorizeAttribute.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Decorators
{
    using System;
    using System.Web;
    using System.Web.Configuration;
    using System.Web.Mvc;
    using Elmah;
    using Picol.Classes;

    /// <summary>Authorized Custom Attribute Controller Class</summary>
    public class AdminAuthorizeAttribute : ActionFilterAttribute
    {
        /// <summary>Controller to run when invoked to determine if a user is logged on or not</summary>
        /// <param name="filterContext">An ActionExecutingContext passed by the invoked controllers</param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                HttpCookie authorizationCookie = filterContext.HttpContext.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authorization"];

                if (authorizationCookie == null)
                {
                    filterContext.Result = new RedirectResult("~/Message/Error/NotAuthorized");
                }
                else
                {
                    bool isAdmin = Convert.ToBoolean(Encryption.UnprotectString(authorizationCookie["Admin"], new string[] { "Cookie" }, true));

                    if (!isAdmin)
                    {
                        filterContext.Result = new RedirectResult("~/Message/Error/NotAuthorized");
                    }
                }
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                filterContext.Result = new RedirectResult("~/Message/Error/NotAuthorized");
            }
        }
    }
}