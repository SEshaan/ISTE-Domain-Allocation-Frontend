export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/600 backdrop-blur-2xl">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
    </div>
  );
}