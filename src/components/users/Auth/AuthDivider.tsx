export function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-100" />
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">or</span>
      <div className="h-px flex-1 bg-gray-100" />
    </div>
  );
}