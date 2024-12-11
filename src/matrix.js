"use strict";

// ratio of particle column to matrix width is 1/100, and should stay that way
// particle gap and size are controlled via css custom properties in the :root
// the number of particles that the matrix is high is the function input

/** @type {HTMLDivElement} */
// @ts-ignore
const column_matrix = document.querySelector(".column-matrix");
const root_styles = getComputedStyle(document.documentElement);

/** @param {number} particle_height */
function populate_matrix(particle_height) {
  // compute number of columns
  // grabs --particle-gap css variable
  const computed_column_gap = getComputedStyle(column_matrix).gap;
  const gap_amount = Number(
    computed_column_gap.slice(0, computed_column_gap.indexOf("p"))
  );

  // grabs --particle-side-size css variable
  /** @type {number | string} */
  let particle_size = root_styles.getPropertyValue("--particle-side-size");
  particle_size = Number(particle_size.slice(0, particle_size.indexOf("p")));
  const column_count = Math.floor(
    column_matrix.clientWidth / (particle_size + gap_amount)
  );

  // generate column
  for (let i = 0; i < column_count; i++) {
    const generated_column = document.createElement("div");
    generated_column.classList.add("column");

    // generate and append particles to column
    for (let j = 0; j < particle_height; j++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      generated_column.appendChild(particle);
    }

    // append column to matrix
    column_matrix.appendChild(generated_column);
  }
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
  populate_matrix(matrix_size);
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

/** @returns {halvedColumns} */
function halve_columns() {
  /** @type {HTMLDivElement[]} */
  const columns = Array.from(document.querySelectorAll(".column"));

  /** @type {halvedColumns} */
  const halved = [];

  for (let col of columns) {
    const column_particles = /** @type {HTMLDivElement[]} */ (
      Array.from(col.childNodes)
    );
    const midpoint = Math.floor(column_particles.length / 2);
    const top_half = column_particles.slice(0, midpoint).reverse();
    const bottom_half = column_particles.slice(
      midpoint,
      column_particles.length
    );
    // populate return array
    halved.push({
      top: top_half,
      bottom: bottom_half,
    });
  }

  return halved;
}

/**
 *  @param {column} column
 *  @param {number} height_percent
 *  @param {number} stagger_ms */
async function make_wave(column, height_percent, stagger_ms) {
  // parameter height_percent defines the amplitude relative to the container height (must be between 1 - 100%)
  if (!(height_percent >= 1 && height_percent <= 100)) {
    throw new Error(
      "height_percent paramater must be between 1 and 100, inclusive."
    );
  }
  const amplitude = Math.floor((height_percent / 100) * column.top.length);

  const expand = new Promise((resolve) => {
    for (let i = 0; i < amplitude; i++) {
      let delay = stagger_ms + stagger_ms * i;
      setTimeout(() => {
        column.top[i].classList.add("visible");
        column.bottom[i].classList.add("visible");
        if (i === amplitude - 1) resolve(true);
      }, delay);
    }
  });

  await expand;
  // console.log("expanded.");

  const contract = new Promise((resolve) => {
    for (let j = amplitude - 1; j >= 0; j--) {
      let delay = stagger_ms + stagger_ms * (amplitude - j);
      setTimeout(() => {
        column.top[j].classList.remove("visible");
        column.bottom[j].classList.remove("visible");
        if (j === 0) resolve(true);
      }, delay);
    }
  });

  await contract;
  // console.log("contracted.");
}

function start_visuals() {
  const halved_columns = halve_columns();
  const stagger_times = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  // const height_percentages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const height_percentages = Array.from({ length: 100 }, (_, i) => i + 1);

  /** @param {number[]} arr */
  function randomize(arr) {
    const result = Math.floor(Math.random() * arr.length);
    if (result >= 1 && result <= 100) {
      return result;
    } else {
      return 10;
    }
  }

  for (let col of halved_columns) {
    make_wave(col, randomize(height_percentages), 40);
  }
}

// particle movement will be vertical and will move mirrored across the x-axis, so to speak

populate_matrix(40);
setInterval(() => {
  start_visuals();
}, 100);
// const halved_columns = halve_columns();
// const col_1 = halved_columns[0];
// make_wave(col_1, 100, 100);
// enable_display(40, 3);
