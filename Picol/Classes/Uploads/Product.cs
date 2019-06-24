// -----------------------------------------------------------------------
// <copyright file="Product.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Classes.Uploads
{
    /// <summary>Override class for the purchase class for holding human friendly display overrides</summary>
    public class Product
    {
        /// <summary>Gets or sets the identifier.</summary>
        /// <value>The identifier.</value>
        public int Id { get; set; }

        /// <summary>Gets or sets the epa.</summary>
        /// <value>The epa.</value>
        public string Name { get; set; }

        /// <summary>Gets or sets the name.</summary>
        /// <value>The name.</value>
        public string EpaNumber { get; set; }

        /// <summary>Gets or sets the name of the supplemental.</summary>
        /// <value>The name of the supplemental.</value>
        public string SupplementalName { get; set; }

        /// <summary>Gets or sets the supplemental number.</summary>
        /// <value>The supplemental number.</value>
        public string SupplementalNumber { get; set; }

        /// <summary>Gets or sets the year.</summary>
        /// <value>The year.</value>
        public int Year { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="Product"/> is reregister.</summary>
        /// <value><c>true</c> if reregister; otherwise, <c>false</c>.</value>
        public bool Reregister { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="Product"/> is revised.</summary>
        /// <value><c>true</c> if revised; otherwise, <c>false</c>.</value>
        public bool Revised { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="Product"/> is cancelled.</summary>
        /// <value><c>true</c> if cancelled; otherwise, <c>false</c>.</value>
        public bool Cancelled { get; set; }
    }
}