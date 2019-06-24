// -----------------------------------------------------------------------
// <copyright file="SessionController.cs" company="Washington State University">
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

    /// <summary>Class for actions that govern the handling of user sessions</summary>
    [History(Order = 1)]
    public class SessionController : Controller
    {
        /// <summary>Creates a new session.</summary>
        /// <returns>A default view</returns>
        public ActionResult Create()
        {
            try
            {
                this.ViewBag.SelectedLink = "Session.Create";
                return this.View(new User());
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Creates a new session.</summary>
        /// <param name="user">The user object to verify</param>
        /// <returns>A default view or a redirect</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Create(User user)
        {
            try
            {
                var picolContext = new PicolEntities();
                var storedUser = (from u in picolContext.Users
                                  where u.Email == user.Email && u.Verified
                                  select u).SingleOrDefault();

                // Check if user exists and is verified
                if (storedUser == null)
                {
                    this.ViewBag.Message = "No matching username/password combination found.";
                    return this.View();
                }

                // If the user has a WSU email address direct to WSU login
                if (user.Email.ToLower().Contains("@wsu.edu"))
                {
                    return this.RedirectToAction("WsuAuthenticate", "Session", new { });
                }

                if (Encryption.VerifyHash(user.Password.Hash, storedUser.Password.Hash))
                {
                    // We check if we are in an environment that has SSL
                    if (!Convert.ToBoolean(WebConfigurationManager.AppSettings["ValidateSsl"]))
                    {
                        System.Net.ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;
                    }

                    // We create a specific time that all cookies will expire at
                    DateTime cookieExpiration = DateTime.Now.AddHours(2);

                    // We craft a cookie to store authentication information
                    HttpCookie authenticationCookie = new HttpCookie(Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authentication");
                    authenticationCookie.Values["Authenticated"] = Encryption.ProtectString(Convert.ToString(true), new string[] { "Cookie" }, true);
                    authenticationCookie.Secure = Convert.ToBoolean(WebConfigurationManager.AppSettings["SecureCookie"]);
                    authenticationCookie.Expires = cookieExpiration;
                    authenticationCookie.HttpOnly = true;

                    // We can check a users authorizations in our system and create a cookie for them here
                    HttpCookie authorizationCookie = new HttpCookie(Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authorization");
                    authorizationCookie.Values.Add("User", Encryption.ProtectString(Convert.ToString(true), new string[] { "Cookie" }, true));
                    authorizationCookie.Values.Add("Admin", Encryption.ProtectString(Convert.ToString(storedUser.Admin), new string[] { "Cookie" }, true));
                    authorizationCookie.Secure = Convert.ToBoolean(WebConfigurationManager.AppSettings["secureCookie"]);
                    authorizationCookie.Expires = cookieExpiration;
                    authorizationCookie.HttpOnly = true;

                    HttpCookie userCookie = new HttpCookie(Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User");
                    userCookie.Values.Add("Id", Encryption.ProtectString(Convert.ToString(storedUser.Id), new string[] { "Cookie" }, true));
                    userCookie.Values.Add("Email", Encryption.ProtectString(storedUser.Email, new string[] { "Cookie" }, true));
                    userCookie.Values.Add("Wsu", Encryption.ProtectString(Convert.ToString(false), new string[] { "Cookie" }, true));
                    userCookie.Secure = Convert.ToBoolean(WebConfigurationManager.AppSettings["SecureCookie"]);
                    userCookie.Expires = cookieExpiration;
                    userCookie.HttpOnly = true;

                    this.HttpContext.Response.Cookies.Add(authenticationCookie);
                    this.HttpContext.Response.Cookies.Add(authorizationCookie);
                    this.HttpContext.Response.Cookies.Add(userCookie);

                    storedUser.LastLogin = DateTime.Now;
                    picolContext.SaveChanges();

                    return this.RedirectToAction("Details", "Account", new { });
                }
                else
                {
                    this.ViewBag.Message = "No matching username/password combination found.";
                    return this.View();
                }
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Recovers this instance.</summary>
        /// <returns>A blank user</returns>
        public ActionResult Recover()
        {
            try
            {
                this.ViewBag.SelectedLink = "Session.Create";
                return this.View(new User());
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Recovers this instance.</summary>
        /// <param name="user">The user.</param>
        /// <returns>An action confirmation</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Recover(User user)
        {
            try
            {
                this.ViewBag.SelectedLink = "NewSession.Create";
                var picolContext = new PicolEntities();
                var stored = (from u in picolContext.Users
                            where u.Email == user.Email
                            select u).FirstOrDefault();

                this.ViewBag.Message = "If an account with the specified email address was found, then a recovery email has been sent.";

                if (stored == null)
                {
                    return this.View(user);
                }

                string url = Convert.ToString(WebConfigurationManager.AppSettings["ResetUrl"]);
                url += "?id=" + stored.Id;
                url += "&code=" + HttpUtility.UrlEncode(Encryption.ProtectString(user.Email, new string[] { "Reset" }, true));

                string body = "<html><head></head><body><h2>Recover your PICOL account</h2><p>We have received a request to reset the password to your PICOL account.  If you did not request this you can safely discard this email.  If you did request this, please verify your email address by opening the following recovery URL: <a href='url_token'>url_token</a></p></body></html>";
                body = body.Replace("url_token", url);

                EmailHelper.SendEmail(user.Email, string.Empty, string.Empty, "noreply@wsu.edu", "Recovery link for PICOL account", body, true);

                this.ViewBag.Id = stored.Id;
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Resets the specified password.</summary>
        /// <param name="id">The identifier.</param>
        /// <param name="code">The code.</param>
        /// <returns>A success indicator</returns>
        public ActionResult Reset(int id, string code)
        {
            try
            {
                this.ViewBag.SelectedLink = "NewSession.Create";
                var picolContext = new PicolEntities();
                var user = (from u in picolContext.Users
                            where u.Id == id
                            select u).First();

                if (Encryption.UnprotectString(code, new string[] { "Reset" }, true) == user.Email)
                {
                    string password = Encryption.GetUniqueKey(16);
                    this.ViewBag.Reset = true;
                    this.ViewBag.Message = "Your password was successfully reset to: " + password;
                    user.Password.Hash = Encryption.HashString(password);
                    user.Password.LastSet = DateTime.Now;
                    picolContext.SaveChanges();
                }
                else
                {
                    this.ViewBag.Reset = false;
                    this.ViewBag.Message = "We could not properly verify your password reset request.";
                }

                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Authenticates the user using WSU authentication</summary>
        /// <returns>A redirect to the account details</returns>
        [WsuAuthenticate(Order = 1)]
        public ActionResult WsuAuthenticate()
        {
            try
            {
                return this.RedirectToAction("Details", "Account", new { });
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Destroys the current user session.</summary>
        /// <returns>A default view</returns>
        public ActionResult Destroy()
        {
            try
            {
                HttpCookie authenticationCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authentication"];
                HttpCookie authorizationCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authorization"];
                HttpCookie userInfoCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"];

                if (authenticationCookie != null)
                {
                    authenticationCookie.Expires = DateTime.Now.AddHours(-1);
                    this.Response.Cookies.Add(authenticationCookie);
                    this.Request.Cookies.Remove(Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authentication");
                }

                if (authorizationCookie != null)
                {
                    authorizationCookie.Expires = DateTime.Now.AddHours(-1);
                    this.Response.Cookies.Add(authorizationCookie);
                    this.Request.Cookies.Remove(Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authorization");
                }

                if (userInfoCookie != null)
                {
                    userInfoCookie.Expires = DateTime.Now.AddHours(-1);
                    this.Response.Cookies.Add(userInfoCookie);
                    this.Request.Cookies.Remove(Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User");
                }

                this.ViewBag.SelectedLink = "Session.Destroy";
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