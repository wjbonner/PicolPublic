// -----------------------------------------------------------------------
// <copyright file="WebApiConfig.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;

    /// <summary>Class to register any web API interfaces</summary>
    public static class WebApiConfig
    {
        /// <summary>Registers the specified configuration.</summary>
        /// <param name="config">The configuration.</param>
        public static void Register(HttpConfiguration config)
        {
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            ////config.Routes.MapHttpRoute(
            ////    name: "DefaultApi",
            ////    routeTemplate: "api/{controller}/{action}/{id}",
            ////    defaults: new { id = RouteParameter.Optional });

            ////config.Routes.MapHttpRoute(
            ////    name: "VersionedApi",
            ////    routeTemplate: "api/v{apiVersion}/{controller}/{action}/{id}",
            ////    defaults: new { id = RouteParameter.Optional });

            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute("Version0", "api/v0/Public/{action}/{id}", new { controller = "PublicV0", id = RouteParameter.Optional });
            config.Routes.MapHttpRoute("Version1", "api/v1/Public/{action}/{id}", new { controller = "PublicV1", id = RouteParameter.Optional });
        }
    }
}
