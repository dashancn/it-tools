<script setup lang="ts">
const props = withDefaults(defineProps<{ tooltip?: string; position?: 'top' | 'bottom' | 'left' | 'right'; tooltipClass?: string }>(), {
  tooltip: undefined,
  position: 'top',
  tooltipClass: '',
});
const { tooltip, position, tooltipClass } = toRefs(props);

const targetRef = ref<HTMLElement>();
const isTargetHovered = useElementHover(targetRef);
const isTargetFocusedWithin = ref(false);
const isTooltipVisible = computed(() => isTargetHovered.value || isTargetFocusedWithin.value);

function handleFocusOut(event: FocusEvent) {
  isTargetFocusedWithin.value = targetRef.value?.contains(event.relatedTarget as Node) ?? false;
}
</script>

<template>
  <div relative inline-block>
    <div
      ref="targetRef"
      @focusin="isTargetFocusedWithin = true"
      @focusout="handleFocusOut"
    >
      <slot />
    </div>

    <div
      v-if="tooltip || $slots.tooltip"
      class="absolute z-10 rounded bg-black px-12px py-6px text-sm text-white shadow-lg transition transition transition-duration-0.2s"
      :class="{
        'op-0 scale-0': isTooltipVisible === false,
        'op-100 scale-100': isTooltipVisible,
        'whitespace-nowrap': !$slots.tooltip,
        [tooltipClass]: Boolean(tooltipClass),
        'bottom-100% left-50% -translate-x-1/2 mb-5px': position === 'top',
        'top-100% left-50% -translate-x-1/2 mt-5px': position === 'bottom',
        'right-100% top-50% -translate-y-1/2 mr-5px': position === 'left',
        'left-100% top-50% -translate-y-1/2 ml-5px': position === 'right',
      }"
    >
      <slot
        v-if="isTooltipVisible"
        name="tooltip"
      >
        {{ tooltip }}
      </slot>
    </div>
  </div>
</template>
