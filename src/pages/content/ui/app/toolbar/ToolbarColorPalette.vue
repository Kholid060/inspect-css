<template>
  <div class="p-3">
    <div class="flex items-center justify-between">
      <p class="font-semibold leading-tight">Website Color Palettes</p>
      <UiButton
        v-if="colors"
        variant="secondary"
        size="icon-sm"
        class="highlight-white/5"
        @click="getColorPalette"
      >
        <RefreshCwIcon class="h-5 w-5" />
      </UiButton>
    </div>
    <div class="mt-3">
      <div v-if="!colors" class="text-center">
        <UiButton
          variant="secondary"
          size="sm"
          class="highlight-white/5"
          @click="getColorPalette"
        >
          Extract colors
        </UiButton>
      </div>
      <div class="grid grid-cols-2 text-sm gap-2">
        <div
          v-for="color in colors"
          :key="color.hex"
          :style="{ backgroundColor: color.hex }"
          :class="[
            'h-16 flex flex-col rounded items-center justify-center group cursor-pointer',
            { 'text-zinc-900': color.isDark },
          ]"
          @click="copyColor(color.hex)"
        >
          <p
            class="uppercase group-hover:-translate-y-0 translate-y-2 transition leading-tight"
          >
            {{ color.hex }}
          </p>
          <p
            class="leading-tight group-hover:-translate-y-0 group-hover:opacity-100 translate-y-2 opacity-0 transition-all"
          >
            {{ copyColorIndicator === color.hex ? '✅ Copied' : 'Copy' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { shallowRef, onMounted } from 'vue';
import CaptureTab from '@root/src/utils/CaptureTab';
import { useAppProvider } from '../../app-plugin';
import ColorThief from 'colorthief';
import { toHex, readableColorIsBlack } from 'color2k';
import UiButton from '@root/src/pages/components/ui/UiButton.vue';
import { copyToClipboard, parseJSON } from '@root/src/utils/helper';
import { RefreshCwIcon } from 'lucide-vue-next';

interface ColorPalette {
  hex: string;
  isDark: boolean;
}

const COLOR_PALETTE_STORAGE_KEY = 'inspect-css:color-palette';

const appProvider = useAppProvider();

const copyColorIndicator = shallowRef('');
const colors = shallowRef<ColorPalette[] | null>(null);

function copyColor(color: string) {
  copyColorIndicator.value = color;
  copyToClipboard(color).finally(() => {
    setTimeout(() => {
      copyColorIndicator.value = '';
    }, 1000);
  });
}
async function getColorPalette() {
  appProvider.updateState({ tempHide: true });

  try {
    const image = await CaptureTab.captureWholePage();
    if (!image) return;

    const colorThief = new ColorThief();
    const palette = await colorThief.getPalette(image);
    const extractedColors = palette.map(([r, g, b]) => {
      const rgb = `rgb(${r}, ${g}, ${b})`;
      return { hex: toHex(rgb), isDark: readableColorIsBlack(rgb) };
    });

    colors.value = extractedColors;

    sessionStorage.setItem(
      COLOR_PALETTE_STORAGE_KEY,
      JSON.stringify(extractedColors),
    );
  } catch (error) {
    console.error(error);
  } finally {
    appProvider.updateState({ tempHide: false });
  }
}

onMounted(() => {
  colors.value = parseJSON<ColorPalette[], null>(
    sessionStorage.getItem(COLOR_PALETTE_STORAGE_KEY) || '',
    null,
  );
});
</script>
