"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "تعذّر تسجيل الدخول");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-grid">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="inline-flex w-16 h-16 bg-white items-center justify-center clip-corner mb-5">
            <img src="/brand/icon_falcon_light.png" alt="شعار فالكون" className="w-12 h-12 object-contain" />
          </span>
          <h1 className="text-2xl font-black">لوحة تحكم فالكون</h1>
          <p className="mt-2 text-sm text-zinc-500">إدارة المنتجات والمحتوى والطلبات</p>
        </div>

        <form
          onSubmit={submit}
          className="bg-[#111113] border border-white/15 clip-corner p-6 sm:p-8 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-sm font-bold">
              كلمة المرور
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" aria-hidden />
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
                dir="ltr"
                className="h-12 bg-[#0A0A0B] border-white/15 focus-visible:ring-white/30 pr-10 text-left"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400 font-medium" role="alert">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full clip-corner-sm bg-white text-[#0A0A0B] hover:bg-zinc-200 font-black h-12 gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                جارٍ التحقق...
              </>
            ) : (
              "دخول"
            )}
          </Button>

          <p className="text-[11px] text-zinc-600 text-center leading-relaxed">
            كلمة المرور الافتراضية <span dir="ltr" className="text-zinc-400 font-mono">falcon-admin</span>
            — يمكن تغييرها من ملف <span dir="ltr" className="font-mono">.env</span>
          </p>
        </form>
      </div>
    </div>
  );
}
