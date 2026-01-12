"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, notFound } from "next/navigation";
import { validateOtp } from "@workspace/sdk/auth";
import { Card, CardContent } from "@workspace/ui/components/card";
import { CircleCheckIcon, LoaderCircle, OctagonXIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const identifier = params.get("identifier");
  const purpose = params.get("purpose") as OtpPurpose;
  const secret = params.get("secret");
  const type = params.get("type") as OtpType;

  if (!identifier || !purpose || !secret) {
    notFound();
  }

  const Icon =
    status === "success"
      ? CircleCheckIcon
      : status === "error"
        ? OctagonXIcon
        : LoaderCircle;

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await validateOtp({
          identifier,
          purpose,
          secret,
          type,
        });

        toast.success(res.message);
        setStatus("success");

        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 500);
      } catch (err: any) {
        toast.error("Verification failed", {
          description: err?.message,
        });
        setStatus("error");
        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    };

    verify();
  }, [params, router]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent
        className={cn(
          "flex-center flex-col gap-4 py-10",
          status === "success" && "text-green-500",
          status === "error" && "text-destructive"
        )}
      >
        <Icon
          className={cn("size-8", status === "loading" && "animate-spin")}
        />
        <div className={cn("flex-center gap-2")}>
          {status === "success"
            ? "Verification successful. Redirecting…"
            : status === "error"
              ? "This verification link is invalid or expired. Redirecting…"
              : "Verifying your request…"}
        </div>
      </CardContent>
    </Card>
  );
}
