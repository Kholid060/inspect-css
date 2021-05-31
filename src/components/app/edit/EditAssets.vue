<template>
  <div class="px-4">
    <div class="flex items-center space-x-2 mb-4">
      <ui-select class="flex-1" placeholder="Asset type" v-model="state.activeType">
        <option
          v-for="type in assetTypes"
          :key="type.id"
          :value="type.id"
        >
          {{ type.name }}
        </option>
      </ui-select>
    </div>
    <div class="image-card-container grid grid-cols-2 gap-2">
      <transition-group name="list-transition">
        <div
          v-for="image in assets"
          :key="image.name"
          class="image-card h-32 relative list-transition bg-center rounded-lg bg-cover overflow-hidden"
        >
          <img
            class="image-card__image max-w-full"
            :alt="image.type !== 'svg' ? image.name : ''"
            :src="image.src"
            :style="image.style"
          />
          <div class="absolute bg-black bg-opacity-50 image-card__meta bottom-0 w-full p-2 flex items-center">
            <p
              class="text-overflow pr-2 flex-1"
              :title="image.type !== 'svg' ? image.name : ''"
              v-text="image.type !== 'svg' ? image.name : ''"
            >
            </p>
            <ui-icon
              name="download"
              size="20"
              class="cursor-pointer"
              @click="downloadAsset(image)"
            ></ui-icon>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
import { onMounted, shallowReactive, computed } from 'vue';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export default {
  setup() {
    let svgId = 0;
    const assetTypes = [
      { id: 'all', name: 'All' },
      { id: 'img', name: 'Image' },
      { id: 'svg', name: 'SVG' },
      // { id: 'video', name: 'Video' },
    ];
    const state = shallowReactive({
      assets: [],
      activeType: 'img',
      loadingSaveAll: false,
    });

    const assets = computed(() => {
      const filteredAssets = state.assets.filter(({ type }) => {
        if (state.activeType === 'all') return true;

        return state.activeType === type;
      });

      return filteredAssets;
    });

    function getAssetContent(asset) {
      const isSvg = asset.type === 'svg';
      let content = asset.src;

      if (isSvg) {
        svgId += 1;
        content = new Blob([asset.name], { type: 'text/plain;charset=utf-8' });
      }

      return {
        name: isSvg ? `SVG-${svgId}.svg` : asset.name,
        content,
      };
    }
    function downloadAsset(asset) {
      const { name, content } = getAssetContent(asset);

      saveAs(content, name);
    }
    function downloadAllAssets() {
      state.loadingSaveAll = true;

      const zip = new JSZip();

      assets.value.forEach((asset) => {
        const { name, content } = getAssetContent(asset);

        zip.file(name, content);
      });

      zip.generateAsync({ type: 'blob' }).then((content) => {
        const { hostname } = window.location;
        const name = `${hostname}-assets.zip`;

        saveAs(content, name);

        state.loadingSaveAll = false;
      }).catch((error) => {
        console.error(error);
        state.loadingSaveAll = false;
      });
    }

    onMounted(() => {
      const elements = document.querySelectorAll('img, svg');
      const result = Array.from(elements).reduce((acc, element) => {
        const { tagName, src } = element;

        if ((tagName === 'IMG' || 'VIDEO') && src) {
          /* eslint-disable-next-line */
          // const name = (src.split('/').pop()).replace(/[\#\?].*$/, '');
          const name = src.split('/').pop();
          console.log(name, src);

          if (acc.seen.has(name)) return acc;

          acc.assets.push({
            src,
            name,
            type: tagName.toLowerCase(),
            style: { maxWidth: '100%' },
          });
          acc.seen.add(name);
        }

        if (tagName === 'svg') {
          const node = element.cloneNode(true);

          node.removeAttribute('id');
          node.removeAttribute('class');

          const nodeStr = node.outerHTML;

          if (acc.seen.has(nodeStr)) return acc;

          acc.assets.push({
            name: nodeStr,
            src: `data:image/svg+xml;base64,${window.btoa(nodeStr)}`,
            type: 'svg',
            style: { width: '100%' },
          });
          acc.seen.add(nodeStr);
        }

        return acc;
      }, { assets: [], seen: new Set() });

      state.assets = result.assets;
    });

    return {
      state,
      assets,
      assetTypes,
      downloadAsset,
      downloadAllAssets,
    };
  },
};
</script>
