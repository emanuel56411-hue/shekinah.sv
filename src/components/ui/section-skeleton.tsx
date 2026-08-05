import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[10px] bg-white/12", className)} />;
}

/** Placeholder suave mientras cargan Palabra / Ayuda. */
export function PastorWordSkeleton({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-xl space-y-5 py-6 text-center" aria-busy="true" aria-label={label}>
      <Bone className="mx-auto h-3 w-24" />
      <Bone className="mx-auto h-8 w-3/4 max-w-sm" />
      <Bone className="mx-auto h-4 w-full max-w-md" />
      <Bone className="mx-auto mt-6 h-28 w-full max-w-lg" />
      <Bone className="mx-auto h-3 w-32" />
    </div>
  );
}

export function AyudaFormSkeleton({ label }: { label: string }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label={label}>
      <div className="space-y-2">
        <Bone className="h-3 w-20" />
        <Bone className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Bone className="h-3 w-28" />
        <Bone className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Bone className="h-3 w-24" />
        <Bone className="h-24 w-full" />
      </div>
      <Bone className="h-11 w-full" />
    </div>
  );
}
