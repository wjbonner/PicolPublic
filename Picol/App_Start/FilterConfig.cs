// -----------------------------------------------------------------------
// <copyright file="FilterConfig.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol
{
    using System.Web;
    using System.Web.Mvc;

    /// <summary>Class for the filter configurations</summary>
    public class FilterConfig
    {
        /// <summary>Registers the global filters.</summary>
        /// <param name="filters">The filters.</param>
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}