// engine.js - Handles communication with Stockfish

class StockfishEngine {
    constructor() {
        // Load stockfish via a blob to avoid cross-origin worker issues if we use a CDN
        const workerCode = `importScripts("https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js");`;
        const blob = new Blob([workerCode], {type: 'application/javascript'});
        this.worker = new Worker(URL.createObjectURL(blob));
        
        this.worker.onmessage = this.onMessage.bind(this);
        this.onMoveCallback = null;
        
        // Initialize stockfish
        this.send('uci');
    }

    send(command) {
        console.log("-> engine:", command);
        this.worker.postMessage(command);
    }

    onMessage(event) {
        const line = event.data;
        // console.log("<- engine:", line);
        
        if (line.startsWith('info ')) {
            const matchCp = line.match(/score cp (-?\d+)/);
            const matchMate = line.match(/score mate (-?\d+)/);
            const matchPv = line.match(/ pv (.*)/);
            
            if (this.onEvalCallback && (matchCp || matchMate) && matchPv) {
                let cp = matchCp ? parseInt(matchCp[1], 10) : undefined;
                let mate = matchMate ? parseInt(matchMate[1], 10) : undefined;
                this.onEvalCallback({ cp, mate, pvs: matchPv[1].trim() });
            }
        }
        
        // Check for bestmove
        if (line.startsWith('bestmove')) {
            const match = line.match(/^bestmove\s([a-h][1-8][a-h][1-8][qrbn]?)/);
            if (match && this.onMoveCallback) {
                this.onMoveCallback(match[1]);
            }
        }
    }

    startNewGame() {
        this.send('ucinewgame');
        this.send('isready');
    }

    findBestMove(fen, depth = 10) {
        this.send(`position fen ${fen}`);
        this.send(`go depth ${depth}`);
    }

    onMove(callback) {
        this.onMoveCallback = callback;
    }

    onEval(callback) {
        this.onEvalCallback = callback;
    }
}

// Export to window
window.StockfishEngine = StockfishEngine;
