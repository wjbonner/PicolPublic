// <copyright file="TermGroup.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>

namespace Picol.Classes.Search
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    /// <summary>Class for term group from the advanced search</summary>
    public partial class TermGroup
    {
        /// <summary>Gets or sets the group.</summary>
        /// <value>The group.</value>
        public int SearchGroup { get; set; }

        /// <summary>Gets or sets the search group operator.</summary>
        /// <value>The search group operator.</value>
        public string SearchGroupOperator { get; set; }

        /// <summary>Gets or sets the search conditional.</summary>
        /// <value>The search conditional.</value>
        public string SearchConditional { get; set; }

        /// <summary>Gets or sets the search field.</summary>
        /// <value>The search field.</value>
        public string SearchField { get; set; }

        /// <summary>Gets or sets the search operator.</summary>
        /// <value>The search operator.</value>
        public string SearchOperator { get; set; }

        /// <summary>Gets or sets the search value.</summary>
        /// <value>The search value.</value>
        public string SearchValue { get; set; }
    }
}