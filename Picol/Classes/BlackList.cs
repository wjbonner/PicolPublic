// -----------------------------------------------------------------------
// <copyright file="BlackList.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Classes
{
    /// <summary>Override class for the purchase class for holding human friendly display overrides</summary>
    public class BlackList
    {
        /// <summary>Gets or sets a value indicating whether this <see cref="BlackList"/> is error.</summary>
        /// <value><c>true</c> if error; otherwise, <c>false</c>.</value>
        public bool Error { get; set; }

        /// <summary>Gets or sets a value indicating whether [black listed].</summary>
        /// <value><c>true</c> if [black listed]; otherwise, <c>false</c>.</value>
        public bool BlackListed { get; set; }
    }
}