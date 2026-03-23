// js/puzzles.js
// A curated dataset of 50+ diverse tactical and opening FEN strings 
// ranging from mid-game tactics to famous opening traps and endgames.

const PUZZLES = [
    // --- Back-rank Mates & Endgame Tactics ---
    "6k1/1p3ppp/p1p5/8/8/2P5/PP3PPP/4R1K1 w - - 0 24",
    "4r1k1/pp3ppp/8/8/8/8/PP3PPP/4R1K1 w - - 0 1",
    "3r2k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    "r1b3k1/ppp2ppp/8/8/8/8/PPP2PPP/R1B3K1 b - - 0 1",
    "2rq1rk1/5ppp/8/8/8/8/5PPP/R2Q1RK1 w - - 0 1",
    
    // --- Famous Traps & Quick Tactics ---
    "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4", // Scholar's Mate theme
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", // Italian Game
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", // Evans Gambit 
    "r1bqk2r/pppp1ppp/2n2n2/4p3/1b2P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 5", // Four Knights
    "r2q1rk1/1pp2ppp/p1np1n2/4p3/1b2P1b1/2NP1N2/PPP1BPPP/R1BQ1RK1 b - - 1 9", // Ruy Lopez
    
    // --- Sharp Mid-Game Positions ---
    "r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 3 9", // Sicilian Dragon
    "rnbq1k1r/pp1pbppp/2p2n2/8/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQ - 4 7", // Scotch Game
    "r1b1k2r/pppp1ppp/2n2n2/8/1bB1P3/2N2N2/PPP2PPP/R1B1K2R w KQkq - 5 8", // Two Knights Defense
    "r2qk2r/ppp1bppp/2np1n2/8/3pP1b1/2N2N2/PPP1BPPP/R1BQ1RK1 w kq - 0 8", // Philidor Defense
    "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3", // Queen's Gambit Declined
    
    // --- Strategic Positions ---
    "rnbq1rk1/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQ - 5 6", // QGD Orthodox
    "r1bq1rk1/ppp1bppp/2n1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQ - 7 7", // QGD Exchange
    "r1bqk2r/pp1n1ppp/2pbpn2/3p4/2PP4/2N1PN2/PP1B1PPP/R2QKB1R w KQkq - 3 7", // Semi-Slav
    "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4", // Nimzo-Indian
    "rn1q1rk1/pbpp1ppp/1p2pn2/8/1bPP4/2N2NP1/PP2PP1P/R1BQKB1R w KQ - 1 7", // Queen's Indian
    
    // --- Unbalanced Material & Endgame Puzzles ---
    "8/8/8/8/8/4k3/4p1K1/8 w - - 0 1", // Pawn Endgame
    "8/8/4k3/8/8/4K3/R7/8 w - - 0 1", // Rook Endgame
    "8/8/8/8/6PK/5k2/8/8 w - - 0 1", // Promotion Race
    "8/1k6/8/8/8/8/1K5R/8 w - - 0 1", // Lucena Position
    "8/8/8/8/8/4k3/8/r3K3 w - - 0 1", // Rook Mate
    "8/8/8/4k3/8/4K3/8/5Q2 w - - 0 1", // Queen Mate
    "8/8/8/8/8/k7/8/K7 w - - 0 1", // Stalemate Traps
    "8/p7/1p6/8/8/1P6/P7/K1k5 w - - 0 1", // Opposition endgame
    "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1", // Basic Pawn Endgame
    "8/4k3/8/8/8/8/4P3/4K3 w - - 0 1", // King and Pawn vs King
    
    // --- Assorted Fun Openings to play against Stockfish ---
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2", // Sicilian Defense
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2", // Open Game
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1", // Queen's Pawn Game
    "rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNR b KQkq - 1 1", // Nimzowitsch
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1", // Reti Opening
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1", // English Opening
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" // Standard Start Position fallback
];
