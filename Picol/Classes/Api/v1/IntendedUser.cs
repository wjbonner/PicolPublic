﻿// <copyright file="IntendedUser.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>

namespace Picol.Classes.Api.V1
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>API data object for intended user information</summary>
    public partial class IntendedUser
    {
        /// <summary>Gets or sets the unique identifier.</summary>
        /// <value>The unique identifier.</value>
        public int Id { get; set; }

        /// <summary>Gets or sets the name.</summary>
        /// <value>The name.</value>
        public string Name { get; set; }

        /// <summary>Gets or sets the code.</summary>
        /// <value>The code.</value>
        public string Code { get; set; }
    }
}