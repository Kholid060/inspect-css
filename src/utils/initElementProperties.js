import { getSelector } from './getElementProperties';

export default function(target) {
	const selector = getSelector(target);
	const template = `
		<div class="element-properties">
			<div class="element-properties__drag">holala</div>
			<div class="element-properties__selector">
				${selector.tag}${selector.id}${selector.classes}
			</div>
		</div>
	`;

	target.insertAdjacentHTML('beforeend', template);
}