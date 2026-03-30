import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const DashboardSkeleton = () => {
  return (
    <section className="space-y-6 animate-pulse">
      <div className="space-y-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="@container/card bg-linear-to-t from-primary/5 to-card shadow-xs dark:bg-card"
          >
            <CardHeader>
              <CardDescription>
                <Skeleton className="h-4 w-24" />
              </CardDescription>
              <CardTitle className="text-2xl @[250px]/card:text-3xl">
                <Skeleton className="h-8 w-20 @[250px]/card:h-9" />
              </CardTitle>
              <CardAction>
                <Skeleton className="h-7 w-20 rounded-md" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-52" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <Card className="@container/card xl:row-span-2">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-full max-w-sm" />
            </CardDescription>
            <CardAction>
              <div className="hidden gap-2 @[767px]/card:flex">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-9 w-28 rounded-md" />
                ))}
              </div>
              <Skeleton className="h-9 w-32 rounded-md @[767px]/card:hidden" />
            </CardAction>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <Skeleton className="h-80 w-full rounded-xl" />
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-28" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-full max-w-sm" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-72 w-full rounded-xl" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-56" />
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Skeleton className="h-56 w-full rounded-xl" />
              <div className="grid gap-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-2.5 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="size-5 rounded" />
              <Skeleton className="h-6 w-36" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-full max-w-sm" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border bg-card/70 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="size-10 rounded-xl" />
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="h-5 w-16 rounded-md sm:w-20" />
                        <Skeleton className="h-4 w-16 sm:w-20" />
                      </div>
                      <Skeleton className="h-4 w-24 max-w-full sm:w-28" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16 shrink-0 sm:w-20" />
                </div>
                <div className="mt-4 flex flex-col gap-2 rounded-xl border border-dashed px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-4 w-full max-w-sm" />
                  <Skeleton className="size-4 shrink-0 rounded" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="size-5 rounded" />
              <Skeleton className="h-6 w-28" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-full max-w-sm" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full rounded-md" />
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl border bg-card/70 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="size-10 rounded-xl" />
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="h-5 w-20 rounded-md sm:w-24" />
                        <Skeleton className="h-4 w-16 sm:w-20" />
                      </div>
                      <Skeleton className="h-4 w-28 max-w-full sm:w-36" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16 shrink-0 sm:w-20" />
                </div>
                <div className="mt-4 flex flex-col gap-2 rounded-xl border border-dashed px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-4 w-full max-w-sm" />
                  <Skeleton className="size-4 shrink-0 rounded" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-36" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full max-w-md" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full rounded-md" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-28" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-xl border bg-card/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-10 rounded-md" />
                        <Skeleton className="h-5 w-20 rounded-md" />
                      </div>
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="size-4 rounded" />
                    </div>
                  </div>
                  <Skeleton className="mt-3 h-2 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DashboardSkeleton;
