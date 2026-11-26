import type { TwistyPlayer } from 'cubing/twisty';
import type { BoxGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three';
import type { CubeFace } from './cubeControls';

const directions = {
  U: ['y', 1],
  F: ['z', 1],
  R: ['x', 1],
  L: ['x', -1],
  B: ['z', -1],
  D: ['y', -1],
} as const;

const axes = ['x', 'y', 'z'] as const;
type CubieMesh = Mesh<BoxGeometry, MeshBasicMaterial>;

function isCubieFoundation(object: Object3D): object is CubieMesh {
  const mesh = object as CubieMesh;
  return mesh.isMesh && mesh.geometry.type === 'BoxGeometry' && mesh.material.isMeshBasicMaterial;
}

export async function addFaceHighlight(player: TwistyPlayer, face: CubeFace): Promise<() => void> {
  const cube = await player.experimentalCurrentThreeJSPuzzleObject();
  const vantages = await player.experimentalCurrentVantages();

  const template = cube.children.flatMap((cubie) => cubie.children).find(isCubieFoundation);
  if (!template) throw new Error('The 3×3 foundation geometry is unavailable.');

  // Cube3D uses unit cubies. The selected layer is a 3 × 3 × 1 box centered one unit from the origin.
  const [axis, sign] = directions[face];
  const center = cube.position.clone().set(0, 0, 0);
  center[axis] = sign;
  const span = cube.scale.clone().set(3.07, 3.07, 3.07);
  span[axis] = 1.07;

  const glow = template.material.clone();
  glow.color.setHex(0xffeab0);
  glow.transparent = true;
  glow.opacity = 0.12;
  glow.depthWrite = false;
  const edge = glow.clone();
  edge.opacity = 0.54;

  const shell = template.clone(false);
  shell.name = 'face-layer-highlight';
  shell.material = glow;
  shell.position.copy(center);
  shell.scale.copy(span);
  shell.renderOrder = 2;
  cube.add(shell);

  const rails = axes.flatMap((along) => {
    const [across, depth] = axes.filter((other) => other !== along);
    return [-1, 1].flatMap((side) => [-1, 1].map((level) => {
      const rail = template.clone(false);
      rail.material = edge;
      rail.position.copy(center);
      rail.position[across] += side * span[across] / 2;
      rail.position[depth] += level * span[depth] / 2;
      rail.scale.set(0.023, 0.023, 0.023);
      rail.scale[along] = span[along];
      rail.renderOrder = 3;
      cube.add(rail);
      return rail;
    }));
  });

  const render = () => {
    for (const vantage of vantages) vantage.scheduleRender();
  };
  render();

  return () => {
    cube.remove(shell, ...rails);
    glow.dispose();
    edge.dispose();
    render();
  };
}
