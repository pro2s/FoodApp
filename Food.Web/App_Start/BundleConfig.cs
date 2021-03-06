﻿using System.Web.Optimization;

namespace Food.Web
{
    public class BundleConfig
    {

        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                        "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                        "~/Scripts/moment-with-locales.js"));

            bundles.Add(new ScriptBundle("~/bundles/loading-bar").Include(
                        "~/Scripts/loading-bar.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/angular.js",
                        "~/Scripts/angular-*",
                        "~/Scripts/angular-ui/*tpls.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/angular-translate").IncludeDirectory(
                        "~/Scripts/angular-translate", "*.js", true));

            bundles.Add(new ScriptBundle("~/bundles/app").IncludeDirectory(
                        "~/app", "*.js", true));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/bootstrap.css",
                        "~/Content/font-awesome.css",
                        "~/Content/bootstrap-social.css",
                        "~/Content/loading-bar.css",
                        "~/Content/site.css"
                        ));
        }
    }
}