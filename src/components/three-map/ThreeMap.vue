<template>
  <div id="three-map" style="width: 100vw; height: 100vh"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useThreeObjectStore } from "@/stores/threeObjectStore.js";
import { useThreeMapUtils } from "@/composables/three-map/threeMapUtils.js";

/**
 * Constants
 */

/**
 * Composables
 */
const { lngLatToTile } = useThreeMapUtils();

/**
 * Stores
 */
const threeObjectStore = useThreeObjectStore();

/**
 * Functions
 */

function loadTiles() {
  const tileSize = 512;
  const zoom = 15;
  const center = { lng: 8.55, lat: 47.37 };
  const centerTile = lngLatToTile(center.lng, center.lat, zoom);
  const range = 1; // 3x3 타일

  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      const tileX = centerTile.x + dx;
      const tileY = centerTile.y + dy;
      const url = `http://[::]:8080/styles/basic-preview/512/${zoom}/${tileX}/${tileY}.png`;

      threeObjectStore.threeObjects.textureLoader.load(url, (texture) => {
        texture.flipY = true;

        const geometry = new threeObjectStore.THREE.PlaneGeometry(
          tileSize,
          tileSize
        );
        const material = new threeObjectStore.THREE.MeshBasicMaterial({
          map: texture,
        });
        const mesh = new threeObjectStore.THREE.Mesh(geometry, material);

        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(dx * tileSize, 0, -dy * tileSize);
        threeObjectStore.threeObjects.scene.add(mesh);
      });
    }
  }
}

function initialize() {
  threeObjectStore.initialize();
  loadTiles();
}

/**
 * Life Cycle
 */

onMounted(initialize);
onUnmounted(threeObjectStore.destroy);
</script>
