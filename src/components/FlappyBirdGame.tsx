import React, { useState, useCallback, useEffect } from 'react';
import { GameState, GameConfig, Pipe } from '../types';
import { useGameLoop } from '../hooks/useGameLoop';
import { checkCollision, generatePipe, CANVAS_WIDTH, CANVAS_HEIGHT, BIRD_RADIUS } from '../utils/gameUtils';
import GameCanvas from './GameCanvas';

interface FlappyBirdGameProps {
  gameConfig: GameConfig;
}

const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ gameConfig }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    bird: {
      x: 100,
      y: CANVAS_HEIGHT / 2,
      velocity: 0,
      radius: BIRD_RADIUS,
    },
    pipes: [],
    score: 0,
    isGameOver: false,
    isGameStarted: false,
    gameConfig,
  });

  // Update game config when it changes
  useEffect(() => {
    setGameState(prev => ({ ...prev, gameConfig }));
  }, [gameConfig]);

  const resetGame = useCallback(() => {
    setGameState({
      bird: {
        x: 100,
        y: CANVAS_HEIGHT / 2,
        velocity: 0,
        radius: BIRD_RADIUS,
      },
      pipes: [],
      score: 0,
      isGameOver: false,
      isGameStarted: false,
      gameConfig,
    });
  }, [gameConfig]);

  const jump = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver) {
        // Restart immediately with slower initial fall
        return {
          bird: {
            x: 100,
            y: CANVAS_HEIGHT / 2,
            velocity: -5, // Gentle upward velocity for slower start
            radius: BIRD_RADIUS,
          },
          pipes: [],
          score: 0,
          isGameOver: false,
          isGameStarted: true,
          gameConfig: prev.gameConfig,
        };
      }

      if (!prev.isGameStarted) {
        return {
          ...prev,
          isGameStarted: true,
          bird: {
            ...prev.bird,
            velocity: -3, // Gentle upward velocity for slower start
          },
        };
      }

      return {
        ...prev,
        bird: {
          ...prev.bird,
          velocity: prev.gameConfig.jumpStrength,
        },
      };
    });
  }, []);

  const updateGame = useCallback((deltaTime: number) => {
    setGameState(prev => {
      if (!prev.isGameStarted || prev.isGameOver) {
        return prev;
      }

      const timeMultiplier = deltaTime / 16.67; // Normalize to ~60fps

      // Update bird physics
      const newBird = {
        ...prev.bird,
        velocity: prev.bird.velocity + prev.gameConfig.gravity * timeMultiplier,
        y: prev.bird.y + prev.bird.velocity * timeMultiplier,
      };

      // Update pipes
      let newPipes = prev.pipes.map(pipe => ({
        ...pipe,
        x: pipe.x - prev.gameConfig.pipeSpeed * timeMultiplier,
      }));

      // Remove off-screen pipes
      newPipes = newPipes.filter(pipe => pipe.x + pipe.width > 0);

      // Add new pipes
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < CANVAS_WIDTH - 300) {
        newPipes.push(generatePipe(CANVAS_WIDTH, prev.gameConfig.pipeGap));
      }

      // Check for scoring
      let newScore = prev.score;
      newPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + pipe.width < newBird.x) {
          pipe.passed = true;
          newScore++;
        }
      });

      // Check collisions
      const hasCollision = checkCollision(newBird, newPipes);

      return {
        ...prev,
        bird: newBird,
        pipes: newPipes,
        score: newScore,
        isGameOver: hasCollision,
      };
    });
  }, []);

  useGameLoop(updateGame, gameState.isGameStarted && !gameState.isGameOver);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="cursor-pointer"
        onClick={jump}
        style={{ background: gameConfig.theme.background }}
      >
        <GameCanvas gameState={gameState} />
      </div>

      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-8xl font-bold text-white animate-pulse">
            {countdown}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={jump}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg"
        >
          {!gameState.isGameStarted ? 'Start Game' : gameState.isGameOver ? 'Restart' : 'Jump'}
        </button>
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg"
        >
          Reset
        </button>
      </div>
      <div className="text-center text-gray-700">
        <p className="font-semibold">Controls:</p>
        <p>Press SPACE or Click to jump • Avoid the pipes!</p>
      </div>
    </div>
  );
};

export default FlappyBirdGame;