'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Aryabhatta College
        </Link>
        <ul className="flex space-x-4 items-center">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><Link href="/about" className="hover:underline">About</Link></li>
          <li><Link href="/courses" className="hover:underline">Courses</Link></li>
          <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          <li><Link href="/enrollment" className="hover:underline">Enroll Now</Link></li>
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/profile" className="hover:underline flex items-center">
                  <User className="mr-1" size={18} />
                  Profile
                </Link>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="hover:bg-blue-700 text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-1" size={18} />
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <>
              <li><Link href="/login" className="hover:underline">Login</Link></li>
              <li><Link href="/register" className="hover:underline">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;