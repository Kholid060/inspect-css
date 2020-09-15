<template>
  <div class="website-palettes">
    <p class="font-semibold p-5">Website Color Palettes</p>
    <p class="text-light text-center" v-if="state.loading">
      Extracting Colors...
    </p>
    <div class="content mb-5 px-5 grid grid-cols-2" v-else>
      <div
        v-for="(color, index) in state.palette"
        :key="color"
        class="h-32 flex items-center justify-center cursor-pointer flex-col color-card"
        :style="{ backgroundColor: color.hex }"
        @click="copyColor(color.hex, index)"
      >
        <p class="color-card__text uppercase leading-none" :style="{ color: color.title }">
          {{ color.hex }}
        </p>
        <p class="color-card__copy-text text-sm invisible opacity-0" :style="{ color: color.title }">
          {{ color.copied ? 'copied' : 'Copy color' }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted } from 'vue';
import extractColors from '~/utils/extractColors';
import copyToClipboard from '~/utils/copyToClipboard';

export default {
  setup() {
    const state = reactive({
      palette: [],
      loading: false,
    });
    const getColorPalettes = () => {
      state.loading = true;

      extractColors().then(colors => {
        state.palette = colors.map(color => ({ ...color, copied: false }));
        state.loading = false;
      });
    };

    onMounted(getColorPalettes);

    return {
      state,
      getColorPalettes,
      copyColor: (color, index) => {
        state.palette[index].copied = true;
        copyToClipboard(color);

        setTimeout(() => {
          state.palette[index].copied = false;
        }, 1000);
      },
    };
  },
};
</script>
