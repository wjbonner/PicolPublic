// -----------------------------------------------------------------------
// <copyright file="Certificate.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Classes.Uploads
{
    /// <summary>Override class for the purchase class for holding human friendly display overrides</summary>
    public class Certificate
    {
        /// <summary>Gets or sets the name.</summary>
        /// <value>The name.</value>
        public string Name { get; set; }

        /// <summary>Gets or sets the date.</summary>
        /// <value>The date.</value>
        public string Date { get; set; }

        /// <summary>Gets or sets the registrant.</summary>
        /// <value>The registrant.</value>
        public string Code { get; set; }

        /// <summary>Gets or sets the name of the file.</summary>
        /// <value>The name of the file.</value>
        public string FileName { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="Certificate"/> is format.</summary>
        /// <value><c>true</c> if format; otherwise, <c>false</c>.</value>
        public bool Format { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="Certificate"/> is match.</summary>
        /// <value><c>true</c> if match; otherwise, <c>false</c>.</value>
        public bool Match { get; set; }

        /// <summary>Gets or sets a value indicating whether [third party].</summary>
        /// <value><c>true</c> if [third party]; otherwise, <c>false</c>.</value>
        public bool ThirdParty { get; set; }
    }
}