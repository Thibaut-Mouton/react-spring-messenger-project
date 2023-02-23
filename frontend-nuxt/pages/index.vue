<template>
  <div class="flex h-full w-full">
    <div class="bg-red-400 h-full w-1/3"></div>
    <div class="bg-orange-300 h-full w-1/3 flex justify-center">
      <InputComponent/>
    </div>
    <div class="bg-amber-300 h-full w-1/3"></div>
  </div>
</template>

<script>
import InputComponent from "~/components/InputComponent.vue";

export default defineComponent({
  components: {InputComponent}
})
</script>
