//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Picol.Models
{
    using System;
    using System.Collections.Generic;
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("EntityFramework", "1.0.0.0")]
    #pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public partial class User
    {
        public User()
        {
            this.UserPreferences = new HashSet<UserPreference>();
            this.ApiKeys = new HashSet<ApiKey>();
            this.ApiKeys1 = new HashSet<ApiKey>();
            this.Searches = new HashSet<Search>();
        }
    
        public int Id { get; set; }
        public string Logon { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool Verified { get; set; }
        public bool Active { get; set; }
        public bool Admin { get; set; }
        public System.DateTime LastLogin { get; set; }
    
        public virtual Password Password { get; set; }
        public virtual ICollection<UserPreference> UserPreferences { get; set; }
        public virtual ICollection<ApiKey> ApiKeys { get; set; }
        public virtual ICollection<ApiKey> ApiKeys1 { get; set; }
        public virtual ICollection<Search> Searches { get; set; }
    }
    #pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
}
