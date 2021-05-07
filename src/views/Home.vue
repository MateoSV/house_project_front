<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2" class="mx-4 my-4">
          <v-img src="@/assets/househome.png"></v-img>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="justify-center d-flex align-center">
        <p @click="goToUrl('/houses')" class="blue--text text-h3">Ingresa tus proyectos</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="justify-center d-flex align-center">
        <p @click="goToUrl('/persons')" class="blue--text text-h3">Define tus intereses</p>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2" class="mx-4 my-4">
          <v-img src="@/assets/persons.png"></v-img>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    goToUrl(route){
      this.$router.push(route)
    }
  }
}
</script>
