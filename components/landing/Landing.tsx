"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  LineChart,
  ArrowUpRight,
  BrainCircuit,
  Zap,
  BarChart4,
  Target,
  Clock,
  TrendingUp,
  DollarSign,
  Users2,
  Wand2,
  Rocket,
  Heart,
  GitBranch,
  Webhook,
  Database,
} from "lucide-react";
import Pricing from "./Pricing";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/20 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 md:p-6">
        <Link href="/" className="group">
          <div className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300 ease-out">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
              Newpix
            </div>
          </div>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-105"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-105"
          >
            Pricing
          </a>
          <a
            href="#benefits"
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-105"
          >
            Benefits
          </a>
          <div className="flex space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="hover:scale-105 transition-transform duration-300 group"
              >
                Sign In
                <Wand2 className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300 group">
                Try It Free
                <Rocket className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 via-indigo-50/50 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] animate-pulse" />
      <div className="absolute w-full h-full bg-gradient-to-r from-violet-500/10 via-transparent to-indigo-500/10 animate-gradient-x" />
      <div className="absolute -inset-x-40 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 mb-8 animate-bounce">
              <Heart className="w-4 h-4 text-violet-600 dark:text-violet-400 mr-2" />
              <span className="text-sm font-medium text-violet-800 dark:text-violet-200">
                Your AI CFO & Product Manager Copilot
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text animate-gradient mb-4">
              Boost Your Revenue with AI-Powered Insights
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Make Data-Driven Revenue Decisions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Get AI-powered insights that feel like having a CFO and Product
              Manager by your side. Connect your Stripe, GitHub, Linear, and
              analytics data to uncover hidden patterns and make confident
              business decisions.
            </p>

            {/* Benefits bullets */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  icon: <LineChart className="w-4 h-4" />,
                  text: "Real-time revenue tracking",
                },
                {
                  icon: <BrainCircuit className="w-4 h-4" />,
                  text: "AI-powered business analysis",
                },
                {
                  icon: <GitBranch className="w-4 h-4" />,
                  text: "Code-to-revenue impact insights",
                },
                {
                  icon: <Target className="w-4 h-4" />,
                  text: "Auto-create Linear tickets",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    {item.icon}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <Link href="#pricing">
                <Button
                  size="lg"
                  className="text-lg px-8 gradient-button w-full sm:w-auto"
                >
                  Start Free Trial
                  <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 w-full sm:w-auto"
                >
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <div className="flex -space-x-2">
                <img
                  src="/testimonials/alejandro.jpeg"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                />
                {/* Add more user images if available */}
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border-2 border-white dark:border-gray-800">
                  <Users2 className="w-4 h-4" />
                </div>
              </div>
              <span className="text-sm">
                Trusted by growing businesses worldwide
              </span>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 hover:shadow-indigo-500/25">
              <img
                src="/landing.png"
                alt="Analytics Dashboard"
                className="rounded-xl"
              />
              <div className="absolute -bottom-12 -left-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl hover:shadow-indigo-500/25 transition-shadow transform hover:scale-105 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      Connect your data
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl hover:shadow-indigo-500/25 transition-shadow transform hover:scale-105 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <div className="flex items-center space-x-3">
                    <LineChart className="w-4 h-4 text-indigo-500" />
                    <p className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      Get insights like a CFO would provide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Integration",
      description:
        "Connect Stripe, GitHub, Linear, and Plausible analytics to centralize your business data",
      highlight: "Unified data view",
    },
    {
      icon: <BrainCircuit className="w-8 h-8" />,
      title: "AI Analysis",
      description:
        "Get intelligent insights about revenue patterns and business performance, like having a CFO on your team",
      highlight: "Smart predictions",
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "Code Impact",
      description:
        "See how code changes and deployments affect your revenue like a Product Manager would",
      highlight: "Development insights",
    },
    {
      icon: <BarChart4 className="w-8 h-8" />,
      title: "Revenue Analytics",
      description: "Track and analyze revenue metrics with detailed breakdowns",
      highlight: "Clear visibility",
    },
    {
      icon: <Webhook className="w-8 h-8" />,
      title: "Custom Integrations",
      description:
        "Connect your existing tools and data sources including Linear.app",
      highlight: "Flexible platform",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Action Items",
      description:
        "Get AI-recommended actions and auto-create Linear tickets, just like a strategic advisor",
      highlight: "Guided optimization",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-6">
            Your AI Revenue Intelligence Partner
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect your data sources and let our AI be your CFO and Product
            Manager copilot
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-105 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <CardContent className="p-8">
                <div className="mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                  <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    {feature.highlight}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Alejandro Estrada",
      role: "Founder",
      company: "Aicotravel.com",
      image: "/testimonials/alejandro.jpeg",
      quote:
        "Revenowl helped us identify that running multiples experiments without a plan was hurting our revenue.",
    },
    // // Add placeholder testimonials to make the section more substantial
    // {
    //   name: "Your Name Here",
    //   role: "Your Role",
    //   company: "Your Company",
    //   image: "/placeholder-avatar.png",
    //   quote:
    //     "Share your experience with Revenowl and how it helped your business make better decisions.",
    // },
    // {
    //   name: "Future Customer",
    //   role: "Decision Maker",
    //   company: "Growing Business",
    //   image: "/placeholder-avatar.png",
    //   quote:
    //     "This could be your testimonial! Try Revenowl today and see the difference in your revenue insights.",
    // },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-6">
            Trusted by Growing Businesses
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how companies use Revenowl as their AI revenue advisor
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-105 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-2 border-indigo-500 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <blockquote className="mb-6 text-gray-600 dark:text-gray-300 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const benefits = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Insights",
      description:
        "Get AI-powered analysis of your revenue patterns within minutes, like having a CFO on speed dial",
      stat: "5min setup time",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Focus",
      description:
        "Identify key factors affecting your revenue and growth with expert-level analysis",
      stat: "2x faster decisions",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Revenue Impact",
      description:
        "Understand how code changes and features affect your bottom line with PM-level insights",
      stat: "Clear ROI tracking",
    },
    {
      icon: <Users2 className="w-8 h-8" />,
      title: "Team Alignment",
      description:
        "Keep everyone focused on metrics that matter with automatic Linear ticket creation",
      stat: "100% transparency",
    },
  ];

  return (
    <section
      id="benefits"
      className="py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-6">
            Why Choose Revenowl
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your AI copilot for revenue and product decisions
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-105 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 h-full"
            >
              <CardContent className="p-8 flex flex-col h-full">
                <div className="mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  {benefit.description}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 self-start">
                  <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    {benefit.stat}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold gradient-text mb-4">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              Revenowl
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Your AI copilot for revenue and product decisions.
            </p>
          </div>
          <div />
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Benefits
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@revenowl.com"
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/estrada9166"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-600 dark:text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} Revenowl. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen font-sans antialiased">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Benefits />
      <Footer />
    </div>
  );
}
