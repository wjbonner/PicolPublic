// -----------------------------------------------------------------------
// <copyright file="JsonNetResult.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Classes
{
    using System;
    using System.IO;
    using System.Web;
    using System.Web.Mvc;
    using Newtonsoft.Json;

    /// <summary>Class that defines JSON Result return types using the JSON.NET library</summary>
    public class JsonNetResult : JsonResult
    {
        /// <summary>Initializes a new instance of the <see cref="JsonNetResult"/> class.</summary>
        public JsonNetResult()
        {
            this.Settings = new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Error
            };
        }

        /// <summary>Gets the settings.</summary>
        /// <value>The settings.</value>
        public JsonSerializerSettings Settings { get; private set; }

        /// <summary>
        /// Enables processing of the result of an action method by a custom type that inherits from the <see cref="T:System.Web.Mvc.ActionResult" /> class.
        /// </summary>
        /// <param name="context">The context within which the result is executed.</param>
        /// <exception cref="System.ArgumentNullException">context of the request</exception>
        /// <exception cref="System.InvalidOperationException">JSON GET is not allowed</exception>
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            if (this.JsonRequestBehavior == JsonRequestBehavior.DenyGet && string.Equals(context.HttpContext.Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("JSON GET is not allowed");
            }

            HttpResponseBase response = context.HttpContext.Response;
            response.ContentType = string.IsNullOrEmpty(this.ContentType) ? "application/json" : this.ContentType;

            if (this.ContentEncoding != null)
            {
                response.ContentEncoding = this.ContentEncoding;
            }

            if (this.Data == null)
            {
                return;
            }

            var scriptSerializer = JsonSerializer.Create(this.Settings);

            using (var sw = new StringWriter())
            {
                scriptSerializer.Serialize(sw, this.Data);
                response.Write(sw.ToString());
            }
        }
    }
}