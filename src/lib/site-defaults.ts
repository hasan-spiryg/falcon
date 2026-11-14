/**
 * المحتوى الافتراضي لموقع فالكون — كل نص هنا قابل للتعديل من لوحة الإدارة.
 * القيم المخزنة في قاعدة البيانات (جدول settings) تتجاوز هذه الافتراضيات.
 */

export interface HeroStat {
  icon: string;
  value: string;
  label: string;
}

export interface HeroContent {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: HeroStat[];
}

export interface ShowcaseContent {
  latin: string;
  title: string;
  subtitle: string;
  text: string;
  cta: string;
  image: string;
  imageAlt: string;
}

export interface ProductsContent {
  kicker: string;
  title: string;
  subtitle: string;
  note: string;
}

export interface TechItem {
  icon: string;
  title: string;
  text: string;
}

export interface TechContent {
  kicker: string;
  title1: string;
  title2: string;
  image: string;
  imageAlt: string;
  badgeValue: string;
  badgeLabel: string;
  items: TechItem[];
}

export interface PrayerFeature {
  icon: string;
  title: string;
  text: string;
}

export interface PrayerContent {
  badge: string;
  title1: string;
  title2: string;
  text: string;
  features: PrayerFeature[];
  note: string;
}

export interface AboutContent {
  kicker: string;
  title1: string;
  title2: string;
  paragraphs: string[];
  quote: string;
  quoteAuthor: string;
  image: string;
  imageAlt: string;
  cardTitle: string;
  cardText: string;
}

export interface TrustItem {
  icon: string;
  title: string;
  text: string;
}

export interface ContactContent {
  city: string; // المدينة اللاتينية للشعار
  address: string;
  phone: string;
  email: string;
  since: string;
}

export interface FooterContent {
  newsletterTitle: string;
  newsletterText: string;
  description: string;
  rights: string;
  latinLine: string;
}

export interface MarqueeContent {
  items: string[];
}

export interface SiteContent {
  hero: HeroContent;
  showcase: ShowcaseContent;
  products: ProductsContent;
  tech: TechContent;
  prayer: PrayerContent;
  about: AboutContent;
  trust: TrustItem[];
  contact: ContactContent;
  footer: FooterContent;
  marquee: MarqueeContent;
}

/** منتج قابل للعرض — كما يخرج من قاعدة البيانات */
export interface ProductDTO {
  id: string;
  name: string;
  latin: string;
  image: string;
  price: string;
  tagline: string;
  specs: { icon: string; text: string }[];
  badge?: string | null;
}

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    badge: "براند سوري · مركزنا في إدلب",
    title1: "ساعات رياضية",
    title2: "صُنعت لتقود الزمن",
    subtitle:
      "فالكون — ساعات رياضية عالية الجودة بمعايير عالمية، مزوّدة بمنبه لمواقيت الصلاة. هندسة دقيقة، تصميم جسور، وروح صقر سوري.",
    ctaPrimary: "اكتشف المجموعة",
    ctaSecondary: "ميزة مواقيت الصلاة",
    stats: [
      { icon: "droplets", value: "20 ATM", label: "مقاومة الماء" },
      { icon: "shield", value: "5 سنوات", label: "ضمان دولي" },
      { icon: "bell", value: "6 مواقيت", label: "منبه الصلاة" },
    ],
  },
  showcase: {
    latin: "FALCON PRO · FLAGSHIP",
    title: "فالكون برو",
    subtitle: "اقتني ساعتك",
    text: "إطار فولاذي مطلي بالكربون الأسود، عقارب مضيئة بترتيب سويسري، ومنبه مواقيت الصلاة يعمل بصمت وكبرياء.",
    cta: "اقتني ساعتك",
    image: "/brand/watch-hero.png",
    imageAlt: "ساعة فالكون برو — الإصدار الأسود المطفي",
  },
  products: {
    kicker: "THE COLLECTION",
    title: "مجموعة الساعات",
    subtitle:
      "ثلاثة موديلات، ثلاث شخصيات — بنفس الروح. كل ساعة تجمع بين المتانة الرياضية ومنبه مواقيت الصلاة والتقويم الهجري.",
    note: "جميع الأسعار شاملة الضمان والدعم الفني — التوصيل متاح لكل المحافظات السورية",
  },
  tech: {
    kicker: "ENGINEERED TO LAST",
    title1: "تقنية لا تعرف",
    title2: "كلمة «يكفي»",
    image: "/brand/watch-macro.png",
    imageAlt: "تفاصيل صناعة ساعة فالكون — الإطار المسنن والزجاج",
    badgeValue: "316L",
    badgeLabel: "فولاذ جراحي أصلي",
    items: [
      {
        icon: "gem",
        title: "زجاج سافاير",
        text: "زجاج يقاوم الخدوش اليومية — من مفاتيح الجيب إلى صخور الجبل.",
      },
      {
        icon: "droplets",
        title: "مقاومة ماء 20 ATM",
        text: "من الغطس في بحر اللاذقية إلى غسيل اليدين — لا تقلق أبداً.",
      },
      {
        icon: "battery",
        title: "بطارية 24 شهراً",
        text: "حركة كوارتز يابانية عالية الكفاءة، استبدال مجاني في مراكزنا.",
      },
      {
        icon: "sunmoon",
        title: "إضاءة ليلية",
        text: "طبقة مضيئة على العقارب والأرقام — وضوح تام في عتمة الخيمة.",
      },
      {
        icon: "bell",
        title: "منبه مواقيت مدمج",
        text: "مواقيت الصلاة محسوبة فلكياً ومبرمجة لكل المحافظات السورية — بلا هاتف ولا إنترنت.",
      },
      {
        icon: "hammer",
        title: "فولاذ 316L",
        text: "نفس فولاذ الساعات الفاخرة — مقاوم للصدأ والعرق والرطوبة.",
      },
    ],
  },
  prayer: {
    badge: "الميزة المميزة — SALAT ALARM",
    title1: "منبه مواقيت الصلاة،",
    title2: "في معصمك أينما كنت",
    text: "صمّمنا فالكون ليبقى الوقت فيه مربوطاً بالإيمان: تنبيه صامت بالاهتزاز عند كل ميقات، محسوب فلكياً لمدينتك، دون حاجة للهاتف أو الإنترنت. الوقت عبادة، والساعة رفيقك.",
    features: [
      {
        icon: "vibrate",
        title: "تنبيه بالاهتزاز",
        text: "اهتزاز لطيف عند كل ميقات — لا أصوات مزعجة في الاجتماعات أو الصالة الرياضية.",
      },
      {
        icon: "mappin",
        title: "14 مدينة سورية",
        text: "أوقات دقيقة محسوبة فلكياً لكل المحافظات السورية، مبرمجة مسبقاً داخل الساعة.",
      },
      {
        icon: "moonstar",
        title: "التقويم الهجري",
        text: "عرض التاريخ الهجري والميلادي على الشاشة، مع تنبيهات مناسبة رمضان مسبقاً.",
      },
      {
        icon: "compass",
        title: "بوصلة القبلة",
        text: "مؤشر اتجاه القبلة مدمج في الساعة — فائدة للمسافر والمسافرة أينما حللت.",
      },
      {
        icon: "belloff",
        title: "وضع المسجد",
        text: "تعطيل التنبيهات مؤقتاً بضغطة واحدة أثناء الصلاة أو المجالس.",
      },
    ],
    note: "* هذا عرض تفاعلي لميزة الساعة — الأوقات محسوبة فلكياً بطريقة الفجر 18° والعشاء 17° وقد تختلف دقيقة عن تقويم وزارة الأوقاف.",
  },
  about: {
    kicker: "OUR STORY",
    title1: "من إدلب،",
    title2: "إلى معصم كل عربي",
    paragraphs: [
      "وُلدت فالكون من فكرة بسيطة: لماذا يستورد السوري ساعته من الخارج، بينما يد السوري تصنع أجمل الأشياء؟ بدأنا بورشة صغيرة في إدلب وشغف كبير بالتوقيت والدقة — فالصقر لا يخطئ انقضاضته.",
      "اليوم، تجمع كل ساعة فالكون بين الحركة اليابانية الدقيقة واللمسة السورية في التصميم والتجميع. ساعة رياضية تليق بمن يصحو للفجر ويعمل حتى الليل، بمنبه صلاة يجعل الوقت عبادةً لا روتيناً.",
    ],
    quote: "«نحن لا نبيع ساعات، نحن نصنع رفيقاً للوقت.»",
    quoteAuthor: "— فريق فالكون، إدلب",
    image: "/brand/watch-lifestyle.png",
    imageAlt: "رياضي يرتدي ساعة فالكون الرياضية السوداء",
    cardTitle: "صُنع بفخر في سوريا",
    cardText: "تصميم وتجميع: إدلب · حركة: يابان",
  },
  trust: [
    { icon: "badgecheck", title: "ضمان 5 سنوات", text: "على الحركة والعلبة في كل مركز خدمة" },
    { icon: "truck", title: "توصيل لكل المحافظات", text: "ودفع عند الاستلام داخل سوريا" },
    { icon: "refresh", title: "استبدال 30 يوماً", text: "لم تناسبك؟ استبدلها دون أسئلة" },
    { icon: "wrench", title: "صيانة سورية", text: "مراكز معتمدة في إدلب وحلب ودمشق" },
  ],
  contact: {
    city: "IDLIB",
    address: "إدلب — الشارع العام، بناء فالكون",
    phone: "+963 23 XXX XXX",
    email: "hello@falcon-watch.sy",
    since: "SINCE 2024",
  },
  footer: {
    newsletterTitle: "انضم إلى عائلة فالكون",
    newsletterText: "إصدارات محدودة، عروض حصرية، وقصص من الورشة — مباشرة إلى بريدك",
    description:
      "براند سوري للساعات الرياضية عالية الجودة. نصنع ساعات تجمع بين المتانة والدقة ومنبه مواقيت الصلاة — لأن الوقت أمانة.",
    rights: "فالكون — جميع الحقوق محفوظة · صنع بفخر في سوريا",
    latinLine: "FALCON — IDLIB · SPORT WATCHES",
  },
  marquee: {
    items: [
      "ساعات رياضية",
      "صناعة سورية",
      "منبه مواقيت الصلاة",
      "ضد الماء 20 ATM",
      "زجاج سافاير",
      "ضمان 5 سنوات",
      "FALCON",
      "IDLIB",
    ],
  },
};

/** المنتجات الافتراضية — تُزرع في قاعدة البيانات عند أول تشغيل */
export const DEFAULT_PRODUCTS: {
  name: string;
  latin: string;
  image: string;
  price: string;
  tagline: string;
  specs: { icon: string; text: string }[];
  badge?: string;
  sortOrder: number;
}[] = [
  {
    name: "فالكون برو",
    latin: "FALCON PRO",
    image: "/brand/watch-black.png",
    price: "$199",
    tagline: "الأسود التكتيكي — رفيق المغامرات القاسية",
    specs: [
      { icon: "droplets", text: "20 ATM" },
      { icon: "battery", text: "بطارية سنتان" },
      { icon: "gauge", text: "فولاذ 316L" },
    ],
    badge: "الأكثر طلباً",
    sortOrder: 0,
  },
  {
    name: "فالكون شاهين",
    latin: "SHAHEEN STEEL",
    image: "/brand/watch-steel.png",
    price: "$229",
    tagline: "الفولاذي الأنيق — حضور يليق بالمناسبات",
    specs: [
      { icon: "droplets", text: "10 ATM" },
      { icon: "battery", text: "بطارية سنتان" },
      { icon: "shield", text: "سوار فولاذي" },
    ],
    sortOrder: 1,
  },
  {
    name: "فالكون حر",
    latin: "HURR WHITE",
    image: "/brand/watch-white.png",
    price: "$189",
    tagline: "الأبيض الرياضي — خفة وأناقة نهارية",
    specs: [
      { icon: "droplets", text: "10 ATM" },
      { icon: "battery", text: "بطارية سنتان" },
      { icon: "weight", text: "وزن 52غ" },
    ],
    badge: "جديد",
    sortOrder: 2,
  },
];

export const CONTENT_KEYS = [
  "hero",
  "showcase",
  "products",
  "tech",
  "prayer",
  "about",
  "trust",
  "contact",
  "footer",
  "marquee",
] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];
