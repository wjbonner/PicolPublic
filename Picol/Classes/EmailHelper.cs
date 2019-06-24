//-----------------------------------------------------------------------
// <copyright file="EmailHelper.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Picol.Classes
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Security;
    using Elmah;

    /// <summary>Helper class for using cookies</summary>
    public static class EmailHelper
    {
        /// <summary>Sends send an email address through the WSU SMTP server</summary>
        /// <param name="to">List of to addresses</param>
        /// <param name="cc">List of cc addressesThe cc.</param>
        /// <param name="bcc">List of bcc addresses</param>
        /// <param name="from">The reply email address.</param>
        /// <param name="subject">The subject of the email.</param>
        /// <param name="body">The body of the email.</param>
        /// <param name="html">if set to <c>true</c> [HTML].</param>
        /// <returns>A Boolean true or false to indicate success.</returns>
        public static bool SendEmail(List<string> to, List<string> cc, List<string> bcc, string from, string subject, string body, bool html)
        {
            try
            {
                System.Net.Mail.MailMessage email = new System.Net.Mail.MailMessage();

                if (to.Count() != 0)
                {
                    email.To.Add(string.Join(",", to.Distinct().ToArray()));
                }

                if (cc.Count() != 0)
                {
                    email.CC.Add(string.Join(",", cc.Distinct().ToArray()));
                }

                if (bcc.Count() != 0)
                {
                    email.Bcc.Add(string.Join(",", bcc.Distinct().ToArray()));
                }

                email.Subject = subject;
                email.From = new System.Net.Mail.MailAddress(from);
                email.Body = body;
                email.IsBodyHtml = html;

                System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("smtp.wsu.edu");
                smtp.Send(email);

                return true;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return false;
            }
        }

        /// <summary>Sends the email.</summary>
        /// <param name="to">To.</param>
        /// <param name="cc">The cc.</param>
        /// <param name="bcc">The BCC.</param>
        /// <param name="from">From.</param>
        /// <param name="subject">The subject.</param>
        /// <param name="body">The body.</param>
        /// <param name="html">if set to <c>true</c> [HTML].</param>
        /// <param name="attachments">The attachments.</param>
        /// <returns>A success indicator</returns>
        public static bool SendEmail(List<string> to, List<string> cc, List<string> bcc, string from, string subject, string body, bool html, List<System.Net.Mail.Attachment> attachments)
        {
            try
            {
                System.Net.Mail.MailMessage email = new System.Net.Mail.MailMessage();

                if (to.Count() != 0)
                {
                    email.To.Add(string.Join(",", to.Distinct().ToArray()));
                }

                if (cc.Count() != 0)
                {
                    email.CC.Add(string.Join(",", cc.Distinct().ToArray()));
                }

                if (bcc.Count() != 0)
                {
                    email.Bcc.Add(string.Join(",", bcc.Distinct().ToArray()));
                }

                email.Subject = subject;
                email.From = new System.Net.Mail.MailAddress(from);
                email.Body = body;
                email.IsBodyHtml = html;

                System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("smtp.wsu.edu");

                foreach (var a in attachments)
                {
                    email.Attachments.Add(a);
                }

                smtp.Send(email);

                return true;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return false;
            }
        }

        /// <summary>Sends send an email address through the WSU SMTP server</summary>
        /// <param name="to">Comma delimited collection of to addresses</param>
        /// <param name="cc">Comma delimited collection of cc addresses.</param>
        /// <param name="bcc">Comma delimited collection of bcc addresses</param>
        /// <param name="from">The reply email address.</param>
        /// <param name="subject">The subject of the email.</param>
        /// <param name="body">The body of the email.</param>
        /// <param name="html">if set to <c>true</c> [HTML].</param>
        /// <param name="attachment">The attachment.</param>
        /// <returns>A Boolean true or false to indicate success.</returns>
        public static bool SendEmail(string to, string cc, string bcc, string from, string subject, string body, bool html, System.Net.Mail.Attachment attachment)
        {
            try
            {
                System.Net.Mail.MailMessage email = new System.Net.Mail.MailMessage();

                if (!string.IsNullOrEmpty(to))
                {
                    email.To.Add(string.Join(",", new List<string>(to.Trim(',', ' ', ';').Split(',')).Distinct().ToArray()));
                }

                if (!string.IsNullOrEmpty(cc))
                {
                    email.CC.Add(string.Join(",", new List<string>(cc.Trim(',', ' ', ';').Split(',')).Distinct().ToArray()));
                }

                if (!string.IsNullOrEmpty(bcc))
                {
                    email.Bcc.Add(string.Join(",", new List<string>(bcc.Trim(',', ' ', ';').Split(',')).Distinct().ToArray()));
                }

                email.Subject = subject;
                email.From = new System.Net.Mail.MailAddress(from);
                email.Body = body;
                email.IsBodyHtml = html;

                System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("smtp.wsu.edu");
                email.Attachments.Add(attachment);
                smtp.Send(email);

                return true;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return false;
            }
        }

        /// <summary>Sends the email.</summary>
        /// <param name="to">To.</param>
        /// <param name="cc">The cc.</param>
        /// <param name="bcc">The BCC.</param>
        /// <param name="from">From.</param>
        /// <param name="subject">The subject.</param>
        /// <param name="body">The body.</param>
        /// <param name="html">if set to <c>true</c> [HTML].</param>
        /// <returns>A success indicator</returns>
        public static bool SendEmail(string to, string cc, string bcc, string from, string subject, string body, bool html)
        {
            try
            {
                System.Net.Mail.MailMessage email = new System.Net.Mail.MailMessage();

                if (!string.IsNullOrEmpty(to))
                {
                    email.To.Add(string.Join(",", new List<string>(to.Trim(',', ' ', ';').Split(',')).Distinct().ToArray()));
                }

                if (!string.IsNullOrEmpty(cc))
                {
                    email.CC.Add(string.Join(",", new List<string>(cc.Trim(',', ' ', ';').Split(',')).Distinct().ToArray()));
                }

                if (!string.IsNullOrEmpty(bcc))
                {
                    email.Bcc.Add(string.Join(",", new List<string>(bcc.Trim(',', ' ', ';').Split(',')).Distinct().ToArray()));
                }

                email.Subject = subject;
                email.From = new System.Net.Mail.MailAddress(from);
                email.Body = body;
                email.IsBodyHtml = html;

                System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("smtp.wsu.edu");
                smtp.Send(email);

                return true;
            }
            catch (Exception e)
            {
                // Signal the error to be logged by elmah
                ErrorSignal.FromCurrentContext().Raise(e);
                return false;
            }
        }
    }
}