import React, { useRef, useEffect } from 'react';
import { GameState } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/gameUtils';

interface GameCanvasProps {
  gameState: GameState;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const bgColors = gameState.gameConfig.theme.background.match(/#[0-9A-Fa-f]{6}/g) || ['#87CEEB', '#98D8E8'];
    gradient.addColorStop(0, bgColors[0]);
    gradient.addColorStop(1, bgColors[1] || bgColors[0]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw pipes
    ctx.fillStyle = gameState.gameConfig.theme.pipe;
    gameState.pipes.forEach((pipe) => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(pipe.x, CANVAS_HEIGHT - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
      
      // Add pipe highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(pipe.x, 0, 10, pipe.topHeight);
      ctx.fillRect(pipe.x, CANVAS_HEIGHT - pipe.bottomHeight, 10, pipe.bottomHeight);
      ctx.fillStyle = gameState.gameConfig.theme.pipe;
    });

    // Draw bird with gradient and shadow
    const bird = gameState.bird;
    
    // Bird shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(bird.x + 3, bird.y + 3, bird.radius, 0, 2 * Math.PI);
    ctx.fill();

    // Bird gradient
    const birdGradient = ctx.createRadialGradient(bird.x - 6, bird.y - 6, 0, bird.x, bird.y, bird.radius);
    birdGradient.addColorStop(0, gameState.gameConfig.theme.bird);
    birdGradient.addColorStop(1, gameState.gameConfig.theme.pipe);
    
    ctx.fillStyle = birdGradient;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, 2 * Math.PI);
    ctx.fill();

    // Bird highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(bird.x - 6, bird.y - 6, bird.radius * 0.3, 0, 2 * Math.PI);
    ctx.fill();

    // Draw score
    ctx.fillStyle = gameState.gameConfig.theme.text;
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeText(`Score: ${gameState.score}`, CANVAS_WIDTH / 2, 50);
    ctx.fillText(`Score: ${gameState.score}`, CANVAS_WIDTH / 2, 50);

    // Draw game over screen
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
      
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      ctx.fillText('Press SPACE or Click to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }

    // Draw start screen
    if (!gameState.isGameStarted && !gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Weather Flappy Bird', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      
      ctx.font = '20px Arial, sans-serif';
      ctx.fillText('Press SPACE or Click to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-4 border-white/30 rounded-lg shadow-2xl bg-gradient-to-br from-blue-400 to-blue-600"
    />
  );
};

export default GameCanvas;