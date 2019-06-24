// -----------------------------------------------------------------------
// <copyright file="AuthenticationSession.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Classes
{
    /// <summary>Represents the authentication tokens</summary>
    public class AuthenticationSession
    {
        /// <summary>Gets or sets the network ID.</summary>
        /// <value>The network id.</value>
        public string Nid { get; set; }

        /// <summary>Gets or sets the WSU id.</summary>
        /// <value>The WSU id.</value>
        public string WsuId { get; set; }

        /// <summary>Gets or sets the first name</summary>
        /// <value>The first name.</value>
        public string Fname { get; set; }

        /// <summary>Gets or sets the last name</summary>
        /// <value>The last name</value>
        public string Lname { get; set; }

        /// <summary>Gets or sets a value indicating whether this instance is authenticated.</summary>
        /// <value><c>true</c> if this instance is authenticated; otherwise, <c>false</c>.</value>
        public bool Authenticated { get; set; }

        /// <summary>Gets or sets the logout URL.</summary>
        /// <value>The logout URL.</value>
        public string LogoutUrl { get; set; }
    }
}