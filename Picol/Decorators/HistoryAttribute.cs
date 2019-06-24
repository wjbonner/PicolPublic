// -----------------------------------------------------------------------
// <copyright file="HistoryAttribute.cs" company="Washington State University">
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

    /// <summary>Authenticated Custom Attribute Controller Class</summary>
    public class HistoryAttribute : ActionFilterAttribute
    {
        /// <summary>Controller to run when invoked to track history</summary>
        /// <param name="filterContext">An ActionExecutingContext passed by the invoked controllers</param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                // We retrieve the user info cookie if it exists
                HttpCookie userCookie = filterContext.HttpContext.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"];

                // We build our database context
                var accountContext = new UtilityEntities();

                // We create a new history object and start hoovering in data
                ApplicationHistory record = new ApplicationHistory();
                record.Application = "Picol";

                // We use Convert.ToString() on anything in a object so in the event that the object is null we get an empty string instead of an exception
                record.Path = Convert.ToString(HttpContext.Current.Request.Url.AbsoluteUri);

                // Set the IP address to the x forwarded IP, then test if it is empty
                record.IpAddress = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

                // If X forwarded is empty, check remote address and host address
                if (string.IsNullOrEmpty(record.IpAddress))
                {
                    record.IpAddress = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];

                    if (string.IsNullOrEmpty(record.IpAddress))
                    {
                        record.IpAddress = Convert.ToString(HttpContext.Current.Request.UserHostAddress);
                    }
                }
                else
                {
                    // Using X-Forwarded-For last address
                    record.IpAddress = record.IpAddress.Split(',').Last().Trim();
                }

                // For each key in a form we convert it into a comma delimmited string
                foreach (var f in HttpContext.Current.Request.Form.AllKeys)
                {
                    // Add the name of the key to the string
                    record.Form += f + ":";

                    // If contains sensitive data redact, otherwise record
                    if (f.ToLower().Contains("password") || f.ToLower().Contains("ssn") || f.ToLower().Contains("birthdate") || f.ToLower().Contains("sms") || f.ToLower().Contains("externalemail") || f.ToLower().Contains("response") || f.ToLower().Contains("answer"))
                    {
                        record.Form += "********" + ",";
                    }
                    else
                    {
                        // Add non-password data
                        record.Form += HttpContext.Current.Request.Form[f] + ",";
                    }
                }

                // Foreach querystring variable we convert it into a comma delimmited string
                foreach (var q in HttpContext.Current.Request.QueryString.AllKeys)
                {
                    if (q == null)
                    {
                        continue;
                    }

                    // If contains sensitive data redact, otherwise record
                    if (q.ToLower().Contains("password") || q.ToLower().Contains("ssn") || q.ToLower().Contains("birthdate") || q.ToLower().Contains("sms") || q.ToLower().Contains("externalemail") || q.ToLower().Contains("response") || q.ToLower().Contains("answer"))
                    {
                        record.QueryString += "********" + ",";
                    }
                    else
                    {
                        record.QueryString += HttpContext.Current.Request.QueryString[q] + ",";
                    }
                }

                // If the user info cookie exists we assign the username
                if (userCookie != null)
                {
                    record.UserName = Encryption.UnprotectString(userCookie["Email"], new string[] { "Cookie" }, true);
                }

                // Create out history entry
                record.Created = DateTime.Now;
                accountContext.ApplicationHistories.Add(record);
                accountContext.SaveChanges();

                return;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);

                // Don't redirect on failure because we don't want to disrupt use of the site
                return;
            }
        }
    }
}