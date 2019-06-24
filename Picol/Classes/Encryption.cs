// -----------------------------------------------------------------------
// <copyright file="Encryption.cs" company="Washington State University">
// Copyright (c) Washington State University Board of Regents. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace Picol.Classes
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Web;
    using System.Web.Security;

    /// <summary>Helper class for using cookies</summary>
    public static class Encryption
    {
        /// <summary>Uses machine key encryption to encrypt data using a reversible encryption method</summary>
        /// <param name="value">The string to encrypt</param>
        /// <returns>An encrypted string that has been URL encoded for durable transport and storage</returns>
        public static string ProtectString(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }

            byte[] stream = System.Text.Encoding.UTF8.GetBytes(value);
            byte[] encodedValue = MachineKey.Protect(stream);
            return HttpServerUtility.UrlTokenEncode(encodedValue);
        }

        /// <summary>Uses machine key encryption to encrypt data using a reversible encryption method, with an optional parameter to force the encryption to work within a defined scope</summary>
        /// <param name="value">The string to encrypt</param>
        /// <param name="purposes">The purpose contexts of the encryption that limits the scope that the data can be decrypted in.</param>
        /// <returns>An encrypted string that has been URL encoded for durable transport and storage</returns>
        public static string ProtectString(string value, string[] purposes)
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }

            byte[] stream = System.Text.Encoding.UTF8.GetBytes(value);
            byte[] encodedValue = MachineKey.Protect(stream, purposes);
            return HttpServerUtility.UrlTokenEncode(encodedValue);
        }

        /// <summary>Uses machine key encryption to encrypt data using a reversible encryption method, with an optional parameter to force the encryption to work within a defined scope, and allows for the encryption to be limited to a single calendar day</summary>
        /// <param name="value">The string to encrypt</param>
        /// <param name="purposes">The purpose contexts of the encryption that limits the scope that the data can be decrypted in.</param>
        /// <param name="dayScoped">If set to <c>true</c> a purpose will be added with the short date string of the current day, limiting the encrypted data's use to the day it was encrypted.</param>
        /// <returns>An encrypted string that has been URL encoded for durable transport and storage</returns>
        public static string ProtectString(string value, string[] purposes, bool dayScoped)
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }

            if (dayScoped)
            {
                string[] scopedPurpose = null;

                if (purposes == null)
                {
                    scopedPurpose = new[] { DateTime.Now.ToShortDateString() };
                }
                else
                {
                    scopedPurpose = purposes.Concat(new[] { DateTime.Now.ToShortDateString() }).ToArray();
                }

                byte[] stream = System.Text.Encoding.UTF8.GetBytes(value);
                byte[] encodedValue = MachineKey.Protect(stream, scopedPurpose);
                return HttpServerUtility.UrlTokenEncode(encodedValue);
            }
            else
            {
                byte[] stream = System.Text.Encoding.UTF8.GetBytes(value);
                byte[] encodedValue = MachineKey.Protect(stream, purposes);
                return HttpServerUtility.UrlTokenEncode(encodedValue);
            }
        }

        /// <summary>Decrypts data that was encrypted using machine key encryption</summary>
        /// <param name="value">The string to decrypt in URL encoded format</param>
        /// <returns>A decrypted string in UTF8 format</returns>
        public static string UnprotectString(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }

            byte[] stream = HttpServerUtility.UrlTokenDecode(value);
            byte[] decodedValue = MachineKey.Unprotect(stream);
            return System.Text.Encoding.UTF8.GetString(decodedValue);
        }

        /// <summary>Decrypts data that was encrypted using machine key encryption</summary>
        /// <param name="value">The string to decrypt in URL encoded format</param>
        /// <param name="purposes">The purpose contexts of the encryption that matches the context that was given during encryption.</param>
        /// <returns>A decrypted string in UTF8 format</returns>
        public static string UnprotectString(string value, string[] purposes)
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }

            byte[] stream = HttpServerUtility.UrlTokenDecode(value);
            byte[] decodedValue = MachineKey.Unprotect(stream, purposes);
            return System.Text.Encoding.UTF8.GetString(decodedValue);
        }

        /// <summary>Decrypts data that was encrypted using machine key encryption</summary>
        /// <param name="value">The string to decrypt in URL encoded format</param>
        /// <param name="purposes">The purpose contexts of the encryption that matches the context that was given during encryption.</param>
        /// <param name="dayScoped">If set to <c>true</c> a purpose will be added with the short date string of the current day, allowing for decryption of data that has been limited to a single calendar day.</param>
        /// <returns>A decrypted string in UTF8 format</returns>
        public static string UnprotectString(string value, string[] purposes, bool dayScoped)
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }

            if (dayScoped)
            {
                string[] scopedPurpose = null;

                if (purposes == null)
                {
                    scopedPurpose = new[] { DateTime.Now.ToShortDateString() };
                }
                else
                {
                    scopedPurpose = purposes.Concat(new[] { DateTime.Now.ToShortDateString() }).ToArray();
                }

                byte[] stream = HttpServerUtility.UrlTokenDecode(value);
                byte[] decodedValue = MachineKey.Unprotect(stream, scopedPurpose);
                return System.Text.Encoding.UTF8.GetString(decodedValue);
            }
            else
            {
                byte[] stream = HttpServerUtility.UrlTokenDecode(value);
                byte[] decodedValue = MachineKey.Unprotect(stream, purposes);
                return System.Text.Encoding.UTF8.GetString(decodedValue);
            }
        }

        /// <summary>Hashes the input string via a one way hashing function.</summary>
        /// <param name="value">The value to hash.</param>
        /// <returns>A hashed version of the input string in a Base 64 string.</returns>
        public static string HashString(string value)
        {
            // Create the salt value with a cryptographic PRNG
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[64]);

            // Create the Rfc2898DeriveBytes and get the hash value:
            var pbkdf2 = new Rfc2898DeriveBytes(value, salt, 10000);
            byte[] hash = pbkdf2.GetBytes(128);

            // Combine the salt and password bytes for later use:
            byte[] hashBytes = new byte[196];
            Array.Copy(salt, 0, hashBytes, 0, 64);
            Array.Copy(hash, 0, hashBytes, 64, 128);

            // Turn the combined salt+hash into a string
            return Convert.ToBase64String(hashBytes);
        }

        /// <summary>Verifies that the passed string value matches the passed hash.</summary>
        /// <param name="value">The string to compare to the hash.</param>
        /// <param name="hash">A base 64 encoded string of the hash to compare against the value.</param>
        /// <returns>Returns true or false depending on whether the value and hash are a match</returns>
        public static bool VerifyHash(string value, string hash)
        {
            // Decode the base 64 string into a byte array
            byte[] hashBytes = Convert.FromBase64String(hash);

            // Retrieve the salt from the password
            byte[] salt = new byte[64];
            Array.Copy(hashBytes, 0, salt, 0, 64);

            // Compute the hash of the passed value
            var pbkdf2 = new Rfc2898DeriveBytes(value, salt, 10000);
            byte[] valueHash = pbkdf2.GetBytes(128);

            // Compare the passed hash with the hash of the passed value
            for (int i = 0; i < 128; i++)
            {
                if (hashBytes[i + 64] != valueHash[i])
                {
                    return false;
                }
            }

            return true;
        }

        /// <summary>Generates a unique key.</summary>
        /// <param name="maxSize">The maximum size.</param>
        /// <returns>A unique key</returns>
        public static string GetUniqueKey(int maxSize)
        {
            char[] chars = new char[62];
            chars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();
            byte[] data = new byte[1];
            using (RNGCryptoServiceProvider crypto = new RNGCryptoServiceProvider())
            {
                crypto.GetNonZeroBytes(data);
                data = new byte[maxSize];
                crypto.GetNonZeroBytes(data);
            }

            string result = string.Empty;
            foreach (byte b in data)
            {
                result += chars[b % chars.Length];
            }

            return result.ToString();
        }
    }
}