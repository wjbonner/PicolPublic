// -----------------------------------------------------------------------
// <copyright file="SearchController.cs" company="Washington State University">
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
    using Newtonsoft.Json.Linq;
    using Picol.Classes;
    using Picol.Classes.Search;
    using Picol.Decorators;
    using Picol.Models;

    /// <summary>Class that contains actions related to searching</summary>
    [History(Order = 1)]
    public class SearchController : Controller
    {
        /// <summary>Index of the search interface</summary>
        /// <returns>A base view object</returns>
        public ActionResult Index()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "Search";
                var dataContext = new PicolEntities();
                var crops = (from c in dataContext.Crops
                             select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                crops.Insert(0, new { Id = -1, Name = "=== Select a department ===" });

                this.ViewBag.Crops = new SelectList(crops, "Id", "Name");
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Quicks this instance.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A base view object</returns>
        public ActionResult Quick(int? id)
        {
            try
            {
                var dbContext = new PicolEntities();
                var states = (from e in dbContext.States
                              select new
                              {
                                  Key = e.Id,
                                  Value = e.Code
                              }).ToList();

                var intendedUsers = (from e in dbContext.IntendedUsers
                                     select new
                                     {
                                         Key = e.Id,
                                         Value = e.Name
                                     }).ToList();

                this.ViewBag.Search = string.Empty;

                if (id != null)
                {
                    var search = (from s in dbContext.Searches
                                  where s.Id == id
                                  select s.Parameters).First();

                    this.ViewBag.Search = search;
                }

                HttpCookie authorizationCookie = this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authorization"];
                List<UserPreference> preferences = new List<UserPreference>();
                this.ViewData["LoggedIn"] = false;

                if (authorizationCookie != null)
                {
                    int userId = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                    preferences = (from s in dbContext.UserPreferences
                                   where s.UserId == userId
                                   select s).ToList();

                    if (Convert.ToBoolean(Encryption.UnprotectString(authorizationCookie["User"], new string[] { "Cookie" }, true)))
                    {
                        this.ViewData["LoggedIn"] = true;
                    }
                }

                states.Add(new { Key = -1, Value = "Both" });
                intendedUsers.Add(new { Key = -1, Value = "All" });
                this.ViewBag.States = new SelectList(states, "Key", "Value", preferences.Where(x => x.Name == "State").Count() == 1 ? preferences.Where(x => x.Name == "State").First().Value : "-1");
                this.ViewBag.IntendedUsers = new SelectList(intendedUsers, "Key", "Value", preferences.Where(x => x.Name == "IntendedUser").Count() == 1 ? preferences.Where(x => x.Name == "IntendedUser").First().Value : "-1");
                this.ViewBag.SelectedLink = "Search.Quick";
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Quick search.</summary>
        /// <param name="epaNumber">The epa number.</param>
        /// <param name="epaNumberExactMatch">if set to <c>true</c> [epa number exact match].</param>
        /// <param name="labelName">The name.</param>
        /// <param name="labelNameExactMatch">if set to <c>true</c> [label name exact match].</param>
        /// <param name="ingredient">The ingredient.</param>
        /// <param name="ingredientExactMatch">if set to <c>true</c> [ingredient exact match].</param>
        /// <param name="crop">The crop.</param>
        /// <param name="cropExactMatch">if set to <c>true</c> [crop exact match].</param>
        /// <param name="pest">The pest.</param>
        /// <param name="pestExactMatch">if set to <c>true</c> [pest exact match].</param>
        /// <param name="i502">if set to <c>true</c> [i502].</param>
        /// <param name="essb">The essb.</param>
        /// <param name="organic">The organic.</param>
        /// <param name="sln">The SLN.</param>
        /// <param name="usageFed">The usage fed.</param>
        /// <param name="usageSrup">The usage srup.</param>
        /// <param name="state">The state.</param>
        /// <param name="intendedUser">The intended user.</param>
        /// <returns>Search results</returns>
        public JsonResult QuickResults(string epaNumber, bool epaNumberExactMatch, string labelName, bool labelNameExactMatch, string ingredient, bool ingredientExactMatch, string crop, bool cropExactMatch, string pest, bool pestExactMatch, bool i502, bool essb, bool organic, bool sln, bool usageFed, bool usageSrup, int state, int intendedUser)
        {
            try
            {
                var dbContext = new PicolEntities();
                dbContext.Database.CommandTimeout = 180;

                int year = Convert.ToInt32((from y in dbContext.Settings
                                            where y.Name == "CurrentSearchYear"
                                            select y.Value).Single());

                int waStateId = Convert.ToInt32((from w in dbContext.States
                                                 where w.Code == "WA"
                                                 select w.Id).Single());

                HashSet<int> intersection = new HashSet<int>();
                bool unfiltered = true;
                IQueryable<int> termIdSet = null;
                dynamic innerSearch = new JObject();
                this.ViewBag.SelectedLink = "Search.Quick";

                if (i502)
                {
                    innerSearch.I502 = i502;
                    innerSearch.State = "WA";
                    innerSearch.IntendedUser = "All";
                    innerSearch.Year = "Current Year";

                    termIdSet = from e in dbContext.Labels
                                where e.StateRecords.Where(x => x.I502).Count() > 0
                                && e.StateRecords.Where(x => x.Year >= year && x.StateId == waStateId).Count() > 0
                                select e.Id;
                }
                else if (essb)
                {
                    innerSearch.Essb = essb;
                    innerSearch.State = "WA";
                    innerSearch.IntendedUser = "All";
                    innerSearch.Year = "Current Year";

                    termIdSet = from e in dbContext.Labels
                                where e.StateRecords.Where(x => x.Essb6206).Count() > 0
                                && e.StateRecords.Where(x => x.Year >= year && x.StateId == waStateId).Count() > 0
                                select e.Id;
                }
                else if (organic)
                {
                    innerSearch.Organic = organic;
                    innerSearch.State = "Both";
                    innerSearch.IntendedUser = "All";
                    innerSearch.Year = "Current Year";

                    termIdSet = from e in dbContext.Labels
                                where e.Organic == true
                                && e.StateRecords.Where(x => x.Year >= year).Count() > 0
                                select e.Id;
                }
                else if (sln)
                {
                    innerSearch.Sln = sln;
                    innerSearch.State = "Both";
                    innerSearch.IntendedUser = "All";
                    innerSearch.Year = "Current Year";

                    termIdSet = from e in dbContext.Labels
                                where e.Sln != string.Empty && e.Sln != null
                                && e.StateRecords.Where(x => x.Year >= year).Count() > 0
                                select e.Id;
                }
                else if (usageFed)
                {
                    innerSearch.UsageFed = usageFed;
                    innerSearch.State = "Both";
                    innerSearch.IntendedUser = "All";
                    innerSearch.Year = "Current Year";

                    termIdSet = from e in dbContext.Labels
                                where e.Usage.Code == "R"
                                && e.StateRecords.Where(x => x.Year >= year).Count() > 0
                                select e.Id;
                }
                else if (usageSrup)
                {
                    innerSearch.UsageSrup = usageSrup;
                    innerSearch.State = "WA";
                    innerSearch.IntendedUser = "All";
                    innerSearch.Year = "Current Year";

                    termIdSet = from e in dbContext.Labels
                                where e.Usage.Name.StartsWith("SRUP")
                                && e.StateRecords.Where(x => x.Year >= year && (x.StateId == waStateId)).Count() > 0
                                select e.Id;
                }
                else
                {
                    innerSearch.EpaNumber = epaNumber;
                    innerSearch.Name = labelName;
                    innerSearch.Ingredient = ingredient;
                    innerSearch.Crop = crop;
                    innerSearch.Pest = pest;
                    innerSearch.I502 = i502;
                    innerSearch.Essb = essb;
                    innerSearch.Organic = organic;
                    innerSearch.Sln = sln;
                    innerSearch.UsageFed = usageFed;
                    innerSearch.UsageSrup = usageSrup;
                    innerSearch.State = state;
                    innerSearch.IntendedUser = intendedUser;
                    innerSearch.Year = "Current Year";

                    var listOfIdLists = new List<IEnumerable<int>>();
                    List<int> epaIds = new List<int>();
                    List<int> nameIds = new List<int>();
                    List<int> ingredientIds = new List<int>();
                    List<int> cropIds = new List<int>();
                    List<int> pestIds = new List<int>();
                    List<int> cannabisIds = new List<int>();
                    List<int> essbIds = new List<int>();
                    List<int> organicIds = new List<int>();
                    List<int> slnIds = new List<int>();
                    List<int> usageFedIds = new List<int>();
                    List<int> usageSrupIds = new List<int>();

                    if (!string.IsNullOrEmpty(epaNumber))
                    {
                        if (epaNumberExactMatch)
                        {
                            epaIds = (from e in dbContext.Labels
                                      where e.Epa == epaNumber
                                      select e.Id).ToList();
                        }
                        else
                        {
                            epaIds = (from e in dbContext.Labels
                                      where e.Epa.Contains(epaNumber)
                                      select e.Id).ToList();
                        }

                        if (epaIds.Count() > 0)
                        {
                            listOfIdLists.Add(epaIds);
                        }
                    }

                    if (!string.IsNullOrEmpty(labelName))
                    {
                        if (labelNameExactMatch)
                        {
                            nameIds = (from e in dbContext.Labels
                                       where e.Name == labelName
                                       select e.Id).ToList();
                        }
                        else
                        {
                            nameIds = (from e in dbContext.Labels
                                       where e.Name.Contains(labelName)
                                       select e.Id).ToList();
                        }

                        if (nameIds.Count() > 0)
                        {
                            listOfIdLists.Add(nameIds);
                        }
                    }

                    if (!string.IsNullOrEmpty(ingredient))
                    {
                        if (ingredientExactMatch)
                        {
                            ingredientIds = (from e in dbContext.IngredientLabelPairs
                                             where e.Ingredient.Name == ingredient
                                             select e.LabelId).ToList();
                        }
                        else
                        {
                            ingredientIds = (from e in dbContext.IngredientLabelPairs
                                             where e.Ingredient.Name.Contains(ingredient)
                                             select e.LabelId).ToList();
                        }

                        if (ingredientIds.Count() > 0)
                        {
                            listOfIdLists.Add(ingredientIds);
                        }
                    }

                    if (!string.IsNullOrEmpty(crop))
                    {
                        List<int> ids = new List<int>();

                        if (cropExactMatch)
                        {
                            ids = (from e in dbContext.Crops
                                   where e.Name == crop
                                   select e.Id).ToList();
                        }
                        else
                        {
                            ids = (from e in dbContext.Crops
                                   where e.Name.Contains(crop)
                                   select e.Id).ToList();
                        }

                        cropIds = (from e in dbContext.LabelCropPestTriples
                                   where ids.Contains(e.CropId)
                                   select e.LabelId).Distinct().ToList();

                        if (cropIds.Count() > 0)
                        {
                            listOfIdLists.Add(cropIds);
                        }
                    }

                    if (!string.IsNullOrEmpty(pest))
                    {
                        List<int> ids = new List<int>();

                        if (pestExactMatch)
                        {
                            ids = (from e in dbContext.Pests
                                   where e.Name == pest
                                   select e.Id).ToList();
                        }
                        else
                        {
                            ids = (from e in dbContext.Pests
                                   where e.Name.Contains(pest)
                                   select e.Id).ToList();
                        }

                        pestIds = (from e in dbContext.LabelCropPestTriples
                                   where ids.Contains(e.PestId)
                                   select e.LabelId).ToList();

                        if (pestIds.Count() > 0)
                        {
                            listOfIdLists.Add(pestIds);
                        }
                    }

                    if (listOfIdLists.Count() > 0)
                    {
                        intersection = listOfIdLists
                        .Skip(1)
                        .Aggregate(
                            new HashSet<int>(listOfIdLists.First()),
                            (h, e) =>
                            {
                                h.IntersectWith(e);
                                return h;
                            });

                        unfiltered = false;
                    }

                    termIdSet = from e in dbContext.Labels
                                where (intersection.Contains(e.Id) || unfiltered)
                                && e.StateRecords.Where(x => (x.StateId == state || state == -1) && (x.Year >= year)).Count() > 0
                                && (e.IntendedUserId == intendedUser || intendedUser == -1)
                                select e.Id;
                }

                var labels = (from e in dbContext.LabelResults
                              where termIdSet.Contains(e.Id)
                              select e).ToList();

                return new JsonNetResult { Data = new { Error = false, Labels = labels.ToList(), Search = innerSearch }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Action to search the labels</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A base view object</returns>
        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult Advanced(int? id)
        {
            try
            {
                this.ViewBag.SelectedLink = "AdvancedSearch";
                var dataContext = new PicolEntities();

                this.ViewBag.Search = string.Empty;

                if (id != null)
                {
                    var search = (from s in dataContext.Searches
                                  where s.Id == id
                                  select s.Parameters).First();

                    this.ViewBag.Search = search;
                }

                HttpCookie authorizationCookie = this.HttpContext.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".Authorization"];
                List<UserPreference> preferences = new List<UserPreference>();

                Dictionary<string, string> searchOperators = new Dictionary<string, string>();
                searchOperators.Add("Contains", "Contains");
                searchOperators.Add("Exact", "Exact");
                this.ViewBag.SearchOperators = new SelectList(searchOperators, "Key", "Value");
                this.ViewData["LoggedIn"] = false;

                if (authorizationCookie != null)
                {
                    int userId = Convert.ToInt32(Encryption.UnprotectString(this.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"]["Id"], new string[] { "Cookie" }, true));

                    preferences = (from s in dataContext.UserPreferences
                                   where s.UserId == userId
                                   select s).ToList();

                    if (Convert.ToBoolean(Encryption.UnprotectString(authorizationCookie["User"], new string[] { "Cookie" }, true)))
                    {
                        this.ViewData["LoggedIn"] = true;
                    }
                }

                var states = (from c in dataContext.States
                              select new { Id = c.Id, Name = c.Name }).OrderBy(x => x.Name).ToList();

                states.Insert(0, new { Id = -1, Name = "Both" });
                this.ViewBag.States = new SelectList(states, "Id", "Name", preferences.Where(x => x.Name == "State").Count() == 1 ? preferences.Where(x => x.Name == "State").First().Value : "-1");

                var intendedUsers = (from e in dataContext.IntendedUsers
                                     select new
                                     {
                                         Key = e.Id,
                                         Value = e.Name
                                     }).ToList();

                intendedUsers.Add(new { Key = -1, Value = "All" });
                this.ViewBag.IntendedUsers = new SelectList(intendedUsers, "Key", "Value", preferences.Where(x => x.Name == "IntendedUser").Count() == 1 ? preferences.Where(x => x.Name == "IntendedUser").First().Value : "-1");

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
                this.ViewBag.Years = new SelectList(year, "Key", "Value", preferences.Where(x => x.Name == "Year" && x.Value != "-2").Count() == 1 ? preferences.Where(x => x.Name == "Year").First().Value : "true");

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

                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Advanceds the specified search terms.</summary>
        /// <param name="searchTerms">The search terms.</param>
        /// <param name="state">The state.</param>
        /// <param name="year">The year.</param>
        /// <param name="i502">The i502 filter.</param>
        /// <param name="essb">The essb filter.</param>
        /// <param name="organic">Is organic.</param>
        /// <param name="intendedUser">The intended user.</param>
        /// <param name="esa">The esa notice.</param>
        /// <param name="spanish">The spanish.</param>
        /// <param name="ground">The ground.</param>
        /// <returns>A JSON collection of labels</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult Advanced(IList<TermGroup> searchTerms, int state, string year, string i502, string essb, string organic, int intendedUser, string esa, string spanish, string ground)
        {
            try
            {
                var dbContext = new PicolEntities();
                dbContext.Database.CommandTimeout = 180;

                // Indicates whether search terms is empty
                bool emptySearch = false;
                if (searchTerms.Count() == 1)
                {
                    if (string.IsNullOrEmpty(searchTerms.ElementAt(0).SearchValue))
                    {
                        emptySearch = true;
                        searchTerms.RemoveAt(0);
                    }
                }

                // Lists of sets for each operator
                var groupSetOfAnds = new List<IEnumerable<int>>();
                var groupSetOfOrs = new List<IEnumerable<int>>();
                var groupSetOfNots = new List<int>();
                var nullSet = new List<int> { -1 };

                // Used for repeatedly computing intersections of sets
                var intersected = new HashSet<int>();

                // Retrieves the administratively set current search year
                int currentYear = Convert.ToInt32((from y in dbContext.Settings
                                                   where y.Name == "CurrentSearchYear"
                                                   select y.Value).Single());

                // For each group of terms we compute the intersections and unions based on operators
                for (int i = 0; i <= (emptySearch ? -1 : searchTerms.Select(x => x.SearchGroup).Max()); i++)
                {
                    // Lists of sets for each operator
                    // It might be more efficient to declare these outside of the for loop, but scoping the variables to where they are used reduces the
                    // the complexity of this already complex code
                    var setOfAnds = new List<IEnumerable<int>>();
                    var setOfOrs = new List<IEnumerable<int>>();
                    var setOfNots = new List<int>();

                    // For each search term we identify a set of labels that match it, and compute intersections and unions based on the conditional
                    foreach (var s in searchTerms.Where(x => x.SearchGroup == i))
                    {
                        // Holds the set of id's that match this search terms criteria
                        IQueryable<int> termIdSet = null;

                        // We find the id's associated with this search term
                        if (s.SearchField == "ApplicationType")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Applications
                                             where e.Name.Contains(s.SearchValue)
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Applications
                                             where e.Name == s.SearchValue
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "ESSB-6206")
                        {
                            bool value = Convert.ToBoolean(s.SearchValue);
                            termIdSet = from e in dbContext.Labels
                                        where e.StateRecords.Where(x => x.State.Code == "WA" && x.Essb6206 == value).Count() > 0
                                        select e.Id;
                        }
                        else if (s.SearchField == "I502")
                        {
                            bool value = Convert.ToBoolean(s.SearchValue);
                            termIdSet = from e in dbContext.Labels
                                        where e.StateRecords.Where(x => x.State.Code == "WA" && x.I502 == value).Count() > 0
                                        select e.Id;
                        }
                        else if (s.SearchField == "Crop")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Crops
                                             where e.Name.Contains(s.SearchValue)
                                             select e.LabelCropPestTriples.Select(x => x.LabelId)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Crops
                                             where e.Name == s.SearchValue
                                             select e.LabelCropPestTriples.Select(x => x.LabelId)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "EpaNumber")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Epa.Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Epa == s.SearchValue
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "EsaNotice")
                        {
                            bool value = Convert.ToBoolean(s.SearchValue);
                            termIdSet = from e in dbContext.Labels
                                        where e.EsaNotice == value
                                        select e.Id;
                        }
                        else if (s.SearchField == "Formulation")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Formulations
                                             where e.Name.Contains(s.SearchValue)
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Formulations
                                             where e.Name == s.SearchValue
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "Ingredient")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Ingredients
                                             where e.Name.Contains(s.SearchValue)
                                             select e.IngredientLabelPairs.Select(x => x.LabelId)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Ingredients
                                             where e.Name == s.SearchValue
                                             select e.IngredientLabelPairs.Select(x => x.LabelId)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "IngredientConcentration")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.IngredientLabelPairs
                                            where e.Concentration.Contains(s.SearchValue)
                                            select e.LabelId).Distinct().DefaultIfEmpty(-1);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.IngredientLabelPairs
                                            where e.Concentration == s.SearchValue
                                            select e.LabelId).Distinct().DefaultIfEmpty(-1);
                            }
                        }
                        else if (s.SearchField == "IntendedUser")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.IntendedUser.Name.Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.IntendedUser.Name == s.SearchValue
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "ModifiedDate")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Updated.Value.ToString().Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Updated.Value.ToString() == s.SearchValue
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "Organic")
                        {
                            bool value = Convert.ToBoolean(s.SearchValue);
                            termIdSet = from e in dbContext.Labels
                                        where e.Organic == value
                                        select e.Id;
                        }
                        else if (s.SearchField == "Pest")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Pests
                                             where e.Name.Contains(s.SearchValue)
                                             select e.LabelCropPestTriples.Select(x => x.LabelId)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Pests
                                             where e.Name == s.SearchValue
                                             select e.LabelCropPestTriples.Select(x => x.LabelId)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "PesticideType")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.PesticideTypes
                                             where e.Name.Contains(s.SearchValue)
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.PesticideTypes
                                             where e.Name == s.SearchValue
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "ProductName")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Name.Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Name == s.SearchValue
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "RegistrantName")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Registrants
                                             where e.Name.Contains(s.SearchValue)
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Registrants
                                             where e.Name == s.SearchValue
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "RegistrantNumber")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Registrants
                                             where e.Code.Contains(s.SearchValue)
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Registrants
                                             where e.Code == s.SearchValue
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "ResistanceCode")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Resistances
                                             where e.Code.Contains(s.SearchValue)
                                             select e.Ingredients.SelectMany(x => x.IngredientLabelPairs).Select(x => x.LabelId)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Resistances
                                             where e.Code == s.SearchValue
                                             select e.Ingredients.SelectMany(x => x.IngredientLabelPairs).Select(x => x.LabelId)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "ResistanceMoa")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Resistances
                                             where e.MethodOfAction.Contains(s.SearchValue)
                                             select e.Ingredients.SelectMany(x => x.IngredientLabelPairs).Select(x => x.LabelId)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Resistances
                                             where e.MethodOfAction == s.SearchValue
                                             select e.Ingredients.SelectMany(x => x.IngredientLabelPairs).Select(x => x.LabelId)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "ResistanceSource")
                        {
                            var test = from e in dbContext.Ingredients
                                       where e.Resistance.Source.Contains(s.SearchValue)
                                       select e;

                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Ingredients
                                             where e.Resistance.Source.Contains(s.SearchValue)
                                             select e.IngredientLabelPairs.Select(x => x.LabelId)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Ingredients
                                             where e.Resistance.Source == s.SearchValue
                                             select e.IngredientLabelPairs.Select(x => x.LabelId)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "Section18")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Section18.Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Section18 == s.SearchValue
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "Section18Expiration")
                        {
                            DateTime value = Convert.ToDateTime(s.SearchValue);
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Section18Expiration.Value.ToShortDateString().Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Section18Expiration == value
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "SignalWord")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.SignalWords
                                             where e.Name.Contains(s.SearchValue)
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.SignalWords
                                             where e.Name == s.SearchValue
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                        }
                        else if (s.SearchField == "Sln")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Sln.Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Sln == s.SearchValue
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "SlnExpiration")
                        {
                            DateTime value = Convert.ToDateTime(s.SearchValue);
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.SlnExpiration.Value.ToShortDateString().Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.SlnExpiration == value
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "SlnName")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.SlnName.Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.SlnName == s.SearchValue
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "Spanish")
                        {
                            bool value = Convert.ToBoolean(s.SearchValue);
                            termIdSet = from e in dbContext.Labels
                                        where e.Spanish == value
                                        select e.Id;
                        }
                        else if (s.SearchField == "Supplemental")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Supplemental.Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.Supplemental == s.SearchValue
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "SupplementalExpiration")
                        {
                            DateTime value = Convert.ToDateTime(s.SearchValue);
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.SupplementalExpiration.Value.ToShortDateString().Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.SupplementalExpiration == value
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "SupplementalName")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.SupplementalName.Contains(s.SearchValue)
                                            select e.Id;
                            }
                            else
                            {
                                termIdSet = from e in dbContext.Labels
                                            where e.SupplementalName == s.SearchValue
                                            select e.Id;
                            }
                        }
                        else if (s.SearchField == "UsageCategory")
                        {
                            if (s.SearchOperator == "Contains")
                            {
                                termIdSet = (from e in dbContext.Usages
                                             where e.Name.Contains(s.SearchValue)
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                            else
                            {
                                termIdSet = (from e in dbContext.Usages
                                             where e.Name == s.SearchValue
                                             select e.Labels.Select(x => x.Id)).SelectMany(x => x);
                            }
                        }

                        // If the term set is empty, set contents to impossible value to represent the null set so AND computation behaves properly
                        termIdSet = termIdSet.Distinct().DefaultIfEmpty(-1);

                        // We check if our term set is non empty, should always be true because of .DefaultIfEmpty(-1)
                        if (termIdSet.Count() > 0)
                        {
                            if (s.SearchConditional == "AND")
                            {
                                // If the conditional is an AND, we add the set to a list of sets from which to compute an intersection
                                setOfAnds.Add(termIdSet);
                            }
                            else if (s.SearchConditional == "OR")
                            {
                                // If the current conditional is an OR, we compute the intersection of all AND sets and push the result set onto our list of or's
                                intersected = setOfAnds
                                .Skip(1)
                                .Aggregate(
                                    new HashSet<int>(setOfAnds.First()),
                                    (h, e) =>
                                    {
                                        h.IntersectWith(e);
                                        return h;
                                    });

                                setOfAnds.Clear();
                                setOfOrs.Add(intersected);
                                setOfAnds.Add(termIdSet);
                            }
                            else if (s.SearchConditional == "NOT")
                            {
                                // If the conditional is a not we use the set as an exclusion criteria on the search groups solution set
                                setOfNots.AddRange(termIdSet);
                            }
                        }
                    }

                    // If there are any sets still in our list of sets, then we compute a final intersection of these sets
                    if (setOfAnds.Count() > 0)
                    {
                        // Create the intersection of the lists
                        intersected = setOfAnds
                                .Skip(1)
                                .Aggregate(
                                    new HashSet<int>(setOfAnds.First()),
                                    (h, e) =>
                                    {
                                        h.IntersectWith(e);
                                        return h;
                                    });
                    }

                    // We add the intersected sets to the list of sets with which to compute the union
                    setOfOrs.Add(intersected);

                    // We compute the union of our OR sets, which is the final solution set for this group of search terms
                    var groupSolutionSet = setOfOrs.SelectMany(list => list).Distinct().Where(x => !setOfNots.Contains(x));

                    // We then determine if the search groups solution set is non empty
                    if (groupSolutionSet.Count() > 0)
                    {
                        // Find the logical operator for this search group and compute accordingly
                        if (searchTerms.Where(x => x.SearchGroup == i).First().SearchGroupOperator == "AND")
                        {
                            // If the conditional is an AND, we add the group solution set to our list of sets to compute an intersection of
                            groupSetOfAnds.Add(groupSolutionSet);
                        }
                        else if (searchTerms.Where(x => x.SearchGroup == i).First().SearchGroupOperator == "OR")
                        {
                            // If the current group operator is an OR, we compute the intersection of all prior sets
                            intersected = groupSetOfAnds
                            .Skip(1)
                            .Aggregate(
                                new HashSet<int>(groupSetOfAnds.First()),
                                (h, e) =>
                                {
                                    h.IntersectWith(e);
                                    return h;
                                });

                            groupSetOfAnds.Clear();
                            groupSetOfOrs.Add(intersected);
                            groupSetOfAnds.Add(groupSolutionSet);
                        }
                        else if (searchTerms.Where(x => x.SearchGroup == i).First().SearchGroupOperator == "NOT")
                        {
                            // If the conditional is a NOT we set the set aside to use an exclusion criteria on the final search
                            groupSetOfNots.AddRange(groupSolutionSet);
                        }
                    }
                }

                // If there are any sets still in our collection of AND sets, then we compute a final intersection of these sets
                if (groupSetOfAnds.Count() > 0)
                {
                    intersected = groupSetOfAnds
                    .Skip(1)
                    .Aggregate(
                        new HashSet<int>(groupSetOfAnds.First()),
                        (h, e) =>
                        {
                            h.IntersectWith(e);
                            return h;
                        });
                }

                // We add the intersected sets to the list of sets with which to compute the union
                groupSetOfOrs.Add(intersected);

                // We compute the union of our intersected sets, which is the final solution set for our search
                var unioned = groupSetOfOrs.SelectMany(list => list).Distinct().Where(x => !groupSetOfNots.Contains(x));

                // If the search was not submitted as an empty search, and there is no pre-filter result set, return indicating no results
                if (!emptySearch && unioned.Count() < 1)
                {
                    return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Your search has no results" }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }

                var finalSetOfAnds = new List<IEnumerable<int>>();
                var finalIntersection = new HashSet<int>();
                IQueryable<int> filterIdSet;

                // Retrieve id's that match state and year simultaneously filter
                filterIdSet = from e in dbContext.Labels
                              where e.StateRecords.Where(x => (x.StateId == state || state == -1) && (x.Year >= currentYear || year == "-1")).Count() > 0
                              select e.Id;

                finalSetOfAnds.Add(filterIdSet);

                // Retrieve id's that match i502 filter
                filterIdSet = from e in dbContext.Labels
                              where (e.StateRecords.Where(x => x.I502).Count() > 0 && i502 == "true") || (e.StateRecords.Where(x => x.I502 == false).Count() > 0 && i502 == "false") || (i502 == "-1")
                              select e.Id;

                finalSetOfAnds.Add(filterIdSet);

                // Retrieve id's that match essb filter
                filterIdSet = from e in dbContext.Labels
                              where (e.StateRecords.Where(x => x.Essb6206).Count() > 0 && essb == "true") || (e.StateRecords.Where(x => x.Essb6206 == false).Count() > 0 && essb == "false") || (essb == "-1")
                              select e.Id;

                finalSetOfAnds.Add(filterIdSet);

                // Retrieve id's that match organic filter
                filterIdSet = from e in dbContext.Labels
                              where (e.Organic == true && organic == "true") || (e.Organic == false && organic == "false") || organic == "-1"
                              select e.Id;

                finalSetOfAnds.Add(filterIdSet);

                // Retrieve id's that match intended user filter
                filterIdSet = from e in dbContext.Labels
                              where e.IntendedUserId == intendedUser || intendedUser == -1
                              select e.Id;

                finalSetOfAnds.Add(filterIdSet);

                // Retrieve id's that match esa filter
                filterIdSet = from e in dbContext.Labels
                              where (e.EsaNotice == true && esa == "true") || (e.EsaNotice == false && esa == "false") || esa == "-1"
                              select e.Id;

                finalSetOfAnds.Add(filterIdSet);

                // Retrieve id's that match spanish filter
                filterIdSet = from e in dbContext.Labels
                              where (e.Spanish == true && spanish == "true") || (e.Spanish == false && spanish == "false") || spanish == "-1"
                              select e.Id;

                finalSetOfAnds.Add(filterIdSet);

                // Retrieve id's that match ground filter
                filterIdSet = from e in dbContext.Labels
                              where (e.Ground == true && ground == "true") || (e.Ground == false && ground == "false") || ground == "-1"
                              select e.Id;

                finalSetOfAnds.Add(filterIdSet);

                // If this is a filter only search unioned will always be empty, and the intersection with it always the empty set
                if (unioned.Count() > 0)
                {
                    finalSetOfAnds.Add(unioned);
                }

                finalIntersection = finalSetOfAnds
                    .Skip(1)
                    .Aggregate(
                        new HashSet<int>(finalSetOfAnds.First()),
                        (h, e) =>
                        {
                            h.IntersectWith(e);
                            return h;
                        });

                var labels = (from e in dbContext.LabelResults
                              where finalIntersection.Contains(e.Id)
                              select e).ToList();

                return new JsonNetResult { Data = new { Error = false, Labels = labels }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Detail view of the selected label.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A label</returns>
        public ActionResult Details(int id)
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "Search";
                var dataContext = new PicolEntities();
                var label = (from l in dataContext.Labels
                             where l.Id == id
                             select l).Single();

                this.ViewData["WashingtonDownload"] = label.LabelFiles.Where(x => x.State.Code == "WA").Count() > 0 ? "http://cru66.cahe.wsu.edu/~picol/pdf/WA/" + label.Pid.ToString() + ".pdf" : string.Empty;
                this.ViewData["OregonDownload"] = label.LabelFiles.Where(x => x.State.Code == "OR").Count() > 0 ? "http://cru66.cahe.wsu.edu/~picol/pdf/OR/" + label.Pid.ToString() + ".pdf" : string.Empty;

                return this.View(label);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Saves the search.</summary>
        /// <param name="name">The name.</param>
        /// <param name="parameters">The parameters.</param>
        /// <param name="type">The type.</param>
        /// <returns>A success indicator</returns>
        public JsonResult Save(string name, string parameters, string type)
        {
            try
            {
                HttpCookie userCookie = this.HttpContext.Request.Cookies[Convert.ToString(WebConfigurationManager.AppSettings["ApplicationName"]) + ".User"];
                int userId = Convert.ToInt32(Encryption.UnprotectString(userCookie["Id"], new string[] { "Cookie" }, true));

                var dbContext = new PicolEntities();
                var search = new Search();
                search.Name = name;
                search.UserId = userId;
                search.Parameters = parameters;
                search.Path = type == "quick" ? "/Search/Quick" : "/Search/Advanced";
                dbContext.Searches.Add(search);
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

        /// <summary>Gets the epa numbers.</summary>
        /// <param name="term">The term.</param>
        /// <returns>A list of EPA numbers</returns>
        public JsonResult GetEpaNumbers(string term)
        {
            try
            {
                var dbContext = new PicolEntities();
                int year = Convert.ToInt32((from y in dbContext.Settings
                                            where y.Name == "CurrentSearchYear"
                                            select y.Value).Single());

                List<string> epaNumbers = (from e in dbContext.Labels
                                           where (e.Epa.Contains(term) || string.IsNullOrEmpty(term))
                                           && e.StateRecords.Where(x => x.Year >= year).Count() > 0
                                           select e.Epa).Distinct().OrderBy(x => x).ToList();

                return new JsonNetResult { Data = new { Error = false, EpaNumbers = epaNumbers }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Gets the label names.</summary>
        /// <param name="term">The term.</param>
        /// <returns>A list of label names</returns>
        public JsonResult GetLabelNames(string term)
        {
            try
            {
                var dbContext = new PicolEntities();
                List<string> names = (from e in dbContext.Labels
                                      where (e.Name.Contains(term) || string.IsNullOrEmpty(term))
                                      && e.StateRecords.Where(x => x.Year == 2017).Count() > 0
                                      select e.Name).Distinct().OrderBy(x => x).ToList();

                return new JsonNetResult { Data = new { Error = false, LabelNames = names }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Gets the ingredients.</summary>
        /// <param name="term">The term.</param>
        /// <returns>A list of ingredients</returns>
        public JsonResult GetIngredients(string term)
        {
            try
            {
                var dbContext = new PicolEntities();
                List<string> results = (from e in dbContext.Ingredients
                                        where e.Name.Contains(term) || string.IsNullOrEmpty(term)
                                        select e.Name).Distinct().OrderBy(x => x).ToList();

                return new JsonNetResult { Data = new { Error = false, Ingredients = results }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Gets the crops.</summary>
        /// <param name="term">The term.</param>
        /// <returns>A list of crops</returns>
        public JsonResult GetCrops(string term)
        {
            try
            {
                var dbContext = new PicolEntities();
                List<string> results = (from e in dbContext.Crops
                                        where e.Name.Contains(term) || string.IsNullOrEmpty(term)
                                        select e.Name).Distinct().OrderBy(x => x).ToList();

                return new JsonNetResult { Data = new { Error = false, Crops = results }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Gets the pests.</summary>
        /// <param name="term">The term.</param>
        /// <returns>A list of pests</returns>
        public JsonResult GetPests(string term)
        {
            try
            {
                var dbContext = new PicolEntities();
                List<string> results = (from e in dbContext.Pests
                                        where e.Name.Contains(term) || string.IsNullOrEmpty(term)
                                        select e.Name).Distinct().OrderBy(x => x).ToList();

                return new JsonNetResult { Data = new { Error = false, Pests = results }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Gets the search fields.</summary>
        /// <returns>A JSON encoded collection of search fields</returns>
        public JsonResult GetSearchFields()
        {
            try
            {
                Dictionary<string, string> searchFields = new Dictionary<string, string>();
                searchFields.Add("ApplicationType", "Application Type");
                searchFields.Add("Crop", "Crop");
                searchFields.Add("EpaNumber", "EPA Number");
                searchFields.Add("EsaNotice", "ESA Notice");
                searchFields.Add("ESSB-6206", "ESSB-6206");
                searchFields.Add("Formulation", "Formulation");
                searchFields.Add("I502", "I502");
                searchFields.Add("Ingredient", "Ingredient");
                searchFields.Add("IngredientConcentration", "Ingredient Concentration");
                searchFields.Add("IntendedUser", "Intended User");
                searchFields.Add("ModifiedDate", "Modified Date");
                searchFields.Add("Organic", "Organic");
                searchFields.Add("Pest", "Pest");
                searchFields.Add("PesticideType", "Pesticide Type");
                searchFields.Add("ProductName", "Product Name");
                searchFields.Add("RegistrantName", "Registrant Name");
                searchFields.Add("RegistrantNumber", "Registrant Number");
                searchFields.Add("ResistanceCode", "Resistance Code");
                searchFields.Add("ResistanceMoa", "Resistance MOA");
                searchFields.Add("ResistanceSource", "Resistance Source");
                searchFields.Add("Section18", "Section 18");
                searchFields.Add("Section18Expiration", "Section 18 Expiration");
                searchFields.Add("SignalWord", "Signal Word");
                searchFields.Add("Sln", "SLN");
                searchFields.Add("SlnName", "SLN Name");
                searchFields.Add("SlnExpiration", "SLN Expiration");
                searchFields.Add("Spanish", "Spanish");
                searchFields.Add("Supplemental", "Supplemental #");
                searchFields.Add("SupplementalName", "Supplemental Name");
                searchFields.Add("SupplementalExpiration", "Supplemental Expiration");
                searchFields.Add("UsageCategory", "Usage Category");

                return new JsonNetResult { Data = new { Error = false, SearchFields = searchFields.OrderBy(x => x.Value) }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Gets the application codes.</summary>
        /// <param name="field">The field.</param>
        /// <returns>A JSON encoded collection of application codes</returns>
        public JsonResult GetSearchValues(string field)
        {
            try
            {
                var dbContext = new PicolEntities();

                if (field == "ApplicationType")
                {
                    var values = from e in dbContext.Applications
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "Crop")
                {
                    var values = from e in dbContext.Crops
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "EpaNumber")
                {
                    var values = from e in dbContext.Labels
                                 select e.Epa;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "EsaNotice")
                {
                    var values = from e in dbContext.Labels
                                 select e.EsaNotice;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "ESSB-6206")
                {
                    var values = (from e in dbContext.Labels
                                  select e.StateRecords.Select(x => x.Essb6206)).SelectMany(x => x);

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "Formulation")
                {
                    var values = from e in dbContext.Formulations
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "I502")
                {
                    var values = (from e in dbContext.Labels
                                  select e.StateRecords.Select(x => x.I502)).SelectMany(x => x);

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "Ingredient")
                {
                    var values = from e in dbContext.Ingredients
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "IngredientConcentration")
                {
                    var values = from e in dbContext.IngredientLabelPairs
                                 select e.Concentration;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "IntendedUser")
                {
                    var values = from e in dbContext.IntendedUsers
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "ModifiedDate")
                {
                    var values = from e in dbContext.Labels
                                 select e.Updated.Value.ToString();

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "Organic")
                {
                    var values = from e in dbContext.Labels
                                 select e.Organic.Value;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "Pest")
                {
                    var values = from e in dbContext.Pests
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "PesticideType")
                {
                    var values = from e in dbContext.PesticideTypes
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "ProductName")
                {
                    var values = from e in dbContext.Labels
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "RegistrantName")
                {
                    var values = from e in dbContext.Registrants
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "RegistrantNumber")
                {
                    var values = from e in dbContext.Registrants
                                 select e.Code;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "ResistanceCode")
                {
                    var values = from e in dbContext.Resistances
                                 select e.Code;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "ResistanceMoa")
                {
                    var values = from e in dbContext.Resistances
                                 select e.MethodOfAction;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "ResistanceSource")
                {
                    var values = from e in dbContext.Resistances
                                 select e.Source;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "Section18")
                {
                    var values = from e in dbContext.Labels
                                 where e.Section18 != null
                                 select e.Section18;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "Section18Expiration")
                {
                    var values = from e in dbContext.Labels
                                 select e.Section18Expiration;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "SignalWord")
                {
                    var values = from e in dbContext.SignalWords
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "Sln")
                {
                    var values = from e in dbContext.Labels
                                 select e.Sln;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "SlnName")
                {
                    var values = from e in dbContext.Labels
                                 select e.SlnName;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "SlnExpiration")
                {
                    var values = from e in dbContext.Labels
                                 select e.SlnExpiration;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "Spanish")
                {
                    var values = from e in dbContext.Labels
                                 select e.Spanish;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "Supplemental")
                {
                    var values = from e in dbContext.Labels
                                 select e.Supplemental;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "SupplementalExpiration")
                {
                    var values = from e in dbContext.Labels
                                 select e.SupplementalExpiration;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "SupplementalName")
                {
                    var values = from e in dbContext.Labels
                                 select e.SupplementalName;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else if (field == "UsageCategory")
                {
                    var values = from e in dbContext.Usages
                                 select e.Name;

                    return new JsonNetResult { Data = new { Error = false, Values = values.Distinct().OrderBy(x => x).ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }

                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Undefined field" }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve results." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}