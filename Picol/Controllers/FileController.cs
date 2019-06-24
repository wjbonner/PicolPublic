// -----------------------------------------------------------------------
// <copyright file="FileController.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using Elmah;
    using Picol.Classes;
    using Picol.Decorators;
    using Picol.Models;

    /// <summary>
    /// Class that contains the home/public action implementations
    /// </summary>
    [History(Order = 1)]
    public class FileController : Controller
    {
        /// <summary>This applications home page</summary>
        /// <param name="id">The identifier of the file to download.</param>
        /// <returns>An octet stream</returns>
        public ActionResult Download(int id)
        {
            try
            {
                var dataContext = new PicolEntities();
                var image = (from i in dataContext.BinarySettings
                            where i.Public && i.Id == id
                            select i).SingleOrDefault();

                if (image == null)
                {
                    // Load file meta data with FileInfo
                    FileInfo fileInfo = new FileInfo(this.Server.MapPath("~/Content/images/Blue_Question_Small.png"));

                    // The byte[] to save the data in
                    byte[] data = new byte[fileInfo.Length];

                    // Load a filestream and put its content into the byte[]
                    using (FileStream fs = fileInfo.OpenRead())
                    {
                        fs.Read(data, 0, data.Length);
                    }

                    return this.File(data, "application/octet-stream", "Blue_Question_Small.png");
                }

                return this.File(image.Value, "application/octet-stream", image.Name + image.Extension);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the file." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }

        /// <summary>Downloads the specified identifier.</summary>
        /// <param name="id">The identifier.</param>
        /// <returns>An octet stream</returns>
        public ActionResult FindByName(string id)
        {
            try
            {
                var dataContext = new PicolEntities();
                var image = (from i in dataContext.BinarySettings
                             where i.Public && i.Name == id && !i.Manageable
                             select i).SingleOrDefault();

                if (image == null)
                {
                    // Load file meta data with FileInfo
                    FileInfo fileInfo = new FileInfo(this.Server.MapPath("~/Content/images/Header.png"));

                    // The byte[] to save the data in
                    byte[] data = new byte[fileInfo.Length];

                    // Load a filestream and put its content into the byte[]
                    using (FileStream fs = fileInfo.OpenRead())
                    {
                        fs.Read(data, 0, data.Length);
                    }

                    return this.File(data, "application/octet-stream", "Header.png");
                }

                return this.File(image.Value, "application/octet-stream", image.Name + image.Extension);
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return new JsonNetResult { Data = new { Error = true, ErrorMessage = "Failed to retrieve the file." }, MaxJsonLength = int.MaxValue, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}
