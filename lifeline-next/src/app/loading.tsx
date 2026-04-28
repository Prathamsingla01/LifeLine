export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-ll-surface3 border-t-ll-red animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-ll-surface3 border-b-ll-blue animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
          </div>
        </div>
        <p className="text-sm text-ll-text3 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
