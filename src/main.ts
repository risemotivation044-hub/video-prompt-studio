import "./style.css";

/* ------------------------------------------------------------------ *
 * Video Prompt Studio — deterministic prompt compiler.
 * No API keys, no network calls: every structural token below is
 * authored film-grammar English. Only the visitor's idea passes through
 * verbatim. Runs entirely in the browser.
 * ------------------------------------------------------------------ */

type Opt = { id: string; ar: string; en: string; tok: string };
type Group = { key: string; ar: string; code: string; opts: Opt[] };

const GROUPS: Group[] = [
  {
    key: "model",
    ar: "الموديل",
    code: "target model",
    opts: [
      { id: "veo", ar: "Veo 3", en: "Veo 3", tok: "veo" },
      { id: "sora", ar: "Sora", en: "Sora", tok: "sora" },
      { id: "runway", ar: "Runway", en: "Runway Gen-3", tok: "runway" },
      { id: "kling", ar: "Kling", en: "Kling AI", tok: "kling" },
      { id: "luma", ar: "Luma", en: "Luma Dream Machine", tok: "luma" },
      { id: "pika", ar: "Pika", en: "Pika", tok: "pika" },
      { id: "mj", ar: "Midjourney", en: "Midjourney", tok: "mj" },
    ],
  },
  {
    key: "format",
    ar: "الفورما",
    code: "aspect / length",
    opts: [
      { id: "reel", ar: "ريلز عمودي", en: "Vertical 9:16", tok: "9:16 vertical, 8 seconds" },
      { id: "sq", ar: "مربع", en: "Square 1:1", tok: "1:1 square, 6 seconds" },
      { id: "wide", ar: "سينمائي عريض", en: "Cinematic 16:9", tok: "16:9 widescreen, 10 seconds" },
      { id: "scope", ar: "سكوب 2.39", en: "Anamorphic 2.39:1", tok: "2.39:1 anamorphic scope, 12 seconds" },
    ],
  },
  {
    key: "style",
    ar: "الستايل",
    code: "look",
    opts: [
      {
        id: "cine",
        ar: "سينمائي",
        en: "Cinematic",
        tok: "photorealistic cinematic film look, 35mm film grain, filmic dynamic range",
      },
      {
        id: "doc",
        ar: "وثائقي واقعي",
        en: "Documentary",
        tok: "handheld documentary realism, natural unstyled textures, available light",
      },
      {
        id: "ad",
        ar: "إعلان تجاري",
        en: "Commercial",
        tok: "high-end commercial product cinematography, immaculate surfaces, controlled studio look",
      },
      {
        id: "anime",
        ar: "أنيمي",
        en: "Anime",
        tok: "2D anime cel-shaded animation, expressive linework, painted backgrounds",
      },
      {
        id: "3d",
        ar: "ثري دي",
        en: "3D render",
        tok: "stylized 3D animated render, subsurface scattering, ray-traced reflections",
      },
      {
        id: "retro",
        ar: "ريترو VHS",
        en: "Retro VHS",
        tok: "1990s VHS home-video aesthetic, chroma bleed, scanlines, soft optics",
      },
      {
        id: "noir",
        ar: "نوار",
        en: "Film noir",
        tok: "black and white film noir, hard chiaroscuro, deep blacks, venetian-blind shadows",
      },
    ],
  },
  {
    key: "mood",
    ar: "الجو",
    code: "mood / grade",
    opts: [
      { id: "warm", ar: "دافي", en: "Warm", tok: "warm golden grade, amber highlights, gentle contrast" },
      { id: "cold", ar: "بارد", en: "Cold", tok: "cool teal-and-steel grade, crushed blacks, high micro-contrast" },
      { id: "dream", ar: "حالمي", en: "Dreamy", tok: "soft pastel grade, hazy bloom, low contrast" },
      { id: "tense", ar: "متشدد", en: "Tense", tok: "desaturated high-contrast grade, heavy shadow, cold skin tones" },
      { id: "vivid", ar: "فرحان", en: "Vivid", tok: "saturated punchy grade, clean whites, energetic color separation" },
      { id: "epic", ar: "ملحمي", en: "Epic", tok: "epic teal-orange blockbuster grade, atmospheric haze, wide tonal range" },
    ],
  },
  {
    key: "camera",
    ar: "الكاميرا",
    code: "camera / lens",
    opts: [
      { id: "a35", ar: "سينما ٣٥مم", en: "ARRI 35mm", tok: "ARRI Alexa, 35mm prime, T2.0, shallow depth of field" },
      { id: "wide24", ar: "واسع ٢٤مم", en: "Wide 24mm", tok: "24mm wide-angle lens, deep focus, slight edge distortion" },
      { id: "tele85", ar: "تيليفوتو ٨٥مم", en: "Tele 85mm", tok: "85mm telephoto, compressed background, creamy bokeh" },
      { id: "macro", ar: "ماكرو", en: "Macro", tok: "100mm macro lens, extreme close detail, razor-thin focus plane" },
      { id: "phone", ar: "تيليفون", en: "Phone", tok: "modern smartphone camera, wide sensor look, natural handheld feel" },
      { id: "drone", ar: "درون", en: "Drone", tok: "aerial drone camera, gimbal-stabilized, high vantage point" },
      { id: "fpv", ar: "FPV", en: "FPV", tok: "FPV drone lens, ultra-wide, aggressive proximity flying" },
    ],
  },
  {
    key: "light",
    ar: "الضو",
    code: "lighting",
    opts: [
      { id: "golden", ar: "غروب", en: "Golden hour", tok: "golden hour backlight, long soft shadows, warm rim light" },
      { id: "soft", ar: "سوفت بوكس", en: "Soft studio", tok: "large softbox key at 45 degrees, soft fill, clean falloff" },
      { id: "hard", ar: "ضو قاسح", en: "Hard light", tok: "single hard key light, sharp shadow edges, dramatic modelling" },
      { id: "neon", ar: "نيون ليلي", en: "Neon night", tok: "neon practical lights, magenta and cyan spill, wet reflective surfaces" },
      { id: "window", ar: "ضو الشرجم", en: "Window light", tok: "north-facing window light, soft directional wrap, natural ambience" },
      { id: "low", ar: "لو كي", en: "Low key", tok: "low-key lighting, 90% shadow, single edge highlight" },
    ],
  },
  {
    key: "motion",
    ar: "الحركة",
    code: "camera move",
    opts: [
      { id: "static", ar: "ثابتة", en: "Locked", tok: "locked-off static frame, subject moves within it" },
      { id: "push", ar: "دخول بطيء", en: "Slow push", tok: "slow dolly push-in toward the subject" },
      { id: "orbit", ar: "دوران", en: "Orbit", tok: "smooth 180-degree orbit around the subject" },
      { id: "track", ar: "تتبع", en: "Tracking", tok: "lateral tracking shot moving with the subject" },
      { id: "handheld", ar: "يد", en: "Handheld", tok: "handheld camera, subtle organic shake, reactive reframing" },
      { id: "crane", ar: "كرين", en: "Crane up", tok: "crane rising reveal, ending on a wide vantage" },
      { id: "slowmo", ar: "سلو موشن", en: "Slow motion", tok: "120fps slow motion, fluid weighted movement" },
    ],
  },
  {
    key: "audio",
    ar: "الصوت",
    code: "audio",
    opts: [
      { id: "amb", ar: "أمبيانس واقعي", en: "Ambience", tok: "realistic location ambience, natural room tone, no music" },
      { id: "score", ar: "موسيقى", en: "Score", tok: "cinematic orchestral score building to a hit on the final beat" },
      { id: "beat", ar: "بيت إيقاعي", en: "Beat", tok: "modern rhythmic beat, tight percussive hits synced to cuts" },
      { id: "sfx", ar: "مؤثرات ASMR", en: "ASMR SFX", tok: "close detailed ASMR sound design, crisp foley, no music" },
      { id: "dialog", ar: "حوار", en: "Dialogue", tok: "clear on-camera dialogue, close lavalier presence, minimal background" },
      { id: "silent", ar: "بلا صوت", en: "Silent", tok: "no audio" },
    ],
  },
];

const DEFAULTS: Record<string, string> = {
  model: "veo",
  format: "reel",
  style: "cine",
  mood: "warm",
  camera: "a35",
  light: "golden",
  motion: "push",
  audio: "amb",
};

const PRESETS: { ar: string; idea: string; set: Partial<Record<string, string>> }[] = [
  {
    ar: "ريلز فيرال",
    idea: "شاب صغير كيمشي فزنقة قديمة فالمدينة القديمة، كيدور للكاميرا وكيتبسم",
    set: { format: "reel", style: "cine", mood: "vivid", motion: "handheld", audio: "beat" },
  },
  {
    ar: "إعلان منتج",
    idea: "قنينة عطر كتدور على طبلة رخام، قطرات الما كتطيح عليها",
    set: { format: "sq", style: "ad", mood: "cold", camera: "macro", light: "soft", motion: "orbit", audio: "sfx" },
  },
  {
    ar: "تريلر سينمائي",
    idea: "فارس بوحدو واقف قدام باب قصر مهجور فوسط الصحرا والريح كيهز السلهام ديالو",
    set: { format: "scope", style: "cine", mood: "epic", camera: "wide24", light: "hard", motion: "crane", audio: "score" },
  },
  {
    ar: "تصوير وجه/كلام",
    idea: "مدربة كتهضر مع الكاميرا فمكتب حديث وهي كتشرح فكرة",
    set: { format: "reel", style: "doc", mood: "warm", camera: "tele85", light: "window", motion: "static", audio: "dialog" },
  },
  {
    ar: "ماكلة",
    idea: "يد كتقطع طاجين سخون والبخار كيطلع، الخبز كيتغمس فالمرقة",
    set: { format: "reel", style: "ad", mood: "warm", camera: "macro", light: "soft", motion: "slowmo", audio: "sfx" },
  },
  {
    ar: "عقار / ديور",
    idea: "دخول لصالون واسع بشرجم كبير كيبان منو البحر",
    set: { format: "wide", style: "ad", mood: "dream", camera: "wide24", light: "window", motion: "track", audio: "amb" },
  },
];

const LEXICON: { ar: string; en: string }[] = [
  { ar: "قريب جداً", en: "extreme close-up" },
  { ar: "بلان عام", en: "wide establishing shot" },
  { ar: "من فوق", en: "top-down overhead angle" },
  { ar: "من تحت", en: "low angle looking up" },
  { ar: "من ورا الكتف", en: "over-the-shoulder framing" },
  { ar: "ضبابة", en: "volumetric fog" },
  { ar: "غبرة فالضو", en: "dust particles in the light beam" },
  { ar: "شتا", en: "rain-soaked, wet surfaces" },
  { ar: "انعكاس", en: "mirror reflection" },
  { ar: "سيلويت", en: "silhouette against bright background" },
  { ar: "فلاش خفيف", en: "subtle anamorphic lens flare" },
  { ar: "بلان واحد", en: "single continuous take, no cuts" },
];

const NEG_BASE = [
  "distorted faces",
  "extra fingers",
  "warped hands",
  "text artifacts",
  "watermark",
  "logo overlay",
  "subtitles",
  "jittery flicker",
  "morphing background",
  "duplicated limbs",
  "plastic skin",
  "oversharpened edges",
  "low resolution",
  "compression blocks",
];

const MODEL_NOTE: Record<string, string> = {
  veo: "Veo كيحب الوصف الطويل المهيكل + الصوت. سير على «البرومبت الرئيسي» ولا نسخة JSON، وحط الصوت داخل البرومبت.",
  sora: "Sora كيخدم مزيان بالوصف السردي المتصل. استعمل «البرومبت الرئيسي» ولا «سلسلة البلانات» باش تتحكم فالمونتاج.",
  runway: "Runway كيفضل برومبت قصير على الحركة. استعمل السطر الأول من البرومبت الرئيسي + خلي «الحركة» واضحة.",
  kling: "Kling كيقبل البرومبت السلبي بشكل منفصل — قوس النسخة السلبية ولصقها فخانة Negative prompt.",
  luma: "Luma كيرد مزيان على حركة الكاميرا. خلي الجملة ديال الكاميرا فاللول.",
  pika: "Pika قصير النفس: استعمل جوج ولا تلاتة جمل بحال ما كاين فسلسلة البلانات، بلان بلان.",
  mj: "Midjourney: استعمل نسخة «الصورة/الستيل» — وصف بصري بلا حركة، وزيد --ar و --style raw فالآخر.",
};

/* ------------------------------ state ------------------------------ */

const sel: Record<string, string> = { ...DEFAULTS };
let idea = "";
let built: { key: string; label: string; code: string; text: string }[] | null = null;
let activeTab = 0;

const pick = (k: string): Opt => {
  const g = GROUPS.find((x) => x.key === k)!;
  return g.opts.find((o) => o.id === sel[k]) ?? g.opts[0];
};

const cleanIdea = () => idea.trim().replace(/\s+/g, " ").replace(/[.،,]+$/, "");

/* ---------------------------- the compiler ---------------------------- */

function compile() {
  const subject = cleanIdea();
  const model = pick("model");
  const fmt = pick("format");
  const style = pick("style");
  const mood = pick("mood");
  const cam = pick("camera");
  const light = pick("light");
  const motion = pick("motion");
  const audio = pick("audio");

  const quality =
    "sharp focus, natural motion physics, consistent character and wardrobe across the whole shot, no morphing, professional colour grade";

  const master = [
    `${subject}.`,
    `Style: ${style.tok}. ${mood.tok}.`,
    `Camera: ${cam.tok}; ${motion.tok}.`,
    `Lighting: ${light.tok}.`,
    `Audio: ${audio.tok}.`,
    `Format: ${fmt.tok}.`,
    `Quality: ${quality}.`,
  ].join("\n");

  const json = JSON.stringify(
    {
      subject_action: subject,
      visual_style: style.en,
      style_details: style.tok,
      color_grade: mood.tok,
      camera: { body_lens: cam.tok, movement: motion.tok },
      lighting: light.tok,
      audio: audio.tok,
      format: fmt.tok,
      quality: quality,
      negative_prompt: NEG_BASE.join(", "),
    },
    null,
    2,
  );

  const shots = [
    `SHOT 1 — ESTABLISH (0:00–0:03)\nWide establishing frame of: ${subject}. ${light.tok}. Camera: slow ${motion.tok}. ${style.tok}. ${mood.tok}. ${audio.tok}.`,
    `SHOT 2 — ACTION (0:03–0:06)\nMedium shot, same subject and wardrobe, the main action of "${subject}" happening clearly. ${cam.tok}; ${motion.tok}. Continuity: identical lighting and grade as Shot 1.`,
    `SHOT 3 — PAYOFF (0:06–0:09)\nClose-up detail that resolves the idea: the strongest single element of "${subject}", filling the frame. ${cam.tok}. ${light.tok}. Final beat lands on this frame. ${fmt.tok}.`,
  ].join("\n\n");

  const mjPrompt = `${subject}, ${style.tok}, ${mood.tok}, ${cam.tok}, ${light.tok} --ar ${
    fmt.id === "reel" ? "9:16" : fmt.id === "sq" ? "1:1" : fmt.id === "scope" ? "21:9" : "16:9"
  } --style raw --v 6`;

  const negative = [...NEG_BASE, ...(style.id === "cine" ? ["cartoon", "video-game render"] : []), ...(audio.id === "silent" ? [] : ["muffled audio"])].join(", ");

  built = [
    { key: "master", label: "البرومبت الرئيسي", code: "master prompt", text: master },
    { key: "json", label: "نسخة JSON", code: "structured json", text: json },
    { key: "shots", label: "سلسلة البلانات", code: "3-shot sequence", text: shots },
    { key: "still", label: "صورة / Midjourney", code: "still image", text: mjPrompt },
    { key: "neg", label: "برومبت سلبي", code: "negative prompt", text: negative },
  ];
  activeTab = 0;
}

/* ------------------------------- view ------------------------------- */

const app = document.getElementById("app")!;

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function render() {
  const ready = cleanIdea().length >= 6;

  app.innerHTML = `
    <header class="masthead">
      <i class="rec"></i><span class="wordmark">Video Prompt Studio</span>
    </header>

    <h1>فكرتك سطر واحد.<br />البرومبت كيخرج <em>احترافي</em>.</h1>
    <p class="lede">كتب فكرة الفيديو بالدارجة ولا بالعربية، ختار الستايل والكاميرا والضو — وخد برومبت مهيكل بلغة السينما جاهز للصق فـ Veo، Sora، Runway، Kling ولا Midjourney.</p>

    <div class="workbench">
      <div class="in-col">
        <section class="panel">
          <div class="field-label"><b>فكرة الفيديو</b><span>your idea</span></div>
          <textarea id="idea" placeholder="مثال: بنت كتقرا كتاب فقهوة قديمة والضو داخل من الشرجم…">${esc(idea)}</textarea>
          <p class="hint">أفكار جاهزة للتجربة:</p>
          <div class="chips wrap" id="presets">
            ${PRESETS.map((p, i) => `<button class="chip ghost" data-preset="${i}">${p.ar}</button>`).join("")}
          </div>
        </section>

        <section class="panel rack">
          ${GROUPS.map(
            (g) => `
            <div class="rack-head"><b>${g.ar}</b><i>${g.code}</i></div>
            <div class="chips" role="group" aria-label="${g.ar}">
              ${g.opts
                .map(
                  (o) =>
                    `<button class="chip" role="button" aria-pressed="${sel[g.key] === o.id}" data-g="${g.key}" data-o="${o.id}">${o.ar}<small>${o.en}</small></button>`,
                )
                .join("")}
            </div>`,
          ).join("")}
          <div class="rack-head"><b>كلمات احترافية</b><i>film lexicon</i></div>
          <p class="hint" style="margin-top:-4px">دوز عليها باش تزيدها لفكرتك:</p>
          <div class="chips wrap">
            ${LEXICON.map((l, i) => `<button class="chip ghost" data-lex="${i}">+ ${l.ar}<small>${l.en}</small></button>`).join("")}
          </div>
        </section>

        <button class="build" id="build" ${ready ? "" : "disabled"}>
          ${ready ? "صاوب البرومبت" : "كتب الفكرة عافاك"}
        </button>
      </div>

      <div class="out-col">
        <section class="panel">
          <div class="out-head"><h2>البرومبتات</h2></div>
          ${
            built
              ? `<div class="tabs" role="tablist">
                  ${built.map((b, i) => `<button class="tab" role="tab" aria-selected="${i === activeTab}" data-tab="${i}">${b.label}</button>`).join("")}
                 </div>
                 <div class="block reveal">
                   <div class="block-top">
                     <span>${built[activeTab].code}</span>
                     <button class="copy" id="copy">نسخ</button>
                   </div>
                   <pre id="out">${esc(built[activeTab].text)}</pre>
                 </div>
                 <div class="modelnote"><b>${pick("model").en}:</b> ${MODEL_NOTE[sel.model]}</div>`
              : `<div class="empty">
                   <b>هنا كيتبان البرومبت.</b>
                   من بعد ما تصاوب، غادي تلقى ٥ نسخ جاهزة للنسخ:
                   <ul>
                     <li>برومبت رئيسي مهيكل بلغة السينما</li>
                     <li>نسخة JSON للموديلات لي كتقبلها</li>
                     <li>سلسلة ٣ بلانات مع الاستمرارية</li>
                     <li>نسخة صورة ثابتة (Midjourney)</li>
                     <li>برومبت سلبي باش تحيد العيوب</li>
                   </ul>
                 </div>`
          }
        </section>
      </div>
    </div>

    <footer>
      كيخدم كامل داخل المتصفح ديالك — بلا حساب، بلا مفتاح API، وفكرتك ماكتمشي لحتى سيرفور.
    </footer>
  `;

  wire();
}

function wire() {
  const ta = document.getElementById("idea") as HTMLTextAreaElement | null;
  if (ta) {
    ta.addEventListener("input", () => {
      const wasReady = cleanIdea().length >= 6;
      idea = ta.value;
      const nowReady = cleanIdea().length >= 6;
      if (wasReady !== nowReady) {
        const b = document.getElementById("build") as HTMLButtonElement;
        b.disabled = !nowReady;
        b.textContent = nowReady ? "صاوب البرومبت" : "كتب الفكرة عافاك";
      }
    });
  }

  app.querySelectorAll<HTMLButtonElement>("[data-g]").forEach((el) =>
    el.addEventListener("click", () => {
      sel[el.dataset.g!] = el.dataset.o!;
      if (built) compile();
      render();
    }),
  );

  app.querySelectorAll<HTMLButtonElement>("[data-preset]").forEach((el) =>
    el.addEventListener("click", () => {
      const p = PRESETS[Number(el.dataset.preset)];
      idea = p.idea;
      Object.assign(sel, p.set);
      compile();
      render();
      document.querySelector(".out-col")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }),
  );

  app.querySelectorAll<HTMLButtonElement>("[data-lex]").forEach((el) =>
    el.addEventListener("click", () => {
      const l = LEXICON[Number(el.dataset.lex)];
      idea = (idea.trim() + (idea.trim() ? "، " : "") + l.ar).trim();
      if (built) compile();
      render();
      (document.getElementById("idea") as HTMLTextAreaElement)?.focus();
    }),
  );

  document.getElementById("build")?.addEventListener("click", () => {
    compile();
    render();
    document.querySelector(".out-col")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  app.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((el) =>
    el.addEventListener("click", () => {
      activeTab = Number(el.dataset.tab);
      render();
    }),
  );

  document.getElementById("copy")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const text = built ? built[activeTab].text : "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const pre = document.getElementById("out")!;
      const r = document.createRange();
      r.selectNodeContents(pre);
      const s = window.getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
    btn.textContent = "تنسخ ✓";
    btn.classList.add("done");
    setTimeout(() => {
      btn.textContent = "نسخ";
      btn.classList.remove("done");
    }, 1600);
  });
}

render();
