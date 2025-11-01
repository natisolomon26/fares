// src/app/signup/page.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUp } from '@/actions/auth';
import AuthCard from '@/app/components/auth/AuthCard';
import AuthLink from '@/app/components/auth/AuthLink';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70"
    >
      {pending ? 'Creating account...' : 'Create Account'}
    </button>
  );
}

export default function SignupPage() {
      const [state, formAction] = useActionState(signUp, null);
    
  return (
    <AuthCard
      title="Create Your Church Account"
      subtitle="Get started with GraceChurchMS in minutes"
    >
      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="churchName" className="block text-sm font-medium text-text-primary mb-1">
            Church Name
          </label>
          <input
            id="churchName"
            name="churchName"
            type="text"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none transition"
            placeholder="Grace Community Church"
            required
          />
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none transition"
            placeholder="At least 6 characters"
            required
          />
        </div>

        {/* Display error */}
        {state && 'message' in state && (
          <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {state.message}
          </p>
        )}

        <SubmitButton />
      </form>

      <AuthLink
        href="/login"
        label="Already have an account?"
        actionText="Sign in"
      />
    </AuthCard>
  );
}