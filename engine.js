/* HoopMath engine - basketball scoring math: efficiency, pace, break-even shot values.
   Pure math, no DOM. Shared by app.html and the node test suite. */
(function (root) {
  'use strict';

  var FT_POSSESSION_FACTOR = 0.44; // standard estimate: free throws end 44% as many possessions

  function safe(n) { return (typeof n === 'number' && isFinite(n)) ? n : null; }

  // Field goal, three-point and free-throw percentages. Null when no attempts.
  function fgPct(fgm, fga) { return fga > 0 ? safe(fgm / fga) : null; }
  function tpPct(tpm, fga3) { return fga3 > 0 ? safe(tpm / fga3) : null; }
  function ftPct(ftm, fta) { return fta > 0 ? safe(ftm / fta) : null; }

  // Effective FG%: threes count 50% more, folded into one number.
  function efgPct(fgm, tpm, fga) {
    if (!(fga > 0)) return null;
    return safe((fgm + 0.5 * tpm) / fga);
  }

  // True shooting: points per true shot attempt (FGA + 0.44 FTA).
  function tsPct(pts, fga, fta) {
    var tsa = 2 * (fga + FT_POSSESSION_FACTOR * fta);
    if (!(tsa > 0)) return null;
    return safe(pts / tsa);
  }

  // Per-36-minutes scaling so a 12-minute night stops lying about itself.
  function per36(stat, minutes) {
    if (!(minutes > 0)) return null;
    return safe(stat * 36 / minutes);
  }

  // Possessions used by one player's line (estimate).
  function possessions(fga, fta, orb, tov) {
    var p = fga + FT_POSSESSION_FACTOR * fta - orb + tov;
    return p >= 0 ? safe(p) : null;
  }

  // Offensive rating proxy: points per 100 estimated possessions.
  function offensiveRating(pts, poss) {
    if (!(poss > 0)) return null;
    return safe(100 * pts / poss);
  }

  // The break-even between a three and a two: threes pay 1.5x, so a 3P% of p
  // earns the same as a 2P% of 1.5p. Above that 2P%, take the two.
  function twoPtBreakEven(threePct) {
    if (!(threePct >= 0)) return null;
    return safe(threePct * 1.5);
  }

  // ...and the mirror: at a given 2P%, the 3P% you need to justify the three.
  function threePtBreakEven(twoPct) {
    if (!(twoPct >= 0)) return null;
    return safe(twoPct / 1.5);
  }

  // Honest TS% bands (NBA league average hovers around 0.57-0.58).
  function tsBand(ts) {
    if (!(ts > 0)) return null;
    if (ts < 0.50) return 'inefficient - the defense is winning this matchup';
    if (ts < 0.55) return 'below average - volume is hiding the cost';
    if (ts < 0.58) return 'league-average scorer';
    if (ts < 0.62) return 'efficient - a shot profile coaches draw up';
    if (ts < 0.67) return 'elite efficiency - all-star scoring shape';
    return 'absurd - Curry-at-his-peak territory';
  }

  // Points from each scoring layer.
  function scoringLayers(pts, ftm, tpm) {
    var fromFT = ftm;
    var from3 = 3 * tpm;
    var from2 = pts - fromFT - from3;
    if (from2 < 0) return null; // inconsistent line
    return { freeThrows: fromFT, threes: from3, twos: from2 };
  }

  var api = {
    FT_POSSESSION_FACTOR: FT_POSSESSION_FACTOR,
    fgPct: fgPct,
    tpPct: tpPct,
    ftPct: ftPct,
    efgPct: efgPct,
    tsPct: tsPct,
    per36: per36,
    possessions: possessions,
    offensiveRating: offensiveRating,
    twoPtBreakEven: twoPtBreakEven,
    threePtBreakEven: threePtBreakEven,
    tsBand: tsBand,
    scoringLayers: scoringLayers
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.HoopMath = api;
})(typeof window !== 'undefined' ? window : globalThis);
