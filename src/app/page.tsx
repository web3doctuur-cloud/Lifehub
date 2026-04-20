"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function LandingPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  // Feature listings data
  const featuredListings = [
    {
      id: 1,
      title: "Smart Task Manager",
      description: "Organize your day with our intuitive todo list. Track progress and never miss a deadline.",
      image: "/assets/Images/task.jpg",
      link: "/dashboard/todo"
    },
    {
      id: 2,
      title: "Quick Calculator",
      description: "Built-in scientific calculator for all your mathematical needs. Simple yet powerful.",
      image: "/assets/Images/calculator.jpg",
      link: "/dashboard/calculator"
    },
    {
      id: 3,
      title: "Digital Library",
      description: "Explore thousands of books and stories. Download for offline reading anytime.",
      image: "/assets/Images/book.jpg",
      link: "/dashboard/storybooks"
    }
  ];

  return (
    <div className="min-h-screen bg-rich-black">
      {/* Hero Section with Search */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-green via-rich-black to-bangladesh-green"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-caribbean-green/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-mountain-meadow/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mint/5 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-caribbean-green/10 border border-caribbean-green/30 rounded-full mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-caribbean-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-caribbean-green"></span>
              </span>
              <span className="text-caribbean-green text-sm font-medium">Your Digital Productivity Hub</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-anti-flash-white mb-6 leading-tight">
              Find Your{' '}
              <span className="text-caribbean-green">Productivity</span>
              <br />
              <span className="text-anti-flash-white">Flow</span>
            </h1>
            
            <p className="text-xl text-anti-flash-white/70 mb-10 max-w-2xl mx-auto">
              Search for tools to organize your life. Find the perfect digital workspace to boost your productivity and creativity.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for task management, notes, calculator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-dark-green/80 backdrop-blur-sm border border-caribbean-green/30 rounded-2xl text-anti-flash-white placeholder-stone focus:outline-none focus:border-caribbean-green focus:ring-2 focus:ring-caribbean-green/30 transition-all text-lg shadow-2xl"
                />
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard/todo"
                className="px-6 py-3 bg-caribbean-green/10 border border-caribbean-green/30 rounded-xl text-caribbean-green hover:bg-caribbean-green hover:text-rich-black transition-all duration-300 backdrop-blur-sm"
              >
                📋 Task Manager
              </Link>
              <Link
                href="/dashboard/calculator"
                className="px-6 py-3 bg-mint/10 border border-mint/30 rounded-xl text-mint hover:bg-mint hover:text-rich-black transition-all duration-300 backdrop-blur-sm"
              >
                🧮 Calculator
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-anti-flash-white/50 text-sm">Scroll to explore</span>
            <div className="w-5 h-10 rounded-full border-2 border-caribbean-green/30 flex justify-center">
              <div className="w-1 h-2 bg-caribbean-green rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-20 bg-dark-green/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-anti-flash-white">
                Featured <span className="text-caribbean-green">Tools</span>
              </h2>
              <Link
                href="/login"
                className="text-caribbean-green hover:text-mint transition-colors flex items-center gap-2"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={listing.link}
                  className="group bg-dark-green/50 backdrop-blur-sm rounded-2xl border border-caribbean-green/20 overflow-hidden hover:border-caribbean-green/50 transition-all duration-300 hover:transform hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rich-black to-transparent opacity-60"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-anti-flash-white mb-2 group-hover:text-caribbean-green transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-anti-flash-white/60 text-sm leading-relaxed">
                      {listing.description}
                    </p>
                    <div className="mt-4 flex items-center text-caribbean-green text-sm font-medium">
                      Explore Tool
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-rich-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-anti-flash-white text-center mb-4">
              Everything You Need in{' '}
              <span className="text-caribbean-green">One Place</span>
            </h2>
            <p className="text-anti-flash-white/60 text-center mb-12 max-w-2xl mx-auto">
              While you're organizing your life, we've got you covered. 
              We offer a wide range of tools to make your life easier.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "✅", label: "Task Management" },
                { icon: "📝", label: "Note Taking" },
                { icon: "📔", label: "Digital Diary" },
                { icon: "📚", label: "Book Library" },
                { icon: "🧮", label: "Calculator" },
                { icon: "🔒", label: "Secure Storage" },
                { icon: "⚡", label: "Fast & Responsive" }
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-dark-green/40 backdrop-blur-sm rounded-xl p-6 border border-caribbean-green/20 text-center hover:border-caribbean-green/40 transition-all duration-300"
                >
                  <span className="text-3xl mb-3 block">{service.icon}</span>
                  <span className="text-anti-flash-white/80 text-sm font-medium">{service.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Developer Section */}
      <section className="py-20 bg-gradient-to-b from-dark-green/50 to-rich-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark-green/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-caribbean-green/20">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-caribbean-green to-mint p-1">
                    <div className="w-full h-full rounded-2xl bg-rich-black flex items-center justify-center text-5xl">
                      👩‍💻
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-caribbean-green rounded-full border-4 border-rich-black"></div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-anti-flash-white mb-2">
                    Meet the Developer
                  </h2>
                  <p className="text-xl text-caribbean-green mb-4">Yusuf Rodiah Hadizah</p>
                  <p className="text-anti-flash-white/70 leading-relaxed">
                    With over 4 years of experience as a Frontend Developer, I created LifeHub to solve a common problem - 
                    the chaos of juggling multiple productivity tools. LifeHub combines task management, journaling, 
                    and literary exploration in one beautiful, user-friendly platform.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-6">
                    {[
                      { value: '4+', label: 'Years Experience' },
                      { value: '10+', label: 'Projects' },
                      { value: '100%', label: 'User Focused' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-caribbean-green/10 rounded-xl px-4 py-2 border border-caribbean-green/20">
                        <span className="text-caribbean-green font-bold">{stat.value}</span>
                        <span className="text-anti-flash-white/60 text-sm ml-2">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-caribbean-green/10 to-mint/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-caribbean-green/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-mint/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-anti-flash-white mb-4">
              Ready to Transform Your{' '}
              <span className="text-caribbean-green">Digital Life</span>?
            </h2>
            <p className="text-xl text-anti-flash-white/70 mb-8">
              Join thousands of users who have simplified their daily workflow with LifeHub.
            </p>
            
            {!session ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-caribbean-green text-rich-black rounded-xl font-semibold text-lg hover:bg-mint transition-all duration-300 transform hover:scale-105 shadow-lg shadow-caribbean-green/30"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-transparent border-2 border-caribbean-green text-caribbean-green rounded-xl font-semibold text-lg hover:bg-caribbean-green hover:text-rich-black transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <Link
                href="/todo"
                className="inline-block px-8 py-4 bg-caribbean-green text-rich-black rounded-xl font-semibold text-lg hover:bg-mint transition-all duration-300 transform hover:scale-105 shadow-lg shadow-caribbean-green/30"
              >
                Get Started
              </Link>
            )}
            
            <p className="text-anti-flash-white/50 text-sm mt-6">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(0, 223, 129, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 223, 129, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}