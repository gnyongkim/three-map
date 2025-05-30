import { computed, onMounted, ref, watch } from "vue";

export function useThreeMapUtils() {
  function lngLatToTile(lng, lat, zoom) {
    const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
    const y = Math.floor(
      ((1 -
        Math.log(
          Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
        ) /
          Math.PI) /
        2) *
        Math.pow(2, zoom)
    );
    return { x, y };
  }

  return { lngLatToTile };
}
