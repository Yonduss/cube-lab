import { Alg } from 'cubing/alg';
import type { FaceTurn } from './cubeControls';

export type CubeMove = FaceTurn | 'x2' | 'y';

const storageKey = 'cube-lab.position.3x3.v1';
const storedMove = /^[RLUDFBxy](?:[1-9]\d*)?'?$/;

export function readPosition(): Alg {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved && saved.split(' ').every((move) => storedMove.test(move))) return new Alg(saved);
  } catch {
    // Open a solved cube if storage is unavailable or the saved sequence is invalid.
  }
  return new Alg();
}

export function savePosition(algorithm: Alg) {
  try {
    localStorage.setItem(storageKey, algorithm.simplify({ cancel: true }).toString());
  } catch {
    // Keep playing with the current position even if storage is blocked or full.
  }
}

export async function generateScramble(): Promise<Alg> {
  const { randomScrambleForEvent } = await import('cubing/scramble');
  return randomScrambleForEvent('333');
}
