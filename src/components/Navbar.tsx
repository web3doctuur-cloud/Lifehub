"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/dashboard/todo", label: "Todo" },
    { href: "/dashboard/calculator", label: "Calculator" },
    { href: "/dashboard/storybooks", label: "Stories" },
    { href: "/dashboard/notes", label: "Notes" },
    { href: "/dashboard/diary", label: "Diary" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-rich-black/95 backdrop-blur-xl border-b border-caribbean-green/20 shadow-lg" 
          : "bg-transparent"
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-caribbean-green to-mint rounded-xl flex items-center justify-center shadow-lg shadow-caribbean-green/20">
                <span className="text-rich-black font-bold text-lg sm:text-xl">L</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-anti-flash-white">
                Life<span className="text-caribbean-green">Hub</span>
              </span>
            </Link>

            {/* Desktop Navigation - Clean text links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {session && navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-200 py-1 ${
                    isActive(link.href)
                      ? "text-caribbean-green"
                      : "text-anti-flash-white/70 hover:text-anti-flash-white"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-caribbean-green rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {session ? (
                <div className="flex items-center gap-4">
                  {/* User Profile */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-caribbean-green to-mint rounded-full flex items-center justify-center text-rich-black font-semibold shadow-md">
                      {session.user?.name?.[0] || session.user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-anti-flash-white/80 text-sm font-medium hidden xl:block">
                      {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}
                    </span>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-px h-6 bg-caribbean-green/20"></div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-anti-flash-white/60 hover:text-caribbean-green transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-anti-flash-white/80 hover:text-caribbean-green transition-colors duration-200 px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium bg-caribbean-green text-rich-black px-5 py-2.5 rounded-full hover:bg-mint transition-all duration-300 shadow-md shadow-caribbean-green/20 whitespace-nowrap"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile/Tablet Menu Button - Hamburger Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-10 h-10 rounded-lg flex items-center justify-center text-anti-flash-white hover:text-caribbean-green transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-45 top-2' : 'top-0'
                }`} />
                <span className={`absolute h-0.5 w-6 bg-current top-2 transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`} />
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? '-rotate-45 top-2' : 'top-4'
                }`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile & Tablet Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-rich-black/98 backdrop-blur-md" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          <div className="fixed top-16 sm:top-20 left-0 right-0 bottom-0 bg-dark-green/95 backdrop-blur-xl overflow-y-auto animate-slideDown">
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Navigation Links */}
              {session && (
                <div className="space-y-1 mb-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                        isActive(link.href)
                          ? "bg-caribbean-green/10 text-caribbean-green border-l-4 border-caribbean-green"
                          : "text-anti-flash-white/80 hover:text-anti-flash-white hover:bg-caribbean-green/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-caribbean-green/20 pt-6">
                {session ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-4 py-2">
                      <div className="w-14 h-14 bg-gradient-to-br from-caribbean-green to-mint rounded-full flex items-center justify-center text-rich-black font-semibold text-xl">
                        {session.user?.name?.[0] || session.user?.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-anti-flash-white font-medium text-lg">{session.user?.name || "User"}</p>
                        <p className="text-anti-flash-white/50 text-sm">{session.user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full px-4 py-4 rounded-lg text-left text-anti-flash-white/80 hover:text-caribbean-green hover:bg-caribbean-green/5 transition-all duration-200 text-lg font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block w-full text-center px-4 py-4 rounded-lg text-anti-flash-white/80 hover:text-anti-flash-white hover:bg-caribbean-green/5 transition-all duration-200 text-lg font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full text-center px-4 py-4 rounded-lg bg-caribbean-green text-rich-black font-medium hover:bg-mint transition-all duration-200 text-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16 sm:h-20" />

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}