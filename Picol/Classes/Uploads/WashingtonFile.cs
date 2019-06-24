// -----------------------------------------------------------------------
// <copyright file="WashingtonFile.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Classes.Uploads
{
    /// <summary>Override class for the purchase class for holding human friendly display overrides</summary>
    public class WashingtonFile
    {
        /// <summary>Gets or sets the epa.</summary>
        /// <value>The epa.</value>
        public string Epa { get; set; }

        /// <summary>Gets or sets the name.</summary>
        /// <value>The name.</value>
        public string Name { get; set; }

        /// <summary>Gets or sets the date.</summary>
        /// <value>The date.</value>
        public string Date { get; set; }

        /// <summary>Gets or sets the line.</summary>
        /// <value>The line.</value>
        public string Line { get; set; }

        /// <summary>Gets or sets the registrant.</summary>
        /// <value>The registrant.</value>
        public string Registrant { get; set; }

        /// <summary>Gets or sets the name of the file.</summary>
        /// <value>The name of the file.</value>
        public string FileName { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="Certificate"/> is format.</summary>
        /// <value><c>true</c> if format; otherwise, <c>false</c>.</value>
        public bool Format { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="Certificate"/> is match.</summary>
        /// <value><c>true</c> if match; otherwise, <c>false</c>.</value>
        public bool Match { get; set; }
    }
}