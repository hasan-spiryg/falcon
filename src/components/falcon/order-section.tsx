"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SYRIAN_CITIES } from "@/lib/cities";
import { CheckCircle2, Loader2, Send } from "lucide-react";

const MODELS = [
  { id: "saqr", name: "فالكون صقر — $199" },
  { id: "shaheen", name: "فالكون شاهين — $229" },
  { id: "hurr", name: "فالكون حر — $189" },
];

export function OrderSection() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, city, model }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({
          title: "تعذّر إرسال الطلب",
          description: data.error ?? "تحقق من الحقول وحاول مجدداً",
          variant: "destructive",
        });
      } else {
        setDone(data.orderId);
        toast({
          title: "تم استلام طلبك",
          description: `رقم الطلب FL-${data.orderId} — سيتصل بك فريقنا خلال 24 ساعة`,
        });
      }
    } catch {
      toast({
        title: "تعذّر الاتصال بالخادم",
        description: "تحقق من اتصالك وحاول مجدداً",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order" className="relative py-20 lg:py-28 bg-[#0A0A0B] overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-50" />
      <div aria-hidden className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-[0.4em] text-zinc-500"
          >
            JOIN THE FLOCK
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black"
          >
            اطلب ساعتك الآن
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-zinc-400 text-base lg:text-lg"
          >
            الدفع عند الاستلام · توصيل مجاني لكل المحافظات · ضمان 5 سنوات
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#111113] border border-white/15 clip-corner p-6 sm:p-10"
        >
          {done ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-16 h-16 mx-auto text-white" aria-hidden />
              <h3 className="mt-5 text-2xl font-black">تم استلام طلبك بنجاح</h3>
              <p className="mt-3 text-zinc-400">
                رقم طلبك: <span className="text-white font-bold" dir="ltr">FL-{done}</span>
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                سيتواصل معك فريق فالكون خلال 24 ساعة لتأكيد الطلب وموعد التوصيل.
              </p>
              <Button
                variant="outline"
                className="mt-8 clip-corner-sm border-white/25 text-white hover:bg-white/10 hover:text-white"
                onClick={() => {
                  setDone(null);
                  setName("");
                  setPhone("");
                  setCity("");
                  setModel("");
                }}
              >
                إرسال طلب آخر
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="order-name" className="text-sm font-bold">
                  الاسم الكامل
                </Label>
                <Input
                  id="order-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد الخطيب"
                  required
                  minLength={2}
                  className="h-12 bg-[#0A0A0B] border-white/15 focus-visible:ring-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-phone" className="text-sm font-bold">
                  رقم الهاتف
                </Label>
                <Input
                  id="order-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09XXXXXXXX"
                  required
                  inputMode="tel"
                  dir="ltr"
                  className="h-12 bg-[#0A0A0B] border-white/15 focus-visible:ring-white/30 text-right"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold">المدينة</Label>
                <Select value={city} onValueChange={setCity} required>
                  <SelectTrigger
                    className="h-12 bg-[#0A0A0B] border-white/15 focus:ring-white/30 font-medium"
                    aria-label="اختر مدينتك"
                  >
                    <SelectValue placeholder="اختر مدينتك" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141416] border-white/15 max-h-72">
                    {SYRIAN_CITIES.map((c) => (
                      <SelectItem key={c.id} value={c.name} className="focus:bg-white/10 focus:text-white">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold">الموديل</Label>
                <Select value={model} onValueChange={setModel} required>
                  <SelectTrigger
                    className="h-12 bg-[#0A0A0B] border-white/15 focus:ring-white/30 font-medium"
                    aria-label="اختر الموديل"
                  >
                    <SelectValue placeholder="اختر ساعتك" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141416] border-white/15">
                    {MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="focus:bg-white/10 focus:text-white">
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full clip-corner bg-white text-[#0A0A0B] hover:bg-zinc-200 font-black h-14 text-lg gap-2.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                      جارٍ الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" aria-hidden />
                      تأكيد الطلب
                    </>
                  )}
                </Button>
                <p className="mt-3.5 text-center text-xs text-zinc-600">
                  بالضغط على تأكيد الطلب أنت توافق على سياسة الاستبدال والضمان
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
