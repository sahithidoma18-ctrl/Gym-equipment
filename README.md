# GymPulse - Gym Equipment Availability Checker 🏋️‍♂️

A modern, responsive, full-stack Next.js web application designed to monitor real-time gym equipment availability, manage campus fitness center assets, and generate AI-driven maintenance insights powered by Google Gemini.

---

## 🚀 Key Features

- **Real-Time Equipment Monitoring**:
  - Live availability dashboard tracking total, available, in-use, under-maintenance, and out-of-service machines.
  - Dynamic availability percentage calculations.
- **Zero-Setup Local Storage Architecture (No External Database Required)**:
  - 100% persistent data storage in browser `localStorage`.
  - Seamless multi-tab real-time reactivity using Custom Storage Events & the browser `storage` API.
  - Pre-seeded with 10 realistic campus gym equipment items across Strength, Cardio, Free Weights, and Functional zones.
  - One-click "Reset to Default Data" button in the navigation bar.
- **Role-Based Admin Management**:
  - Member view: View live status, filter by categories, search machines, inspect maintenance history, and export records.
  - Admin view: Protected by PIN/passcode authentication (`admin123`). Admins can add, edit, change status, and delete equipment records with confirmation modals.
- **Google Gemini AI Insights**:
  - Server-side analysis via `/api/ai/insights` using `@google/generative-ai`.
  - Generates equipment health summaries, maintenance urgency priorities, high-demand category observations, and utilization recommendations.
- **Analytics & Visualizations**:
  - Interactive status distribution pie chart and category breakdown bar chart built with Recharts.
- **Data Exporting**:
  - Instant CSV export with equipment name, category, status, location, and maintenance logs.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom sleek dark gym aesthetic
- **Icons**: Lucide React
- **Charts**: Recharts
- **Persistence**: Browser `localStorage` (No Supabase dependency)
- **AI**: Google Gemini API (`gemini-1.5-flash`)
- **Validation**: Zod

---

## 📋 Getting Started

### 1. Prerequisites
Ensure you have Node.js 18+ installed on your computer.

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Google Gemini API key:
```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
> Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔐 Admin Passcode
To test adding, editing, or deleting equipment:
1. Click **Admin Login** in the top navigation bar.
2. Enter the default admin PIN:
   ```text
   admin123
   ```
3. You now have full management privileges. Click **Exit Admin** at any time to return to the public member view.

---

## 💾 Local Storage Architecture

The application replaces external database configurations (such as Supabase) with a robust browser `localStorage` repository located at [`src/lib/storage.ts`](src/lib/storage.ts):

| Storage Key | Purpose |
|---|---|
| `gym_equipment_inventory_v1` | Stores the complete array of equipment items, status history, and maintenance notes |
| `gym_admin_auth_v1` | Persists the administrator session status (`true` / `false`) |

All modifications emit a `gym-equipment-updated` CustomEvent and trigger native `storage` events so multiple browser windows or tabs remain in sync without needing a page refresh.
