<template>
  <div ref="containerRef" class="p-3 text-sm">
    <div class="rounded-md bg-muted/50">
      <p class="font-semibold leading-tight p-2">Eye Dropper</p>
      <div class="flex items-center px-2 pb-2">
        <UiButton variant="secondary" size="icon-sm" @click="openEyeDropper">
          <PipetteIcon class="h-5 w-5" />
        </UiButton>
        <hr class="h-6 bg-border w-px mx-2" />
        <div
          :class="[
            'flex items-center flex-1',
            { 'justify-between': colorHistory.length > 3 },
          ]"
        >
          <button
            v-for="(history, index) in colorHistory"
            :key="history.baseColor"
            :aria-label="history.baseColor"
            :style="{ backgroundColor: history.baseColor }"
            class="rounded-md h-9 w-9 mr-1 border"
            @click="activeColorIdx = index"
          />
        </div>
      </div>
    </div>
    <div class="mt-3">
      <p
        v-if="!activeColor"
        class="text-center text-muted-foreground leading-tight"
      >
        Press the Color Picker icon to start capturing a color
      </p>
      <template v-else>
        <div class="flex h-10 rounded-md mt-3">
          <div
            v-for="(lightVariant, index) in activeColor.lightVariants"
            :key="lightVariant.color + index"
            :class="[
              'h-full flex-1 cursor-pointer hover:flex-[3] text-xs transition-all first:rounded-l-md flex items-center justify-center group',
              lightVariant.textIsBlack ? 'text-zinc-900' : 'text-zinc-100',
            ]"
            :style="{ backgroundColor: lightVariant.color }"
            @click="copyColorVariant(lightVariant.color)"
          >
            <p class="opacity-0 group-hover:opacity-100 transition">
              {{
                copyColorIndicator === lightVariant.color ? '✅ Copied' : 'Copy'
              }}
            </p>
          </div>
          <div
            :class="[
              'h-full flex-[2] cursor-pointer hover:flex-[3] text-xs transition-all first:rounded-l-md flex items-center justify-center group',
              activeColor.textIsBlack ? 'text-zinc-900' : 'text-zinc-100',
            ]"
            :style="{ backgroundColor: activeColor.baseColor }"
            @click="copyColorVariant(activeColor.baseColor)"
          >
            <p class="opacity-0 group-hover:opacity-100 transition">
              {{
                copyColorIndicator === activeColor.baseColor
                  ? '✅ Copied'
                  : 'Copy'
              }}
            </p>
          </div>
          <div
            v-for="(darkVariant, index) in activeColor.darkVariants"
            :key="darkVariant.color + index"
            :class="[
              'h-full flex-1 cursor-pointer hover:flex-[3] text-xs transition-all last:rounded-r-md flex items-center justify-center group',
              darkVariant.textIsBlack ? 'text-zinc-900' : 'text-zinc-100',
            ]"
            :style="{ backgroundColor: darkVariant.color }"
            @click="copyColorVariant(darkVariant.color)"
          >
            <p class="opacity-0 group-hover:opacity-100 transition">
              {{
                copyColorIndicator === darkVariant.color ? '✅ Copied' : 'Copy'
              }}
            </p>
          </div>
        </div>
        <div class="flex flex-col mt-2 gap-2">
          <div
            class="flex items-center text-muted-foreground bg-muted/50 highlight-white/5 rounded-sm h-9"
          >
            <p class="pl-2 w-12">HEX</p>
            <input
              id="hex-code"
              readonly
              :value="activeColorVariant.hex"
              type="text"
              class="flex-1 h-full bg-transparent text-foreground"
            />
            <button
              class="h-full px-2"
              @click="copyColorCode(activeColorVariant.hex, 'hex')"
            >
              <CopyIcon class="h-5 w-5" />
            </button>
          </div>
          <div
            class="flex items-center text-muted-foreground bg-muted/50 highlight-white/5 rounded-sm h-9"
          >
            <p class="pl-2 w-12">RGB</p>
            <input
              id="rgb-code"
              type="text"
              readonly
              :value="activeColorVariant.rgb"
              class="flex-1 h-full bg-transparent text-foreground"
            />
            <button
              class="h-full px-2"
              @click="copyColorCode(activeColorVariant.rgb, 'rgb')"
            >
              <CopyIcon class="h-5 w-5" />
            </button>
          </div>
          <div
            class="flex items-center text-muted-foreground bg-muted/50 highlight-white/5 rounded-sm h-9"
          >
            <p class="pl-2 w-12">HSL</p>
            <input
              id="hsl-code"
              readonly
              :value="activeColorVariant.hsl"
              type="text"
              class="flex-1 h-full bg-transparent text-foreground"
            />
            <button
              class="h-full px-2"
              @click="copyColorCode(activeColorVariant.hsl, 'hsl')"
            >
              <CopyIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
  <div class="border-t p-3 flex items-center text-sm">
    <div class="flex items-center gap-2 text-muted-foreground">
      <UiSwitch
        class="h-2"
        size="sm"
        :checked="settings.pickOnActivate"
        @update:checked="settings.pickOnActivate = $event"
      />
      <p>Pick color on activate</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  onMounted,
  shallowRef,
  computed,
  shallowReactive,
  ref,
  watch,
  toRaw,
} from 'vue';
import UiButton from '@root/src/pages/components/ui/UiButton.vue';
import UiSwitch from '@root/src/pages/components/ui/UiSwitch.vue';
import { useAppProvider } from '../../app-plugin';
import { CopyIcon, PipetteIcon } from 'lucide-vue-next';
import eyeDropperStorage, {
  EyeDropperHistoryItem,
  EyeDropperSettings,
} from '@src/storages/eye-dropper.storage';
import {
  darken,
  lighten,
  toHsla,
  toRgba,
  toHex,
  readableColorIsBlack,
} from 'color2k';
import { copyToClipboard, debounce } from '@root/src/utils/helper';

let initialized = false;
const MAX_COLOR_HISTORY = 5;

const appProvider = useAppProvider();

const containerRef = ref<HTMLDivElement>();

const settings = shallowReactive<EyeDropperSettings>({
  ...eyeDropperStorage.$defaultValue.settings,
});

const activeColorIdx = shallowRef(0);
const copyColorIndicator = shallowRef('');
const colorHistory = ref<EyeDropperHistoryItem[]>([]);

const activeColor = computed(
  () => colorHistory.value.at(activeColorIdx.value) ?? null,
);
const activeColorVariant = computed(() => {
  if (!activeColor.value) return { hex: '', rgb: '', hsl: '' };

  return {
    hex: activeColor.value.baseColor,
    hsl: toHsla(activeColor.value.baseColor),
    rgb: toRgba(activeColor.value.baseColor),
  };
});

function copyColorVariant(color: string) {
  copyColorIndicator.value = color;
  copyToClipboard(color).finally(() => {
    setTimeout(() => {
      copyColorIndicator.value = '';
    }, 1000);
  });
}
function copyColorCode(color: string, code: string) {
  copyToClipboard(color).then(() => {
    const inputEl = containerRef.value?.querySelector<HTMLInputElement>(
      `#${code}-code`,
    );
    inputEl?.select();
  });
}
function addColor(baseColor: string) {
  const colorIndex = colorHistory.value.findIndex(
    (color) => color.baseColor === baseColor,
  );
  if (colorIndex !== -1) {
    activeColorIdx.value = colorIndex;
    return;
  }

  const VARIANT_AMOUNT = 0.1;
  const getColorVariant = (color: string, type: 'darken' | 'lighten') => {
    let colorVariant =
      type === 'darken'
        ? darken(color, VARIANT_AMOUNT)
        : lighten(color, VARIANT_AMOUNT);
    const textIsBlack = readableColorIsBlack(colorVariant);

    return {
      textIsBlack,
      color: toHex(colorVariant),
    };
  };

  const darkVariant = getColorVariant(baseColor, 'darken');
  const lightVariant = getColorVariant(baseColor, 'lighten');

  if (colorHistory.value.length >= MAX_COLOR_HISTORY) {
    colorHistory.value.pop();
  }

  colorHistory.value.unshift({
    baseColor,
    textIsBlack: readableColorIsBlack(baseColor),
    darkVariants: [darkVariant, getColorVariant(darkVariant.color, 'darken')],
    lightVariants: [
      getColorVariant(lightVariant.color, 'lighten'),
      lightVariant,
    ],
  });
}
function openEyeDropper() {
  if (!window.EyeDropper) return;

  appProvider.updateState({ tempHide: true });

  const eyeDropper = new window.EyeDropper();
  eyeDropper
    .open()
    .then((result) => {
      addColor(result.sRGBHex);
    })
    .finally(() => {
      appProvider.updateState({ tempHide: false });
    });
}

watch(
  colorHistory,
  debounce(() => {
    if (!initialized) return;

    eyeDropperStorage.update({ history: toRaw(colorHistory.value) });
  }, 100),
  { deep: true },
);
watch(
  settings,
  debounce(() => {
    if (!initialized) return;

    eyeDropperStorage.update({ settings: toRaw(settings) });
  }, 100),
  { deep: true },
);

onMounted(() => {
  eyeDropperStorage
    .get()
    .then((storage) => {
      Object.assign(settings, storage.settings);

      if (storage.settings.pickOnActivate) {
        openEyeDropper();
      }

      colorHistory.value = storage.history;
    })
    .finally(() => {
      initialized = true;
    });
});
</script>
