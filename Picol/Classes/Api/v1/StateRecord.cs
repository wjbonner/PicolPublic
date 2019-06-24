// <copyright file="StateRecord.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>

namespace Picol.Classes.Api.V1
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>API data object for pest information</summary>
    public partial class StateRecord
    {
        /// <summary>Gets or sets the unique identifier.</summary>
        /// <value>The unique database identifier identifier.</value>
        public int Id { get; set; }

        /// <summary>Gets or sets the state identifier.</summary>
        /// <value>The state identifier.</value>
        public int StateId { get; set; }

        /// <summary>Gets or sets the name of the state.</summary>
        /// <value>The name of the state.</value>
        public string Name { get; set; }

        /// <summary>Gets or sets the agency identifier such as WSDA Line Number.</summary>
        /// <value>The agency identifier.</value>
        public string AgencyId { get; set; }

        /// <summary>Gets or sets the version of the state registration.</summary>
        /// <value>The version of the state registration.</value>
        public string Version { get; set; }

        /// <summary>Gets or sets the year of registration.</summary>
        /// <value>The registration year.</value>
        public int Year { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="StateRecord"/> is i502.</summary>
        /// <value><c>true</c> if i502; otherwise, <c>false</c>.</value>
        public bool I502 { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="StateRecord"/> is essb6206.</summary>
        /// <value><c>true</c> if essb6206; otherwise, <c>false</c>.</value>
        public bool Essb6206 { get; set; }
    }
}