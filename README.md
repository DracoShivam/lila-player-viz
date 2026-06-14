# LILA Games — Player Journey Visualization Tool

**Live Demo**: [https://lila-player-viz-ten.vercel.app/](https://lila-player-viz-ten.vercel.app/)

A high-performance, interactive, static-first dashboard built to visualize player movements, combat loops, looting patterns, and spatial densities across three distinct maps (AmbroseValley, GrandRift, and Lockdown).

This visualization tool helps level designers and game developers identify combat hotspots, unexplored map areas, bot behaviors, and map imbalances.

---

## 🛠️ Tech Stack

*   **Frontend Core**: Next.js 16 (App Router with Turbopack), React 19, TypeScript
*   **State Management**: Zustand
*   **Rendering Layer**: HTML5 Canvas (for fast drawing of paths and markers)
*   **Heatmap Rendering**: `simpleheat` (canvas-based spatial density)
*   **Client-Side Parquet Parser**: `hyparquet` (pure JS Parquet reader for custom files)
*   **Styling**: Tailwind CSS + Custom CSS (cyberpunk dark palette with glassmorphism)
*   **Data Pipeline**: Python 3.10+, pandas, PyArrow (converts raw logs to compressed JSON)

---

## 🔑 Environment Variables

This application is **static-first and runs entirely on the client side**. 
*   No environment variables (`.env`) or secret keys are required to run the dashboard locally or deploy it to production (e.g. Vercel).
*   All assets and JSON databases are served directly from the public directory.

---

## 🚀 Key Features

*   **Interactive Playback Controls**: Full timeline playback with Play/Pause, speed adjustment (1x, 2x, 4x, 8x), and scrubbing capabilities.
*   **Coordinate-Accurate Rendering**: Translates 3D game coordinates to pixel coordinates on customized $1024 \times 1024$ minimap backgrounds.
*   **Visual Player Paths**: Distinguishes active human paths (solid cyan lines) from bot trajectories (dashed orange lines).
*   **Event Marker Overlay**: Pinpoints critical in-game events on the fly:
    *   ♦️ **Kills** (Red Diamonds)
    *   ✖️ **Deaths** (White Xs)
    *   🟡 **Loot opened** (Gold Circles)
    *   ▲ **Storm deaths** (Purple Triangles)
*   **Dynamic Heatmaps**: Overlays aggregated Kills, Deaths, and Traffic heatmaps with adjustable gradient themes.
*   **Responsive Sidebars & Filters**: Filter matches instantly by Map, Dates, and search/select specific Match IDs.
*   **Level Design File Upload**: Drag-and-drop raw player `.parquet` logs directly into the visualizer to parse and render custom sessions in real-time.

---

## 📂 Project Structure

```
lila-player-viz/
├── ARCHITECTURE.md          # System design, coordinate mapping, and technical decisions
├── INSIGHTS.md              # Data-driven level design insights backed by stats
├── README.md                # This file (user guide and setup instructions)
├── package.json             # Node.js dependencies and scripts
├── public/                  # Static assets and pre-processed JSON data
│   ├── maps/                # AmbroseValley.png, GrandRift.png, Lockdown.png
│   └── data/                # matches_index.json, aggregates.json, matches/*.json
├── scripts/                 # Data pipelines
│   ├── process_data.py      # Python ETL pipeline (Parquet -> JSON)
│   ├── resize_minimaps.py   # Map resizing script
│   └── debug_data.py        # Pipeline debugging/diagnostics utility
├── src/
│   ├── app/                 # Next.js pages and CSS configuration
│   ├── components/          # Dashboard components (MapCanvas, FilterPanel, TimelineSlider, etc.)
│   ├── hooks/           # useMatchData custom react hooks
│   └── lib/                 # Zustand store and types
```

---

## 🛠️ Getting Started & Setup

### 1. Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Python 3.10+](https://www.python.org/) with `pip`

### 2. Python ETL Data Pipeline
To regenerate the coordinate-mapped match JSON files from the raw Parquet files:
1. Install the python dependencies:
   ```bash
   pip install pandas pyarrow
   ```
2. Run the processing pipeline:
   ```bash
   python scripts/process_data.py
   ```
This reads the raw files from `player_data/` (located in the parent directory), performs coordinate mapping and bot detection, and outputs static JSONs to `public/data/`.

### 3. Running the Visualizer Dashboard
1. Install Node dependencies:
   ```bash
   npm install
   ```
2. Run the local development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your web browser to explore the visualizer.

### 4. Building for Production
To build the static Next.js production bundle:
```bash
npm run build
```

---

## 📈 Visual Walkthrough

1.  **Select a Map**: Choose between *AmbroseValley*, *GrandRift*, or *Lockdown* using the top filter buttons.
2.  **Filter by Date**: Multi-select dates to display matches played on specific days.
3.  **Choose a Match**: Scroll through the *Matches* list in the sidebar. The metadata cards display the match duration, human/bot counts, and dates.
4.  **Control the Timeline**: Click the **Play** button at the bottom of the screen to watch players navigate the map. You can speed up the playhead using the speed selector ($1x, 2x, 4x, 8x$) or drag the slider directly.
5.  **Toggle Layers**: Use the *Layers* checkboxes to toggle human/bot visibility, paths, or activate the **Heatmap Overlay** (Kills, Deaths, or Traffic).
