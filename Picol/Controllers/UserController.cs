// -----------------------------------------------------------------------
// <copyright file="UserController.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace FarmFinder.Controllers
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

    /// <summary>Controller for administrative actions</summary>
    [WsuAuthenticate(Order = 1)]
    [AdminAuthorize(Order = 2)]
    [History(Order = 3)]
    public class UserController : Controller
    {
        /// <summary>Lists the users.</summary>
        /// <returns>A base view object</returns>
        public ActionResult List()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "User.List";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the users.</summary>
        /// <returns>A JSON encoded collection of users</returns>
        public JsonResult Get()
        {
            try
            {
                var dbContext = new PicolEntities();
                var users = (from l in dbContext.Users
                             select new
                             {
                                 Id = l.Id,
                                 Logon = l.Logon,
                                 FirstName = l.FirstName,
                                 LastName = l.LastName,
                                 Email = l.Email,
                                 Verified = l.Verified,
                                 Active = l.Active,
                                 Admin = l.Admin,
                                 PasswordLastSet = l.Password.LastSet.ToString(),
                                 LastLogin = l.LastLogin.ToString()
                             }).ToList();

                return new JsonNetResult { Data = new { Error = false, Users = users.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the users." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>User details.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A user object</returns>
        public ActionResult Details(int id)
        {
            try
            {
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
                this.ViewBag.Years = new SelectList(year, "Key", "Value", preferences.Where(x => x.Name == "Year").Count() == 1 ? preferences.Where(x => x.Name == "Year").First().Value : "-1");

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

                this.ViewBag.SelectedLink = "Users";
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
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult SetPreference(string name, string value, int id)
        {
            try
            {
                var dbContext = new PicolEntities();
                var statePreference = (from s in dbContext.UserPreferences
                                       where s.UserId == id
                                       && s.Name == name
                                       && !s.User.Admin
                                       select s).SingleOrDefault();

                if (statePreference == null)
                {
                    UserPreference preference = new UserPreference();
                    preference.UserId = id;
                    preference.Name = name;
                    preference.Value = value;
                    dbContext.UserPreferences.Add(preference);
                }
                else
                {
                    statePreference.Value = value;
                }

                dbContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to set preference." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Creates the user.</summary>
        /// <param name="user">The user.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Create(User user)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Users.Add(user);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false, User = user }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed save user." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the user.</summary>
        /// <param name="user">The user.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Update(User user)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Users.Attach(user);
                farmContext.Entry(user).State = System.Data.Entity.EntityState.Modified;
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update user." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the user.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Delete(int id)
        {
            try
            {
                var farmContext = new PicolEntities();
                var user = (from l in farmContext.Users
                             where l.Id == id
                             select l).Single();

                farmContext.Users.Remove(user);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to delete user." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Sends the recovery email.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult SendRecoveryEmail(int id)
        {
            try
            {
                var picolContext = new PicolEntities();
                var user = (from l in picolContext.Users
                            where l.Id == id
                            select l).Single();

                string url = Convert.ToString(WebConfigurationManager.AppSettings["ResetUrl"]);
                url += "?id=" + id;
                url += "&code=" + HttpUtility.UrlEncode(Encryption.ProtectString(user.Email, new string[] { "Reset" }, true));

                string body = "<html><head></head><body><h2>Recover your PICOL account</h2><p>We have received a request to reset the password to your PICOL account.  If you did not request this you can safely discard this email.  If you did request this, please verify your email address by opening the following recovery URL: <a href='url_token'>url_token</a></p></body></html>";
                body = body.Replace("url_token", url);

                EmailHelper.SendEmail(user.Email, string.Empty, string.Empty, "noreply@wsu.edu", "Recovery link for PICOL account", body, true);

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to delete user." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
