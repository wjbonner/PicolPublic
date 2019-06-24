// -----------------------------------------------------------------------
// <copyright file="NewAccountController.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Web;
    using System.Web.Configuration;
    using System.Web.Mvc;
    using Elmah;
    using Picol.Classes;
    using Picol.Decorators;
    using Picol.Models;

    /// <summary>Class for actions related to creating a new user account</summary>
    [History(Order = 1)]
    public class NewAccountController : Controller
    {
        /// <summary>Action for describing accounts.</summary>
        /// <returns>A view for explaining accounts</returns>
        public ActionResult Index()
        {
            try
            {
                this.ViewBag.SelectedLink = "NewAccount.Index";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Creates this instance.</summary>
        /// <returns>A default view</returns>
        public ActionResult Create()
        {
            try
            {
                this.ViewBag.SelectedLink = "NewAccount.Create";
                User user = new Models.User();
                return this.View(user);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Creates a new account.</summary>
        /// <param name="user">The user object</param>
        /// <param name="passwordConfirmation">The password confirmation.</param>
        /// <returns>A redirect to set the password</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Create(User user, string passwordConfirmation)
        {
            try
            {
                // Track the number of character types in a password
                int characterTypes = 0;

                var picolContext = new PicolEntities();
                var account = from a in picolContext.Users
                              where a.Email == user.Email
                              select a;

                // If the user has a WSU email address register them and direct to WSU login
                if (user.Email.ToLower().Contains("@wsu.edu") && account.Count() == 0)
                {
                    user.Logon = user.Email.Split('@').First();
                    user.Active = true;
                    user.Admin = false;
                    user.Verified = true;
                    user.LastLogin = DateTime.Now;
                    user.Password = null;
                    picolContext.Users.Add(user);
                    picolContext.SaveChanges();

                    return this.RedirectToAction("WsuAuthenticate", "Session", new { });
                }

                // Check if account already exists
                if (account.Count() > 0)
                {
                    return this.RedirectToAction("SendVerification", "NewAccount", new { Id = user.Id });
                }

                // Compare the unhashed password and password confirmation to ensure they match
                if (user.Password.Hash != passwordConfirmation)
                {
                    this.ViewBag.SelectedLink = "NewAccount.Create";
                    this.ViewBag.Message = "Passwords do not match.";
                    user.Password.Hash = string.Empty;
                    this.ModelState.Clear();
                    return this.View(user);
                }

                if (user.Password.Hash.Length < 10)
                {
                    this.ViewBag.SelectedLink = "NewAccount.Create";
                    this.ViewBag.Message = "Password must be at least 10 characters in length.";
                    user.Password.Hash = string.Empty;
                    this.ModelState.Clear();
                    return this.View(user);
                }

                if (user.Password.Hash.Any(c => char.IsUpper(c)))
                {
                    characterTypes++;
                }

                if (user.Password.Hash.Any(c => char.IsLower(c)))
                {
                    characterTypes++;
                }

                if (user.Password.Hash.Any(c => char.IsNumber(c)))
                {
                    characterTypes++;
                }

                if (user.Password.Hash.Any(c => char.IsSymbol(c)))
                {
                    characterTypes++;
                }

                if (characterTypes < 3)
                {
                    this.ViewBag.SelectedLink = "NewAccount.Create";
                    this.ViewBag.Message = "Password must contain three of the four following character types: Upper case letters, lower case letters, numbers, or symbols.";
                    user.Password.Hash = string.Empty;
                    this.ModelState.Clear();
                    return this.View(user);
                }

                user.Password.Hash = Encryption.HashString(user.Password.Hash);
                user.Password.LastSet = DateTime.Now;
                user.Logon = user.Email.Split('@').First();
                user.Active = true;
                user.Admin = false;
                user.Verified = false;
                user.LastLogin = DateTime.Now;
                picolContext.Users.Add(user);
                picolContext.SaveChanges();

                return this.RedirectToAction("SendVerification", "NewAccount", new { Id = user.Id });
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Sends the verification.</summary>
        /// <param name="id">The identifier of the user</param>
        /// <returns>A base view</returns>
        public ActionResult SendVerification(int id)
        {
            try
            {
                this.ViewBag.SelectedLink = "NewAccount.Create";
                var picolContext = new PicolEntities();
                var user = (from u in picolContext.Users
                            where u.Id == id && !u.Verified
                            select u).FirstOrDefault();

                if (user == null)
                {
                    return this.RedirectToAction("Create", "Session", new { Id = user.Id });
                }

                string url = Convert.ToString(WebConfigurationManager.AppSettings["VerificationUrl"]);
                url += "?id=" + id;
                url += "&code=" + HttpUtility.UrlEncode(Encryption.ProtectString(user.Email, new string[] { "Verify" }, true));

                string body = "<html><head></head><body><h2>Verify your new PICOL account</h2><p>We have received a request for a new PICOL account using this email address as the login.  If you did not request this account you can safely discard this email.  If you did request this account, please verify your email address by opening the following confirmation URL: <a href='url_token'>url_token</a>.  This verification email will expire at midnight on " + DateTime.Now.ToShortDateString() + "</p></body></html>";
                body = body.Replace("url_token", url);

                EmailHelper.SendEmail(user.Email, string.Empty, string.Empty, "noreply@wsu.edu", "Verification link for PICOL account", body, true);

                this.ViewBag.Id = id;
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Verifies the specified identifier.</summary>
        /// <param name="id">The identifier.</param>
        /// <param name="code">The code.</param>
        /// <returns>A base view</returns>
        public ActionResult Verify(int id, string code)
        {
            try
            {
                this.ViewBag.SelectedLink = "NewAccount.Create";
                var picolContext = new PicolEntities();
                var user = (from u in picolContext.Users
                            where u.Id == id && !u.Verified
                            select u).First();

                if (Encryption.UnprotectString(code, new string[] { "Verify" }, true) == user.Email)
                {
                    this.ViewBag.Verified = true;
                    this.ViewBag.Message = "Your account has been successfully verified.";
                    user.Verified = true;
                    user.LastLogin = DateTime.Now;
                    picolContext.SaveChanges();
                }
                else
                {
                    this.ViewBag.Verified = false;
                    this.ViewBag.Message = "We could not properly verify your account.";
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
    }
}