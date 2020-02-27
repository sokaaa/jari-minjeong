<template>
  <v-card>
    <my-son name="aaa" @help="listen"></my-son>
    <my-doughter></my-doughter>
    <v-card-text>
      <v-alert v-model="call" type="success">This is a success alert.</v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import MySon from '@/components/MySon'
import MyDoughter from '@/components/MyDoughter'
export default {
  components: {
    MySon,
    MyDoughter
  },
  data () {
    return {
      call: false
    }
  },
  methods: {
    listen () {
      this.call = true
    }
  }
}
</script>
