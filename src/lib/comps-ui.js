import UiButton from '../components/ui/Button.vue';
import UiIcon from '../components/ui/Icon.vue';
import UiSelect from '../components/ui/Select.vue';
import UiSpinner from '../components/ui/Spinner.vue';
import UiPrismEditor from '../components/ui/PrismEdtior.vue';
import UiElementProperties from '../components/ui/ElementProperties/index.vue';

export default {
  install(app) {
    app.component('UiIcon', UiIcon);
    app.component('UiButton', UiButton);
    app.component('UiSelect', UiSelect);
    app.component('UiSpinner', UiSpinner);
    app.component('UiPrismEditor', UiPrismEditor);
    app.component('UiElementProperties', UiElementProperties);
  },
};
