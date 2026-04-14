# Bilingual Dashboard Progress (English/Swahili)

## Plan Steps:
- [ ] Create i18n: `src/i18n/en.json`, `sw.json`; `src/hooks/useI18n.tsx` provider/hook.
- [ ] Edit `src/App.tsx`: Add I18nProvider.
- [ ] Add lang selector to Index.tsx header (prompt choice).
- [ ] Translate Index.tsx, HeroSection, BottomNav, overlayTitles (EN/SW).
- [ ] Translate sections: PatientsSection, AlertsSection etc.
- [ ] Test: `bun dev`, switch lang.
- [ ] Deploy: `vercel --prod`.

Start with dashboard core (Index, Hero, BottomNav). Default English.

