<style lang="scss" scoped>
.dialog {
  width: min(420px, 86vw);
  padding: 30px 26px 24px;
  color: var(--ink);
  text-align: center;
  background: var(--paper);
  border-radius: 24px;
  box-shadow: var(--drop);
  animation: pop 0.24s cubic-bezier(0.2, 0.9, 0.3, 1.25) both;
}

.dialog-text {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.55;
  text-wrap: balance;
}

.dialog-btn {
  margin-top: 24px;
  padding: 13px 34px;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  background: var(--flame);
  border-radius: 14px;
  box-shadow: var(--drop-ink);
  transition: transform 0.14s ease, box-shadow 0.14s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 var(--ink);
  }

  &:active {
    transform: translate(3px, 3px);
    box-shadow: 1px 1px 0 var(--ink);
  }
}

@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.92);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<template>
  <div class="dialog" role="dialog" aria-modal="true">
    <p class="dialog-text">
      {{ props.content }}
    </p>

    <button class="dialog-btn" type="button" @click="emit('reset')">
      {{ t('memoryGame.reset') }}
    </button>
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
