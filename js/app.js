// app.js - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // Game State
    const game = new Chess();
    const engine = new StockfishEngine();
    
    // UI Elements
    const boardEl = document.getElementById('board');
    const statusEl = document.getElementById('status');
    const pgnEl = document.getElementById('pgn-container');
    const btnUndo = document.getElementById('btn-undo');

    // Piece CDN
    const PIECE_URL = 'https://raw.githubusercontent.com/oakmac/chessboardjs/master/website/img/chesspieces/wikipedia/';

    // Board State mapping to DOM
    let squares = {}; // mapping 'a1' -> DOM element
    
    // Drag and Drop state
    let draggedPiece = null;
    let dragStartSquare = null;
    let selectedSquare = null;

    // AI Configuration
    let aiDepth = 8;
    let playerColor = 'w';
    let isAiThinking = false;

    // Start Menu Elements
    const startMenu = document.getElementById('start-menu');
    const appContent = document.getElementById('app-content');
    const btnMenu = document.getElementById('btn-menu');
    const btnNormalGame = document.getElementById('btn-normal-game');
    const btnTactics = document.getElementById('btn-tactics');
    const difficultySelect = document.getElementById('difficulty-select');

    difficultySelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'easy') aiDepth = 2;
        else if (val === 'medium') aiDepth = 8;
        else if (val === 'hard') aiDepth = 14;
    });

    // Menu logic
    btnNormalGame.addEventListener('click', () => {
        startMenu.classList.add('hidden');
        appContent.classList.remove('hidden');
        game.reset();
        playerColor = 'w';
        engine.startNewGame();
        startGame();
    });

    btnTactics.addEventListener('click', () => {
        startMenu.classList.add('hidden');
        appContent.classList.remove('hidden');
        
        // Pick random FEN
        const randomFen = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
        game.load(randomFen);
        
        playerColor = game.turn(); // 'w' or 'b'
        engine.startNewGame();
        startGame();
    });

    function startGame() {
        initBoard();
        updateBoard();
        updateStatus();
    }

    // Setup engine callbacks
    engine.onMove((bestMove) => {
        // e.g. e2e4
        const source = bestMove.substring(0, 2);
        const target = bestMove.substring(2, 4);
        const promotion = bestMove.length === 5 ? bestMove[4] : undefined;

        const move = game.move({
            from: source,
            to: target,
            promotion: promotion || 'q'
        });

        isAiThinking = false;
        if (move) {
            updateBoard();
            updateStatus();
        } else {
            console.error("AI tried an invalid move:", bestMove);
        }
    });

    // Initialize board layout
    function initBoard() {
        boardEl.innerHTML = '';
        squares = {};
        
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

        let flip = playerColor === 'b';
        let renderRanks = flip ? [...ranks].reverse() : ranks;
        let renderFiles = flip ? [...files].reverse() : files;

        for (let idxR = 0; idxR < 8; idxR++) {
            const rank = renderRanks[idxR];
            for (let idxF = 0; idxF < 8; idxF++) {
                const file = renderFiles[idxF];
                const squareId = file + rank;
                
                const isDark = (idxR + idxF) % 2 !== 0;
                
                const squareEl = document.createElement('div');
                squareEl.className = `square ${isDark ? 'dark' : 'light'}`;
                squareEl.dataset.square = squareId;
                
                // Add coordinates on edges
                if (idxF === 0) {
                    const rankLabel = document.createElement('div');
                    rankLabel.className = 'coord-rank';
                    rankLabel.textContent = rank;
                    squareEl.appendChild(rankLabel);
                }
                
                if (idxR === 7) {
                    const fileLabel = document.createElement('div');
                    fileLabel.className = 'coord-file';
                    fileLabel.textContent = file;
                    squareEl.appendChild(fileLabel);
                }
                
                boardEl.appendChild(squareEl);
                squares[squareId] = squareEl;
            }
        }

        bindEvents();
    }

    function renderPieces() {
        // Clear old pieces
        document.querySelectorAll('.piece').forEach(p => p.remove());
        clearHighlights();

        const boardArray = game.board(); // 2D array [rank][file] 8x8
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

        // Add last move highlight
        const history = game.history({ verbose: true });
        if (history.length > 0) {
            const lastMove = history[history.length - 1];
            if(squares[lastMove.from]) squares[lastMove.from].classList.add('highlight-last-move');
            if(squares[lastMove.to]) squares[lastMove.to].classList.add('highlight-last-move');
        }

        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const p = boardArray[r][f];
                if (p) {
                    const squareId = files[f] + ranks[r];
                    
                    const pieceEl = document.createElement('div');
                    const colorLabel = p.color; // 'w' or 'b'
                    const typeLabel = p.type.toUpperCase(); // 'P', 'N', etc.
                    
                    pieceEl.className = 'piece';
                    pieceEl.style.backgroundImage = `url("${PIECE_URL}${colorLabel}${typeLabel}.png")`;
                    pieceEl.dataset.pieceType = typeLabel;
                    pieceEl.dataset.pieceColor = colorLabel;
                    pieceEl.dataset.square = squareId;

                    // If King in Check, highlight square
                    if (p.type === 'k' && game.in_check() && game.turn() === p.color) {
                        squares[squareId].classList.add('in-check');
                    }
                    
                    squares[squareId].appendChild(pieceEl);
                }
            }
        }
    }

    function clearHighlights() {
        Object.values(squares).forEach(sq => {
            sq.className = sq.className.replace(/highlight-\S+/g, '').replace(/in-check/g, '').trim();
        });
    }

    // Input Handling for Drag & Drop / Click
    function bindEvents() {
        boardEl.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        
        // Prevent default touch actions (scrolling) while interacting with board
        boardEl.addEventListener('touchmove', e => e.preventDefault(), {passive: false});
    }

    function handlePointerDown(e) {
        if (isAiThinking || game.game_over()) return;
        if (game.turn() !== playerColor) return; // Prevent controlling AI's pieces

        const target = e.target;
        
        if (target.classList.contains('piece')) {
            const pieceColor = target.dataset.pieceColor;
            if (pieceColor !== playerColor) return;

            draggedPiece = target;
            dragStartSquare = target.parentElement.dataset.square;

            // Prepare piece for manual drag positioning
            const rect = boardEl.getBoundingClientRect();
            target.classList.add('dragging');
            
            // Bring to active position under cursor
            positionElement(target, e.clientX, e.clientY);

            // Highlight possible moves
            showValidMoves(dragStartSquare);
        } else if (target.closest('.square')) {
            // Unselect on clicking empty space if not dragging
            clearHighlights();
            renderPieces();
            selectedSquare = null;
        }
    }

    function handlePointerMove(e) {
        if (!draggedPiece) return;
        positionElement(draggedPiece, e.clientX, e.clientY);
    }

    function handlePointerUp(e) {
        if (!draggedPiece) return;

        // Find which square we are above
        draggedPiece.hidden = true; // hide piece temporarily to find underlying element
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        draggedPiece.hidden = false;

        let targetSquare = null;
        if (elementBelow) {
            const squareEl = elementBelow.closest('.square');
            if (squareEl) {
                targetSquare = squareEl.dataset.square;
            }
        }

        draggedPiece.classList.remove('dragging');
        draggedPiece.style.transform = '';
        draggedPiece.style.position = '';
        draggedPiece.style.left = '';
        draggedPiece.style.top = '';
        
        let validMoveMade = false;

        if (targetSquare && targetSquare !== dragStartSquare) {
            // Attempt move
            const move = game.move({
                from: dragStartSquare,
                to: targetSquare,
                promotion: 'q' // Auto-promote to Queen for simplicity
            });

            if (move) {
                validMoveMade = true;
                updateBoard();
                updateStatus();
                makeAIMove();
            }
        }

        if (!validMoveMade) {
            // Snap back
            squares[dragStartSquare].appendChild(draggedPiece);
            clearHighlights();
            renderPieces();
        }

        draggedPiece = null;
        dragStartSquare = null;
    }

    function positionElement(el, clientX, clientY) {
        const boardRect = boardEl.getBoundingClientRect();
        
        // Translate cursor point to percentage inside board
        let x = clientX - boardRect.left;
        let y = clientY - boardRect.top;
        
        // Center the piece visually on cursor (approximately)
        const pieceSize = boardRect.width / 8;
        x -= pieceSize / 2;
        y -= pieceSize / 2;

        el.style.position = 'absolute';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `scale(1.1)`; // Keep scaled while dragging
        el.style.zIndex = 100;
        
        // Ensure piece is appended to board root so it can overflow squares freely
        boardEl.appendChild(el); 
    }

    function showValidMoves(squareId) {
        clearHighlights();
        const moves = game.moves({ square: squareId, verbose: true });
        
        squares[squareId].classList.add('highlight-selected');
        
        moves.forEach(m => {
            const targetSq = squares[m.to];
            if (targetSq) {
                // Determine if capture
                if (m.flags.includes('c')) {
                    targetSq.classList.add('highlight-capture');
                } else {
                    targetSq.classList.add('highlight-valid');
                }
            }
        });
    }

    function updateBoard() {
        renderPieces();
    }

    function updateStatus() {
        let status = '';

        let moveColor = game.turn() === 'w' ? 'White' : 'Black';

        if (game.in_checkmate()) {
            status = `Game over, ${moveColor} is in checkmate.`;
        } else if (game.in_draw()) {
            status = 'Game over, drawn position';
        } else {
            status = `${moveColor} to move`;
            if (game.in_check()) {
                status += ', ' + moveColor + ' is in check';
            }
        }

        statusEl.textContent = status;
        
        // Update PGN History
        const pgn = game.pgn().split(" ").filter((s,i) => i%3 !== 0).join(" "); // Just a quick format check
        pgnEl.textContent = game.pgn();
        pgnEl.scrollTop = pgnEl.scrollHeight;
    }

    function makeAIMove() {
        if (game.game_over()) return;

        isAiThinking = true;
        statusEl.textContent = "Engine is thinking...";
        
        // Small delay to allow UI to render user move
        setTimeout(() => {
            engine.findBestMove(game.fen(), aiDepth);
        }, 100);
    }

    // Buttons
    btnMenu.addEventListener('click', () => {
        appContent.classList.add('hidden');
        startMenu.classList.remove('hidden');
        game.reset(); // clear board
    });

    btnUndo.addEventListener('click', () => {
        // Undo twice to undo AI move AND player move
        game.undo();
        game.undo();
        updateBoard();
        updateStatus();
    });

});
