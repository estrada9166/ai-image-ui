"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

type Testimonial = {
  name: string;
  role: string;
  content: string;
  image?: string;
  rating?: number;
};

export default function Testimonials() {
  const { t } = useTranslation();

  // Get testimonials and handle type conversion
  const testimonials = t("landing.testimonials.testimonials", {
    returnObjects: true,
  }) as Testimonial[];

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
            {t("landing.testimonials.badge")}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("landing.testimonials.title")}
          </h3>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {t("landing.testimonials.description")}
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(testimonials) &&
            testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow relative"
              >
                <div className="absolute top-4 right-4 text-indigo-100 dark:text-indigo-900/30">
                  <Quote className="w-8 h-8" />
                </div>

                <div className="mb-6">
                  {/* Star rating */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < (testimonial.rating || 5)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial content */}
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>

                {/* User info */}
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={
                        testimonial.image ||
                        `https://randomuser.me/api/portraits/${
                          index % 2 === 0 ? "men" : "women"
                        }/${30 + index}.jpg`
                      }
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
