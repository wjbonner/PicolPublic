// <copyright file="State.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>

namespace Picol.Classes.Api.V1
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>API data object for pest information</summary>
    public partial class State
    {
        /// <summary>Gets or sets the unique identifier.</summary>
        /// <value>The unique database identifier identifier.</value>
        public int Id { get; set; }

        /// <summary>Gets or sets the name of the state.</summary>
        /// <value>The name of the state.</value>
        public string Name { get; set; }
    }
}