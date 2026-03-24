// js/puzzles.js
// Curated tactical puzzles featuring specific forcing sequences.

const PUZZLES = [
    { fen: "1n2kb1r/p4ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 1", description: "White to play and win in 2 (Morphy's Opera Game)" },
    { fen: "6k1/1p3ppp/p1p5/8/8/2P5/PP3PPP/4R1K1 w - - 0 1", description: "White to play and win in 1 (Back-rank Mate)" },
    { fen: "1k6/1P6/1K6/8/8/8/6R1/8 w - - 0 1", description: "White to play and win in 2" },
    { fen: "3r2k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", description: "White to play and win in 1" },
    { fen: "8/4k3/8/8/8/8/4P3/4K3 w - - 0 1", description: "White to win (Basic endgame technique)" },
    { fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4", description: "White to play and win in 1" },
    // Some classic tactical motifs where forcing moves are key:
    { fen: "8/8/4k3/8/8/4K3/R7/8 w - - 0 1", description: "White to play and practice Rook rolling" },
    { fen: "8/1k6/8/8/8/8/1K5R/8 w - - 0 1", description: "White to win in the Lucena Position" },
    { fen: "r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 3 9", description: "White to play and win a sharp Sicilian sequence" },
    { fen: "r2qk2r/ppp1bppp/2np1n2/8/3pP1b1/2N2N2/PPP1BPPP/R1BQ1RK1 w kq - 0 8", description: "White to win positional advantage" },
    { fen: "r1b1k2r/pppp1ppp/2n2n2/8/1bB1P3/2N2N2/PPP2PPP/R1B1K2R w KQkq - 5 8", description: "White to find the forcing combination" },
    { fen: "k7/p7/K7/8/8/8/8/1R6 w - - 0 1", description: "White to play and win in 2" },
    { fen: "8/8/8/8/k7/8/p7/K7 w - - 0 1", description: "White to play and force a stalemate draw" }
];
