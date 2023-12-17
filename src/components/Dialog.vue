<style lang="scss" scoped>
.dialog {
  --at-apply: py-4 w-[80%] max-w-120 rounded-4 bg-white;
}
</style>

<template>
  <div flex="~ col" class="dialog">
    <div flex-1 text="8 center">{{ props.content }}</div>
    <div mt-10 flex items-center justify-center>
      <button
        w-32
        h-18
        rounded-2
        bg-primary
        text="6 white"
        @click="emit('reset')"
      >
        {{ t('memoryGame.reset') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  content: {
    required: true,
    type: String
  }
})

const emit = defineEmits(['reset'])

const { t } = useI18n()
</script>
