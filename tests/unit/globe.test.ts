import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { distanceKm, toVector } from "../../src/globe/globe";

describe("globe geometry", () => {
  it("measures real distances between real places", () => {
    const yantian = {
      name: "Yantian",
      country: "China",
      lat: 22.58,
      lon: 114.27,
    };
    const longBeach = {
      name: "Long Beach",
      country: "US",
      lat: 33.74,
      lon: -118.27,
    };
    const km = distanceKm(yantian, longBeach);
    // The published great circle distance is a little over 11,600 km.
    expect(km).toBeGreaterThan(11_000);
    expect(km).toBeLessThan(12_500);
  });

  it("puts a place and itself zero kilometres apart", () => {
    const p = { name: "x", country: "y", lat: 12.3, lon: -45.6 };
    expect(distanceKm(p, p)).toBeCloseTo(0, 6);
  });

  it("puts the poles and the equator where they belong", () => {
    expect(toVector(90, 0).y).toBeCloseTo(1, 6);
    expect(toVector(-90, 0).y).toBeCloseTo(-1, 6);
    expect(toVector(0, 0).y).toBeCloseTo(0, 6);
  });

  it("turns the globe to the right face, not the opposite one", () => {
    // Turning to a place must bring that place towards the viewer, never the
    // antipode. Getting this 180 degrees wrong put a Thai marker on Florida.
    const viewer = new THREE.Vector3(0, 0.22, 1).normalize();
    for (const [lat, lon] of [
      [9.14, 99.33],
      [-9.53, -77.06],
      [55.73, 9.12],
      [-20.72, 139.49],
      [0, 180],
    ] as const) {
      const point = toVector(lat, lon).normalize();
      const turn = new THREE.Quaternion().setFromUnitVectors(point, viewer);
      const facing = point.clone().applyQuaternion(turn);
      expect(facing.dot(viewer)).toBeGreaterThan(0.999);
    }
  });
});

describe("leaving the planet", () => {
  it("does not invent a surface distance for a leg that goes into space", () => {
    const ground = { name: "a party", country: "US", lat: 37.69, lon: -97.34 };
    const space = {
      name: "out past the sky",
      country: "Space",
      lat: 0,
      lon: 0,
      offEarth: true,
    };
    // Measuring to 0, 0 would return thousands of kilometres to a spot in the
    // Gulf of Guinea, which is not where the helium went.
    expect(distanceKm(ground, space)).toBe(0);
    expect(distanceKm(space, ground)).toBe(0);
  });
});
