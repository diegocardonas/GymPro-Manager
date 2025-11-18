import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Role } from '../types';

const LoginScreen: React.FC = () => {
  const { login, register } = useContext(AuthContext);
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role.CLIENT | Role.TRAINER>(Role.CLIENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let result: string | void;

    if (isLoginView) {
      result = await login(email, password);
    } else {
      if (!name || !email || !password) {
        setError('All fields are required for registration.');
        return;
      }
      result = await register({ name, email, password, role });
    }

    if (result) {
      setError(result);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-black/10 dark:ring-white/10 animate-slide-up">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isLoginView ? 'Sign in to continue to GymPro Manager' : 'Join our community of fitness enthusiasts'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLoginView}
                className="w-full px-4 py-3 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full Name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLoginView ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
          </div>

          {!isLoginView && (
            <div className="flex items-center justify-around p-2 bg-gray-200/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 font-medium">I am a:</p>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="role" value={Role.CLIENT} checked={role === Role.CLIENT} onChange={() => setRole(Role.CLIENT)} className="form-radio text-blue-500 bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600 focus:ring-blue-500" />
                    <span className={role === Role.CLIENT ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}>Client</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="role" value={Role.TRAINER} checked={role === Role.TRAINER} onChange={() => setRole(Role.TRAINER)} className="form-radio text-purple-500 bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600 focus:ring-purple-500" />
                    <span className={role === Role.TRAINER ? 'text-purple-600 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'}>Trainer</span>
                </label>
            </div>
          )}

          {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center px-4 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              {isLoginView ? 'Sign In' : 'Register'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleView} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
            {isLoginView ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default LoginScreen;