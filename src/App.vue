<template>
  <v-app>
    <router-link :to="'/'"></router-link>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
  created () {
    this.$vuetify.theme.dark = true
  }
}
</script>
