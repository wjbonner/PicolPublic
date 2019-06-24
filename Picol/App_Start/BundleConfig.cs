// -----------------------------------------------------------------------
// <copyright file="BundleConfig.cs" company="Washington State University">
//  Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol
{
    using System.Web;
    using System.Web.Optimization;

    /// <summary>Class for our resource bundles</summary>
    public class BundleConfig
    {
        /// <summary>Registers the bundles.</summary>
        /// <param name="bundles">The bundles.</param>
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/base").Include(
                        "~/Scripts/modernizr-*",
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-{version}.js",
                        "~/Scripts/jquery.cookie.js",
                        "~/Scripts/jquery.multi-select.js",
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*",
                        "~/Scripts/Picol.Layout.js",
                        "~/Scripts/Picol.Utilities.js"));

            bundles.Add(new ScriptBundle("~/bundles/slickgrid").Include(
                        "~/Scripts/jquery.event.drag.js",
                        "~/Scripts/jquery.event.drop.js",
                        "~/Scripts/SlickGrid/slick.core.js",
                        "~/Scripts/SlickGrid/Plugins/slick.cellrangeselector.js",
                        "~/Scripts/SlickGrid/Plugins/slick.cellrangedecorator.js",
                        "~/Scripts/SlickGrid/Plugins/slick.cellselectionmodel.js",
                        "~/Scripts/SlickGrid/Plugins/slick.rowselectionmodel.js",
                        "~/Scripts/SlickGrid/Plugins/slick.rowmovemanager.js",
                        "~/Scripts/SlickGrid/Plugins/slick.headermenu.js",
                        "~/Scripts/SlickGrid/Plugins/slick.autotooltips.js",
                        "~/Scripts/SlickGrid/slick.formatters.js",
                        "~/Scripts/SlickGrid/slick.dataview.js",
                        "~/Scripts/SlickGrid/slick.editors.js",
                        "~/Scripts/SlickGrid/slick.custom.editors.js",
                        "~/Scripts/SlickGrid/slick.groupitemmetadataprovider.js",
                        "~/Scripts/SlickGrid/slick.remotemodel.js",
                        "~/Scripts/SlickGrid/slick.grid.js",
                        "~/Scripts/SlickGrid/Controls/slick.pager.js",
                        "~/Scripts/SlickGrid/Controls/slick.columnpicker.js",
                        "~/Scripts/SlickGrid.Helper.js",
                        "~/Scripts/SlickGrid.Comparer.js"));

            bundles.Add(new Bundle("~/bundles/SlickgridFilter").Include(
                        "~/Scripts/SlickGrid.Filter.js"));

            bundles.Add(new ScriptBundle("~/bundles/filesaver").Include(
                        "~/Scripts/FileSaver.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Account_Details").Include(
                        "~/Scripts/Picol.Account.Details.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Account_RequestApiKey").Include(
                        "~/Scripts/Picol.Account.RequestApiKey.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Admin_DataLoad").Include(
                        "~/Scripts/Picol.Admin.DataLoad.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Admin_ApiKeyDetails").Include(
                        "~/Scripts/Picol.Admin.ApiKeyDetails.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Admin_EditHome").Include(
                        "~/Scripts/Picol.Admin.EditHome.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Admin_EditApiTos").Include(
                        "~/Scripts/Picol.Admin.EditApiTos.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Admin_EditFaq").Include(
                        "~/Scripts/Picol.Admin.EditFaq.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Admin_EditVideoTutorials").Include(
                        "~/Scripts/Picol.Admin.EditVideoTutorials.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Admin_EditApiUse").Include(
                        "~/Scripts/Picol.Admin.EditApiUse.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_User_Details").Include(
                        "~/Scripts/Picol.User.Details.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_NewAccount_Create").Include(
                        "~/Scripts/Picol.NewAccount.Create.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Session_Create").Include(
                        "~/Scripts/Picol.Session.Create.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Account_ResetPassword").Include(
                        "~/Scripts/Picol.Account.ResetPassword.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_IntendedUsers").Include(
                        "~/Scripts/Picol.Lookup.IntendedUsers.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_ToleranceCrops").Include(
                        "~/Scripts/Picol.Lookup.ToleranceCrops.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_SignalWords").Include(
                        "~/Scripts/Picol.Lookup.SignalWords.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_Applications").Include(
                        "~/Scripts/Picol.Lookup.Applications.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_Crops").Include(
                        "~/Scripts/Picol.Lookup.Crops.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_Formulations").Include(
                        "~/Scripts/Picol.Lookup.Formulations.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_Pests").Include(
                        "~/Scripts/Picol.Lookup.Pests.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_PesticideTypes").Include(
                        "~/Scripts/Picol.Lookup.PesticideTypes.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_Ingredients").Include(
                        "~/Scripts/Picol.Lookup.Ingredients.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_Registrants").Include(
                        "~/Scripts/Picol.Lookup.Registrants.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Lookup_Resistance").Include(
                        "~/Scripts/Picol.Lookup.Resistance.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Home_Labels").Include(
                        "~/Scripts/Picol.Home.Labels.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Search_Index").Include(
                        "~/Scripts/Picol.Search.Index.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Search_Quick").Include(
                        "~/Scripts/Picol.Search.Quick.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Search_Results").Include(
                        "~/Scripts/Picol.Search.Results.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Search_Labels").Include(
                        "~/Scripts/Picol.Search.Labels.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Search_Advanced").Include(
                        "~/Scripts/Picol.Search.Advanced.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Search_Details").Include(
                        "~/Scripts/Picol.Search.Details.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Admin_Users").Include(
                        "~/Scripts/Picol.Admin.Users.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Admin_ApiKeys").Include(
                        "~/Scripts/Picol.Admin.ApiKeys.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Admin_ListSettings").Include(
                        "~/Scripts/Picol.Admin.ListSettings.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_CertificateProcessing_Uploaded").Include(
                        "~/Scripts/Picol.CertificateProcessing.Uploaded.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_CertificateProcessing_Review").Include(
                        "~/Scripts/Picol.CertificateProcessing.Review.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_CertificateProcessing_InTransit").Include(
                        "~/Scripts/Picol.CertificateProcessing.InTransit.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_CertificateProcessing_Reviewed").Include(
                        "~/Scripts/Picol.CertificateProcessing.Reviewed.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Label_Details").Include(
                        "~/Scripts/Picol.Label.Details.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Label_Upload").Include(
                        "~/Scripts/Picol.Label.Upload.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_CropGroup_List").Include(
                        "~/Scripts/Picol.CropGroup.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Crop_List").Include(
                        "~/Scripts/Picol.Crop.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Formulation_List").Include(
                        "~/Scripts/Picol.Formulation.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Application_List").Include(
                        "~/Scripts/Picol.Application.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Resistance_List").Include(
                        "~/Scripts/Picol.Resistance.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Ingredient_List").Include(
                        "~/Scripts/Picol.Ingredient.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Registrant_List").Include(
                        "~/Scripts/Picol.Registrant.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_RegulationAuthority_List").Include(
                        "~/Scripts/Picol.RegulationAuthority.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_SignalWord_List").Include(
                        "~/Scripts/Picol.SignalWord.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_ToleranceCrop_List").Include(
                        "~/Scripts/Picol.ToleranceCrop.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_ToleranceType_List").Include(
                        "~/Scripts/Picol.ToleranceType.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Usage_List").Include(
                        "~/Scripts/Picol.Usage.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Pest_List").Include(
                        "~/Scripts/Picol.Pest.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_User_List").Include(
                        "~/Scripts/Picol.User.List.js"));

            bundles.Add(new ScriptBundle("~/bundles/Picol_Label_List").Include(
                        "~/Scripts/Picol.Label.List.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/base").Include(
                        "~/Content/Site.css",
                        "~/Content/jquery-ui.css",
                        "~/Content/multi-select.css"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/core.css",
                        "~/Content/themes/base/resizable.css",
                        "~/Content/themes/base/selectable.css",
                        "~/Content/themes/base/accordion.css",
                        "~/Content/themes/base/autocomplete.css",
                        "~/Content/themes/base/button.css",
                        "~/Content/themes/base/dialog.css",
                        "~/Content/themes/base/slider.css",
                        "~/Content/themes/base/tabs.css",
                        "~/Content/themes/base/datepicker.css",
                        "~/Content/themes/base/progressbar.css",
                        "~/Content/themes/base/theme.css"));

            bundles.Add(new StyleBundle("~/Content/slickgrid").Include(
                        "~/Content/slick.columnpicker.css",
                        "~/Content/slick.headerbuttons.css",
                        "~/Content/slick.headermenu.css",
                        "~/Content/slick.pager.css",
                        "~/Content/slick.columnpicker.css",
                        "~/Content/slick.grid.css",
                        "~/Content/slick-default-theme.css"));
        }
    }
}