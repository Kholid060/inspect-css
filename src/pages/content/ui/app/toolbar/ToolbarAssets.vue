<template>
  <div class="p-3 max-h-96 overflow-auto">
    <div class="flex justify-between text-sm">
      <div>
        <p class="font-semibold leading-tight">Assets</p>
        <p class="text-muted-foreground leading-tight">Website assets</p>
      </div>
      <UiButton
        variant="secondary"
        size="sm"
        class="highlight-white/5"
        @click="saveAllAssets"
      >
        <DownloadIcon class="h-5 w-5 mr-2" />
        Save all
      </UiButton>
    </div>
    <div class="grid grid-cols-2 gap-3 mt-4">
      <div
        v-for="(asset, index) in assets"
        :key="asset.filename"
        :style="{
          backgroundSize: '100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url('${backgroundImg}')`,
        }"
        class="h-32 rounded-lg overflow-hidden flex items-center justify-center relative group"
      >
        <div
          class="flex flex-col justify-between text-sm absolute top-0 left-0 h-full w-full group-hover:bg-gradient-to-b from-background/70 via-40% to-80% via-transparent to-background/70"
        >
          <div
            class="p-2 -translate-y-full group-hover:translate-y-0 duration-300"
          >
            <UiButton
              class="text-xs gap-1"
              size="xs"
              variant="secondary"
              @click="saveAsset(asset)"
            >
              <DownloadIcon class="h-4 w-4" />
              Save
            </UiButton>
          </div>
          <div
            class="p-2 translate-y-full group-hover:translate-y-0 transition duration-300"
          >
            <p class="line-clamp-1">{{ asset.filename }}</p>
            <p class="leading-tight text-muted-foreground text-xs line-clamp-1">
              {{ asset.size.width }}x{{ asset.size.height }}
            </p>
          </div>
        </div>
        <img
          :src="asset.url"
          :alt="asset.filename || 'image'"
          class="object-contain min-h-24 min-w-24"
          :style="{
            width: asset.size.width + 'px',
            height: asset.size.height + 'px',
          }"
          @error="onAssetError(index)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, shallowRef, triggerRef } from 'vue';
import backgroundImg from '@assets/img/background.png';
import { DownloadIcon } from 'lucide-vue-next';
import JSZip from 'jszip';
import UiButton from '@root/src/pages/components/ui/UiButton.vue';
import { downloadFile, parseURL } from '@root/src/utils/helper';

interface AssetItem {
  id: number;
  url: string;
  filename: string;
  type: 'image' | 'svg';
  imgEl?: HTMLImageElement;
  size: { height: number; width: number };
}

const assets = shallowRef<AssetItem[]>([]);

async function getAssetContent(asset: AssetItem) {
  const filename = asset.filename || `asset-svg-${asset.id}.svg`;

  let content: string | null | Blob = asset.url;
  if (
    asset.type === 'image' &&
    asset.imgEl &&
    parseURL(asset.url)?.hostname !== window.location.hostname
  ) {
    const response = await fetch(asset.url);

    content = response.ok ? await response.blob() : null;
  }

  return { filename, content };
}
async function saveAsset(asset: AssetItem) {
  try {
    const { content, filename } = await getAssetContent(asset);
    if (!content) throw new Error("Can't get image file");

    downloadFile(filename, content);
  } catch (error) {
    if (error instanceof Error && error.message.includes('CORS')) {
      window.open(asset.url, '_blank');
    }

    console.error(error);
  }
}
async function saveAllAssets() {
  try {
    const zip = new JSZip();

    await Promise.allSettled(
      assets.value.map(async (asset) => {
        let content: string | Blob = asset.url;
        const filename = asset.filename || `asset-svg-${asset.id}.svg`;

        if (asset.type === 'svg') {
          content = new Blob([filename], {
            type: 'text/plain;charset=utf-8',
          });
        } else {
          content = (await getAssetContent(asset)).content || asset.url;
        }

        zip.file(filename, content);
      }),
    );

    zip
      .generateAsync({ type: 'blob' })
      .then((content) => {
        const { hostname } = window.location;
        const name = `${hostname}-assets.zip`;

        downloadFile(name, content);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
}
function onAssetError(index: number) {
  assets.value.splice(index, 1);
  triggerRef(assets);
}

onMounted(() => {
  const seen = new Set();
  const graphicEls = document.querySelectorAll<HTMLImageElement | SVGElement>(
    'svg,img',
  );

  let assetId = 0;
  const assetsList: AssetItem[] = [];

  graphicEls.forEach((element) => {
    if (element instanceof SVGElement) {
      const clonedEl = element.cloneNode(true) as SVGElement;
      clonedEl.removeAttribute('id');
      clonedEl.removeAttribute('class');
      clonedEl.setAttribute('fill', '#cbd5e1');

      const strSVG = clonedEl.outerHTML;
      if (seen.has(strSVG)) return;

      assetsList.push({
        id: assetId,
        type: 'svg',
        filename: '',
        url: `data:image/svg+xml;base64,${window.btoa(strSVG)}`,
        size: { height: element.clientHeight, width: element.clientHeight },
      });

      seen.add(strSVG);
      assetId += 1;

      return;
    }

    const filename = element.src?.split('/').pop() || element.src;
    if (seen.has(filename) || !element.src) return;

    assetsList.unshift({
      filename,
      id: assetId,
      type: 'image',
      imgEl: element,
      url: element.src,
      size: { height: element.naturalHeight, width: element.naturalWidth },
    });

    seen.add(filename);
    assetId += 1;
  });

  assets.value = assetsList;
});
</script>
