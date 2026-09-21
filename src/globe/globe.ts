import * as THREE from "three";
import type { Place, Stage } from "../data/types";

/**
 * The Earth, and a toy's route across it.
 *
 * Coastlines are the real thing: Natural Earth's 110m land polygons, which are
 * public domain. Routes are drawn as great circle arcs lifted off the surface,
 * because that is the path that is actually shortest between two places on a
 * sphere, and seeing it bend is half the lesson.
 */

export interface GlobeOptions {
  container: HTMLElement;
  reducedMotion?: boolean;
  /** Called when the child clicks a place marker. */
  onPickStage?: (index: number) => void;
}

export interface Globe {
  /** Draw a journey. Pass an empty list to clear it. */
  setRoute(stages: Stage[]): void;
  /** Spin the globe so this stage faces the viewer, and highlight it. */
  focusStage(index: number): void;
  /** How far the whole route travels over the ground, in kilometres. */
  routeKm(): number;
  setReducedMotion(value: boolean): void;
  dispose(): void;
}

const RADIUS = 1;
const EARTH_RADIUS_KM = 6371;

/** Latitude and longitude to a point on the sphere. */
export function toVector(
  lat: number,
  lon: number,
  radius = RADIUS,
): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * Great circle distance along the surface, in kilometres. A leg that leaves
 * the planet has no surface distance, so it counts as zero rather than as a
 * made-up number.
 */
export function distanceKm(a: Place, b: Place): number {
  if (a.offEarth || b.offEarth) return 0;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * An arc between two places, lifted so it clears the surface. Longer hops
 * arch higher, which is why a Pacific crossing looks like a jump and a trip
 * across one country looks like a scratch.
 */
function arcPoints(a: Place, b: Place, segments = 64): THREE.Vector3[] {
  const start = toVector(a.lat, a.lon);
  const end = toVector(b.lat, b.lon);
  const angle = start.angleTo(end);
  const lift = 0.12 + Math.min(angle / Math.PI, 1) * 0.42;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = new THREE.Vector3().copy(start).lerp(end, t);
    if (point.lengthSq() < 1e-9) point.copy(start);
    // Sine bulge, zero at both ends so the arc touches down on each place.
    point.normalize().multiplyScalar(RADIUS + Math.sin(t * Math.PI) * lift);
    points.push(point);
  }
  return points;
}

/**
 * Where a stage's marker belongs. A place on Earth sits just above its own
 * coordinates. A place that is not on Earth sits straight out above wherever
 * the journey last was, because that is the direction the helium actually
 * went.
 */
function positionOf(stages: Stage[], index: number): THREE.Vector3 {
  const stage = stages[index];
  if (!stage.place.offEarth)
    return toVector(stage.place.lat, stage.place.lon, RADIUS * 1.02);
  const previous = stages[Math.max(0, index - 1)].place;
  return toVector(previous.lat, previous.lon, RADIUS * 1.85);
}

/** A trail heading straight out from the surface, and not coming back. */
function escapePoints(end: THREE.Vector3, segments = 28): THREE.Vector3[] {
  const direction = end.clone().normalize();
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push(
      direction
        .clone()
        .multiplyScalar(RADIUS * 1.02 + t * (end.length() - RADIUS * 1.02)),
    );
  }
  return points;
}

export async function createGlobe(options: GlobeOptions): Promise<Globe> {
  const { container } = options;
  let reducedMotion = options.reducedMotion ?? false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
  camera.position.set(0, 0.7, 3.1);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute(
    "aria-label",
    "A globe showing where a toy's materials come from and the route it travels.",
  );
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.touchAction = "pan-y";
  container.append(renderer.domElement);

  const world = new THREE.Group();
  scene.add(world);

  // The ocean.
  const ocean = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 0.997, 64, 48),
    new THREE.MeshBasicMaterial({ color: 0x14263c }),
  );
  world.add(ocean);

  // A faint grid, so the globe reads as a sphere while it turns.
  const grid = new THREE.LineSegments(
    new THREE.WireframeGeometry(
      new THREE.SphereGeometry(RADIUS * 0.999, 24, 16),
    ),
    new THREE.LineBasicMaterial({
      color: 0x24405e,
      transparent: true,
      opacity: 0.4,
    }),
  );
  world.add(grid);

  // Real coastlines.
  const land = new THREE.Group();
  world.add(land);
  try {
    const response = await fetch(
      new URL("../../land.geojson", import.meta.url).href,
    ).catch(() => fetch("./land.geojson"));
    const data = await response.json();
    const positions: number[] = [];
    for (const feature of data.features ?? []) {
      const rings: number[][][] =
        feature.geometry?.type === "Polygon"
          ? feature.geometry.coordinates
          : (feature.geometry?.coordinates ?? []).flat();
      for (const ring of rings) {
        for (let i = 0; i < ring.length - 1; i++) {
          const a = toVector(ring[i][1], ring[i][0], RADIUS * 1.002);
          const b = toVector(ring[i + 1][1], ring[i + 1][0], RADIUS * 1.002);
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    land.add(
      new THREE.LineSegments(
        geometry,
        new THREE.LineBasicMaterial({ color: 0x9ad08a }),
      ),
    );
  } catch {
    // A globe with no coastlines is still usable, so this is not fatal.
  }

  const routeGroup = new THREE.Group();
  world.add(routeGroup);
  const markerGroup = new THREE.Group();
  world.add(markerGroup);

  let stages: Stage[] = [];
  let markers: THREE.Mesh[] = [];
  let arcs: { line: THREE.Line; count: number }[] = [];
  let focused = -1;
  let elapsed = 0;
  /** Where the camera sits, in globe space, as a direction. */
  const VIEWER_DIRECTION = new THREE.Vector3(0, 0.22, 1).normalize();
  const targetTurn = new THREE.Quaternion().setFromUnitVectors(
    toVector(20, 0).normalize(),
    VIEWER_DIRECTION,
  );

  const markerGeometry = new THREE.SphereGeometry(0.022, 16, 12);
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffd166 });
  const activeMaterial = new THREE.MeshBasicMaterial({ color: 0xff7a45 });

  function clearRoute(): void {
    for (const { line } of arcs) {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    }
    routeGroup.clear();
    markerGroup.clear();
    arcs = [];
    markers = [];
  }

  function setRoute(next: Stage[]): void {
    clearRoute();
    stages = next;
    for (let i = 0; i < stages.length - 1; i++) {
      const a = stages[i].place;
      const b = stages[i + 1].place;
      const leaving = b.offEarth && !a.offEarth;
      if (!leaving && distanceKm(a, b) < 1) continue;
      const points = leaving
        ? escapePoints(positionOf(stages, i))
        : arcPoints(a, b);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      // Drawn progressively, so the route travels rather than appearing.
      geometry.setDrawRange(0, 0);
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ color: 0xffb703 }),
      );
      routeGroup.add(line);
      arcs.push({ line, count: points.length });
    }
    markers = stages.map((_stage, i) => {
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(positionOf(stages, i));
      markerGroup.add(marker);
      return marker;
    });
    focused = -1;
  }

  function focusStage(index: number): void {
    if (index < 0 || index >= stages.length) return;
    focused = index;
    markers.forEach((marker, i) => {
      marker.material = i === index ? activeMaterial : markerMaterial;
      marker.scale.setScalar(i === index ? 1.7 : 1);
    });
    // Turn the globe so the place faces the camera. Working out the spin and
    // tilt as separate Euler angles means guessing at rotation order and
    // sign conventions, and getting it 180 degrees wrong is invisible until
    // you notice the marker sitting on the wrong continent. A quaternion that
    // maps the place's own direction onto the direction of the camera cannot
    // be off by a half turn.
    targetTurn.setFromUnitVectors(
      positionOf(stages, index).normalize(),
      VIEWER_DIRECTION,
    );
    if (reducedMotion) world.quaternion.copy(targetTurn);
  }

  function routeKm(): number {
    let total = 0;
    for (let i = 0; i < stages.length - 1; i++)
      total += distanceKm(stages[i].place, stages[i + 1].place);
    return total;
  }

  function resize(): void {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  // Clicking a marker selects that stage.
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  function onClick(event: PointerEvent): void {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(markers, false)[0];
    if (!hit) return;
    const index = markers.indexOf(hit.object as THREE.Mesh);
    if (index >= 0) options.onPickStage?.(index);
  }
  renderer.domElement.addEventListener("pointerdown", onClick);

  let frame = 0;
  let last = performance.now();
  let disposed = false;
  function tick(now: number): void {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    const delta = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (document.hidden) return;
    elapsed += delta;

    world.quaternion.slerp(
      targetTurn,
      Math.min(1, delta * (reducedMotion ? 14 : 2.4)),
    );

    // Arcs up to the focused stage draw themselves in.
    arcs.forEach(({ line, count }, i) => {
      const shown = focused < 0 ? 0 : focused > i ? 1 : focused === i ? 1 : 0;
      const target = shown * count;
      const current = line.geometry.drawRange.count;
      const step = reducedMotion ? count : count * delta * 1.8;
      const next =
        current < target
          ? Math.min(target, current + step)
          : Math.max(target, current - step * 2);
      line.geometry.setDrawRange(0, Math.round(next));
    });

    if (focused >= 0 && markers[focused] && !reducedMotion) {
      markers[focused].scale.setScalar(1.7 + Math.sin(elapsed * 3.4) * 0.22);
    }
    renderer.render(scene, camera);
  }
  frame = requestAnimationFrame(tick);

  return {
    setRoute,
    focusStage,
    routeKm,
    setReducedMotion(value) {
      reducedMotion = value;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onClick);
      clearRoute();
      markerGeometry.dispose();
      markerMaterial.dispose();
      activeMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
