# LILA Player Journey Visualizer — Level Design Insights

This document presents 3 core game and level design insights extracted from the analysis of 796 matches and 89,104 events in the LILA dataset.

---

## Insight 1: The Combat Loop is Heavily Bot-Driven

### What caught my eye:
When visualizing the matches on the map canvas and examining the event summary counts, the total absence of human-on-human combat becomes stark. The match player lists almost always consist of 1 human and 0 to 15 bots. The combat loop is almost entirely PvE (Player vs Environment/Bots) rather than PvP.

### Supporting evidence:
*   **Total Combat Events**: Out of **2,421 total kills** recorded across all 796 matches:
    *   **92.2% (2,232 kills)** were human players killing bots (`BotKill` by human).
    *   **7.6% (183 kills)** were bots killing bots or players.
    *   **Only 0.1% (3 kills)** were human-on-human kills (`Kill` by human).
*   **Contested Zones**: The heatmap shows that combat heavily clusters around the center compound on AmbroseValley (world coordinates $X \in [-33, 19]$, $Z \in [-30, 38]$), where bots spawn or wander in linear patterns, making them easy prey for human players.

### Actionable recommendation:
*   **Matchmaking & Lobby Sizes**: Increase human lobby density (e.g. from 1 active human per match to 10–20 humans) to foster human-on-human encounters.
*   **AI Difficulty & Trajectories**: Upgrade bot AI to engage in flanking maneuvers and cover-seeking behaviors, reducing their predictability when entering the central compound.
*   **Metrics affected**: Kill distribution entropy, player survival rate, player retention, average engagement distance.

### Why a level designer should care:
A multiplayer shooter that is 99% target practice against linear bots loses player tension rapidly. To build a compelling PvPvE experience, level designs must feature high-value chokepoints and extraction zones that actively funnel *human* players together, rather than scattering them across empty bot-filled spaces.

---

## Insight 2: Bots Have 34% Shorter Lifespans

### What caught my eye:
In the playback slider and data analysis, bot paths are short and terminate early. Bots are cleared out of the map rapidly in the first 4 minutes of a match, leaving the mid-to-late game desolate.

### Supporting evidence:
*   **Average Lifespans**:
    *   **Human Players**: Average match duration is **399.1 seconds** (~6.6 minutes).
    *   **Bot Players**: Average match duration is **262.9 seconds** (~4.4 minutes) — a **34% shorter survival time**.
*   **Distance Traveled**: Humans cover an average of **899 world units** per match, while bots only cover **707 world units**.
*   **Storm Deaths**: 39 storm deaths occurred in total (17 on AmbroseValley, 17 on Lockdown, 5 on GrandRift). These occurred primarily at the final stages of the timeline, showing that late-game danger exists, but bots rarely survive long enough to face the storm.

### Actionable recommendation:
*   **Dynamic Bot Spawning**: Instead of spawning all bots at the start of the match (leading to an early-game bloodbath), implement **wave-based reinforcements** or trigger bot spawns when human players enter specific sub-zones later in the match.
*   **Metrics affected**: Active player count over timeline, spatial occupancy rate, mid-game player engagement score.

### Why a level designer should care:
If all bots die in the first 4 minutes, the remaining 3–8 minutes of a match feel empty and lack tension. Level designers should coordinate with gameplay engineers to place "bot camps" or "patrol routes" that activate dynamically in the mid-game, maintaining a consistent threat level.

---

## Insight 3: Bots are Completely Excluded from Loot Dynamics

### What caught my eye:
When filtering events to show only loot chests opened, the map lights up with gold markers for human paths, but remains completely empty along bot trajectories. Bots wander past chests without interacting with them.

### Supporting evidence:
*   **Loot Box Chests Opened**:
    *   **Human Players**: Generated **12,770 loot events** (averaging **16.0 loot chests per match** per human).
    *   **Bot Players**: Generated only **115 loot events** across all 796 matches combined.
*   **Pathing Disconnect**: Overlaying the loot chest heatmap with bot paths reveals that bots frequently walk directly over or next to loot nodes but do not execute the "Loot" action.

### Actionable recommendation:
*   **Interactive Bot Pathing**: Program bots to identify nearby unopened loot chests and path toward them when out of combat.
*   **Contested Loot Hotspots**: Place high-tier loot chests inside fortified areas that bots are programmed to defend, forcing human players to fight bots to secure top-tier gear.
*   **Metrics affected**: Loot chest opening rate, bot gear progression, combat difficulty scaling.

### Why a level designer should care:
If bots do not loot, high-tier loot zones are completely uncontested unless another rare human player is nearby. Programming bots to loot makes resource gathering active, dangerous, and competitive.
