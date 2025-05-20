"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t("landing.footer.product"),
      links: [
        { label: t("landing.footer.features"), href: "#features" },
        { label: t("landing.footer.pricing"), href: "#pricing" },
        { label: t("landing.footer.examples"), href: "#examples" },
        // { label: t("landing.footer.testimonials"), href: "#testimonials" },
        { label: t("landing.footer.faq"), href: "#faq" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12 ">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-indigo-600 rounded-full blur opacity-40"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-white dark:bg-gray-900 rounded-full border border-indigo-200 dark:border-indigo-800">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Newpix
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
              Transform your images with AI-powered enhancement, restoration,
              and creative editing tools.
            </p>
          </div>

          {/* Footer links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-800 mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Newpix. All rights reserved.
          </div>

          <div className="flex items-center space-x-2 text-sm"></div>

          <div className="flex space-x-6 text-sm">
            <a
              href="mailto:contact@newpix.ai"
              className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              contact@newpix.ai
            </a>
            <a
              href="/terms"
              className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
