import { UserButton } from "@clerk/nextjs";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
