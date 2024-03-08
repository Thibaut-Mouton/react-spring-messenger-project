<template>
  <div class="w-full m-4 outline-blue-500">
    <i class="absolute w-7 mt-3">
      <PaperAirplaneIcon class="text-blue-500 hover:text-red-500"/>
    </i>
    <input placeholder="Your message..."
           class="w-full px-7 py-4 bg-orange-200 rounded leading-5">
  </div>
</template>

<script setup>
import {PaperAirplaneIcon} from '@heroicons/vue/24/solid'
</script>
