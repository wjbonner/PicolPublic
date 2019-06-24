// -----------------------------------------------------------------------
// <copyright file="AccountController.cs" company="Washington State University">
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

    /// <summary>Class for actions related to existing user accounts</summary>
    [Authenticate(Order = 1)]
    [UserAuthorize(Order = 2)]
    [History(Order = 3)]
    public class AccountController : Controller
    {
        /// <summary>Details this user.</summary>
        /// <returns>A details view of the current users account</returns>
        public ActionResult Details()
        {
            try
            {
                int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var picolContext = new PicolEntities();
                var user = (from u in picolContext.Users
                            where u.Id == id
                            select u).Single();

                var preferences = from s in picolContext.UserPreferences
                                  where s.UserId == id
                                  select s;

                var states = (from c in picolContext.States
                              select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                states.Insert(0, new { Id = -1, Name = "Both" });
                states.Insert(0, new { Id = -2, Name = "Not Set" });
                this.ViewBag.States = new SelectList(states, "Id", "Name", preferences.Where(x => x.Name == "State").Count() == 1 ? preferences.Where(x => x.Name == "State").First().Value : "-2");

                var users = (from c in picolContext.IntendedUsers
                             select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                users.Insert(0, new { Id = -1, Name = "All" });
                users.Insert(0, new { Id = -2, Name = "Not Set" });
                this.ViewBag.Users = new SelectList(users, "Id", "Name", preferences.Where(x => x.Name == "IntendedUser").Count() == 1 ? preferences.Where(x => x.Name == "IntendedUser").First().Value : "-2");

                Dictionary<string, string> i502 = new Dictionary<string, string>();
                i502.Add("-1", "No Filter");
                i502.Add("true", "Yes");
                i502.Add("false", "No");
                this.ViewBag.I502s = new SelectList(i502, "Key", "Value", preferences.Where(x => x.Name == "I502").Count() == 1 ? preferences.Where(x => x.Name == "I502").First().Value : "-1");

                Dictionary<string, string> essb = new Dictionary<string, string>();
                essb.Add("-1", "No Filter");
                essb.Add("true", "Yes");
                essb.Add("false", "No");
                this.ViewBag.Essbs = new SelectList(essb, "Key", "Value", preferences.Where(x => x.Name == "Essb").Count() == 1 ? preferences.Where(x => x.Name == "Essb").First().Value : "-1");

                Dictionary<string, string> organic = new Dictionary<string, string>();
                organic.Add("-1", "No Filter");
                organic.Add("true", "Yes");
                organic.Add("false", "No");
                this.ViewBag.Organics = new SelectList(organic, "Key", "Value", preferences.Where(x => x.Name == "Organic").Count() == 1 ? preferences.Where(x => x.Name == "Organic").First().Value : "-1");

                Dictionary<string, string> year = new Dictionary<string, string>();
                year.Add("true", "Current");
                year.Add("-1", "All");
                year.Add("-2", "Not set");
                this.ViewBag.Years = new SelectList(year, "Key", "Value", preferences.Where(x => x.Name == "Year").Count() == 1 ? preferences.Where(x => x.Name == "Year").First().Value : "-2");

                Dictionary<string, string> ground = new Dictionary<string, string>();
                ground.Add("-1", "No Filter");
                ground.Add("true", "Yes");
                ground.Add("false", "No");
                this.ViewBag.Grounds = new SelectList(ground, "Key", "Value", preferences.Where(x => x.Name == "Ground").Count() == 1 ? preferences.Where(x => x.Name == "Ground").First().Value : "-1");

                Dictionary<string, string> spanish = new Dictionary<string, string>();
                spanish.Add("-1", "No Filter");
                spanish.Add("true", "Yes");
                spanish.Add("false", "No");
                this.ViewBag.Spanishs = new SelectList(spanish, "Key", "Value", preferences.Where(x => x.Name == "Spanish").Count() == 1 ? preferences.Where(x => x.Name == "Spanish").First().Value : "-1");

                Dictionary<string, string> esa = new Dictionary<string, string>();
                esa.Add("-1", "No Filter");
                esa.Add("true", "Yes");
                esa.Add("false", "No");
                this.ViewBag.Esas = new SelectList(esa, "Key", "Value", preferences.Where(x => x.Name == "Esa").Count() == 1 ? preferences.Where(x => x.Name == "Esa").First().Value : "-1");

                this.ViewBag.SelectedLink = "Account.Details";
                return this.View(user);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Sets the preference.</summary>
        /// <param name="name">The name.</param>
        /// <param name="value">The value.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult SetPreference(string name, string value)
        {
            try
            {
                int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var dbContext = new PicolEntities();

                var userPreference = (from s in dbContext.UserPreferences
                                       where s.UserId == id
                                       && s.Name == name
                                       select s).SingleOrDefault();

                if (userPreference == null)
                {
                    UserPreference preference = new UserPreference();
                    preference.UserId = id;
                    preference.Name = name;
                    preference.Value = value;
                    dbContext.UserPreferences.Add(preference);
                }
                else if (value == "-2")
                {
                    dbContext.UserPreferences.Remove(userPreference);
                }
                else
                {
                    userPreference.Value = value;
                }

                dbContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Gets the preference.</summary>
        /// <param name="name">The name.</param>
        /// <returns>A JSON encoded value and success indicator</returns>
        public JsonResult GetPreference(string name)
        {
            try
            {
                HttpCookie authorizationCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authorization"];
                string value = string.Empty;

                if (authorizationCookie != null)
                {
                    if (Convert.ToBoolean(Encryption.UnprotectString(authorizationCookie["User"], new string[] { "Cookie" }, true)))
                    {
                        int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));
                        var dbContext = new PicolEntities();

                        value = (from s in dbContext.UserPreferences
                                 where s.UserId == id
                                 && s.Name == name
                                 select s.Value).SingleOrDefault();
                    }
                }

                return new JsonNetResult { Data = new { Error = false, Value = value }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the first name.</summary>
        /// <param name="value">The value.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult UpdateFirstName(string value)
        {
            try
            {
                int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var dbContext = new PicolEntities();
                var user = (from u in dbContext.Users
                            where u.Id == id
                            select u).SingleOrDefault();

                user.FirstName = value;
                dbContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to save name." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the last name.</summary>
        /// <param name="value">The value.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult UpdateLastName(string value)
        {
            try
            {
                int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var dbContext = new PicolEntities();
                var user = (from u in dbContext.Users
                            where u.Id == id
                            select u).SingleOrDefault();

                user.LastName = value;
                dbContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to save name." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Resets the password.</summary>
        /// <returns>A base view</returns>
        public ActionResult ResetPassword()
        {
            try
            {
                int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var picolContext = new PicolEntities();
                var user = (from u in picolContext.Users
                            where u.Id == id
                            select u).Single();

                this.ViewData["WsuReset"] = false;
                if (user.Email.ToLower().Contains("@wsu.edu"))
                {
                    this.ViewData["WsuReset"] = true;
                }

                this.ViewBag.SelectedLink = "Account.ResetPassword";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Resets the password</summary>
        /// <param name="currentPassword">The current password.</param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="passwordConfirmation">The confirmation password.</param>
        /// <returns>A redirect to set the password</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ResetPassword(string currentPassword, string newPassword, string passwordConfirmation)
        {
            try
            {
                this.ViewBag.SelectedLink = "Account.ResetPassword";

                HttpCookie userCookie = this.HttpContext.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"];
                int id = Convert.ToInt32(Encryption.UnprotectString(userCookie["Id"], new string[] { "Cookie" }, true));

                // Track the number of character types in a password
                int characterTypes = 0;

                var picolContext = new PicolEntities();
                var account = (from a in picolContext.Users
                               where a.Id == id
                               select a).SingleOrDefault();

                // Check if account already exists
                if (account == null)
                {
                    return this.View();
                }

                // Compare the unhashed password and password confirmation to ensure they match
                if (newPassword != passwordConfirmation)
                {
                    this.ViewBag.Message = "Passwords do not match.";
                    return this.View();
                }

                if (!Encryption.VerifyHash(currentPassword, account.Password.Hash))
                {
                    this.ViewBag.Message = "The current password is incorrect.";
                    return this.View();
                }

                if (newPassword.Length < 10)
                {
                    this.ViewBag.SelectedLink = "Account.ResetPassword";
                    this.ViewBag.Message = "Password must be at least 10 characters in length.";
                    account.Password.Hash = string.Empty;
                    return this.View();
                }

                if (newPassword.Any(c => char.IsUpper(c)))
                {
                    characterTypes++;
                }

                if (newPassword.Any(c => char.IsLower(c)))
                {
                    characterTypes++;
                }

                if (newPassword.Any(c => char.IsNumber(c)))
                {
                    characterTypes++;
                }

                if (newPassword.Any(c => char.IsSymbol(c)))
                {
                    characterTypes++;
                }

                if (characterTypes < 3)
                {
                    this.ViewBag.Message = "Password must contain three of the four following character types: Upper case letters, lower case letters, numbers, or symbols.";
                    return this.View();
                }

                account.Password.Hash = Encryption.HashString(newPassword);
                account.Password.LastSet = DateTime.Now;
                this.ViewBag.Message = "Password sucessfully updated!";
                picolContext.SaveChanges();
                this.ModelState.Clear();

                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Updates the email.</summary>
        /// <returns>A base view</returns>
        public ActionResult UpdateEmail()
        {
            try
            {
                int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var picolContext = new PicolEntities();
                var user = (from u in picolContext.Users
                            where u.Id == id
                            select u).Single();

                this.ViewBag.SelectedLink = "Account.UpdateEmail";
                return this.View(user);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Activitieses this instance.</summary>
        /// <returns>A view listing the account activities</returns>
        public ActionResult Activities()
        {
            try
            {
                int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var picolContext = new PicolEntities();
                var utilityContext = new UtilityEntities();

                var user = (from u in picolContext.Users
                            where u.Id == id
                            select u).Single();

                var histories = (from h in utilityContext.ApplicationHistories
                                 where h.UserName == user.Email
                                 select h).OrderByDescending(x => x.Created);

                this.ViewBag.SelectedLink = "Account.Activities";
                return this.View(histories);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Clears the history.</summary>
        /// <returns>A view confirming the clearing on the users history.</returns>
        public ActionResult ClearHistory()
        {
            try
            {
                int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var picolContext = new PicolEntities();
                var utilityContext = new UtilityEntities();

                var user = (from u in picolContext.Users
                            where u.Id == id
                            select u).Single();

                var histories = from h in utilityContext.ApplicationHistories
                                where h.UserName == user.Email
                                select h;

                utilityContext.ApplicationHistories.RemoveRange(histories);
                utilityContext.SaveChanges();

                this.ViewBag.SelectedLink = "Account.ClearHistory";
                return this.View(histories);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Requests the API key.</summary>
        /// <returns>ToS and user data</returns>
        public ActionResult RequestApiKey()
        {
            try
            {
                this.ViewBag.SelectedLink = "Account.RequestApiKey";
                int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var picolContext = new PicolEntities();
                var user = (from u in picolContext.Users
                            where u.Id == id
                            select u).Single();

                var tosSetting = (from l in picolContext.Settings
                                where l.Name == "ApiTos"
                                select l).Single();

                var useSetting = (from l in picolContext.Settings
                                  where l.Name == "ApiUse"
                                  select l).Single();

                this.ViewData["ApiTos"] = tosSetting.Value;
                this.ViewData["ApiUse"] = useSetting.Value;
                this.ViewData["Account"] = user.Email;
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Submits the API key request.</summary>
        /// <param name="name">The name.</param>
        /// <param name="acceptedTos">if set to <c>true</c> [accepted tos].</param>
        /// <param name="intendedUse">The intended use.</param>
        /// <returns>A JSON encoded success indicator</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        [ValidateInput(false)]
        public JsonResult SubmitApiKeyRequest(string name, bool acceptedTos, string intendedUse)
        {
            try
            {
                if (!acceptedTos)
                {
                    return new JsonNetResult { Data = new { Error = true, ErrorMessage = "You must accept the terms of service." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }

                int id = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var picolContext = new PicolEntities();
                var settings = (from l in picolContext.Settings
                                where l.Name == "ApiTos"
                                select l).Single();

                ApiKey key = new ApiKey();
                key.ApprovalDate = null;
                key.Approved = false;
                key.ApprovedBy = null;
                key.DateAccepted = DateTime.Now;
                key.ProposedUse = intendedUse;
                key.Name = name;
                key.Value = Guid.NewGuid().ToString();
                key.TermsOfService = settings.Value;
                key.UserId = id;
                key.Active = false;
                key.Notes = string.Empty;
                picolContext.ApiKeys.Add(key);
                picolContext.SaveChanges();

                var user = (from u in picolContext.Users
                           where u.Id == id
                           select u).Single();

                var admins = (from u in picolContext.Users
                              where u.Admin
                              select u.Email).ToList();

                EmailHelper.SendEmail(user.Email, string.Empty, string.Empty, "noreply@wsu.edu", "For your record - PICOL Terms of Service", "<h2>Thank you for requesting an API KEY for PICOL</h2><p>We have received your request, and you will be notified when your API key is approved, or if we need additional information to process your request.  For your records, here is the Terms of Service you agreed to when requesting an API key.</p>" + settings.Value, true);
                EmailHelper.SendEmail(admins, new List<string>(), new List<string>(), "noreply@wsu.edu", "A new API key has been requested in PICOL", string.Empty, false);

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to submit the request." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the search.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A redirect to the details action</returns>
        public ActionResult DeleteSearch(int id)
        {
            try
            {
                int userId = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var picolContext = new PicolEntities();
                var search = (from l in picolContext.Searches
                                where l.Id == id && l.UserId == userId
                                select l).Single();

                picolContext.Searches.Remove(search);
                picolContext.SaveChanges();

                return this.RedirectToAction("Details", "Account", null);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to submit the request." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the name of the search.</summary>
        /// <param name="id">The identifier.</param>
        /// <param name="name">The name.</param>
        /// <returns>JSON encoded success indicator</returns>
        public JsonResult UpdateSearchName(int id, string name)
        {
            try
            {
                int userId = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                var picolContext = new PicolEntities();
                var search = (from l in picolContext.Searches
                              where l.Id == id && l.UserId == userId
                              select l).Single();

                search.Name = name;
                picolContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to submit the request." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}