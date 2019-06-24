// -----------------------------------------------------------------------
// <copyright file="AuthenticateAttribute.cs" company="Washington State University">
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
    public class AuthenticateAttribute : ActionFilterAttribute
    {
        /// <summary>Controller to run when invoked to determine if a user is logged on or not</summary>
        /// <param name="filterContext">An ActionExecutingContext passed by the invoked controllers</param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                HttpCookie authenticationCookie = filterContext.HttpContext.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authentication"];

                if (authenticationCookie == null)
                {
                    filterContext.Result = new RedirectResult("~/Message/Error/NotAuthenticated");
                }
                else
                {
                    bool authenticated = Convert.ToBoolean(Encryption.UnprotectString(authenticationCookie["Authenticated"], new string[] { "Cookie" }, true));

                    if (!authenticated)
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