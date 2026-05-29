export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 items-center gap-2 px-6">
          <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">GR</span>
          </div>
          <span className="text-lg font-bold text-gray-900">Golden Robin</span>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center py-10 px-4">
        {children}
      </main>
    </div>
  );
}
