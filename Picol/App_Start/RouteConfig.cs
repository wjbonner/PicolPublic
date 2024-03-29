﻿// -----------------------------------------------------------------------
// <copyright file="RouteConfig.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.Routing;

    /// <summary>Class for the route configuration</summary>
    public class RouteConfig
    {
        /// <summary>Registers the routes.</summary>
        /// <param name="routes">The routes.</param>
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional });
        }
    }
}