<template>
  <h3>COUCOU</h3>
</template>

<script setup>

const route = useRoute()

const folders = [
  {
    subtitle: 'Jan 9, 2014',
    title: 'Photos',
    prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
  },
  {
    subtitle: 'Jan 17, 2014',
    title: 'Recipes',
    prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
  },
  {
    subtitle: 'Jan 28, 2014',
    title: 'Work',
    prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
  },
]

const items = [
  {type: 'subheader', title: 'Today'},
  {
    prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    title: 'Brunch this weekend?',
    subtitle: `<span class="text-primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
  },
  {type: 'divider', inset: true},
  {
    prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
    title: 'Summer BBQ',
    subtitle: `<span class="text-primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
  },
  {type: 'divider', inset: true},
  {
    prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
    title: 'Oui oui',
    subtitle: '<span class="text-primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
  },
  {type: 'divider', inset: true},
  {
    prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
    title: 'Birthday gift',
    subtitle: '<span class="text-primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
  },
  {type: 'divider', inset: true},
  {
    prependAvatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
    title: 'Recipe to try',
    subtitle: '<span class="text-primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
  },
]
</script>
<style>
.custom-scroll {
  overflow-y: scroll;
}
</style>
