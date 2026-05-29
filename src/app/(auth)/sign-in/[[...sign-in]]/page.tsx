export function generateStaticParams() {
  return [{ "sign-in": [] }];
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Sign in is not available in this preview.</p>
    </div>
  );
}
