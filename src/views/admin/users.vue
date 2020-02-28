/* eslint-disable vue/no-unused-components */
/* eslint-disable no-unused-vars */
<template>
  <v-container grid-list-md>
     <create-client-modal/>
    <v-card>
      <v-toolbar
        dark
        color="teal"
      >
        <v-toolbar-title>회원 관리</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-autocomplete
          v-model="email"
          :loading="loadingSearch"
          :items="emails"
          :search-input.sync="search"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="이메일을 입력하세요"
          solo-inverted
          clearable
        ></v-autocomplete>
        <v-btn icon @click="list" :disabled="loading">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container grid-list-md fluid>
        <v-data-iterator
          :items="items"
          :options.sync="options"
          :server-items-length="totalCount"
          :items-per-page="4"
          :loading="loading"
        >
          <template v-slot:default="props">
            <v-layout row wrap>
              <v-flex xs12 v-if="loading" class="text-center">
                <v-progress-circular indeterminate></v-progress-circular>
                <p>데이터 로딩중</p>

              </v-flex>
              <v-flex
                v-else
                v-for="item in props.items"
                :key="item.email"
                xs12
                sm6
                md4
                lg3
              >
                <user-card :item="item"></user-card>
              </v-flex>
            </v-layout>
          </template>

        </v-data-iterator>
      </v-container>
    </v-card>
    <v-spacer></v-spacer>
    <v-card-actions>
        <v-btn color="primary" @click="$modal.show('create-client')">
          회원등록
        </v-btn>
      </v-card-actions>
  </v-container>
</template>

<script>
import CreateClientModal from '@/components/CreateClientModal'
import UserCard from '@/components/userCard'
import _ from 'lodash' // 연속 입력 꼬임방지 위한 debounce 이용
export default {
  components: {
    CreateClientModal,
    UserCard
  },
  data () {
    return {
      headers: [
        {
          text: 'uid',
          value: 'uid'
        },
        // uid, email, displayName, emailVerified, photoURL, disabled, level
        { text: 'email', value: 'email' },
        { text: 'displayName', value: 'displayName' },
        { text: 'photoURL', value: 'photoURL' },
        { text: 'level', value: 'level' }
      ],
      items: [],
      totalCount: 0,
      loading: false,
      options: {
        sortBy: ['email'],
        sortDesc: [false]
      },
      search: '',
      emails: [],
      email: null,
      loadingSearch: false
    }
  },
  watch: {
    options: {
      handler () {
        this.list()
      },
      deep: true
    },
    search (val) {
      val && val !== this.email && this.searchEmails(val)
    },
    email (n, o) { // new, old
      if (n !== o) this.list()
    }
  },
  methods: {
    async list () {
      this.loading = true // 로딩 만들기 팁 (시작과 끝)
      const r = await this.$axios.get('/admin/users', { // functions/admin/index.js와 이어짐
        params: {
          offset: this.options.page > 0 ? (this.options.page - 1) * this.options.itemsPerPage : 0,
          limit: this.options.itemsPerPage,
          order: this.options.sortBy[0],
          sort: this.options.sortDesc[0] ? 'desc' : 'asc',
          search: this.email
        }
      })
      this.totalCount = r.data.totalCount
      this.items = r.data.items
      this.loading = false
    },
    searchEmails: _.debounce(
      function (val) {
        this.loadingSearch = true

        this.$axios.get('/admin/search', {
          params: { search: this.search }
        })
          .then(({ data }) => {
            this.emails = data
          })
          .catch(e => {
            this.$toasted.global.error(e.message)
          })
          .finally(() => {
            this.loadingSearch = false
          })
      }, 500
    )
  }
}
</script>

<style>

</style>
