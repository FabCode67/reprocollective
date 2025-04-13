'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialAuthCheck, setInitialAuthCheck] = useState(false);
  const router = useRouter();

  // Check if user is already logged in - only once on initial mount
  useEffect(() => {
    // const checkAuth = () => {
    //   try {
    //     const userStr = localStorage.getItem('reprouser');
    //     if (userStr) {
    //       const user = JSON.parse(userStr);
    //       if (user.email && user.isAdmin) {
    //         // Valid user exists, redirect to admin
    //         router.replace('/admin');
    //         return true;
    //       }
    //     }
    //   } catch (error) {
    //     // If there's an error, clear the storage
    //     console.log('Error parsing user data:', error);
        
    //     localStorage.removeItem('reprouser');
    //   }
    //   return false;
    // };
    
    if (!initialAuthCheck) {
      setInitialAuthCheck(true);
    }
  }, [router, initialAuthCheck]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
      // Check for admin credentials
      if (email === 'reproadmin@gmail.com' && password === 'Repro@123') {
        try {
          // Store user info in local storage
          const user = {
            email,
            isAdmin: true,
            loginTime: new Date().toISOString()
          };
          localStorage.setItem('reprouser', JSON.stringify(user));
          
          // Redirect to admin portal using replace to avoid history issues
          router.replace('/admin');
        } catch (error) {
          console.log('Error saving user data:', error);
          
          setError('Failed to save login information. Please try again.');
        }
      } else {
        // Show error message
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Don't render login form until initial auth check is complete
  if (!initialAuthCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 relative">
              {/* Logo placeholder */}
              <div className="absolute inset-0 flex items-center justify-center bg-orange-100 rounded-full">
                <span className="text-orange-600 font-bold">RC</span>
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl">Login to REPROCOLLECTIVE</CardTitle>
          <CardDescription>
            Enter your credentials to access the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
                <a
                  href="#"
                  className="text-sm text-orange-600 hover:text-orange-800"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Do not have an account?{' '}
            <a href="#" className="text-orange-600 hover:text-orange-800">
              Contact administrator
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;