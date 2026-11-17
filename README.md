# moonii

Cycle-aware wellness app. Onboarding → home dashboard, with real local
persistence (no backend required to run and click through it).

## What's in this build

- `app/onboarding.tsx` — the 8-step onboarding flow from the questionnaire
  (period date, help needs, conditions, dietary preferences, age range,
  location, notifications, sign-up)
- `app/index.tsx` — the home dashboard (cycle card, today's insight, today's
  plan, daily log)
- `context/CycleContext.tsx` — real cycle-phase calculation from the date
  you enter in onboarding, plus log storage. Everything is saved to the
  device with AsyncStorage, so it survives closing the app.
- First launch always goes to onboarding. After that, it opens straight to
  the dashboard.

## Not wired up yet (left as clearly marked TODOs in the code)

- Google / Apple sign-in only fake-succeeds right now — needs real SDK keys
  for your project
- No backend yet — `submitToBackend()` in `components/Onboarding.tsx` is a
  stub with a commented-out Supabase example ready to fill in
- Date and timezone pickers are plain text inputs, not native pickers
- Push notifications aren't scheduled — the opt-in step just stores your
  choice

## Run it

You need a computer with Node.js installed (this can't run from a phone
alone).

\`\`\`bash
npm install
npx expo start
\`\`\`

Then either:
- press `i` for the iOS simulator (Mac + Xcode only), or
- press `a` for an Android emulator (Android Studio), or
- scan the QR code with the **Expo Go** app on your phone
