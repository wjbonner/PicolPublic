// -----------------------------------------------------------------------
// <copyright file="AuthenticationToken.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Classes
{
    /// <summary>Represents the authentication tokens</summary>
    public class AuthenticationToken
    {
        /// <summary>Gets or sets the request id.</summary>
        /// <value>The request id.</value>
        public string RequestId { get; set; }

        /// <summary>Gets or sets the claim id.</summary>
        /// <value>The claim id.</value>
        public string ClaimId { get; set; }

        /// <summary>Gets or sets the authentication url</summary>
        /// <value>The authentication url.</value>
        public string AuthenticationUrl { get; set; }
    }
}