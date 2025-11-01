// src/app/login/page.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signIn } from '@/actions/auth';
import AuthCard from '@/app/components/auth/AuthCard';
import AuthLink from '@/app/components/auth/AuthLink';
import { useEffect } from 'react';

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70"
    >
      {pending ? 'Signing in...' : 'Sign In'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(signIn, null);

  // Optional: log errors during dev
  useEffect(() => {
    if (state && 'message' in state) {
      console.error('Login error:', state.message);
    }
  }, [state]);

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to manage your church members"
    >
      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none transition"
            placeholder="admin@yourchurch.org"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-text-primary">
              Password
            </label>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Display error if any */}
        {state && 'message' in state && (
          <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {state.message}
          </p>
        )}

        <SubmitButton />
      </form>

      <AuthLink
        href="/signup"
        label="Don’t have an account?"
        actionText="Create one"
      />
    </AuthCard>
  );
}