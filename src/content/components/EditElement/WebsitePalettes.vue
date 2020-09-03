<template>
	<div class="website-palettes">
		<p class="font-semibold mb-3">Website Color Palettes</p>
		<p class="text-light text-center" v-if="state.loading">
			Extracting Colors...
		</p>
		<div class="content" v-else>
			<button 
				class="bg-primary h-10 rounded-lg w-full hover:bg-primary-light" 
				@click="getColorPalettes"
				v-if="state.palette.length === 0"
			>
				Get Color Palettes
			</button>
			<template v-else>
				<div 
					v-for="color in state.palette"
					:key="color"
					class="py-4 mb-2 rounded-lg text-center" 
					:style="{ backgroundColor: color.hex, color: color.text }"
				>
					<input 
						class="bg-transparent text-center"
						:value="color.hex" 
					/>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
import { shallowReactive, onMounted } from 'vue';
import html2canvas from 'html2canvas';
import * as Vibrant from 'node-vibrant';

export default {
	setup() {
		const state = shallowReactive({
			palette: [],
			loading: false,
		});
		const getColorPalettes = () => {
			state.loading = true;

			html2canvas(document.body).then((canvas) => {
			  const base64Img = canvas.toDataURL();
			  const image = new Image(canvas.width, canvas.height);
			  image.src = base64Img;

			  Vibrant.from(image).getPalette().then((palette) => {
			  	const values = Object.values(palette);
			  	const colors = values.map(({ hex, titleTextColor }) => ({ hex, text: titleTextColor }));

			  	state.palette = colors;
					state.loading = false;

					sessionStorage.setItem('color-palettes', JSON.stringify(colors));
			  });
			});
		};

		onMounted(() => {
			state.palette = JSON.parse(sessionStorage.getItem('color-palettes')) || [];
		});

		return {
			state,
			getColorPalettes,
		};
	},
};
</script>