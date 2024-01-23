<template>
  <SwitchRoot v-bind="forwarded" :class="buttonVariants({ size })">
    <SwitchThumb :class="thumbVariants({ size })" />
  </SwitchRoot>
</template>

<script setup lang="ts">
import {
  SwitchRoot,
  type SwitchRootEmits,
  type SwitchRootProps,
  SwitchThumb,
  useForwardPropsEmits,
} from 'radix-vue';
import { cva } from 'class-variance-authority';

interface Props extends SwitchRootProps {
  class: string;
  size: NonNullable<Parameters<typeof buttonVariants>[0]>['size'];
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  size: 'default',
});
const emits = defineEmits<SwitchRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);

const buttonVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
  {
    variants: {
      size: {
        sm: 'h-[22px] w-[38px]',
        default: 'h-[24px] w-[44px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);
const thumbVariants = cva(
  'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0',
  {
    variants: {
      size: {
        sm: 'h-[20px] w-[20px] data-[state=checked]:translate-x-[15px]',
        default: 'h-5 w-5 data-[state=checked]:translate-x-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);
</script>
