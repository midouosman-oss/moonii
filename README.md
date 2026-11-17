# moonii

Moonii is a cycle-aware wellbeing app built with Expo, React Native and TypeScript.

## Included in this build

- Eight-step onboarding questionnaire with 17 interface languages.
- Cycle-day and phase estimates based on the last period start date.
- Home dashboard with daily insight and phase-aware wellbeing suggestions.
- Daily log for mood, energy, sleep, movement, nourishment, symptoms and notes.
- Local persistence for settings and daily logs using AsyncStorage.
- Supabase email authentication and onboarding-response storage.
- Localized country names and translated recommendation library.

## Requirements

- Node.js (LTS recommended)
- A Supabase project
- Expo Go for device testing, or an Android/iOS simulator

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   ```

   Use the project's publishable/anon key only. Never put a Supabase service-role key in the app.

3. In the Supabase project, open **SQL Editor** and run `supabase/schema.sql`. This creates the `user_onboarding` table and enables row-level security so each signed-in user can access only their own onboarding response.

4. In Supabase Authentication settings, configure the email sign-up and email-confirmation behavior required by the client.

5. Start the app:

   ```bash
   npx expo start
   ```

   For web:

   ```bash
   npx expo start --web
   ```

   After changing environment variables, restart Expo and clear the Metro cache if needed:

   ```bash
   npx expo start -c
   ```

## Validation

Run these before handing off a build:

```bash
npx tsc --noEmit
npx expo-doctor
```

## Current integration boundaries

- Email/password authentication is connected through Supabase.
- Google and Apple sign-in buttons are present in the interface but are not connected to OAuth providers yet; the app reports that these methods are unavailable.
- The notification preference is collected and stored with onboarding responses, but push notifications are not scheduled yet.
- The cycle calculation currently uses the default 28-day cycle and 5-day period unless those settings are changed in stored profile data. It is an estimate, not a medical prediction.
- Daily logs and core cycle settings are stored on the device. Onboarding questionnaire responses are also sent to the Supabase `user_onboarding` table.
- The app currently uses a typed date field (DD/MM/YYYY), not a native date picker.

## Data handling

The app stores cycle settings and daily logs in local device storage. The onboarding questionnaire response is synced to the signed-in user's Supabase row. Row-level security is enabled by the SQL setup above.

