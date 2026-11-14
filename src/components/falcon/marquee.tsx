/** شريط متحرك بكلمات الهوية */
export function Marquee() {
  const items = [
    "ساعات رياضية",
    "صناعة سورية",
    "منبه مواقيت الصلاة",
    "ضد الماء 20 ATM",
    "زجاج سافاير",
    "ضمان 5 سنوات",
    "FALCON",
    "DAMASCUS",
  ];
  const row = [...items, ...items];
  return (
    <div className="border-y border-white/10 bg-[#0E0E10] overflow-hidden py-4" dir="ltr" aria-hidden>
      <div className="flex w-max animate-marquee gap-0">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6 whitespace-nowrap">
            <img src="/brand/icon_falcon_dark.png" alt="" className="w-5 h-5 object-contain opacity-80" />
            <span className="text-sm font-bold tracking-wider text-zinc-400">{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
