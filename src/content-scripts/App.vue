<template>
  <main class="app">
    <app-element></app-element>
    <app-properties></app-properties>
  </main>
</template>
<script>
import AppElement from '../components/app/AppElement.vue';
import AppProperties from '../components/app/AppProperties.vue';

export default {
  components: { AppElement, AppProperties },
};
</script>
