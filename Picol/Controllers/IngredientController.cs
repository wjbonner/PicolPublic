// -----------------------------------------------------------------------
// <copyright file="IngredientController.cs" company="Washington State University">
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
    public class IngredientController : Controller
    {
        /// <summary>Lists the ingredients.</summary>
        /// <returns>A base view object</returns>
        public ActionResult List()
        {
            try
            {
                // Set the selected link
                this.ViewBag.SelectedLink = "Ingredient.List";

                // Create resistance dropdown
                var dbContext = new PicolEntities();
                var resistances = (from c in dbContext.Resistances
                                     select new { Id = c.Id, Name = c.Code }).OrderBy(x => x.Name).ToList();

                resistances.Insert(0, new { Id = -1, Name = "=== Choose a resistance code ===" });
                this.ViewBag.Resistances = new SelectList(resistances, "Id", "Name");
                return this.View();
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return this.Redirect("~/Message/Error/LoadFailed");
            }
        }

        /// <summary>Gets the ingredients.</summary>
        /// <returns>A JSON encoded collection of ingredients</returns>
        public JsonResult Get()
        {
            try
            {
                var farmContext = new PicolEntities();
                var ingredients = from l in farmContext.Ingredients
                             select new
                             {
                                 Id = l.Id,
                                 ResistanceId = l.ResistanceId,
                                 ResistanceCode = l.Resistance.Code,
                                 Code = l.Code,
                                 Name = l.Name,
                                 Notes = l.Notes,
                                 ManagementCode = l.ManagementCode
                             };

                return new JsonNetResult { Data = new { Error = false, Ingredients = ingredients.ToList() }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the ingredients." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Creates the ingredient.</summary>
        /// <param name="ingredient">The ingredient.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Create(Ingredient ingredient)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Ingredients.Add(ingredient);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false, Ingredient = ingredient }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed save ingredient." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Updates the ingredient.</summary>
        /// <param name="ingredient">The ingredient.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Update(Ingredient ingredient)
        {
            try
            {
                var farmContext = new PicolEntities();
                farmContext.Ingredients.Attach(ingredient);
                farmContext.Entry(ingredient).State = System.Data.Entity.EntityState.Modified;
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to update ingredient." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Deletes the ingredient.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A JSON encoded success indicator</returns>
        public JsonResult Delete(int id)
        {
            try
            {
                var farmContext = new PicolEntities();
                var ingredient = (from l in farmContext.Ingredients
                             where l.Id == id
                             select l).Single();

                farmContext.Ingredients.Remove(ingredient);
                farmContext.SaveChanges();

                return new JsonNetResult { Data = new { Error = false }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to delete ingredient." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
