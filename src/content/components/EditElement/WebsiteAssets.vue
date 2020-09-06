<template>
  <div class="website-assets">
    <div class="image-card-container flex flex-wrap">
      <div
        v-for="(image, index) in state.images"
        :key="image.name + index"
        class="image-card h-32 w-6/12 relative bg-center bg-no-repeat bg-cover"
        :style="{ backgroundImage: `url(${image.src})` }"
      >
        <p class="absolute bg-black bg-opacity-25 bottom-0 w-full text-overflow">
          {{ image.name }}
        </p>
        <a :href="image.src" :download="image.name">
          Export
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, shallowReactive } from 'vue';

export default {
  setup() {
    const state = shallowReactive({
      images: [],
    });

    onMounted(() => {
      const seen = new Set();
      const imagesEl = document.querySelectorAll('img');
      const images = Array.from(imagesEl).reduce(
        (acc, image) => {
          const { src } = image;
          const name = src.split('/').pop();

          if (!acc.seen.has(name)) {
            const { height, width } = getComputedStyle(image);

            acc.images.push({ src, name, height, width });
            acc.seen.add(name);

            return acc;
          }

          return acc;
        },
        { images: [], seen: new Set() }
      );

      state.images = images.images;
    });

    return {
      state,
    };
  },
};
</script>
