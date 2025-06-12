"use client";

import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Examples from "./Examples";
import UGCGenerator from "./UGCGenerator";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import CTA from "./CTA";
import Footer from "./Footer";

export default function LandingV2() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <UGCGenerator />
      <Examples />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
