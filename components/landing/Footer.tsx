"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Mail, Shield, Star, ExternalLink } from "lucide-react";
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
        { label: t("landing.footer.faq"), href: "#faq" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo and description */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl blur opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-white rounded-2xl shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                {t("landing.navbar.logo")}
              </span>
            </Link>

            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              {t("landing.footer.description")}
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-emerald-400">
                <Star className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {t("landing.footer.boostSales")}
                </span>
              </div>
              <div className="flex items-center text-blue-400">
                <Shield className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {t("landing.footer.commercialLicense")}
                </span>
              </div>
            </div>
          </div>

          {/* Footer links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-6">
              <h4 className="text-lg font-bold text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="group flex items-center text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <div className="text-gray-400">
            © {currentYear} {t("landing.navbar.logo")}.{" "}
            {t("landing.footer.copyright")}
          </div>

          <div className="flex items-center space-x-8">
            <a
              href="mailto:contact@newpix.ai"
              className="group flex items-center text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            >
              <Mail className="w-4 h-4 mr-2" />
              <span>{t("landing.footer.contactEmail")}</span>
            </a>
            <a
              href="/terms"
              className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            >
              {t("landing.footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
