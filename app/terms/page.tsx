"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Mail, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const formattedDate = `${currentYear}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 group"
              aria-label="Go to homepage"
            >
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-indigo-600 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative flex items-center justify-center w-full h-full bg-white dark:bg-gray-900 rounded-full border border-indigo-200 dark:border-indigo-800">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Newpix
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Last updated: <time dateTime={formattedDate}>{formattedDate}</time>
          </p>

          <section className="prose dark:prose-invert max-w-none">
            <h2>1. Disclaimer of Responsibility</h2>
            <p>
              Newpix (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
              is not liable for any damages, losses, or consequences resulting
              from the use of our services. You acknowledge and accept that you
              use the platform at your own risk.
            </p>

            <h2>2. User Content</h2>
            <p>
              Users are solely responsible for any content they upload, create,
              or modify using our services. Ownership and accountability for
              such content rest entirely with the user. You retain all rights to
              your content, and we do not claim ownership of any materials you
              submit through our service.
            </p>

            <h2>3. Service Availability</h2>
            <p>
              While we strive for reliable uptime, we do not guarantee
              uninterrupted access. Downtime may occur for maintenance or due to
              unforeseen technical issues. We will make reasonable efforts to
              notify users of scheduled maintenance but reserve the right to
              perform emergency maintenance when necessary.
            </p>

            <h2>4. AI-Generated Content</h2>
            <p>
              AI-generated content may not always be accurate or appropriate.
              Since our models operate based on training data, results may
              occasionally be unexpected. Users should review all AI-generated
              content before using it for any purpose. We are continuously
              improving our models but cannot guarantee specific outcomes or
              results.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>
              Newpix may link or integrate with third-party platforms. We do not
              take responsibility for their content, data practices, or
              policies. When you access third-party services through our
              platform, you are subject to their terms and privacy policies. We
              recommend reviewing these policies before engaging with
              third-party services.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              Users must ensure they hold the necessary rights for all content
              used on our platform. We are not liable for any infringement of
              intellectual property. By using our service, you represent and
              warrant that you have all required permissions and licenses for
              any content you upload or create. We respect intellectual property
              rights and expect our users to do the same.
            </p>

            <h2>7. Changes to Terms</h2>
            <p>
              These terms may change at any time. Your continued use of our
              services implies acceptance of any updates. We will make
              reasonable efforts to notify users of significant changes to these
              terms, but it remains your responsibility to periodically review
              these terms for any modifications.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Newpix shall not be held
              liable for indirect, incidental, or consequential damages,
              including loss of profits or data. Our maximum liability arising
              out of or related to your use of our services shall not exceed the
              amount you paid to us in the three months preceding the claim.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These terms are governed by the laws of the jurisdiction where our
              company is registered, without regard to conflict of law
              principles. Any disputes arising from these terms or your use of
              our services shall be resolved exclusively in the courts of that
              jurisdiction.
            </p>

            <h2>10. Refund Policy</h2>
            <p>
              We do not offer refunds as our service utilizes AI models and
              computing resources that are consumed immediately upon use. Once
              you have accessed our AI tools, these resources have been
              allocated and cannot be returned. We encourage users to try our
              free plan first to ensure our service meets their needs before
              subscribing.
            </p>

            <h2>11. Data Privacy</h2>
            <p>
              We take data privacy seriously and handle your information in
              accordance with our Privacy Policy. By using our services, you
              consent to our collection and processing of your data as described
              in that policy. For more information about how we protect your
              data, please review our complete Privacy Policy.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              Questions? Contact us at{" "}
              <a
                href="mailto:contact@newpix.ai"
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center"
              >
                <Mail className="w-4 h-4 mr-1" />
                contact@newpix.ai
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
