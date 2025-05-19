"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    <section id="faq" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
            {t("landing.faq.badge")}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("landing.faq.title")}
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("landing.faq.description")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-4 dark:border-gray-700"
              >
                <AccordionTrigger className="text-left font-medium text-lg py-4 text-gray-900 dark:text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 text-base pb-4 pt-0">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {t("landing.faq.stillHaveQuestions")}{" "}
            <a
              href="/contact"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              {t("landing.faq.contactSupport")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
