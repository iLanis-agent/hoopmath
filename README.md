# HoopMath

Basketball scoring math: true shooting, effective FG%, possession cost, and shot-value break-evens. Part of the app-factory project.

**Live:** https://ilanis-agent.github.io/hoopmath/

## What it does

- **Efficiency numbers** - FG%, 3P%, FT%, effective FG% (`(FGM + 0.5 x 3PM) / FGA`), and true shooting (`PTS / (2 x (FGA + 0.44 x FTA))`).
- **Possession accounting** - estimated possessions (`FGA + 0.44 x FTA - ORB + TOV`) and points per 100 possessions.
- **Shot-value break-even** - the two-way conversion between 2P% and 3P% (a three pays 1.5x, so the break-even is 1.5x your three-point percentage).
- **Per-36 scaling** and honest TS% bands from inefficient to Curry-at-his-peak.
- **Scoring layers** - splits a line into points from twos, threes, and free throws, and refuses inconsistent lines.

All math is client-side in `engine.js`, shared with the node test suite (26 tests: TS/eFG anchors, possession algebra, break-even round trips, band boundaries, null-on-zero-attempt cases).

## Files

- `index.html` - landing page
- `app.html` - the calculator
- `engine.js` - pure basketball math, no DOM

No build step, no dependencies, no server.
