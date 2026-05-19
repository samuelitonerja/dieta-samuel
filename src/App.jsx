import { useState, useMemo } from "react";

// ─── DATOS NUTRICIONALES POR 100g ───────────────────────────────────────────
const PROTEINAS_DATA = [
  { id: "pollo",     name: "Pechuga de pollo",        emoji: "🍗", kcal: 165, p: 31, g: 3.6, c: 0 },
  { id: "salmon",    name: "Salmón fresco",            emoji: "🐟", kcal: 208, p: 20, g: 13,  c: 0 },
  { id: "merluza",   name: "Merluza",                  emoji: "🐠", kcal: 80,  p: 17, g: 1.5, c: 0 },
  { id: "ternera_m", name: "Ternera molida 5%",        emoji: "🥩", kcal: 137, p: 21, g: 5,   c: 0 },
  { id: "ternera_f", name: "Filete de ternera",        emoji: "🥩", kcal: 150, p: 22, g: 6,   c: 0 },
  { id: "pavo",      name: "Pechuga de pavo",          emoji: "🦃", kcal: 135, p: 29, g: 1.5, c: 0 },
  { id: "lomo",      name: "Lomo embuchado",           emoji: "🍖", kcal: 175, p: 29, g: 6,   c: 0 },
  { id: "emb_pavo",  name: "Embutido pavo 93%",        emoji: "🥪", kcal: 100, p: 19, g: 2,   c: 1 },
  { id: "atun",      name: "Atún en conserva (agua)",  emoji: "🐡", kcal: 116, p: 26, g: 1,   c: 0 },
];

const HIDRATOS_DATA = [
  { id: "arroz",       name: "Arroz blanco",                  emoji: "🍚", kcal: 360, p: 7,   g: 0.5, c: 80,  unit: "g seco",   base: 80  },
  { id: "pasta",       name: "Pasta",                         emoji: "🍝", kcal: 360, p: 12,  g: 1.5, c: 72,  unit: "g seco",   base: 75  },
  { id: "gnocchi",     name: "Ñoquis Hacendado",              emoji: "🫙", kcal: 174, p: 4.5, g: 0.4, c: 37,  unit: "g",        base: 170 },
  { id: "tort_nat",    name: "Tortitas maíz Hacendado natural",emoji: "🌽", kcal: 367, p: 7.5, g: 1.8, c: 80,  unit: "g",        base: 82  },
  { id: "tort_jamon",  name: "Tortitas maíz sabor jamón",     emoji: "🌽", kcal: 417, p: 8,   g: 5,   c: 80,  unit: "g",        base: 72  },
  { id: "bicentury",   name: "Bicentury tomate (9.5g/ud)",    emoji: "🍅", kcal: 460, p: 6,   g: 14,  c: 72,  unit: "g",        base: 65  },
  { id: "fajita",      name: "Fajitas pequeñas Hacendado",    emoji: "🫓", kcal: 287, p: 8,   g: 5,   c: 55,  unit: "g (2 uds)",base: 120 },
  { id: "fajita_av",   name: "Fajitas avena 51% Hacendado",   emoji: "🫓", kcal: 287, p: 15,  g: 6,   c: 40,  unit: "g (2 uds)",base: 120 },
  { id: "centeno",     name: "Pan centeno 51% Mercadona",     emoji: "🍞", kcal: 262, p: 9,   g: 2,   c: 50,  unit: "g",        base: 115 },
  { id: "cereales",    name: "Pan 12 cereales Hacendado",     emoji: "🍞", kcal: 263, p: 10,  g: 4,   c: 47,  unit: "g",        base: 114 },
  { id: "patata",      name: "Patata cocida",                 emoji: "🥔", kcal: 77,  p: 2,   g: 0.1, c: 17,  unit: "g",        base: 390 },
  { id: "boniato",     name: "Boniato cocido",                emoji: "🍠", kcal: 86,  p: 1.6, g: 0.1, c: 20,  unit: "g",        base: 349 },
  { id: "avena",       name: "Avena en copos",                emoji: "🌾", kcal: 370, p: 13,  g: 7,   c: 63,  unit: "g seco",   base: 81  },
  { id: "legumbres",   name: "Legumbres cocidas (garbanzos)", emoji: "🫘", kcal: 164, p: 9,   g: 2.6, c: 27,  unit: "g",        base: 183 },
];

const GRASAS_DATA = [
  { id: "aove",      name: "Aceite de oliva virgen extra", emoji: "🫒", kcal: 900, p: 0, g: 100, c: 0 },
  { id: "aguacate",  name: "Aguacate",                    emoji: "🥑", kcal: 160, p: 2, g: 15,  c: 9  },
  { id: "nueces",    name: "Nueces",                      emoji: "🥜", kcal: 654, p: 15, g: 65, c: 14 },
  { id: "almendras", name: "Almendras",                   emoji: "🌰", kcal: 579, p: 21, g: 50, c: 22 },
  { id: "hummus",    name: "Hummus",                      emoji: "🫙", kcal: 177, p: 5, g: 10,  c: 17 },
];

const VERDURAS_DATA = [
  { id: "cherry",    name: "Tomate cherry",    emoji: "🍅", kcal: 18,  p: 0.9, g: 0.2, c: 3.5, base: 150 },
  { id: "cebolla",   name: "Cebolla",          emoji: "🧅", kcal: 40,  p: 1.1, g: 0.1, c: 9,   base: 100 },
  { id: "lechuga",   name: "Lechuga",          emoji: "🥬", kcal: 15,  p: 1.4, g: 0.2, c: 2.3, base: 150 },
  { id: "esparragos",name: "Espárragos",       emoji: "🌿", kcal: 20,  p: 2.2, g: 0.1, c: 3.7, base: 150 },
  { id: "champis",   name: "Champiñones",      emoji: "🍄", kcal: 22,  p: 3.1, g: 0.3, c: 3.3, base: 150 },
  { id: "judias",    name: "Judías verdes",    emoji: "🫛", kcal: 31,  p: 1.8, g: 0.1, c: 7,   base: 150 },
  { id: "brocoli",   name: "Brócoli",          emoji: "🥦", kcal: 34,  p: 2.8, g: 0.4, c: 7,   base: 150 },
  { id: "calabacin", name: "Calabacín",        emoji: "🥒", kcal: 17,  p: 1.2, g: 0.3, c: 3.1, base: 200 },
];

// Postre fijo de cena
const POSTRE_CENA = { name: "Yogur griego 0% + miel + cornflakes", kcal: 220, p: 14, g: 1, c: 38 };

// OBJETIVOS DIARIOS
const OBJETIVO = { kcal: 2000, p: 160, g: 80, c: 160 };
// Por comida (distribución orientativa): desayuno 25%, almuerzo 40%, cena 35%
const DIST = {
  desayuno: { kcal: 500, p: 40, g: 20, c: 40 },
  almuerzo: { kcal: 800, p: 65, g: 32, c: 64 },
  cena:     { kcal: 700 - POSTRE_CENA.kcal, p: 55 - POSTRE_CENA.p, g: 28 - POSTRE_CENA.g, c: 56 - POSTRE_CENA.c },
};

// ─── CÁLCULO INTELIGENTE ─────────────────────────────────────────────────────
function calcRacion(item, targetP) {
  // Gramos necesarios para alcanzar la proteína objetivo de esa comida
  const gramos = Math.round((targetP / item.p) * 100);
  return gramos;
}

function calcHidratoRacion(item, targetC) {
  const gramos = Math.round((targetC / item.c) * 100);
  return gramos;
}

function calcGrasaRestante(targetG, protG, hidG) {
  return Math.max(0, targetG - protG - hidG);
}

function calcGrasaAlimento(item, neededG) {
  if (item.g === 0) return 0;
  return Math.round((neededG / item.g) * 100);
}

// ─── COMPONENTES ─────────────────────────────────────────────────────────────
const COLORS = {
  prot:  { bg: "#e8f5e9", border: "#4caf50", accent: "#2e7d32", light: "#c8e6c9" },
  hidro: { bg: "#fff3e0", border: "#ff9800", accent: "#e65100", light: "#ffe0b2" },
  grasa: { bg: "#fce4ec", border: "#e91e63", accent: "#880e4f", light: "#f8bbd0" },
  veg:   { bg: "#e3f2fd", border: "#2196f3", accent: "#0d47a1", light: "#bbdefb" },
};

function BlockTitle({ emoji, label, color }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
      fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13,
      color: color.accent, textTransform: "uppercase", letterSpacing: 1.5,
    }}>
      <span style={{ fontSize: 18 }}>{emoji}</span>
      {label}
    </div>
  );
}

function Chip({ item, selected, onSelect, color, subtitle }) {
  return (
    <button onClick={onSelect} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      width: "100%", padding: "10px 14px", marginBottom: 7,
      borderRadius: 12, border: `2px solid ${selected ? color.border : "#e8e8e8"}`,
      background: selected ? color.bg : "#fafafa",
      cursor: "pointer", transition: "all 0.15s ease",
      boxShadow: selected ? `0 2px 12px ${color.border}33` : "none",
      textAlign: "left",
    }}>
      <div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
          color: selected ? color.accent : "#333",
        }}>
          {item.emoji} {item.name}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: "#888", marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{
        background: selected ? color.accent : "#ddd",
        color: "white", borderRadius: 20, padding: "3px 10px",
        fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
        whiteSpace: "nowrap", marginLeft: 8,
      }}>
        {item.kcal} kcal/100g
      </div>
    </button>
  );
}

function MacroCircle({ label, value, target, color, unit = "g" }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const r = 22; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={54} height={54}>
        <circle cx={27} cy={27} r={r} fill="none" stroke="#eee" strokeWidth={4} />
        <circle cx={27} cy={27} r={r} fill="none" stroke={color}
          strokeWidth={4} strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round" transform="rotate(-90 27 27)" />
        <text x={27} y={31} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
          {Math.round(value)}{unit}
        </text>
      </svg>
      <span style={{ fontSize: 10, color: "#888", fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>
        {label}<br /><span style={{ color: "#bbb" }}>/{target}{unit}</span>
      </span>
    </div>
  );
}

function MealCard({ title, emoji, colorKey, dist, children, totalMacros }) {
  const c = COLORS[colorKey] || COLORS.prot;
  return (
    <div style={{
      background: "white", borderRadius: 20, marginBottom: 16, overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${c.accent} 0%, ${c.border} 100%)`,
        padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18, color: "white",
          }}>{emoji} {title}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif" }}>
            Objetivo: ~{dist.kcal + (title === "Cena" ? POSTRE_CENA.kcal : 0)} kcal
          </div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "6px 14px",
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "white",
        }}>
          {Math.round(totalMacros.kcal)} kcal
        </div>
      </div>
      <div style={{ padding: "16px 16px 8px" }}>{children}</div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [sel, setSel] = useState({
    desayuno: { prot: null, hidro: null, grasa: null, veg: null },
    almuerzo: { prot: null, hidro: null, grasa: null, veg: null },
    cena:     { prot: null, hidro: null, grasa: null, veg: null },
  });

  const pick = (comida, bloque, id) => {
    setSel(prev => ({
      ...prev,
      [comida]: {
        ...prev[comida],
        [bloque]: prev[comida][bloque] === id ? null : id,
      },
    }));
  };

  // Calcula macros de una comida
  const calcComida = (comida) => {
    const s = sel[comida];
    const dist = DIST[comida];

    const prot = PROTEINAS_DATA.find(x => x.id === s.prot);
    const hidro = HIDRATOS_DATA.find(x => x.id === s.hidro);
    const grasa = GRASAS_DATA.find(x => x.id === s.grasa);
    const veg = VERDURAS_DATA.find(x => x.id === s.veg);

    let protG = 0, protKcal = 0, protGramos = 0;
    let hidG = 0, hidKcal = 0, hidGramos = 0;
    let grasaG = 0, grasaKcal = 0, grasaGramos = 0;
    let vegKcal = 0, vegGramos = 0;

    if (prot) {
      protGramos = calcRacion(prot, dist.p);
      protG = (prot.g * protGramos) / 100;
      protKcal = (prot.kcal * protGramos) / 100;
    }
    if (hidro) {
      hidGramos = calcHidratoRacion(hidro, dist.c);
      hidG = (hidro.g * hidGramos) / 100;
      hidKcal = (hidro.kcal * hidGramos) / 100;
    }
    if (veg) {
      vegGramos = veg.base;
      vegKcal = (veg.kcal * vegGramos) / 100;
    }

    // Grasas restantes después de prot e hidro
    const grasaNecesaria = calcGrasaRestante(dist.g, protG, hidG);
    let grasaDisplay = null;

    if (grasa) {
      grasaGramos = calcGrasaAlimento(grasa, grasaNecesaria);
      grasaG = (grasa.g * grasaGramos) / 100;
      grasaKcal = (grasa.kcal * grasaGramos) / 100;
      grasaDisplay = { gramos: grasaGramos, kcal: grasaKcal, necesaria: grasaNecesaria };
    }

    const totalKcal = protKcal + hidKcal + grasaKcal + vegKcal;
    const totalP = prot ? (prot.p * protGramos) / 100 : 0;
    const totalC = hidro ? (hidro.c * hidGramos) / 100 : 0;

    return {
      protGramos, hidGramos, grasaDisplay, vegGramos, grasaNecesaria,
      kcal: totalKcal, p: totalP, g: grasaG, c: totalC,
    };
  };

  const desayunoCalc = useMemo(() => calcComida("desayuno"), [sel.desayuno]);
  const almuerzoCalc = useMemo(() => calcComida("almuerzo"), [sel.almuerzo]);
  const cenaCalc     = useMemo(() => calcComida("cena"),     [sel.cena]);

  const totalKcal = desayunoCalc.kcal + almuerzoCalc.kcal + cenaCalc.kcal + POSTRE_CENA.kcal;
  const totalP    = desayunoCalc.p + almuerzoCalc.p + cenaCalc.p + POSTRE_CENA.p;
  const totalG    = desayunoCalc.g + almuerzoCalc.g + cenaCalc.g + POSTRE_CENA.g;
  const totalC    = desayunoCalc.c + almuerzoCalc.c + cenaCalc.c + POSTRE_CENA.c;

  const barColor = Math.abs(totalKcal - OBJETIVO.kcal) < 100 ? "#4caf50"
    : Math.abs(totalKcal - OBJETIVO.kcal) < 250 ? "#ff9800" : "#f44336";

  function ComidaBlocks({ comida, calc, dist }) {
    const s = sel[comida];
    const grasaNec = calc.grasaNecesaria;

    return (
      <>
        {/* PROTEÍNA */}
        <BlockTitle emoji="🥩" label="Proteína — elige una" color={COLORS.prot} />
        {PROTEINAS_DATA.map(item => {
          const gr = calcRacion(item, dist.p);
          return (
            <Chip key={item.id} item={item} selected={s.prot === item.id}
              onSelect={() => pick(comida, "prot", item.id)} color={COLORS.prot}
              subtitle={`${gr}g · ${Math.round((item.kcal * gr) / 100)} kcal · ${Math.round((item.p * gr) / 100)}g prot · grasa propia: ${Math.round((item.g * gr) / 100)}g`}
            />
          );
        })}

        <div style={{ height: 12 }} />

        {/* HIDRATO */}
        <BlockTitle emoji="🍚" label="Hidrato — elige uno" color={COLORS.hidro} />
        {HIDRATOS_DATA.map(item => {
          const gr = calcHidratoRacion(item, dist.c);
          // Unidades legibles
          let display = `${gr}g`;
          if (item.id === "tort_nat")   display = `${Math.round(gr / 7.5)} tortitas (${gr}g)`;
          if (item.id === "tort_jamon") display = `${Math.round(gr / 8.75)} tortitas (${gr}g)`;
          if (item.id === "bicentury")  display = `${Math.round(gr / 9.5)} tortitas (${gr}g)`;
          if (item.id === "fajita" || item.id === "fajita_av") display = `${Math.round(gr / 60)} fajitas (${gr}g)`;
          if (item.id === "centeno" || item.id === "cereales")  display = `${Math.round(gr / 43)} rebanadas (${gr}g)`;
          return (
            <Chip key={item.id} item={item} selected={s.hidro === item.id}
              onSelect={() => pick(comida, "hidro", item.id)} color={COLORS.hidro}
              subtitle={`${display} · ${Math.round((item.kcal * gr) / 100)} kcal · ${Math.round((item.c * gr) / 100)}g HC`}
            />
          );
        })}

        <div style={{ height: 12 }} />

        {/* GRASA INTELIGENTE */}
        <BlockTitle emoji="🫒" label="Grasa saludable — elige una" color={COLORS.grasa} />
        <div style={{
          background: "#fce4ec", border: "1px solid #f8bbd0", borderRadius: 10,
          padding: "8px 12px", marginBottom: 10, fontSize: 12,
          fontFamily: "'DM Sans', sans-serif", color: "#880e4f",
        }}>
          {s.prot && s.hidro
            ? `⚡ Con tu proteína+hidrato, te quedan ~${Math.round(grasaNec)}g de grasa por añadir`
            : "Elige proteína e hidrato para ver cuánta grasa necesitas"}
        </div>
        {GRASAS_DATA.map(item => {
          const gr = calcGrasaAlimento(item, grasaNec);
          let display = `${gr}g`;
          if (item.id === "aove") display = `${Math.round(gr / 14 * 10) / 10} cucharadas (${gr}g)`;
          if (item.id === "aguacate") display = `${gr}g (~${Math.round(gr / 150 * 100)}% aguacate mediano)`;
          return (
            <Chip key={item.id} item={item} selected={s.grasa === item.id}
              onSelect={() => pick(comida, "grasa", item.id)} color={COLORS.grasa}
              subtitle={s.prot && s.hidro
                ? `${display} · ${Math.round((item.kcal * gr) / 100)} kcal · ${Math.round(grasaNec)}g grasa`
                : "Selecciona proteína e hidrato primero"}
            />
          );
        })}

        <div style={{ height: 12 }} />

        {/* VERDURAS */}
        <BlockTitle emoji="🥗" label="Verdura — elige una" color={COLORS.veg} />
        {VERDURAS_DATA.map(item => (
          <Chip key={item.id} item={item} selected={s.veg === item.id}
            onSelect={() => pick(comida, "veg", item.id)} color={COLORS.veg}
            subtitle={`${item.base}g · ${Math.round((item.kcal * item.base) / 100)} kcal`}
          />
        ))}
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f2f5; }
        button { background: none; outline: none; font-family: inherit; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", paddingBottom: 100 }}>

        {/* HEADER STICKY */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "#0f0f14",
          padding: "16px 18px 14px",
          boxShadow: "0 4px 30px rgba(0,0,0,0.4)",
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20,
            color: "white", letterSpacing: -0.5, marginBottom: 2,
          }}>
            🍽️ Dieta Samuel
          </div>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
            160g P · 80g G · 160g HC · 2000 kcal
          </div>

          {/* Barra kcal */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 26,
              color: barColor,
            }}>{Math.round(totalKcal)}</span>
            <span style={{ color: "#444", fontSize: 13, alignSelf: "flex-end", fontFamily: "'DM Sans', sans-serif" }}>
              / 2000 kcal
            </span>
          </div>
          <div style={{ background: "#1e1e28", borderRadius: 8, height: 8, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              width: `${Math.min(100, (totalKcal / 2000) * 100)}%`,
              height: "100%", background: barColor, borderRadius: 8, transition: "all 0.4s",
            }} />
          </div>

          {/* Macros circulares */}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <MacroCircle label="Proteína" value={totalP} target={160} color="#4caf50" />
            <MacroCircle label="Grasa"    value={totalG} target={80}  color="#e91e63" />
            <MacroCircle label="Hidratos" value={totalC} target={160} color="#ff9800" />
            <MacroCircle label="Kcal" value={totalKcal} target={2000} color={barColor} unit="" />
          </div>
        </div>

        <div style={{ padding: "16px 14px 0" }}>

          {/* DESAYUNO */}
          <MealCard title="Desayuno" emoji="🌅" colorKey="prot" dist={DIST.desayuno} totalMacros={desayunoCalc}>
            <ComidaBlocks comida="desayuno" calc={desayunoCalc} dist={DIST.desayuno} />
          </MealCard>

          {/* ALMUERZO */}
          <MealCard title="Almuerzo" emoji="☀️" colorKey="hidro" dist={DIST.almuerzo} totalMacros={almuerzoCalc}>
            <ComidaBlocks comida="almuerzo" calc={almuerzoCalc} dist={DIST.almuerzo} />
          </MealCard>

          {/* CENA */}
          <MealCard title="Cena" emoji="🌙" colorKey="grasa" dist={DIST.cena} totalMacros={{ kcal: cenaCalc.kcal + POSTRE_CENA.kcal }}>
            <ComidaBlocks comida="cena" calc={cenaCalc} dist={DIST.cena} />

            {/* Postre fijo */}
            <div style={{ height: 12 }} />
            <div style={{
              background: "linear-gradient(135deg, #1a237e, #283593)",
              borderRadius: 14, padding: "14px 16px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "white", fontSize: 14,
                }}>🍯 Postre fijo</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>
                  Yogur griego 0% + miel + cornflakes
                </div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "6px 12px",
                fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "white", fontSize: 16,
              }}>
                {POSTRE_CENA.kcal} kcal
              </div>
            </div>
          </MealCard>

        </div>
      </div>
    </>
  );
}
