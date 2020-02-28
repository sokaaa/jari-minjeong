<template>
    <v-card :loading="loading">
        <v-list-item three-line>
        <v-list-item-avatar
            size="125"
            tile
            rounded
        >
            <v-img :src="item.photoURL | imgCheck"></v-img>
        </v-list-item-avatar>

        <v-list-item-content class="align-self-start">
            <v-list-item-title
            class="headline mb-2"
            v-text="item.email"
            ></v-list-item-title>
            <v-list-item-subtitle>{{item.displayName | nameCheck}}</v-list-item-subtitle>
            <!--item의 level 의 값이, levels 에 있는 value 값 중 하나로 할당된다-->
            <v-select
                class="ma-2"
                v-model="item.level"
                :items="levels"
                solo
                hide-details
                @change="levelChange(item)"
            ></v-select>
            <v-btn
                @click="deleteByAdmin(item)">
              <v-icon>mdi-delete</v-icon>
              삭제
            </v-btn>
        </v-list-item-content>
        </v-list-item>
    </v-card>
</template>

<script>
export default {
  props: ['item'],
  data () {
    return {
      loading: false,
      levels: [
        { value: 0, text: '관리자' },
        { value: 1, text: '사용자' },
        { value: 2, text: '손님' }
      ]
    }
  },
  filters: {
    nameCheck: function (v) {
      if (v) return v
      return 'no name'
    },
    imgCheck (v) {
      if (v) return v
      return 'https://cdn.vuetifyjs.com/images/cards/foster.jpg'
    }
  },
  methods: {
    levelChange (v) {
      this.loading = true
      this.$axios.patch(`/admin/user/${v.uid}/changeclient/level`, {
        level: v.level
      })
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    async deleteByAdmin (v) {
      // this.loading = true
      await this.$axios.delete(`/admin/user/${v.uid}/deleteclient`)
        .catch(e => {
          this.$toasted.global.error(e.message)
        })
        // .finally(() => {
        //   this.loading = false
        // })
    }
  }
}
</script>
