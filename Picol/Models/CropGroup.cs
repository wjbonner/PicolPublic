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
    public partial class CropGroup
    {
        public CropGroup()
        {
            this.Crops = new HashSet<Crop>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
    
        public virtual ICollection<Crop> Crops { get; set; }
    }
    #pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
}
