// <copyright file="Data.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>

namespace Picol.Classes.Api.V1
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>API Data object</summary>
    /// <typeparam name="TOne">The type data list to use</typeparam>
    public partial class Result<TOne>
    {
        /// <summary>Gets or sets a value indicating whether this <see cref="Result{TOne}"/> is error.</summary>
        /// <value><c>true</c> if error; otherwise, <c>false</c>.</value>
        public bool Error { get; set; }

        /// <summary>Gets or sets the administrative message.</summary>
        /// <value>The message.</value>
        public string Message { get; set; }

        /// <summary>Gets or sets the data.</summary>
        /// <value>The data part of the result.</value>
        public List<TOne> Data { get; set; }
    }
}