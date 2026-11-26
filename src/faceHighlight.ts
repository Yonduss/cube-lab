import type { TwistyPlayer } from 'cubing/twisty';
import type { BufferGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three';

const directions = {
  U: ['y', 1],
  F: ['z', 1],
  R: ['x', 1],
  L: ['x', -1],
  B: ['z', -1],
  D: ['y', -1],
} as const;

export type CubeFace = keyof typeof directions;
type Sticker = Mesh<BufferGeometry, MeshBasicMaterial>;

function isSticker(object: Object3D): object is Sticker {
  const mesh = object as Sticker;
  return mesh.isMesh && mesh.geometry.type === 'BufferGeometry'
    && mesh.material.isMeshBasicMaterial && !mesh.material.transparent;
}

export async function addFaceHighlight(player: TwistyPlayer, face: CubeFace): Promise<() => void> {
  const cube = await player.experimentalCurrentThreeJSPuzzleObject();
  const vantages = await player.experimentalCurrentVantages();

  const [axis, sign] = directions[face];
  const stickers: Sticker[] = [];
  const position = cube.position.clone();
  cube.updateWorldMatrix(true, true);
  cube.traverse((object) => {
    if (!isSticker(object)) return;

    // Cube3D's outer stickers lie just beyond 1.5 local units on their face axis.
    cube.worldToLocal(object.getWorldPosition(position));
    if (Math.abs(position[axis] * sign - 1.503) < 0.01) stickers.push(object);
  });

  if (stickers.length !== 9) throw new Error(`Expected nine stickers for face ${face}.`);

  const materials = stickers.map((sticker) => {
    const original = sticker.material;
    const highlighted = original.clone();
    highlighted.color.lerp(original.color.clone().setHex(0xffee9a), 0.85);
    sticker.material = highlighted;
    return { sticker, original, highlighted };
  });

  const render = () => {
    for (const vantage of vantages) vantage.scheduleRender();
  };
  render();

  return () => {
    for (const { sticker, original, highlighted } of materials) {
      if (sticker.material === highlighted) sticker.material = original;
      highlighted.dispose();
    }
    render();
  };
}
