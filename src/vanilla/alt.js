"use strict";

/**
 * @param {number} matrix_size
 * @param {number} visibility_factor
 */
function enable_display(matrix_size, visibility_factor) {
  if (visibility_factor < 2) {
    throw new Error(
      "Matrix not displaying: visibility factor must be at least 2."
    );
  }
  // create matrix
  // populate_matrix(matrix_size);
  // initiate visual interval
  setInterval(() => {
    /** @type {HTMLDivElement[]} */
    const particles = choose_visible(visibility_factor);
    particles.map((p) => p.classList.add("visible"));

    setTimeout(() => {
      particles.map((p) => p.classList.remove("visible"));
    }, 400);
  }, 400);
}

/**
 * @param {number} visibility_factor
 * @returns {HTMLDivElement[]} */
function choose_visible(visibility_factor) {
  // ** generates random visible particles
  /** @type {HTMLDivElement[]} */
  const all_particles = Array.from(document.querySelectorAll(".particle"));
  const set = new Set();
  const particle_count = Math.floor(all_particles.length);
  while (set.size !== Math.floor(particle_count / visibility_factor)) {
    const rand = Math.floor(Math.random() * particle_count);
    if (!set.has(rand)) {
      set.add(rand);
    }
  }
  /** @type {HTMLDivElement[]} */
  const visible_particles = [];
  for (let index of set) {
    visible_particles.push(all_particles[index]);
  }
  return visible_particles;
}
