/**
 * Line-art derived from the practice's own mark (public/brand/logo-mark.png,
 * the cropped ionic capital used in Nav — see Gate 0/STATUS.md). No tracing
 * tool was available in this environment (no potrace, no cv2/skimage, no
 * network install), and an automated pixel trace of a small raster produces
 * jagged, poorly-animating paths anyway — a stroke-draw reads better off
 * clean geometry. These are hand-constructed vectors (the volutes are a
 * scripted Archimedean spiral, not freehand), calibrated against the real
 * mark's proportions measured directly off the PNG (bounding box, flute
 * count and spacing, bar positions) rather than eyeballed. Real vector work,
 * not AI-generated — BRAND-REVISION.md §4's constraint.
 *
 * All paths share this viewBox so multiple <LineDraw> instances layer into
 * one composite drawing (see components/motion/preloader.tsx).
 */
export const COLUMN_VIEW_BOX = "0 0 400 174";

/**
 * Tight crop around just the left volute (x: 28.2-82.5, y: 26-87.2 in the
 * full COLUMN_VIEW_BOX coordinate space), for standalone use as a small
 * flourish icon. Using the full composite viewBox for one sub-path renders
 * it as a tiny, off-center fraction of its box — found by screenshotting
 * the hero's flourish at its intended 48px size and seeing a barely-visible
 * dot instead of a spiral.
 */
export const VOLUTE_VIEW_BOX = "24 22 62 70";

export const COLUMN_PATHS = {
  topCap: "M60,18 L340,18",
  leftVolute:
    "M52.00,26.00 L57.91,26.91 L63.50,28.83 L68.60,31.67 L73.07,35.32 L76.78,39.66 L79.64,44.52 L81.56,49.75 L82.52,55.17 L82.51,60.60 L81.55,65.88 L79.69,70.84 L77.02,75.34 L73.65,79.24 L69.69,82.44 L65.29,84.86 L60.59,86.44 L55.76,87.15 L50.94,87.00 L46.29,86.02 L41.95,84.25 L38.06,81.78 L34.71,78.71 L32.00,75.14 L29.99,71.21 L28.73,67.06 L28.24,62.81 L28.50,58.61 L29.49,54.60 L31.15,50.88 L33.40,47.57 L36.15,44.76 L39.30,42.53 L42.74,40.91 L46.35,39.96 L50.00,39.66 L53.57,40.01 L56.96,40.97 L60.07,42.50 L62.80,44.50 L65.08,46.92 L66.86,49.64 L68.10,52.58 L68.78,55.62 L68.90,58.67 L68.48,61.62 L67.57,64.39 L66.20,66.89 L64.46,69.05 L62.40,70.82 L60.13,72.16 L57.71,73.04 L55.23,73.47 L52.79,73.44 L50.46,72.98 L48.32,72.14 L46.42,70.96 L44.81,69.50 L43.54,67.82 L42.62,66.00 L42.07,64.11 L41.88,62.22 L42.03,60.39 L42.50,58.69 L43.25,57.16 L44.23,55.85 L45.38,54.78 L46.66,53.99 L48.00,53.48 L49.35,53.24 L50.66,53.26 L51.87,53.51 L52.95,53.98 L53.87,54.60 L54.60,55.35 L55.13,56.18 L55.46,57.05 L55.59,57.90 L55.54,58.69 L55.33,59.40 L55.00,60.00",
  rightVolute:
    "M348.00,26.00 L342.09,26.91 L336.50,28.83 L331.40,31.67 L326.93,35.32 L323.22,39.66 L320.36,44.52 L318.44,49.75 L317.48,55.17 L317.49,60.60 L318.45,65.88 L320.31,70.84 L322.98,75.34 L326.35,79.24 L330.31,82.44 L334.71,84.86 L339.41,86.44 L344.24,87.15 L349.06,87.00 L353.71,86.02 L358.05,84.25 L361.94,81.78 L365.29,78.71 L368.00,75.14 L370.01,71.21 L371.27,67.06 L371.76,62.81 L371.50,58.61 L370.51,54.60 L368.85,50.88 L366.60,47.57 L363.85,44.76 L360.70,42.53 L357.26,40.91 L353.65,39.96 L350.00,39.66 L346.43,40.01 L343.04,40.97 L339.93,42.50 L337.20,44.50 L334.92,46.92 L333.14,49.64 L331.90,52.58 L331.22,55.62 L331.10,58.67 L331.52,61.62 L332.43,64.39 L333.80,66.89 L335.54,69.05 L337.60,70.82 L339.87,72.16 L342.29,73.04 L344.77,73.47 L347.21,73.44 L349.54,72.98 L351.68,72.14 L353.58,70.96 L355.19,69.50 L356.46,67.82 L357.38,66.00 L357.93,64.11 L358.12,62.22 L357.97,60.39 L357.50,58.69 L356.75,57.16 L355.77,55.85 L354.62,54.78 L353.34,53.99 L352.00,53.48 L350.65,53.24 L349.34,53.26 L348.13,53.51 L347.05,53.98 L346.13,54.60 L345.40,55.35 L344.87,56.18 L344.54,57.05 L344.41,57.90 L344.46,58.69 L344.67,59.40 L345.00,60.00",
  fluting:
    "M130,30 L130,76 M156,30 L156,76 M182,30 L182,76 M208,30 L208,76 M234,30 L234,76 M260,30 L260,76 M286,30 L286,76",
  thinRule: "M60,94 L340,94",
  baseBar: "M60,110 L340,110",
} as const;
