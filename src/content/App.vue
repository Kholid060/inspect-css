<template>
  <div class="app">
    <popper></popper>
    <edit-element></edit-element>
  </div>
</template>
<script>
import Popper from './Popper.vue';
import EditElement from './EditElement.vue';

export default {
  components: { Popper, EditElement },
};
</script>
