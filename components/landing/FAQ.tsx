"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FAQ() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("landing.faq.questions.whatKindOfImages.question"),
      answer: t("landing.faq.questions.whatKindOfImages.answer"),
    },
    {
      question: t("landing.faq.questions.howDoesImageEnhancement.question"),
      answer: t("landing.faq.questions.howDoesImageEnhancement.answer"),
    },
    {
      question: t("landing.faq.questions.whatIsTextGuidedEditing.question"),
      answer: t("landing.faq.questions.whatIsTextGuidedEditing.answer"),
    },
    {
      question: t("landing.faq.questions.howAccurateIsImageCreation.question"),
      answer: t("landing.faq.questions.howAccurateIsImageCreation.answer"),
    },
    {
      question: t("landing.faq.questions.canIUseCommercially.question"),
      answer: t("landing.faq.questions.canIUseCommercially.answer"),
    },
    {
      question: t("landing.faq.questions.doINeedPowerfulComputer.question"),
      answer: t("landing.faq.questions.doINeedPowerfulComputer.answer"),
    },
    {
      question: t("landing.faq.questions.canICancelSubscription.question"),
      answer: t("landing.faq.questions.canICancelSubscription.answer"),
    },
    {
      question: t("landing.faq.questions.doYouOfferRefunds.question"),
      answer: t("landing.faq.questions.doYouOfferRefunds.answer"),
    },
  ];

  return (
    <section
      id="faq"
      className="py-24 relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-blue-300/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-r from-violet-300/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              {t("landing.faq.badge")}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("landing.faq.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {t("landing.faq.description")}
          </p>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-200/50 dark:border-gray-700/50">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="group bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-6 py-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg"
              >
                <AccordionTrigger className="text-left font-semibold text-lg py-6 text-gray-900 dark:text-white hover:no-underline group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center mr-4 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <span className="flex-1">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 text-base pb-6 pt-0 ml-12 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
