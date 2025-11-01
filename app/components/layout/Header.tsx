// src/components/dashboard/Header.tsx
export default function Header({
  user,
}: {
  user?: { churchName: string };
}) {
  return (
    <header className="bg-white border-b border-gray-200 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-right hidden md:block">
              <p className="text-sm text-text-secondary">{user.churchName}</p>
              <p className="text-sm font-medium text-text-primary">Admin</p>
            </div>
          )}
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-medium">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}