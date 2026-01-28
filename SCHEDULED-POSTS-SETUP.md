# 📅 Scheduled Blog Posts - Setup Guide

## ✅ Co bylo implementováno

Kompletní systém pro **automatické publikování blogových postů** v naplánovaný čas (stejně jako na Facebook/Instagram).

---

## 🎯 Jak to funguje

1. **Naplánuješ článek** v admin panelu (vyber datum + čas)
2. **Článek zůstane draft** až do naplánovaného času
3. **Každých 15 minut** běží automatický cron job
4. **Články s `scheduled_at <= NOW()`** se automaticky publikují
5. **Status se změní** z "Scheduled" → "Published"

---

## 📦 Co bylo vytvořeno

### 1. **Database Migration**
`supabase/migrations/20260125000000_add_scheduled_publishing.sql`

- Přidán sloupec `scheduled_at TIMESTAMPTZ` do `blog_posts` tabulky
- Index pro efektivní dotazování
- SQL funkce `auto_publish_scheduled_posts()` pro ruční spuštění

### 2. **Supabase Edge Function**
`supabase/functions/auto-publish-posts/index.ts`

- Edge Function která publikuje naplánované posty
- Volá se z GitHub Actions nebo ručně
- Security: Bearer token authentication

### 3. **GitHub Actions Workflow**
`.github/workflows/auto-publish-posts.yml`

- Běží každých 15 minut (`*/15 * * * *`)
- Volá Supabase Edge Function
- **ZDARMA** (GitHub Actions free tier: 2000 minut/měsíc)

### 4. **Admin UI Update**
`src/components/admin/AdminBlog.tsx`

- Přidán datetime picker pro `scheduled_at`
- Badge zobrazuje status: "Draft" / "Scheduled: DD.MM.YYYY HH:MM" / "Published"
- Logika: když nastavíš `scheduled_at`, nemůžeš zaškrtnout "Publish immediately"

---

## 🚀 Deployment Kroky

### Krok 1: Deploy Database Migration

```bash
# V Supabase Dashboard
# 1. Jdi na SQL Editor
# 2. Zkopíruj obsah: supabase/migrations/20260125000000_add_scheduled_publishing.sql
# 3. Spusť SQL
# 4. Ověř: SELECT * FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'scheduled_at';
```

**NEBO** použij Supabase CLI:

```bash
npx supabase db push
```

---

### Krok 2: Deploy Supabase Edge Function

```bash
# Instalace Supabase CLI (pokud nemáš)
npm install -g supabase

# Login do Supabase
npx supabase login

# Link projekt
npx supabase link --project-ref pxxfcphgmifhnjalixen

# Deploy edge function
npx supabase functions deploy auto-publish-posts
```

**Test funkce:**
```bash
# Manuální test
curl -X POST \
  "https://pxxfcphgmifhnjalixen.supabase.co/functions/v1/auto-publish-posts" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

---

### Krok 3: Nastavit GitHub Secrets

1. Jdi na GitHub repo: **Settings → Secrets and variables → Actions**
2. Přidej 2 secrets:

```
SUPABASE_URL=https://pxxfcphgmifhnjalixen.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUz...tvůj service role key...
```

**Kde najdeš service role key:**
- Supabase Dashboard → Project Settings → API
- Zkopíruj `service_role` key (ne `anon` key!)

---

### Krok 4: Push GitHub Actions Workflow

```bash
git add .github/workflows/auto-publish-posts.yml
git commit -m "Add auto-publish scheduled posts cron job"
git push origin main
```

**Ověření:**
- Jdi na GitHub repo → **Actions** tab
- Uvidíš workflow "Auto-publish Scheduled Blog Posts"
- Můžeš spustit ručně: **Run workflow** button

---

### Krok 5: Deploy Admin UI Update

```bash
git add src/components/admin/AdminBlog.tsx
git commit -m "Add scheduled publishing to blog admin"
git push origin main

# Deploy na Vercel (automaticky se nasadí)
# NEBO
npx vercel --prod
```

---

## 🧪 Testování

### Test 1: Vytvoř naplánovaný post

1. Jdi do admin panelu
2. Vytvoř nový blog článek
3. **Nastav "Schedule for later"** na např. `25.01.2026 18:30`
4. Klikni **Create Article**
5. Ověř že status je **"Scheduled: 25.01.2026 18:30"**

### Test 2: Ruční trigger publikování

V Supabase SQL Editoru:

```sql
-- Nastav scheduled_at na minulost (měl by se publikovat)
UPDATE blog_posts
SET scheduled_at = NOW() - INTERVAL '1 minute'
WHERE title = 'Tvůj testovací článek';

-- Spusť auto-publish funkci
SELECT auto_publish_scheduled_posts();

-- Ověř že se publikoval
SELECT id, title, is_published, scheduled_at, published_at
FROM blog_posts
WHERE title = 'Tvůj testovací článek';
```

### Test 3: GitHub Actions trigger

1. Jdi na GitHub repo → **Actions**
2. Vyber workflow **"Auto-publish Scheduled Blog Posts"**
3. Klikni **"Run workflow"** → **"Run workflow"**
4. Počkej 10-30 sekund
5. Ověř že job proběhl úspěšně (zelený checkmark)

---

## ⏰ Cron Schedule

**Aktuální nastavení:** Každých 15 minut

```yaml
schedule:
  - cron: '*/15 * * * *'
```

**Můžeš změnit na:**
- Každých 5 minut: `*/5 * * * *`
- Každou hodinu: `0 * * * *`
- Každých 30 minut: `*/30 * * * *`

**GitHub Actions limity (Free tier):**
- 2000 minut/měsíc zdarma
- Každých 15 min = 96 běhů/den = 2,880 běhů/měsíc
- Každý běh ~10-20 sekund = **~960 minut/měsíc** ✅ v pohodě!

---

## 💡 Jak používat v Admin UI

### Scénář 1: Publikovat HNED
1. Vytvoř článek
2. **Nenastav** "Schedule for later"
3. Zaškrtni **"Publish immediately"**
4. Článek se publikuje okamžitě ✅

### Scénář 2: Naplánovat na POZDĚJI
1. Vytvoř článek
2. **Nastav** "Schedule for later" na např. `30.01.2026 09:00`
3. Switch "Publish immediately" zmizí (nelze kombinovat)
4. Článek zůstane draft až do 30.01.2026 09:00
5. V 09:00 (±15 min) se automaticky publikuje ✅

### Scénář 3: Uložit jako DRAFT
1. Vytvoř článek
2. **Nenastav** "Schedule for later"
3. **Nezaškrtni** "Publish immediately"
4. Článek zůstane draft dokud ručně nepublikuješ ✅

---

## 🔧 Troubleshooting

### Problém: "Edge Function nenalezena"
**Řešení:**
```bash
npx supabase functions deploy auto-publish-posts
```

### Problém: "GitHub Actions selhává"
**Řešení:**
1. Ověř že secrets `SUPABASE_URL` a `SUPABASE_SERVICE_ROLE_KEY` jsou nastaveny
2. Zkontroluj GitHub Actions logs
3. Test edge funkce ručně přes curl

### Problém: "Články se nepublikují"
**Řešení:**
```sql
-- Zkontroluj naplánované posty
SELECT id, title, scheduled_at, is_published
FROM blog_posts
WHERE scheduled_at IS NOT NULL AND is_published = false;

-- Ruční publikování
SELECT auto_publish_scheduled_posts();
```

### Problém: "datetime-local picker nezobrazuje čas"
**Řešení:** To je normální - formát `datetime-local` funguje jen v moderních prohlížečích. Otestuj v Chrome/Edge.

---

## 🎉 Hotovo!

Teď máš plně funkční **scheduled blog posts** systém jako na FB/IG! 🚀

**Co to dělá:**
✅ Naplánuješ posty dopředu
✅ Automaticky se publikují v daný čas
✅ Žádné manuální zásahy potřeba
✅ 100% zdarma (GitHub Actions free tier)
✅ Spolehlivé a škálovatelné

---

## 📞 Potřebuješ pomoct?

1. Zkontroluj GitHub Actions logs
2. Zkontroluj Supabase Logs (Project → Logs)
3. Test edge funkci ručně přes curl
4. Spusť `SELECT auto_publish_scheduled_posts();` v SQL Editoru
