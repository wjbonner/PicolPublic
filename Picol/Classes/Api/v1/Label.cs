// <copyright file="Label.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>

namespace Picol.Classes.Api.V1
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using Models;

    /// <summary>API data object for label information</summary>
    public partial class Label
    {
        /// <summary>Gets or sets the unique identifier.</summary>
        /// <value>The unique database identifier.  Subject to change.</value>
        public int Id { get; set; }

        /// <summary>Gets or sets the name.</summary>
        /// <value>The name of the label.</value>
        public string Name { get; set; }

        /// <summary>Gets or sets the EPA Number.</summary>
        /// <value>The EPA Number.</value>
        public string EpaNumber { get; set; }

        /// <summary>Gets or sets the intended user.</summary>
        /// <value>The intended user.</value>
        public IntendedUser IntendedUser { get; set; }

        /// <summary>Gets or sets the ingredients.</summary>
        /// <value>The ingredients.</value>
        public IEnumerable<Ingredient> Ingredients { get; set; }

        /// <summary>Gets or sets the pesticide types.</summary>
        /// <value>The pesticide types.</value>
        public IEnumerable<PesticideType> PesticideTypes { get; set; }

        /// <summary>Gets or sets the registrant.</summary>
        /// <value>The registrant.</value>
        public Registrant Registrant { get; set; }

        /// <summary>Gets or sets the SLN.</summary>
        /// <value>The SLN.</value>
        public string Sln { get; set; }

        /// <summary>Gets or sets the name of the SLN.</summary>
        /// <value>The name of the SLN.</value>
        public string SlnName { get; set; }

        /// <summary>Gets or sets the SLN expiration.</summary>
        /// <value>The SLN expiration.</value>
        public DateTime? SlnExpiration { get; set; }

        /// <summary>Gets or sets the state record.</summary>
        /// <value>The records related to registration with a state.</value>
        public IEnumerable<StateRecord> StateRecords { get; set; }

        /// <summary>Gets or sets the supplemental value.</summary>
        /// <value>The supplemental value.</value>
        public string Supplemental { get; set; }

        /// <summary>Gets or sets the name of the supplemental.</summary>
        /// <value>The supplemental name.</value>
        public string SupplementalName { get; set; }

        /// <summary>Gets or sets the supplemental expiration.</summary>
        /// <value>The supplemental expiration.</value>
        public DateTime? SupplementalExpiration { get; set; }

        /// <summary>Gets or sets the formulation.</summary>
        /// <value>The formulation code.</value>
        public string Formulation { get; set; }

        /// <summary>Gets or sets the signal word.</summary>
        /// <value>The signal word.</value>
        public string SignalWord { get; set; }

        /// <summary>Gets or sets the usage.</summary>
        /// <value>The usage.</value>
        public string Usage { get; set; }

        /// <summary>Gets or sets the organic designation.</summary>
        /// <value>Whether the lable is OMRI.</value>
        public bool? Organic { get; set; }

        /// <summary>Gets or sets the spanish.</summary>
        /// <value>Whether there is a Spanish label.</value>
        public bool? Spanish { get; set; }

        /// <summary>Gets or sets a value indicating whether [esa notice].</summary>
        /// <value><c>true</c> if [endangered specis act notice]; otherwise, <c>false</c>.</value>
        public bool? EsaNotice { get; set; }

        /// <summary>Gets or sets the section18.</summary>
        /// <value>The section18.</value>
        public string Section18 { get; set; }
    }
}