"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../layout/LanguageSelector";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-indigo-600 rounded-full blur opacity-40"></div>
              <div className="relative flex items-center justify-center w-full h-full bg-white dark:bg-gray-900 rounded-full border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {t("landing.navbar.logo")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <div className="flex items-center space-x-4">
              <LanguageSelector className="mb-0" displayOnlyFlag />
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {t("landing.navbar.signIn")}
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white">
                  {t("landing.navbar.getStarted")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg p-4">
          <div className="flex flex-col space-y-4 pt-2 pb-4">
            <MobileNavLinks closeMenu={() => setIsMobileMenuOpen(false)} />
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="px-4 py-2">
                <LanguageSelector className="w-full mb-0" displayOnlyFlag />
              </div>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-center">
                  {t("landing.navbar.signIn")}
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full justify-center bg-gradient-to-r from-indigo-600 to-violet-600">
                  {t("landing.navbar.getStarted")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLinks() {
  const { t } = useTranslation();
  return (
    <>
      <a
        href="#features"
        className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        {t("landing.navbar.features")}
      </a>
      <a
        href="#ugc-generator"
        className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        {t("landing.navbar.ugcCreator")}
      </a>
      <a
        href="#examples"
        className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        {t("landing.navbar.examples")}
      </a>
      <a
        href="#pricing"
        className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        {t("landing.navbar.pricing")}
      </a>
      <a
        href="#faq"
        className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        {t("landing.navbar.faq")}
      </a>
    </>
  );
}

function MobileNavLinks({ closeMenu }: { closeMenu: () => void }) {
  const { t } = useTranslation();
  return (
    <>
      <a
        href="#features"
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        onClick={closeMenu}
      >
        {t("landing.navbar.features")}
      </a>
      <a
        href="#ugc-generator"
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        onClick={closeMenu}
      >
        {t("landing.navbar.ugcCreator")}
      </a>
      <a
        href="#examples"
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        onClick={closeMenu}
      >
        {t("landing.navbar.examples")}
      </a>
      <a
        href="#pricing"
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        onClick={closeMenu}
      >
        {t("landing.navbar.pricing")}
      </a>
      <a
        href="#faq"
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        onClick={closeMenu}
      >
        {t("landing.navbar.faq")}
      </a>
    </>
  );
}
