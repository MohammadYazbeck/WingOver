"use client";

import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { nextRewardForScore, rewardForScore } from "@/lib/game-rewards";

type Obstacle = { id: number; x: number; width: number; height: number };
type GameStatus = "playing" | "over";
type RewardClaimState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "claimed"; code: string; rewardTitle: string; expiresAt: string }
  | { status: "error"; message: string };
type GameState = {
  obstacles: Obstacle[];
  jumpY: number;
  velocity: number;
  distance: number;
  nextSpawn: number;
  nextId: number;
  displayedScore: number;
};

const createGameState = (): GameState => ({
  obstacles: [], jumpY: 0, velocity: 0, distance: 0,
  nextSpawn: 1.05, nextId: 0, displayedScore: 0,
});

const GROUND_HEIGHT = 54;

function WingIcon({ compact = false }: { compact?: boolean }) {
  return (
    <NextImage
      className={compact ? "runner-wing runner-wing-compact" : "runner-wing"}
      src="/images/wing.png"
      alt=""
      width={877}
      height={877}
      draggable={false}
      priority
      aria-hidden="true"
    />
  );
}

function drawObstacles(context: CanvasRenderingContext2D, obstacles: Obstacle[], height: number, groundHeight: number, pan: HTMLImageElement | null) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  obstacles.forEach((obstacle) => {
    const top = height - groundHeight - obstacle.height;
    const bottom = height - groundHeight;
    const centerX = obstacle.x + obstacle.width / 2;

    context.beginPath();
    context.fillStyle = "rgba(0,0,0,.48)";
    context.ellipse(centerX + 3, bottom + 4, obstacle.width * 0.4, 5, 0, 0, Math.PI * 2);
    context.fill();

    if (pan?.complete && pan.naturalWidth > 0) {
      context.save();
      context.shadowColor = "rgba(0,0,0,.42)";
      context.shadowBlur = 5;
      context.drawImage(
        pan,
        115, 270, 655, 340,
        obstacle.x, top,
        obstacle.width, obstacle.height,
      );
      context.restore();
    }
  });
}

export default function RunnerGame() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [rewardClaim, setRewardClaim] = useState<RewardClaimState>({ status: "idle" });
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const panImageRef = useRef<HTMLImageElement | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const sessionRequestRef = useRef(0);
  const gameState = useRef<GameState>(createGameState());

  useEffect(() => {
    const pan = new window.Image();
    pan.decoding = "async";
    pan.src = "/images/pan.png";
    panImageRef.current = pan;
  }, []);

  const startRound = useCallback(() => {
    const requestId = ++sessionRequestRef.current;
    gameState.current = createGameState();
    sessionTokenRef.current = null;
    setScore(0);
    setStatus("playing");
    setRewardClaim({ status: "idle" });
    setRound((value) => value + 1);
    if (playerRef.current) playerRef.current.style.transform = "translate3d(0, 0, 0)";

    void fetch("/api/game/start", { method: "POST", cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as { token?: string; message?: string };
        if (!response.ok || !data.token) throw new Error(data.message || "Rewards are unavailable.");
        if (sessionRequestRef.current === requestId) sessionTokenRef.current = data.token;
      })
      .catch((error: unknown) => {
        if (sessionRequestRef.current === requestId) {
          setRewardClaim({ status: "error", message: error instanceof Error ? error.message : "Rewards are unavailable." });
        }
      });
  }, []);

  const openGame = useCallback(() => {
    setOpen(true);
    startRound();
  }, [startRound]);

  const closeGame = useCallback(() => {
    setOpen(false);
    setStatus("over");
  }, []);

  const jump = useCallback(() => {
    const state = gameState.current;
    if (!open || status !== "playing" || state.jumpY > 1) return;
    state.velocity = 720;
  }, [open, status]);

  const claimReward = useCallback(async () => {
    const token = sessionTokenRef.current;
    if (!token) {
      setRewardClaim({ status: "error", message: "This run cannot be verified. Please run again." });
      return;
    }

    setRewardClaim({ status: "checking" });
    try {
      const response = await fetch("/api/game/claim", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, score }),
      });
      const data = await response.json() as {
        eligible?: boolean;
        code?: string;
        rewardTitle?: string;
        expiresAt?: string;
        message?: string;
      };
      if (!response.ok || !data.eligible || !data.code || !data.rewardTitle || !data.expiresAt) {
        throw new Error(data.message || "This reward could not be claimed.");
      }
      setRewardClaim({ status: "claimed", code: data.code, rewardTitle: data.rewardTitle, expiresAt: data.expiresAt });
    } catch (error) {
      setRewardClaim({ status: "error", message: error instanceof Error ? error.message : "This reward could not be claimed." });
    }
  }, [score]);

  useEffect(() => {
    if (!open || status !== "playing") return;

    let animationFrame = 0;
    let lastTime = 0;
    const tick = (time: number) => {
      const stage = stageRef.current;
      const canvas = canvasRef.current;
      const player = playerRef.current;
      if (!stage || !canvas || !player) return;

      if (!lastTime) lastTime = time;
      const delta = Math.min((time - lastTime) / 1000, 0.04);
      lastTime = time;
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const canvasWidth = Math.round(width * ratio);
      const canvasHeight = Math.round(height * ratio);
      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }
      const context = canvas.getContext("2d", { alpha: true });
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const state = gameState.current;
      const mobileGame = width <= 600;
      const groundHeight = mobileGame ? 108 : GROUND_HEIGHT;
      const speed = mobileGame
        ? 280 + Math.min(state.distance * 1.4, 80)
        : 300 + Math.min(state.distance * 2.2, 185);
      state.distance += delta * 10;
      state.nextSpawn -= delta;

      if (state.nextSpawn <= 0) {
        const panWidth = width <= 600
          ? 64 + Math.random() * 8
          : 88 + Math.random() * 10;
        state.obstacles.push({
          id: state.nextId++, x: width + 30,
          width: panWidth,
          height: panWidth * 0.52,
        });
        if (mobileGame) {
          state.nextSpawn = 0.9 + Math.random() * 0.25;
        } else {
          state.nextSpawn = 1 + Math.random() * 0.65;
        }
      }

      state.obstacles.forEach((obstacle) => { obstacle.x -= speed * delta; });
      state.obstacles = state.obstacles.filter((obstacle) => obstacle.x > -80);

      if (state.jumpY > 0 || state.velocity > 0) {
        state.jumpY += state.velocity * delta;
        state.velocity -= 1850 * delta;
        if (state.jumpY <= 0) {
          state.jumpY = 0;
          state.velocity = 0;
        }
      }

      player.style.transform = `translate3d(0, ${-state.jumpY}px, 0)`;
      drawObstacles(context, state.obstacles, height, groundHeight, panImageRef.current);

      const playerX = player.offsetLeft;
      const playerWidth = player.offsetWidth;
      const collision = state.obstacles.some((obstacle) => (
        obstacle.x + 7 < playerX + playerWidth * 0.84
        && obstacle.x + obstacle.width - 7 > playerX + playerWidth * 0.18
        && state.jumpY < obstacle.height + 7
      ));
      const nextScore = Math.floor(state.distance);

      // React updates only when the visible score changes. Movement remains on
      // the display's animation clock, keeping the game light on mobile.
      if (nextScore !== state.displayedScore) {
        state.displayedScore = nextScore;
        setScore(nextScore);
      }

      if (collision) {
        setScore(nextScore);
        setBestScore((value) => Math.max(value, nextScore));
        setStatus("over");
        return;
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [open, round, status]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => stageRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        jump();
      }
      if (event.code === "Escape") closeGame();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeGame, jump, open]);

  const unlockedReward = rewardForScore(score);
  const nextReward = nextRewardForScore(score);

  return (
    <>
      <button className="runner-launcher" type="button" onClick={openGame}>
        <WingIcon compact />
        <span>Wing run</span>
        <span className="runner-launcher-arrow" aria-hidden="true">↗</span>
      </button>

      {open && (
        <div className="runner-overlay" role="dialog" aria-modal="true" aria-label="WingOver Wing Run game">
          <button className="runner-exit" type="button" onClick={closeGame} aria-label="Exit game">
            <span className="runner-exit-label">Exit game</span>
            <span className="runner-exit-icon" aria-hidden="true">×</span>
          </button>
          <div className="runner-hud" aria-live="polite">
            <span>Score {String(score).padStart(4, "0")}</span>
            <span>{status === "playing" ? "Space / tap to jump" : `Best ${String(bestScore).padStart(4, "0")}`}</span>
          </div>
          <div className="runner-stage" ref={stageRef} onPointerDown={jump} tabIndex={0}>
            <div className="runner-track" aria-hidden="true" />
            <canvas className="runner-canvas" ref={canvasRef} aria-hidden="true" />
            <div className="runner-player" ref={playerRef} aria-label="Wing runner"><WingIcon /></div>
            {status === "over" && (
              <div className="runner-game-over">
                <p>Wing over.</p>
                <strong>{String(score).padStart(4, "0")}</strong>
                <div className="runner-reward-panel">
                  {rewardClaim.status === "claimed" ? (
                    <div className="runner-reward-ticket">
                      <span>{rewardClaim.rewardTitle}</span>
                      <strong>{rewardClaim.code}</strong>
                      <small>Show at the counter · expires {new Date(rewardClaim.expiresAt).toLocaleDateString()}</small>
                    </div>
                  ) : unlockedReward ? (
                    <>
                      <span className="runner-reward-kicker">You unlocked</span>
                      <b>{unlockedReward.title}</b>
                      <small>{unlockedReward.detail} · one claim per day</small>
                      {rewardClaim.status === "checking" ? (
                        <button type="button" disabled>Checking…</button>
                      ) : rewardClaim.status === "error" ? (
                        <span className="runner-reward-error">{rewardClaim.message}</span>
                      ) : (
                        <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={claimReward}>Claim reward</button>
                      )}
                    </>
                  ) : nextReward ? (
                    <>
                      <span className="runner-reward-kicker">Next reward</span>
                      <b>{nextReward.title}</b>
                      <small>{nextReward.minScore - score} more points</small>
                      {rewardClaim.status === "error" && <span className="runner-reward-error">{rewardClaim.message}</span>}
                    </>
                  ) : null}
                </div>
                <div className="runner-prize-guide" aria-label="Prize levels">
                  <span>250 <b>Sauce</b></span>
                  <span>450 <b>Fries</b></span>
                  <span>700 <b>10% off</b></span>
                </div>
                <button className="runner-replay" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={startRound}>Run it back <span aria-hidden="true">↗</span></button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
