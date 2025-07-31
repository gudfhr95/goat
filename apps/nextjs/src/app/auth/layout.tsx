export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex min-h-screen items-center justify-center py-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
