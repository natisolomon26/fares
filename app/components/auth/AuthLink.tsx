// src/components/auth/AuthLink.tsx
import Link from "next/link";

export default function AuthLink({
  href,
  label,
  actionText,
}: {
  href: string;
  label: string;
  actionText: string;
}) {
  return (
    <p className="text-center text-text-secondary mt-6">
      {label}{" "}
      <Link href={href} className="text-primary-600 hover:underline font-medium">
        {actionText}
      </Link>
    </p>
  );
}