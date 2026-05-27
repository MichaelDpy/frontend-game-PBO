// hooks/useLocalGame.js
// Full offline game engine — no backend needed.
// Runs countdown, movement, collision, grass cutting, power-ups, quiz, rounds, game-over.

import { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 10;
const MOVE_INTERVAL = 220;   // ms per cell (normal)
const BOOST_INTERVAL = 130;  // ms per cell (speed boost)
const QUIZ_DURATION = 10000; // 10 seconds

// Power-up budget per round: starts at 3, +2 every 3 rounds
function powerUpBudgetForRound(round) {
  // round 1-3: 3, round 4-6: 5, round 7-9: 7, ...
  return 3 + Math.floor((round - 1) / 3) * 2;
}

// ---- Quiz bank (25 questions) ----
const QUIZ_BANK = [
  { q: 'Berapa hasil dari 7 × 8?',           choices: ['54','56','48','64'],                correct: 1, cat: 'Matematika' },
  { q: 'Berapa akar kuadrat dari 144?',       choices: ['10','11','12','13'],                correct: 2, cat: 'Matematika' },
  { q: 'Berapa hasil dari 15 + 27?',          choices: ['40','41','42','43'],                correct: 2, cat: 'Matematika' },
  { q: 'Berapa hasil dari 100 ÷ 4?',          choices: ['20','25','30','40'],                correct: 1, cat: 'Matematika' },
  { q: 'Berapa hasil dari 3³ (3 pangkat 3)?', choices: ['9','18','27','36'],                 correct: 2, cat: 'Matematika' },
  { q: 'Planet apa yang paling dekat dengan Matahari?', choices: ['Venus','Bumi','Mars','Merkurius'], correct: 3, cat: 'Sains' },
  { q: 'Apa rumus kimia air?',                choices: ['CO2','H2O','O2','NaCl'],            correct: 1, cat: 'Sains' },
  { q: 'Berapa kecepatan cahaya (km/s)?',     choices: ['100.000','200.000','300.000','400.000'], correct: 2, cat: 'Sains' },
  { q: 'Hewan apa yang memiliki leher terpanjang?', choices: ['Unta','Jerapah','Kuda','Gajah'], correct: 1, cat: 'Sains' },
  { q: 'Gas apa yang paling banyak di atmosfer Bumi?', choices: ['Oksigen','Karbon Dioksida','Nitrogen','Hidrogen'], correct: 2, cat: 'Sains' },
  { q: 'Ibu kota Indonesia adalah?',          choices: ['Surabaya','Bandung','Jakarta','Medan'], correct: 2, cat: 'Geografi' },
  { q: 'Gunung tertinggi di dunia adalah?',   choices: ['K2','Everest','Kilimanjaro','Elbrus'], correct: 1, cat: 'Geografi' },
  { q: 'Benua terluas di dunia adalah?',      choices: ['Afrika','Amerika','Asia','Eropa'],  correct: 2, cat: 'Geografi' },
  { q: 'Sungai terpanjang di dunia adalah?',  choices: ['Amazon','Nil','Yangtze','Mississippi'], correct: 1, cat: 'Geografi' },
  { q: 'Negara dengan penduduk terbanyak?',   choices: ['India','Amerika Serikat','Indonesia','Cina'], correct: 3, cat: 'Geografi' },
  { q: 'Siapa pendiri Microsoft?',            choices: ['Steve Jobs','Bill Gates','Mark Zuckerberg','Elon Musk'], correct: 1, cat: 'Teknologi' },
  { q: 'HTML adalah singkatan dari?',         choices: ['Hyper Text Markup Language','High Tech Modern Language','Hyper Transfer Markup Link','Home Tool Markup Language'], correct: 0, cat: 'Teknologi' },
  { q: 'CPU adalah singkatan dari?',          choices: ['Central Processing Unit','Computer Personal Unit','Central Program Utility','Core Processing Unit'], correct: 0, cat: 'Teknologi' },
  { q: 'Bahasa pemrograman untuk Android?',   choices: ['Swift','Kotlin','Python','Ruby'],   correct: 1, cat: 'Teknologi' },
  { q: 'Apa kepanjangan dari RAM?',           choices: ['Read Access Memory','Random Access Memory','Rapid Access Module','Read And Memory'], correct: 1, cat: 'Teknologi' },
  { q: 'Berapa jumlah sisi pada segitiga?',   choices: ['2','3','4','5'],                    correct: 1, cat: 'Umum' },
  { q: 'Warna dari campuran merah dan biru?', choices: ['Hijau','Oranye','Ungu','Coklat'],   correct: 2, cat: 'Umum' },
  { q: 'Berapa hari dalam seminggu?',         choices: ['5','6','7','8'],                    correct: 2, cat: 'Umum' },
  { q: 'Hewan yang dikenal sebagai raja hutan?', choices: ['Harimau','Singa','Beruang','Serigala'], correct: 1, cat: 'Umum' },
  { q: 'Berapa jumlah bulan dalam setahun?',  choices: ['10','11','12','13'],                correct: 2, cat: 'Umum' },
];

function randomQuestion() {
  return QUIZ_BANK[Math.floor(Math.random() * QUIZ_BANK.length)];
}

function randomPowerUp(rockEnabled) {
  const types = rockEnabled ? ['ROCK', 'SPEED_BOOST', 'BOMB'] : ['SPEED_BOOST', 'BOMB'];
  return types[Math.floor(Math.random() * types.length)];
}

function generateSpawnPoints(count) {
  const corners = [
    [1, 1], [GRID_SIZE - 2, 1], [1, GRID_SIZE - 2], [GRID_SIZE - 2, GRID_SIZE - 2],
  ];
  // Shuffle
  for (let i = corners.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [corners[i], corners[j]] = [corners[j], corners[i]];
  }
  return corners.slice(0, count);
}

// Arah menghadap ke tengah grid berdasarkan posisi spawn
function spawnDirection(x, y) {
  const cx = GRID_SIZE / 2;
  const cy = GRID_SIZE / 2;
  const dx = cx - x;
  const dy = cy - y;
  // Pilih arah horizontal atau vertikal yang lebih dominan
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
}

function isOpposite(a, b) {
  return (a === 'up' && b === 'down') || (a === 'down' && b === 'up') ||
         (a === 'left' && b === 'right') || (a === 'right' && b === 'left');
}

function makeGrass() {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(true));
}
function makeRock() {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
}

// ---- Initial players — 1 player only ----
function makePlayers(myName, myColor) {
  const name = myName.trim() || 'Unknown';
  const color = myColor.toUpperCase();
  const spawn = [1, 1];
  return [{
    id: 1,
    name,
    color,
    isHost: true,
    posX: spawn[0],
    posY: spawn[1],
    direction: spawnDirection(spawn[0], spawn[1]),
    alive: true,
    crashed: false,
    lives: 2,
    grassCut: 0,
    heldPowerUp: null,
    speedBoosted: false,
    speedBoostEnd: 0,
  }];
}

export function useLocalGame(myName, myColor) {
  const MY_ID = 1;

  const [phase, setPhase] = useState('COUNTDOWN'); // COUNTDOWN | PLAYING | QUIZ | GAME_OVER
  const [round, setRound] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [grassGrid, setGrassGrid] = useState(makeGrass);
  const [rockGrid, setRockGrid] = useState(makeRock);
  const [playerRockGrid, setPlayerRockGrid] = useState(makeRock);
  const [players, setPlayers] = useState(() => makePlayers(myName, myColor));
  const [quizState, setQuizState] = useState(null);
  const [winnerId, setWinnerId] = useState(null);
  const [powerUpNotifs, setPowerUpNotifs] = useState([]);
  const [bombs, setBombs] = useState([]); // { id, fromX, fromY, toX, toY, launch, arrival, targetId }

  // Refs for game loop (avoid stale closures)
  const phaseRef = useRef('COUNTDOWN');
  const playersRef = useRef(players);
  const grassRef = useRef(grassGrid);
  const rockRef = useRef(rockGrid);
  const playerRockRef = useRef(playerRockGrid);
  const roundRef = useRef(1);
  const quizRef = useRef(null);
  const bombsRef = useRef([]);
  const rockPowerUpEnabled = useRef(true);
  const powerUpsGivenThisRound = useRef(0);
  const obstacleCount = useRef(0);

  // Keep refs in sync
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { grassRef.current = grassGrid; }, [grassGrid]);
  useEffect(() => { rockRef.current = rockGrid; }, [rockGrid]);
  useEffect(() => { playerRockRef.current = playerRockGrid; }, [playerRockGrid]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { bombsRef.current = bombs; }, [bombs]);

  // ---- Countdown ----
  useEffect(() => {
    if (phase !== 'COUNTDOWN') return;
    if (countdown === 0) {
      const t = setTimeout(() => {
        setPhase('PLAYING');
        phaseRef.current = 'PLAYING';
      }, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // ---- Movement loop ----
  const lastMoveRef = useRef(0);
  const animRef = useRef(null);

  const gameLoop = useCallback((ts) => {
    if (phaseRef.current !== 'PLAYING') {
      animRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const ps = playersRef.current;
    const anyBoost = ps.some(p => p.speedBoosted && Date.now() < p.speedBoostEnd);
    const interval = anyBoost ? BOOST_INTERVAL : MOVE_INTERVAL;

    if (ts - lastMoveRef.current >= interval) {
      lastMoveRef.current = ts;
      tickMovement();
    }

    // Process arrived bombs
    const now = Date.now();
    const arrived = bombsRef.current.filter(b => now >= b.arrival);
    if (arrived.length > 0) {
      setBombs(prev => prev.filter(b => now < b.arrival));
      setPlayers(prev => {
        const next = prev.map(p => {
          if (arrived.some(b => b.targetId === p.id) && p.alive && !p.crashed) {
            // Bomb hit = crashed but alive, triggers round over via next tick check
            return { ...p, crashed: true, alive: true };
          }
          return p;
        });
        playersRef.current = next;
        // Trigger round over immediately for bomb hits
        const wasCrashed = prev.some(p => !p.crashed);
        const nowCrashed = next.some(p => p.crashed && prev.find(op => op.id === p.id && !op.crashed));
        if (nowCrashed) {
          setTimeout(() => endRound(next), 0);
        }
        return next;
      });
    }

    animRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [gameLoop]);

  function tickMovement() {
    const ps = playersRef.current;
    const grass = grassRef.current.map(r => [...r]);
    const rock = rockRef.current;
    const pRock = playerRockRef.current;
    let changed = false;
    const newNotifs = [];

    // Track total grass cut before this tick for power-up budget calculation
    const grassCutBefore = ps.reduce((s, p) => s + p.grassCut, 0);

    const nextPlayers = ps.map(p => {
      if (!p.alive || p.crashed) return p;

      // Expire speed boost
      const speedBoosted = p.speedBoosted && Date.now() < p.speedBoostEnd;

      let nx = p.posX, ny = p.posY;
      switch (p.direction) {
        case 'up':    ny--; break;
        case 'down':  ny++; break;
        case 'left':  nx--; break;
        case 'right': nx++; break;
      }

      // Wall collision — crashed but still alive, triggers round over
      if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) {
        return { ...p, crashed: true, alive: true, speedBoosted };
      }

      // Rock collision — same
      if (rock[ny][nx] || pRock[ny][nx]) {
        return { ...p, crashed: true, alive: true, speedBoosted };
      }

      // Player collision — only the mover crashes, same
      const other = ps.find(o => o.id !== p.id && o.alive && !o.crashed && o.posX === nx && o.posY === ny);
      if (other) {
        return { ...p, crashed: true, alive: true, speedBoosted };
      }

      // Move succeeded
      let grassCut = p.grassCut;
      let heldPowerUp = p.heldPowerUp;

      if (grass[ny][nx]) {
        grass[ny][nx] = false;
        grassCut++;
        changed = true;

        // Power-up budget: spread evenly using cumulative cut count
        const budget = powerUpBudgetForRound(roundRef.current);
        if (powerUpsGivenThisRound.current < budget) {
          const totalCells = GRID_SIZE * GRID_SIZE;
          const cellsPerPowerUp = Math.max(1, Math.floor(totalCells / budget));
          // Use grassCut (this player's new total) as the trigger
          if (grassCut % cellsPerPowerUp === 0) {
            const pu = randomPowerUp(rockPowerUpEnabled.current);
            powerUpsGivenThisRound.current++;
            if (pu === 'SPEED_BOOST') {
              newNotifs.push({ id: Date.now() + p.id, playerId: p.id, type: 'SPEED_BOOST' });
              return {
                ...p, posX: nx, posY: ny, grassCut, heldPowerUp,
                speedBoosted: true, speedBoostEnd: Date.now() + 3000,
              };
            } else {
              heldPowerUp = pu;
              newNotifs.push({ id: Date.now() + p.id, playerId: p.id, type: pu });
            }
          }
        }
      }

      return { ...p, posX: nx, posY: ny, grassCut, heldPowerUp, speedBoosted };
    });

    if (changed) {
      setGrassGrid(grass);
      grassRef.current = grass;
    }

    if (newNotifs.length > 0) {
      setPowerUpNotifs(prev => [...prev, ...newNotifs]);
      newNotifs.forEach(n => {
        setTimeout(() => setPowerUpNotifs(prev => prev.filter(x => x.id !== n.id)), 2500);
      });
    }

    playersRef.current = nextPlayers;
    setPlayers(nextPlayers);

    // Check all grass cut
    const allCut = !grass.some(row => row.some(c => c));
    if (allCut) {
      endRound(nextPlayers);
      return;
    }

    // If player crashed this tick → round over (quiz time)
    // Guard with phaseRef so we don't trigger twice if already in QUIZ
    const justCrashed = nextPlayers.some(p => p.crashed && !ps.find(op => op.id === p.id).crashed);
    if (justCrashed && phaseRef.current === 'PLAYING') {
      endRound(nextPlayers);
      return;
    }

    // Game over only when player has no lives left (handled inside finishQuiz)
    const alive = nextPlayers.filter(p => p.alive);
    if (alive.length === 0) {
      endGame(nextPlayers);
    }
  }

  // ---- Direction input ----
  const setDirection = useCallback((dir) => {
    setPlayers(prev => {
      const me = prev.find(p => p.id === MY_ID);
      if (!me || !me.alive || me.crashed) return prev;
      if (isOpposite(dir, me.direction)) return prev;
      const next = prev.map(p => p.id === MY_ID ? { ...p, direction: dir } : p);
      playersRef.current = next;
      return next;
    });
  }, []);

  // ---- Power-up activation ----
  const activatePowerUp = useCallback(() => {
    setPlayers(prev => {
      const me = prev.find(p => p.id === MY_ID);
      if (!me || !me.heldPowerUp) return prev;

      const type = me.heldPowerUp;
      let next = prev.map(p => p.id === MY_ID ? { ...p, heldPowerUp: null } : p);

      if (type === 'ROCK') {
        // Place rock behind player
        let bx = me.posX, by = me.posY;
        if (me.direction === 'up')    by++;
        if (me.direction === 'down')  by--;
        if (me.direction === 'left')  bx++;
        if (me.direction === 'right') bx--;
        if (bx >= 0 && bx < GRID_SIZE && by >= 0 && by < GRID_SIZE) {
          setPlayerRockGrid(pr => {
            const np = pr.map(r => [...r]);
            np[by][bx] = true;
            playerRockRef.current = np;
            return np;
          });
        }
      } else if (type === 'BOMB') {
        // Find nearest alive player
        const others = prev.filter(p => p.id !== MY_ID && p.alive && !p.crashed);
        if (others.length > 0) {
          const target = others.reduce((a, b) =>
            Math.hypot(a.posX - me.posX, a.posY - me.posY) <
            Math.hypot(b.posX - me.posX, b.posY - me.posY) ? a : b
          );
          const bomb = {
            id: Date.now(),
            fromX: me.posX, fromY: me.posY,
            toX: target.posX, toY: target.posY,
            launch: Date.now(),
            arrival: Date.now() + 1500,
            targetId: target.id,
          };
          setBombs(bm => [...bm, bomb]);
          bombsRef.current = [...bombsRef.current, bomb];
        }
      } else if (type === 'SPEED_BOOST') {
        next = next.map(p => p.id === MY_ID
          ? { ...p, speedBoosted: true, speedBoostEnd: Date.now() + 3000 }
          : p);
      }

      playersRef.current = next;
      return next;
    });
  }, []);

  // ---- Round end → quiz ----
  function endRound(ps) {
    // Guard: only trigger once per round
    if (phaseRef.current === 'QUIZ' || phaseRef.current === 'GAME_OVER') return;
    phaseRef.current = 'QUIZ';
    setPhase('QUIZ');

    // All alive players (including crashed ones — they're still in the game)
    const eligible = ps.filter(p => p.alive);
    if (eligible.length === 0) { endGame(ps); return; }

    // Crashed player always has the least grass (they stopped cutting early)
    // If no crash, pick the one with fewest grass cut
    const loser = eligible.reduce((a, b) => a.grassCut <= b.grassCut ? a : b);

    const q = randomQuestion();
    const qState = {
      targetPlayerId: loser.id,
      question: q.q,
      choices: q.choices,
      correctIndex: q.correct,
      timeRemainingMs: QUIZ_DURATION,
      answered: null,
      selectedIndex: null,
      startTime: Date.now(),
    };
    quizRef.current = qState;
    setQuizState(qState);

    // Countdown timer for quiz
    const timer = setInterval(() => {
      if (quizRef.current?.answered !== null) {
        clearInterval(timer);
        return;
      }
      const elapsed = Date.now() - qState.startTime;
      const remaining = Math.max(0, QUIZ_DURATION - elapsed);
      setQuizState(prev => prev ? { ...prev, timeRemainingMs: remaining } : prev);
      if (remaining <= 0) {
        clearInterval(timer);
        if (quizRef.current?.answered === null) {
          handleQuizTimeout();
        }
      }
    }, 200);
  }

  function handleQuizTimeout() {
    const qs = quizRef.current;
    if (!qs) return;
    setQuizState(prev => prev ? { ...prev, answered: false, timeRemainingMs: 0 } : prev);
    setTimeout(() => finishQuiz(qs.targetPlayerId, false), 1500);
  }

  const answerQuiz = useCallback((selectedIndex) => {
    const qs = quizRef.current;
    if (!qs || qs.answered !== null) return;
    const correct = selectedIndex === qs.correctIndex;
    const updated = { ...qs, answered: correct, selectedIndex };
    quizRef.current = updated;
    setQuizState(updated);
    setTimeout(() => finishQuiz(qs.targetPlayerId, correct), 1800);
  }, []);

  function finishQuiz(targetId, correct) {
    setPlayers(prev => {
      let next = prev;
      if (!correct) {
        next = prev.map(p => {
          if (p.id !== targetId) return p;
          const newLives = p.lives - 1;
          // alive: false only when lives reach 0
          return { ...p, lives: newLives, alive: newLives > 0 };
        });
        playersRef.current = next;
      }

      // Game over only when player truly has no lives left
      const stillAlive = next.filter(p => p.alive);
      if (stillAlive.length === 0) {
        endGame(next);
        return next;
      }

      startNextRound(next);
      return next;
    });
  }

  function startNextRound(ps) {
    // Guard: only run once — phaseRef must still be QUIZ when this fires
    if (phaseRef.current === 'COUNTDOWN' || phaseRef.current === 'PLAYING') return;

    const newRound = roundRef.current + 1;
    roundRef.current = newRound;
    setRound(newRound);

    // Reset power-up budget counter for new round
    powerUpsGivenThisRound.current = 0;

    // Add obstacle rocks: after every 3 rounds (round 4, 7, 10, ...)
    // Round 4: add 5 rocks. Round 7+: add 2 more each time.
    if (newRound === 4) {
      addObstacleRocks(5);
    } else if (newRound > 4 && (newRound - 1) % 3 === 0) {
      addObstacleRocks(2);
    }

    // Reset grass
    const newGrass = makeGrass();
    setGrassGrid(newGrass);
    grassRef.current = newGrass;

    // Reset player positions — crashed players respawn too
    const spawns = generateSpawnPoints(ps.filter(p => p.alive).length);
    let si = 0;
    const respawned = ps.map(p => {
      if (!p.alive) return p;
      const sp = spawns[si++] || [1, 1];
      return {
        ...p,
        posX: sp[0], posY: sp[1],
        direction: spawnDirection(sp[0], sp[1]),
        crashed: false,          // un-crash on new round
        heldPowerUp: null,
        speedBoosted: false,
        grassCut: 0,             // reset per-round grass count
      };
    });
    playersRef.current = respawned;
    setPlayers(respawned);

    quizRef.current = null;
    setQuizState(null);
    setCountdown(3);
    phaseRef.current = 'COUNTDOWN';
    setPhase('COUNTDOWN');
  }

  function addObstacleRocks(count) {
    setRockGrid(prev => {
      const next = prev.map(r => [...r]);
      let added = 0;
      const available = [];
      for (let y = 0; y < GRID_SIZE; y++)
        for (let x = 0; x < GRID_SIZE; x++)
          if (!next[y][x] && !playerRockRef.current[y][x]) available.push([x, y]);

      for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
      }

      for (const [x, y] of available) {
        if (added >= count) break;
        next[y][x] = true;
        added++;
        obstacleCount.current++;
      }

      if (added < count) rockPowerUpEnabled.current = false;
      rockRef.current = next;
      return next;
    });
  }

  // ---- Game over ----
  function endGame(ps) {
    phaseRef.current = 'GAME_OVER';
    setPhase('GAME_OVER');
    // Winner = player with lives remaining
    const winner = ps.find(p => p.alive);
    setWinnerId(winner ? winner.id : null);
    setQuizState(null);
  }

  // ---- Retry ----
  const retry = useCallback(() => {
    const newPlayers = makePlayers(myName, myColor);
    playersRef.current = newPlayers;
    setPlayers(newPlayers);

    const newGrass = makeGrass();
    const newRock = makeRock();
    const newPRock = makeRock();
    setGrassGrid(newGrass);
    setRockGrid(newRock);
    setPlayerRockGrid(newPRock);
    grassRef.current = newGrass;
    rockRef.current = newRock;
    playerRockRef.current = newPRock;

    roundRef.current = 1;
    setRound(1);
    setWinnerId(null);
    setQuizState(null);
    quizRef.current = null;
    setBombs([]);
    bombsRef.current = [];
    rockPowerUpEnabled.current = true;
    powerUpsGivenThisRound.current = 0;
    obstacleCount.current = 0;

    setCountdown(3);
    phaseRef.current = 'COUNTDOWN';
    setPhase('COUNTDOWN');
  }, [myName, myColor]);

  return {
    MY_ID,
    phase,
    round,
    countdown,
    grassGrid,
    rockGrid: rockGrid.map((row, y) => row.map((cell, x) => cell || playerRockGrid[y][x])),
    players,
    quizState,
    winnerId,
    powerUpNotifs,
    bombs,
    setDirection,
    activatePowerUp,
    answerQuiz,
    retry,
  };
}
