"use strict";

// ratio of particle column to matrix width is 1/100, and should stay that way
// particle gap and size are controlled via css custom properties in the :root
// the number of particles that the matrix is high is the parameter for populate_matrix

/** @type {HTMLDivElement} */
// @ts-ignore
const column_matrix = document.querySelector(".column-matrix");
const root_styles = getComputedStyle(document.documentElement);

/**
 *  @param {HTMLDivElement} matrix
 *  @param {number} particle_height */
function populate_matrix(matrix, particle_height) {
  // compute number of columns
  // grabs --particle-gap css variable
  const computed_column_gap = getComputedStyle(matrix).gap;
  const gap_amount = Number(
    computed_column_gap.slice(0, computed_column_gap.indexOf("p"))
  );

  // grabs --particle-side-size css variable
  /** @type {number | string} */
  let particle_size = root_styles.getPropertyValue("--particle-side-size");
  particle_size = Number(particle_size.slice(0, particle_size.indexOf("p")));
  const column_count = Math.floor(
    matrix.clientWidth / (particle_size + gap_amount)
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
    matrix.appendChild(generated_column);
  }
}

/** @returns {ColumnList} */
function halve_columns() {
  /** @type {HTMLDivElement[]} */
  const columns = Array.from(document.querySelectorAll(".column"));

  /** @type {ColumnList} */
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
      `height_percent paramater must be between 1 and 100, inclusive.\ncurrent parameter: ${height_percent}`
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

/** @param {ColumnList} columns */
function start_visuals(columns) {
  const height_percentages = Array.from(
    { length: columns.length },
    (_, i) => i + 1
  );
  const random_percentages = [];
  const set = new Set();
  while (random_percentages.length < height_percentages.length) {
    const i = Math.floor(Math.random() * height_percentages.length);
    if (!set.has(height_percentages[i])) {
      random_percentages.push(height_percentages[i]);
      set.add(height_percentages[i]);
    }
  }

  for (let i = 0; i < columns.length; i++) {
    make_wave(columns[i], random_percentages[i], 70);
  }
}

let matrix_size = 20;
let size_to_interval_ratio = 80 / 3;
let interval_delay = matrix_size * size_to_interval_ratio;

populate_matrix(column_matrix, matrix_size);
const halved_columns = halve_columns();
setInterval(() => {
  start_visuals(halved_columns);
}, interval_delay);
// start_visuals(halved_columns);
