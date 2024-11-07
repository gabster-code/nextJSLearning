import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Sessions & Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your active sessions and view login history.
        </p>
      </div>
      <div className="space-y-6">
        {/* Active Sessions Loading State */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Active Sessions</h4>
          <div className="divide-y divide-border rounded-md border">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-9 w-[100px]" />
              </div>
            ))}
          </div>
        </div>

        {/* Login History Loading State */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Login History</h4>
          <div className="divide-y divide-border rounded-md border">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="h-5 w-[60px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
