<template>
  <div class="h-screen">
    <HeaderComponent/>
    <div class="h-[calc(100%-48px)]">
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup>

</script>

<style>
.custom-height {
//height: calc(100vh - 65px) !important
}
</style>
