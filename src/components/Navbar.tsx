import React, { useState } from 'react';
import { Database, Menu, X, History, User, Home, LogOut, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Query History', href: '/history', icon: History },
    // "Login" will only show if not logged in, see JSX below
  ];
  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // Avatar letter: use first letter of email, uppercase
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Database className="h-8 w-8 text-neon-violet group-hover:text-soft-blue transition-colors duration-300" />
              <div className="absolute inset-0 bg-neon-violet/20 rounded-full blur-xl group-hover:bg-soft-blue/20 transition-colors duration-300"></div>
            </div>
            <span className="text-xl font-bold font-poppins glow-text">
              QueryGenie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover-glass group ${
                    isActive(item.href)
                      ? 'glass-effect text-neon-violet'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4 group-hover:text-neon-violet transition-colors duration-300" />
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Login/Avatar */}
              {!user ? (
                <Link
                  to="/auth"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover-glass group ${
                    isActive("/auth") ? 'glass-effect text-neon-violet' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <User className="h-4 w-4 group-hover:text-neon-violet transition-colors duration-300" />
                  <span>Login</span>
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative p-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                      <Avatar>
                        <AvatarFallback className="bg-neon-violet text-white">{userInitial}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-effect min-w-[180px]">
                    <DropdownMenuLabel className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-neon-violet" />
                      <span className="truncate max-w-[110px] text-xs">{user.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer flex items-center space-x-2 text-red-500"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="glass-effect p-2 rounded-lg hover-glass transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-neon-violet" />
              ) : (
                <Menu className="h-6 w-6 text-neon-violet" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-effect mx-4 mt-2 rounded-lg border border-white/10 animate-slide-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover-glass ${
                  isActive(item.href)
                    ? 'crystal-effect text-neon-violet'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            {/* Login/Avatar for mobile */}
            {!user ? (
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover-glass ${
                  isActive("/auth")
                    ? 'crystal-effect text-neon-violet'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-3 px-3 py-2">
                <Avatar>
                  <AvatarFallback className="bg-neon-violet text-white">{userInitial}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neon-violet truncate">{user.email}</span>
                  <Button
                    variant="ghost"
                    className="p-0 h-5 text-red-500 text-xs justify-start"
                    onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }}
                  >
                    <LogOut className="w-4 h-4 mr-1" />Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
