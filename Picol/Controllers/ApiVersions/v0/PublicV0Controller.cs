// -----------------------------------------------------------------------
// <copyright file="PublicV0Controller.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Controllers.V0
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Configuration;
    using System.Web.Http;
    using System.Web.Mvc;
    using Elmah;
    using Microsoft.Web.Http;
    using Newtonsoft.Json.Linq;
    using Picol.Classes;
    using Picol.Classes.Api.V0;
    using Picol.Classes.Search;
    using Picol.Decorators;
    using Picol.Models;

    /// <summary>Controller for public PICOL API methods</summary>
    /// <seealso cref="System.Web.Http.ApiController" />
    [ApiVersion("0", Deprecated = false)]
    [System.Web.Mvc.RoutePrefix("api/v0/Public")]
    public class PublicV0Controller : ApiController
    {
        /// <summary>Gets the pesticide applications.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of applications</returns>
        public Result<Classes.Api.V0.Application> GetApplications(string apiKey, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Application>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dbContext = new PicolEntities();
                var applications = (from r in dbContext.Applications
                                    select new Classes.Api.V0.Application
                                    {
                                        Id = r.Id,
                                        Name = r.Name,
                                        Code = r.Code
                                    }).OrderBy(x => x.Name).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = applications;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Application>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the crops.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of crops</returns>
        public Result<Classes.Api.V0.Crop> GetCrops(string apiKey, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Crop>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dbContext = new PicolEntities();
                var crops = (from r in dbContext.Crops
                             select new Classes.Api.V0.Crop
                             {
                                 Id = r.Id,
                                 Name = r.Name,
                                 Code = r.Code,
                                 Notes = r.Notes
                             }).OrderBy(x => x.Name).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = crops;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Crop>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the ingredients.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of ingredients</returns>
        public Result<Classes.Api.V0.Ingredient> GetIngredients(string apiKey, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Ingredient>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dbContext = new PicolEntities();
                var ingredients = (from r in dbContext.Ingredients
                                   select new Classes.Api.V0.Ingredient
                                   {
                                       Id = r.Id,
                                       Name = r.Name,
                                       Code = r.Code,
                                       Notes = r.Notes,
                                       Resistance = new Classes.Api.V0.Resistance { Id = r.Resistance.Id, Code = r.Resistance.Code, MethodOfAction = r.Resistance.MethodOfAction, Source = r.Resistance.Source }
                                   }).OrderBy(x => x.Name).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = ingredients;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Ingredient>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the intended users.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of intended users</returns>
        public Result<Classes.Api.V0.IntendedUser> GetIntendedUsers(string apiKey, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.IntendedUser>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dbContext = new PicolEntities();
                var users = (from r in dbContext.IntendedUsers
                             select new Classes.Api.V0.IntendedUser
                             {
                                 Id = r.Id,
                                 Name = r.Name,
                                 Code = r.Code
                             }).OrderBy(x => x.Name).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = users;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.IntendedUser>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the pesticide types.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of pesticide types</returns>
        public Result<Classes.Api.V0.PesticideType> GetPesticideTypes(string apiKey, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.PesticideType>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dbContext = new PicolEntities();
                var pesticideTypes = (from r in dbContext.PesticideTypes
                                      select new Classes.Api.V0.PesticideType
                                      {
                                          Id = r.Id,
                                          Name = r.Name,
                                          Code = r.Code
                                      }).OrderBy(x => x.Name).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = pesticideTypes;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.PesticideType>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the pests.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of pests</returns>
        public Result<Classes.Api.V0.Pest> GetPests(string apiKey, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Pest>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dbContext = new PicolEntities();
                var pests = (from r in dbContext.Pests
                             select new Classes.Api.V0.Pest
                             {
                                 Id = r.Id,
                                 Name = r.Name,
                                 Code = r.Code,
                                 Notes = r.Notes
                             }).OrderBy(x => x.Name).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = pests;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Pest>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the registrants.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection a registrants</returns>
        public Result<Classes.Api.V0.Registrant> GetRegistrants(string apiKey, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Registrant>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dbContext = new PicolEntities();
                var registrants = (from r in dbContext.Registrants
                                   select new Classes.Api.V0.Registrant
                                   {
                                       Id = r.Id,
                                       Name = r.Name,
                                       Website = r.Url
                                   }).OrderBy(x => x.Name).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = registrants;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Registrant>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the resistance codes.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of resistance codes</returns>
        public Result<Classes.Api.V0.Resistance> GetResistances(string apiKey, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Resistance>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dbContext = new PicolEntities();
                var resistanceCodes = (from r in dbContext.Resistances
                                       select new Classes.Api.V0.Resistance
                                       {
                                           Id = r.Id,
                                           Source = r.Source,
                                           Code = r.Code,
                                           MethodOfAction = r.MethodOfAction
                                       }).OrderBy(x => x.Source).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = resistanceCodes;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Resistance>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the signal words.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of signal words</returns>
        public Result<Classes.Api.V0.SignalWord> GetSignalWords(string apiKey, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.SignalWord>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dataContext = new PicolEntities();
                var dbContext = new PicolEntities();
                var words = (from r in dbContext.SignalWords
                             select new Classes.Api.V0.SignalWord
                             {
                                 Id = r.Id,
                                 Name = r.Name,
                                 Code = r.Code
                             }).OrderBy(x => x.Name).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = words;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.SignalWord>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the states.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of states</returns>
        public Result<Classes.Api.V0.State> GetStates(string apiKey, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.State>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dataContext = new PicolEntities();
                var dbContext = new PicolEntities();
                var states = (from r in dbContext.States
                             select new Classes.Api.V0.State
                             {
                                 Id = r.Id,
                                 Name = r.Name
                             }).OrderBy(x => x.Name).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = states;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.State>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the labels by a single crop identifier.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="cropId">The crop identifier.</param>
        /// <param name="currentYear">if set to <c>true</c> results are restricted to the current registration year, otherwise all years results will be included.</param>
        /// <param name="state">The ID of the state you wish to restrict your results to, -1 for all states.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of labels</returns>
        public Result<Classes.Api.V0.Label> GetLabelsByCropId(string apiKey, int cropId, bool currentYear, int state, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Label>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dataContext = new PicolEntities();

                int keyCount = (from k in dataContext.ApiKeys
                                where k.Value == apiKey
                                && k.Active
                                && k.Approved
                                select k).Count();

                if (keyCount < 1)
                {
                    result.Error = true;
                    result.Message = "Unauthorized API Key";
                    result.Data = null;
                    return result;
                }

                int year = 0;

                if (currentYear)
                {
                    year = Convert.ToInt32((from y in dataContext.Settings
                                            where y.Name == "CurrentSearchYear"
                                            select y.Value).Single());
                }

                var ids = (from l in dataContext.LabelCropPestTriples
                           where cropId == l.CropId
                           && l.Label.StateRecords.Where(x => x.Year >= year).Count() > 0
                           && l.Label.StateRecords.Where(x => (x.StateId == state || state == -1)).Count() > 0
                           select l.LabelId).Distinct();

                var labels = (from l in dataContext.Labels
                              where ids.Contains(l.Id)
                              select new Classes.Api.V0.Label
                              {
                                  Id = l.Id,
                                  Name = l.Name,
                                  EpaNumber = l.Epa,
                                  IntendedUser = new Classes.Api.V0.IntendedUser { Id = l.IntendedUser.Id, Name = l.IntendedUser.Name, Code = l.IntendedUser.Code },
                                  Ingredients = l.IngredientLabelPairs.Select(x => new Classes.Api.V0.Ingredient { Id = x.Ingredient.Id, Name = x.Ingredient.Name, Code = x.Ingredient.Code, Notes = x.Ingredient.Notes, Resistance = new Classes.Api.V0.Resistance { Id = x.Ingredient.Resistance.Id, Code = x.Ingredient.Resistance.Code, MethodOfAction = x.Ingredient.Resistance.MethodOfAction, Source = x.Ingredient.Resistance.Source } }),
                                  PesticideTypes = l.PesticideTypes.Select(x => new Classes.Api.V0.PesticideType { Id = x.Id, Code = x.Code, Name = x.Name }),
                                  Registrant = new Classes.Api.V0.Registrant { Id = l.Registrant.Id, Name = l.Registrant.Name, Website = l.Registrant.Url },
                                  SlnName = l.SlnName,
                                  SlnExpiration = l.SlnExpiration.HasValue ? l.SlnExpiration.Value : DateTime.MinValue,
                                  StateRecords = l.StateRecords.Select(x => new Classes.Api.V0.StateRecord { Id = x.Id, Name = x.State.Name, AgencyId = x.AgencyId, Version = x.Version, Year = x.Year, I502 = x.I502, Essb6206 = x.Essb6206 }),
                                  Supplemental = l.Supplemental,
                                  SupplementalName = l.SupplementalName,
                                  SupplementalExpiration = l.SupplementalExpiration.HasValue ? l.SupplementalExpiration.Value : DateTime.MinValue,
                                  Formulation = l.Formulation.Name,
                                  SignalWord = l.SignalWord.Code,
                                  Usage = l.Usage.Code,
                                  Organic = l.Organic,
                                  Spanish = l.Spanish,
                                  EsaNotice = l.EsaNotice,
                                  Section18 = l.Section18
                              }).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = labels;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Label>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the labels that are associated with a crop ID contained in the provided array of Crop ID's</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="cropIds">The crop ids.</param>
        /// <param name="currentYear">if set to <c>true</c> results are restricted to the current registration year, otherwise all years results will be included.</param>
        /// <param name="state">The ID of the state you wish to restrict your results to, -1 for all states.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of labels</returns>
        public Result<Classes.Api.V0.Label> GetLabelsByCropIds(string apiKey, int[] cropIds, bool currentYear, int state, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Label>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dataContext = new PicolEntities();
                List<int> cropList = cropIds.Cast<int>().ToList();

                int keyCount = (from k in dataContext.ApiKeys
                                where k.Value == apiKey
                                && k.Active
                                && k.Approved
                                select k).Count();

                if (keyCount < 1)
                {
                    result.Error = true;
                    result.Message = "Unauthorized API Key";
                    result.Data = null;
                    return result;
                }

                int year = Convert.ToInt32((from y in dataContext.Settings
                                            where y.Name == "CurrentSearchYear"
                                            select y.Value).Single());

                var ids = (from l in dataContext.LabelCropPestTriples
                           where cropList.Contains(l.CropId)
                           && l.Label.StateRecords.Where(x => x.Year >= year).Count() > 0
                           && l.Label.StateRecords.Where(x => (x.StateId == state || state == -1)).Count() > 0
                           select l.LabelId).Distinct();

                var labels = (from l in dataContext.Labels
                              where ids.Contains(l.Id)
                              select new Classes.Api.V0.Label
                              {
                                  Id = l.Id,
                                  Name = l.Name,
                                  EpaNumber = l.Epa,
                                  IntendedUser = new Classes.Api.V0.IntendedUser { Id = l.IntendedUser.Id, Name = l.IntendedUser.Name, Code = l.IntendedUser.Code },
                                  Ingredients = l.IngredientLabelPairs.Select(x => new Classes.Api.V0.Ingredient { Id = x.Ingredient.Id, Name = x.Ingredient.Name, Code = x.Ingredient.Code, Notes = x.Ingredient.Notes, Resistance = new Classes.Api.V0.Resistance { Id = x.Ingredient.Resistance.Id, Code = x.Ingredient.Resistance.Code, MethodOfAction = x.Ingredient.Resistance.MethodOfAction, Source = x.Ingredient.Resistance.Source } }),
                                  PesticideTypes = l.PesticideTypes.Select(x => new Classes.Api.V0.PesticideType { Id = x.Id, Code = x.Code, Name = x.Name }),
                                  Registrant = new Classes.Api.V0.Registrant { Id = l.Registrant.Id, Name = l.Registrant.Name, Website = l.Registrant.Url },
                                  SlnName = l.SlnName,
                                  SlnExpiration = l.SlnExpiration.HasValue ? l.SlnExpiration.Value : DateTime.MinValue,
                                  StateRecords = l.StateRecords.Select(x => new Classes.Api.V0.StateRecord { Id = x.Id, Name = x.State.Name, AgencyId = x.AgencyId, Version = x.Version, Year = x.Year, I502 = x.I502, Essb6206 = x.Essb6206 }),
                                  Supplemental = l.Supplemental,
                                  SupplementalName = l.SupplementalName,
                                  SupplementalExpiration = l.SupplementalExpiration.HasValue ? l.SupplementalExpiration.Value : DateTime.MinValue,
                                  Formulation = l.Formulation.Name,
                                  SignalWord = l.SignalWord.Code,
                                  Usage = l.Usage.Code,
                                  Organic = l.Organic,
                                  Spanish = l.Spanish,
                                  EsaNotice = l.EsaNotice,
                                  Section18 = l.Section18
                              }).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = labels;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Label>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Get's labels by EPA number.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="id">The EPA identifier.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of labels</returns>
        public Result<Classes.Api.V0.Label> GetLabelsByEpa(string apiKey, string id, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Label>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                var dataContext = new PicolEntities();

                int keyCount = (from k in dataContext.ApiKeys
                                where k.Value == apiKey
                                && k.Active
                                && k.Approved
                                select k).Count();

                if (keyCount < 1)
                {
                    result.Error = true;
                    result.Message = "Unauthorized API Key";
                    result.Data = null;
                    return result;
                }

                var labels = (from l in dataContext.Labels
                              where l.Epa == id
                              select new Classes.Api.V0.Label
                              {
                                  Id = l.Id,
                                  Name = l.Name,
                                  EpaNumber = l.Epa,
                                  IntendedUser = new Classes.Api.V0.IntendedUser { Id = l.IntendedUser.Id, Name = l.IntendedUser.Name, Code = l.IntendedUser.Code },
                                  Ingredients = l.IngredientLabelPairs.Select(x => new Classes.Api.V0.Ingredient { Id = x.Ingredient.Id, Name = x.Ingredient.Name, Code = x.Ingredient.Code, Notes = x.Ingredient.Notes, Resistance = new Classes.Api.V0.Resistance { Id = x.Ingredient.Resistance.Id, Code = x.Ingredient.Resistance.Code, MethodOfAction = x.Ingredient.Resistance.MethodOfAction, Source = x.Ingredient.Resistance.Source } }),
                                  PesticideTypes = l.PesticideTypes.Select(x => new Classes.Api.V0.PesticideType { Id = x.Id, Code = x.Code, Name = x.Name }),
                                  Registrant = new Classes.Api.V0.Registrant { Id = l.Registrant.Id, Name = l.Registrant.Name, Website = l.Registrant.Url },
                                  SlnName = l.SlnName,
                                  SlnExpiration = l.SlnExpiration.HasValue ? l.SlnExpiration.Value : DateTime.MinValue,
                                  StateRecords = l.StateRecords.Select(x => new Classes.Api.V0.StateRecord { Id = x.Id, Name = x.State.Name, AgencyId = x.AgencyId, Version = x.Version, Year = x.Year, I502 = x.I502, Essb6206 = x.Essb6206 }),
                                  Supplemental = l.Supplemental,
                                  SupplementalName = l.SupplementalName,
                                  SupplementalExpiration = l.SupplementalExpiration.HasValue ? l.SupplementalExpiration.Value : DateTime.MinValue,
                                  Formulation = l.Formulation.Name,
                                  SignalWord = l.SignalWord.Code,
                                  Usage = l.Usage.Code,
                                  Organic = l.Organic,
                                  Spanish = l.Spanish,
                                  EsaNotice = l.EsaNotice,
                                  Section18 = l.Section18
                              }).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = labels;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Label>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the labels by ingredient identifier.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="ingredientId">The ingredient identifier.</param>
        /// <param name="currentYear">if set to <c>true</c> [current year].</param>
        /// <param name="state">The state.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of labels</returns>
        public Result<Classes.Api.V0.Label> GetLabelsByIngredientId(string apiKey, int ingredientId, bool currentYear, int state, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Label>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                // Set the selected link
                var dataContext = new PicolEntities();

                int keyCount = (from k in dataContext.ApiKeys
                                where k.Value == apiKey
                                && k.Active
                                && k.Approved
                                select k).Count();

                if (keyCount < 1)
                {
                    result.Error = true;
                    result.Message = "Unauthorized API Key";
                    result.Data = null;
                    return result;
                }

                int year = Convert.ToInt32((from y in dataContext.Settings
                                            where y.Name == "CurrentSearchYear"
                                            select y.Value).Single());

                var ids = (from l in dataContext.IngredientLabelPairs
                           where ingredientId == l.IngredientId
                           && l.Label.StateRecords.Where(x => x.Year >= year).Count() > 0
                           && l.Label.StateRecords.Where(x => (x.StateId == state || state == -1)).Count() > 0
                           select l.LabelId).Distinct();

                var labels = (from l in dataContext.Labels
                              where ids.Contains(l.Id)
                              select new Classes.Api.V0.Label
                              {
                                  Id = l.Id,
                                  Name = l.Name,
                                  EpaNumber = l.Epa,
                                  IntendedUser = new Classes.Api.V0.IntendedUser { Id = l.IntendedUser.Id, Name = l.IntendedUser.Name, Code = l.IntendedUser.Code },
                                  Ingredients = l.IngredientLabelPairs.Select(x => new Classes.Api.V0.Ingredient { Id = x.Ingredient.Id, Name = x.Ingredient.Name, Code = x.Ingredient.Code, Notes = x.Ingredient.Notes, Resistance = new Classes.Api.V0.Resistance { Id = x.Ingredient.Resistance.Id, Code = x.Ingredient.Resistance.Code, MethodOfAction = x.Ingredient.Resistance.MethodOfAction, Source = x.Ingredient.Resistance.Source } }),
                                  PesticideTypes = l.PesticideTypes.Select(x => new Classes.Api.V0.PesticideType { Id = x.Id, Code = x.Code, Name = x.Name }),
                                  Registrant = new Classes.Api.V0.Registrant { Id = l.Registrant.Id, Name = l.Registrant.Name, Website = l.Registrant.Url },
                                  SlnName = l.SlnName,
                                  SlnExpiration = l.SlnExpiration.HasValue ? l.SlnExpiration.Value : DateTime.MinValue,
                                  StateRecords = l.StateRecords.Select(x => new Classes.Api.V0.StateRecord { Id = x.Id, Name = x.State.Name, AgencyId = x.AgencyId, Version = x.Version, Year = x.Year, I502 = x.I502, Essb6206 = x.Essb6206 }),
                                  Supplemental = l.Supplemental,
                                  SupplementalName = l.SupplementalName,
                                  SupplementalExpiration = l.SupplementalExpiration.HasValue ? l.SupplementalExpiration.Value : DateTime.MinValue,
                                  Formulation = l.Formulation.Name,
                                  SignalWord = l.SignalWord.Code,
                                  Usage = l.Usage.Code,
                                  Organic = l.Organic,
                                  Spanish = l.Spanish,
                                  EsaNotice = l.EsaNotice,
                                  Section18 = l.Section18
                              }).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = labels;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Label>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the labels by ingredient ids.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="ingredientIds">The ingredient ids.</param>
        /// <param name="currentYear">if set to <c>true</c> [current year].</param>
        /// <param name="state">The state.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of labels</returns>
        public Result<Classes.Api.V0.Label> GetLabelsByIngredientIds(string apiKey, int[] ingredientIds, bool currentYear, int state, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Label>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                // Set the selected link
                var dataContext = new PicolEntities();
                List<int> ingredientList = ingredientIds.Cast<int>().ToList();

                int keyCount = (from k in dataContext.ApiKeys
                                where k.Value == apiKey
                                && k.Active
                                && k.Approved
                                select k).Count();

                if (keyCount < 1)
                {
                    result.Error = true;
                    result.Message = "Unauthorized API Key";
                    result.Data = null;
                    return result;
                }

                int year = Convert.ToInt32((from y in dataContext.Settings
                                            where y.Name == "CurrentSearchYear"
                                            select y.Value).Single());

                var ids = (from l in dataContext.IngredientLabelPairs
                           where ingredientList.Contains(l.IngredientId)
                           && l.Label.StateRecords.Where(x => x.Year >= year).Count() > 0
                           && l.Label.StateRecords.Where(x => (x.StateId == state || state == -1)).Count() > 0
                           select l.LabelId).Distinct();

                var labels = (from l in dataContext.Labels
                              where ids.Contains(l.Id)
                              select new Classes.Api.V0.Label
                              {
                                  Id = l.Id,
                                  Name = l.Name,
                                  EpaNumber = l.Epa,
                                  IntendedUser = new Classes.Api.V0.IntendedUser { Id = l.IntendedUser.Id, Name = l.IntendedUser.Name, Code = l.IntendedUser.Code },
                                  Ingredients = l.IngredientLabelPairs.Select(x => new Classes.Api.V0.Ingredient { Id = x.Ingredient.Id, Name = x.Ingredient.Name, Code = x.Ingredient.Code, Notes = x.Ingredient.Notes, Resistance = new Classes.Api.V0.Resistance { Id = x.Ingredient.Resistance.Id, Code = x.Ingredient.Resistance.Code, MethodOfAction = x.Ingredient.Resistance.MethodOfAction, Source = x.Ingredient.Resistance.Source } }),
                                  PesticideTypes = l.PesticideTypes.Select(x => new Classes.Api.V0.PesticideType { Id = x.Id, Code = x.Code, Name = x.Name }),
                                  Registrant = new Classes.Api.V0.Registrant { Id = l.Registrant.Id, Name = l.Registrant.Name, Website = l.Registrant.Url },
                                  SlnName = l.SlnName,
                                  SlnExpiration = l.SlnExpiration.HasValue ? l.SlnExpiration.Value : DateTime.MinValue,
                                  StateRecords = l.StateRecords.Select(x => new Classes.Api.V0.StateRecord { Id = x.Id, Name = x.State.Name, AgencyId = x.AgencyId, Version = x.Version, Year = x.Year, I502 = x.I502, Essb6206 = x.Essb6206 }),
                                  Supplemental = l.Supplemental,
                                  SupplementalName = l.SupplementalName,
                                  SupplementalExpiration = l.SupplementalExpiration.HasValue ? l.SupplementalExpiration.Value : DateTime.MinValue,
                                  Formulation = l.Formulation.Name,
                                  SignalWord = l.SignalWord.Code,
                                  Usage = l.Usage.Code,
                                  Organic = l.Organic,
                                  Spanish = l.Spanish,
                                  EsaNotice = l.EsaNotice,
                                  Section18 = l.Section18
                              }).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = labels;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Label>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the labels by pest identifier.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="pestId">The pest identifier.</param>
        /// <param name="currentYear">if set to <c>true</c> results are restricted to the current registration year, otherwise all years results will be included.</param>
        /// <param name="state">The ID of the state you wish to restrict your results to, -1 for all states.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of labels</returns>
        public Result<Classes.Api.V0.Label> GetLabelsByPestId(string apiKey, int pestId, bool currentYear, int state, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Label>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                // Set the selected link
                var dataContext = new PicolEntities();

                int keyCount = (from k in dataContext.ApiKeys
                                where k.Value == apiKey
                                && k.Active
                                && k.Approved
                                select k).Count();

                if (keyCount < 1)
                {
                    result.Error = true;
                    result.Message = "Unauthorized API Key";
                    result.Data = null;
                    return result;
                }

                int year = Convert.ToInt32((from y in dataContext.Settings
                                            where y.Name == "CurrentSearchYear"
                                            select y.Value).Single());

                var ids = (from l in dataContext.LabelCropPestTriples
                           where pestId == l.PestId
                           && l.Label.StateRecords.Where(x => x.Year >= year).Count() > 0
                           && l.Label.StateRecords.Where(x => (x.StateId == state || state == -1)).Count() > 0
                           select l.LabelId).Distinct();

                var labels = (from l in dataContext.Labels
                              where ids.Contains(l.Id)
                              select new Classes.Api.V0.Label
                              {
                                  Id = l.Id,
                                  Name = l.Name,
                                  EpaNumber = l.Epa,
                                  IntendedUser = new Classes.Api.V0.IntendedUser { Id = l.IntendedUser.Id, Name = l.IntendedUser.Name, Code = l.IntendedUser.Code },
                                  Ingredients = l.IngredientLabelPairs.Select(x => new Classes.Api.V0.Ingredient { Id = x.Ingredient.Id, Name = x.Ingredient.Name, Code = x.Ingredient.Code, Notes = x.Ingredient.Notes, Resistance = new Classes.Api.V0.Resistance { Id = x.Ingredient.Resistance.Id, Code = x.Ingredient.Resistance.Code, MethodOfAction = x.Ingredient.Resistance.MethodOfAction, Source = x.Ingredient.Resistance.Source } }),
                                  PesticideTypes = l.PesticideTypes.Select(x => new Classes.Api.V0.PesticideType { Id = x.Id, Code = x.Code, Name = x.Name }),
                                  Registrant = new Classes.Api.V0.Registrant { Id = l.Registrant.Id, Name = l.Registrant.Name, Website = l.Registrant.Url },
                                  SlnName = l.SlnName,
                                  SlnExpiration = l.SlnExpiration.HasValue ? l.SlnExpiration.Value : DateTime.MinValue,
                                  StateRecords = l.StateRecords.Select(x => new Classes.Api.V0.StateRecord { Id = x.Id, Name = x.State.Name, AgencyId = x.AgencyId, Version = x.Version, Year = x.Year, I502 = x.I502, Essb6206 = x.Essb6206 }),
                                  Supplemental = l.Supplemental,
                                  SupplementalName = l.SupplementalName,
                                  SupplementalExpiration = l.SupplementalExpiration.HasValue ? l.SupplementalExpiration.Value : DateTime.MinValue,
                                  Formulation = l.Formulation.Name,
                                  SignalWord = l.SignalWord.Code,
                                  Usage = l.Usage.Code,
                                  Organic = l.Organic,
                                  Spanish = l.Spanish,
                                  EsaNotice = l.EsaNotice,
                                  Section18 = l.Section18
                              }).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = labels;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Label>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the labels by pest ids.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="pestIds">The pest ids.</param>
        /// <param name="currentYear">if set to <c>true</c> results are restricted to the current registration year, otherwise all years results will be included.</param>
        /// <param name="state">The ID of the state you wish to restrict your results to, -1 for all states.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of labels</returns>
        public Result<Classes.Api.V0.Label> GetLabelsByPestIds(string apiKey, int[] pestIds, bool currentYear, int state, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Label>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                // Set the selected link
                var dataContext = new PicolEntities();
                List<int> pestList = pestIds.Cast<int>().ToList();

                int keyCount = (from k in dataContext.ApiKeys
                                where k.Value == apiKey
                                && k.Active
                                && k.Approved
                                select k).Count();

                if (keyCount < 1)
                {
                    result.Error = true;
                    result.Message = "Unauthorized API Key";
                    result.Data = null;
                    return result;
                }

                int year = Convert.ToInt32((from y in dataContext.Settings
                                            where y.Name == "CurrentSearchYear"
                                            select y.Value).Single());

                var ids = (from l in dataContext.LabelCropPestTriples
                           where pestList.Contains(l.PestId)
                           && l.Label.StateRecords.Where(x => x.Year >= year).Count() > 0
                           && l.Label.StateRecords.Where(x => (x.StateId == state || state == -1)).Count() > 0
                           select l.LabelId).Distinct();

                var labels = (from l in dataContext.Labels
                              where ids.Contains(l.Id)
                              select new Classes.Api.V0.Label
                              {
                                  Id = l.Id,
                                  Name = l.Name,
                                  EpaNumber = l.Epa,
                                  IntendedUser = new Classes.Api.V0.IntendedUser { Id = l.IntendedUser.Id, Name = l.IntendedUser.Name, Code = l.IntendedUser.Code },
                                  Ingredients = l.IngredientLabelPairs.Select(x => new Classes.Api.V0.Ingredient { Id = x.Ingredient.Id, Name = x.Ingredient.Name, Code = x.Ingredient.Code, Notes = x.Ingredient.Notes, Resistance = new Classes.Api.V0.Resistance { Id = x.Ingredient.Resistance.Id, Code = x.Ingredient.Resistance.Code, MethodOfAction = x.Ingredient.Resistance.MethodOfAction, Source = x.Ingredient.Resistance.Source } }),
                                  PesticideTypes = l.PesticideTypes.Select(x => new Classes.Api.V0.PesticideType { Id = x.Id, Code = x.Code, Name = x.Name }),
                                  Registrant = new Classes.Api.V0.Registrant { Id = l.Registrant.Id, Name = l.Registrant.Name, Website = l.Registrant.Url },
                                  SlnName = l.SlnName,
                                  SlnExpiration = l.SlnExpiration.HasValue ? l.SlnExpiration.Value : DateTime.MinValue,
                                  StateRecords = l.StateRecords.Select(x => new Classes.Api.V0.StateRecord { Id = x.Id, Name = x.State.Name, AgencyId = x.AgencyId, Version = x.Version, Year = x.Year, I502 = x.I502, Essb6206 = x.Essb6206 }),
                                  Supplemental = l.Supplemental,
                                  SupplementalName = l.SupplementalName,
                                  SupplementalExpiration = l.SupplementalExpiration.HasValue ? l.SupplementalExpiration.Value : DateTime.MinValue,
                                  Formulation = l.Formulation.Name,
                                  SignalWord = l.SignalWord.Code,
                                  Usage = l.Usage.Code,
                                  Organic = l.Organic,
                                  Spanish = l.Spanish,
                                  EsaNotice = l.EsaNotice,
                                  Section18 = l.Section18
                              }).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = labels;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Label>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }

        /// <summary>Gets the labels by registrant.</summary>
        /// <param name="apiKey">The API key.</param>
        /// <param name="registrantId">The registrant identifier.</param>
        /// <param name="currentYear">if set to <c>true</c> results are restricted to the current registration year, otherwise all years results will be included.</param>
        /// <param name="state">The ID of the state you wish to restrict your results to, -1 for all states.</param>
        /// <param name="acceptTos">if set to <c>true</c> [accept tos].</param>
        /// <returns>A JSON encoded collection of labels</returns>
        public Result<Classes.Api.V0.Label> GetLabelsByRegistrant(string apiKey, int registrantId, bool currentYear, int state, bool acceptTos)
        {
            try
            {
                // Process TOS acceptance
                var result = new Result<Classes.Api.V0.Label>();
                if (!acceptTos)
                {
                    result.Error = true;
                    result.Message = "You must accept the Terms of Service located on the Request API key page (~/Account/RequestApiKey) by setting acceptTos to true.";
                    result.Data = null;
                    return result;
                }

                // Set the selected link
                var dataContext = new PicolEntities();

                int keyCount = (from k in dataContext.ApiKeys
                                where k.Value == apiKey
                                && k.Active
                                && k.Approved
                                select k).Count();

                if (keyCount < 1)
                {
                    result.Error = true;
                    result.Message = "Unauthorized API Key";
                    result.Data = null;
                    return result;
                }

                int year = Convert.ToInt32((from y in dataContext.Settings
                                            where y.Name == "CurrentSearchYear"
                                            select y.Value).Single());

                var labels = (from l in dataContext.Labels
                              where registrantId == l.RegistrantId
                               && l.StateRecords.Where(x => x.Year >= year).Count() > 0
                               && l.StateRecords.Where(x => (x.StateId == state || state == -1)).Count() > 0
                              select new Classes.Api.V0.Label
                              {
                                  Id = l.Id,
                                  Name = l.Name,
                                  EpaNumber = l.Epa,
                                  IntendedUser = new Classes.Api.V0.IntendedUser { Id = l.IntendedUser.Id, Name = l.IntendedUser.Name, Code = l.IntendedUser.Code },
                                  Ingredients = l.IngredientLabelPairs.Select(x => new Classes.Api.V0.Ingredient { Id = x.Ingredient.Id, Name = x.Ingredient.Name, Code = x.Ingredient.Code, Notes = x.Ingredient.Notes, Resistance = new Classes.Api.V0.Resistance { Id = x.Ingredient.Resistance.Id, Code = x.Ingredient.Resistance.Code, MethodOfAction = x.Ingredient.Resistance.MethodOfAction, Source = x.Ingredient.Resistance.Source } }),
                                  PesticideTypes = l.PesticideTypes.Select(x => new Classes.Api.V0.PesticideType { Id = x.Id, Code = x.Code, Name = x.Name }),
                                  Registrant = new Classes.Api.V0.Registrant { Id = l.Registrant.Id, Name = l.Registrant.Name, Website = l.Registrant.Url },
                                  SlnName = l.SlnName,
                                  SlnExpiration = l.SlnExpiration.HasValue ? l.SlnExpiration.Value : DateTime.MinValue,
                                  StateRecords = l.StateRecords.Select(x => new Classes.Api.V0.StateRecord { Id = x.Id, Name = x.State.Name, AgencyId = x.AgencyId, Version = x.Version, Year = x.Year, I502 = x.I502, Essb6206 = x.Essb6206 }),
                                  Supplemental = l.Supplemental,
                                  SupplementalName = l.SupplementalName,
                                  SupplementalExpiration = l.SupplementalExpiration.HasValue ? l.SupplementalExpiration.Value : DateTime.MinValue,
                                  Formulation = l.Formulation.Name,
                                  SignalWord = l.SignalWord.Code,
                                  Usage = l.Usage.Code,
                                  Organic = l.Organic,
                                  Spanish = l.Spanish,
                                  EsaNotice = l.EsaNotice,
                                  Section18 = l.Section18
                              }).ToList();

                result.Error = false;
                result.Message = string.Empty;
                result.Data = labels;
                return result;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                var result = new Result<Classes.Api.V0.Label>();
                result.Error = true;
                result.Message = "Exception thrown during retrieval of data";
                result.Data = null;
                return result;
            }
        }
    }
}