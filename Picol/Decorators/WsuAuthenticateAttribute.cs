// -----------------------------------------------------------------------
// <copyright file="WsuAuthenticateAttribute.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Decorators
{
    using System;
    using System.Collections.Generic;
    using System.Collections.Specialized;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Net;
    using System.Web;
    using System.Web.Configuration;
    using System.Web.Mvc;
    using System.Web.Security;
    using Elmah;
    using Newtonsoft.Json;
    using Picol.Classes;
    using Picol.Models;

    /// <summary>Authorized Custom Attribute Controller Class</summary>
    public class WsuAuthenticateAttribute : ActionFilterAttribute
    {
        /// <summary>Controller to run when invoked to determine if a user is logged on or not</summary>
        /// <param name="filterContext">An ActionExecutingContext passed by the invoked controllers</param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                // We create a specific time that all cookies will expire at
                DateTime cookieExpiration = DateTime.Now.AddHours(2);

                // We can check a users authorizations in our system and create a cookie for them here
                HttpCookie authorizationCookie = new HttpCookie(Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authorization");
                authorizationCookie.Values.Add("User", Encryption.ProtectString(Convert.ToString(true), new string[] { "Cookie" }, true));
                authorizationCookie.Values.Add("Admin", Encryption.ProtectString(Convert.ToString(true), new string[] { "Cookie" }, true));
                authorizationCookie.Secure = Convert.ToBoolean(WebConfigurationManager.AppSettings["SecureCookie"]);
                authorizationCookie.Expires = cookieExpiration;
                authorizationCookie.HttpOnly = true;

                // We flesh out the rest of the authentication cookie
                HttpCookie authenticationCookie = new HttpCookie(Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authentication");
                authenticationCookie.Values["Authenticated"] = Encryption.ProtectString(Convert.ToString(true), new string[] { "Cookie" }, true);
                authenticationCookie.Values.Add("LogoutUrl", Encryption.ProtectString(WebConfigurationManager.AppSettings["LogoutUrl"], new string[] { "Cookie" }, true));
                authenticationCookie.Secure = Convert.ToBoolean(WebConfigurationManager.AppSettings["SecureCookie"]);
                authenticationCookie.Expires = cookieExpiration;
                authenticationCookie.HttpOnly = true;

                // We craft a cookie to store user info
                HttpCookie userCookie = new HttpCookie(Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User");
                userCookie = new HttpCookie(Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User");
                userCookie.Values.Add("Id", Encryption.ProtectString(Convert.ToString(0), new string[] { "Cookie" }, true));
                userCookie.Values.Add("Email", Encryption.ProtectString("noreply@wdomain.edu", new string[] { "Cookie" }, true));
                userCookie.Values.Add("Wsu", Encryption.ProtectString(Convert.ToString(true), new string[] { "Cookie" }, true));
                userCookie.Secure = Convert.ToBoolean(WebConfigurationManager.AppSettings["SecureCookie"]);
                userCookie.Expires = cookieExpiration;
                userCookie.HttpOnly = true;

                filterContext.HttpContext.Response.Cookies.Add(userCookie);
                filterContext.HttpContext.Response.Cookies.Add(authorizationCookie);
                filterContext.HttpContext.Response.Cookies.Add(authenticationCookie);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                filterContext.Result = new RedirectResult("~/Message/Error/NotAuthenticated");
            }
        }
    }
}