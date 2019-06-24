// -----------------------------------------------------------------------
// <copyright file="MessageController.cs" company="Washington State University">
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
    using Picol.Decorators;

    /// <summary>Class for handling errors and displaying them to the user</summary>
    [History(Order = 1)]
    public class MessageController : Controller
    {
        /// <summary>Displays error messages to the user</summary>
        /// <param name="id">The id of the error</param>
        /// <returns>Returns a default view and a error message to display</returns>
        public ActionResult Error(string id)
        {
            switch (id)
            {
                case "NotAuthenticated":
                    HttpCookie authenticationCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authentication"];
                    HttpCookie authorizationCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authorization"];
                    HttpCookie userInfoCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"];

                    if (authenticationCookie != null)
                    {
                        authenticationCookie.Expires = DateTime.Now.AddHours(-1);
                        this.Response.Cookies.Add(authenticationCookie);
                    }

                    if (authorizationCookie != null)
                    {
                        authenticationCookie.Expires = DateTime.Now.AddHours(-1);
                        this.Response.Cookies.Add(authenticationCookie);
                    }

                    if (userInfoCookie != null)
                    {
                        userInfoCookie.Expires = DateTime.Now.AddHours(-1);
                        this.Response.Cookies.Add(userInfoCookie);
                    }

                    this.ViewBag.Message = "You were not successfully authenticated.";
                    break;
                case "NotAuthorized":
                    this.ViewBag.NoTrust = true;
                    this.ViewBag.Message = "You are not authorized for the report you are attempting to access.";
                    break;
                case "BlackListed":
                    this.ViewBag.NoTrust = true;
                    this.ViewBag.Message = "Your account has been blacklisted.  You must change your password at http://wsu.edu/pwr and within fifteen minutes your account should be removed from the black list";
                    break;
                case "SSOFailure":
                    this.ViewBag.Message = "There was an error with the university Single Sign On system.";
                    break;
                case "ValidationFailed":
                    this.ViewBag.Message = "There was an error when attempting to validate the data.";
                    break;
                case "CreateFailed":
                    this.ViewBag.Message = "There was an error creating the record.";
                    break;
                case "LoadFailed":
                    this.ViewBag.Message = "There was an error loading the requested page.  This is most likely because a required resource, such as a data from a database was unavailable, or there was an unexpected error handling the data.";
                    break;
                case "NotificationFailed":
                    this.ViewBag.Message = "There was an error sending out a notification.  This usually happens after a record was created and an email notification or confirmation failed to be sent. ";
                    break;
                case "404":
                    this.ViewBag.Message = "The page you requested could not be found, or your request could not be processed properly.  This can happen because of an incorrect link, invalid parameters in the URL path, or mistyped URL.";
                    break;
                case "500":
                    this.ViewBag.Message = "The page you requested resulted in an unhandled server error occurring.  This can often occur because of a malformed URL where a parameter does not match the data type expected.";
                    break;
                default:
                    this.ViewBag.Message = "An unknown error has occurred.";
                    break;
            }

            return this.View();
        }

        /// <summary>Logoffs this instance.</summary>
        /// <returns>A default view</returns>
        public ActionResult LoggedOut()
        {
            HttpCookie authenticationCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authentication"];
            HttpCookie authorizationCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authorization"];
            HttpCookie userInfoCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"];

            if (authenticationCookie != null)
            {
                authenticationCookie.Expires = DateTime.Now.AddHours(-1);
                this.Response.Cookies.Add(authenticationCookie);
            }

            if (authorizationCookie != null)
            {
                authenticationCookie.Expires = DateTime.Now.AddHours(-1);
                this.Response.Cookies.Add(authenticationCookie);
            }

            if (userInfoCookie != null)
            {
                userInfoCookie.Expires = DateTime.Now.AddHours(-1);
                this.Response.Cookies.Add(userInfoCookie);
            }

            this.Session.Abandon();

            return this.View();
        }
    }
}
