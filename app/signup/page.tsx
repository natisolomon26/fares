// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/app/components/auth/AuthCard";
import AuthLink from "@/app/components/auth/AuthLink";

export default function SignupPage() {
  const [churchName, setChurchName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setLoading(true);
    
    // TODO: Replace with real signup API
    console.log("Signup attempt:", { churchName, email, password });
    
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard"); // or verification page
    }, 1000);
  };

  return (
    <AuthCard
      title="Create Your Church Account"
      subtitle="Get started with GraceChurchMS in minutes"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="church" className="block text-sm font-medium text-text-primary mb-1">
            Church Name
          </label>
          <input
            id="church"
            type="text"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none transition"
            placeholder="At least 8 characters"
            required
          />
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-text-primary mb-1">
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
            loading
              ? "bg-primary-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <AuthLink
        href="/login"
        label="Already have an account?"
        actionText="Sign in"
      />
    </AuthCard>
  );
}