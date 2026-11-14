import { Badge } from "@/components/ui/badge";

/** شارات حالات الطلب — مشتركة بين صفحات الإدارة */
export const STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  confirmed: "مؤكد",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

export const STATUS_OPTIONS = [
  { value: "new", label: "جديد" },
  { value: "confirmed", label: "مؤكد" },
  { value: "delivered", label: "تم التوصيل" },
  { value: "cancelled", label: "ملغي" },
];

const STATUS_CLASSES: Record<string, string> = {
  new: "bg-white text-[#0A0A0B] border-0 font-bold",
  confirmed: "bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold",
  delivered: "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 font-bold",
  cancelled: "bg-red-400/15 text-red-300 border border-red-400/30 font-bold",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={STATUS_CLASSES[status] ?? "border-white/20 text-zinc-300 font-bold"}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export const STATUS_BADGE = {
  new: (
    <Badge className="bg-white text-[#0A0A0B] border-0 font-bold">جديد</Badge>
  ),
  confirmed: (
    <Badge className="bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold">مؤكد</Badge>
  ),
  delivered: (
    <Badge className="bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 font-bold">تم التوصيل</Badge>
  ),
  cancelled: (
    <Badge className="bg-red-400/15 text-red-300 border border-red-400/30 font-bold">ملغي</Badge>
  ),
};
