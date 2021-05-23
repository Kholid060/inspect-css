<template>
  <div class="website-palettes px-4">
    <div class="text-center" v-if="state.loading">
      <ui-spinner size="32" class="my-4"></ui-spinner>
      <p class="text-gray-300">
        Extracting Colors...
      </p>
    </div>
    <template v-else>
      <div class="mb-4 flex items-center">
        <p class="flex-1">Website Color Palettes</p>
        <button title="Refresh" @click="getColorPalettes(true)">
          <ui-icon name="restart" size="20"></ui-icon>
        </button>
      </div>
      <div class="content gap-2 grid grid-cols-2">
        <div
          v-for="(color, index) in state.palette"
          :key="color"
          class="h-32 flex items-center rounded-lg justify-center cursor-pointer flex-col color-card"
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
    </template>
  </div>
</template>
<script>
import { reactive, onMounted } from 'vue';
import extractColors from '@/utils/extractColors';
import { copyToClipboard } from '@/utils/helper';
import screenshot from '@/utils/screenshot';

export default {
  setup() {
    const state = reactive({
      palette: [],
      loading: false,
    });

    async function getColorPalettes(refresh) {
      state.loading = true;

      const paletteFromSession = JSON.parse(sessionStorage.getItem('color-palettes'));

      if (paletteFromSession && !refresh) {
        state.palette = paletteFromSession || [];
        state.loading = false;

        return;
      }

      const image = await screenshot.captureAll();
      const palettes = await extractColors(image);

      state.palette = palettes;
      state.loading = false;
    }
    function copyColor(color, index) {
      state.palette[index].copied = true;
      copyToClipboard(color);

      setTimeout(() => {
        state.palette[index].copied = false;
      }, 1400);
    }

    onMounted(getColorPalettes);

    return {
      state,
      copyColor,
      getColorPalettes,
    };
  },
};
</script>
