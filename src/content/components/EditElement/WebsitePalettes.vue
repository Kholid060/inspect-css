<template>
  <div class="website-palettes">
    <p class="font-semibold p-5">Website Color Palettes</p>
    <p class="text-light text-center" v-if="state.loading">
      Extracting Colors...
    </p>
    <div class="content mb-5" v-else>
      <div v-for="color in state.palette" :key="color" class="h-16 flex items-center px-5 color-card" :style="{ backgroundColor: color.hex }">
        <p class="text-xl flex-1 color-card__text" :style="{ color: color.title }">
          {{ color.hex }}
        </p>
        <button @click="copyColor(color.hex)" class="color-card__btn">
          <v-mdi name="mdi-content-copy"></v-mdi>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { shallowReactive, onMounted } from 'vue';
import extractColors from '~/utils/extractColors';
import copyToClipboard from '~/utils/copyToClipboard';

export default {
  setup() {
    const state = shallowReactive({
      palette: [],
      loading: false,
    });
    const getColorPalettes = () => {
      state.loading = true;

      extractColors().then(colors => {
        state.palette = colors;
        state.loading = false;
      });
    };

    onMounted(getColorPalettes);

    return {
      state,
      getColorPalettes,
      copyColor: color => {
        copyToClipboard(color);
      },
    };
  },
};
</script>
