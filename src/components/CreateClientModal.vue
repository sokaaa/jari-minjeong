<template>
<modal name="create-client" transition="pop-out" :width="modalWidth" :height="700">
  <v-card color="transparent" height="500" flat>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-card-title primary-title>
        <span class="title">회원등록</span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="성"
          v-model="form.lastName"
          required
          ></v-text-field>
        <v-text-field
          label="이름"
          v-model="form.firstName"
          required
          ></v-text-field>
        <v-text-field
          label="이메일"
          v-model="form.email"
          :rules="[rule.required, rule.minLength(5), rule.maxLength(50), rule.email]"
          required
          ></v-text-field>
        <v-text-field
          label="사번"
          v-model="form.empNo"
          :rules="[rule.required, rule.minLength(6), rule.maxLength(50)]"
          required
          ></v-text-field>
          <v-select
            class="ma-2"
            label="소속"
            v-model="form.teamName"
            :items="teamNames"
            solo
            hide-details
            ></v-select>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" :disabled="!valid" @click="createByAdmin">
          회원등록
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
  </modal>
</template>

<script>
const MODAL_WIDTH = 656

export default {
  name: 'CreateClientModal',
  data () {
    return {
      teamNames: [
        { value: 'CM', text: 'CM' },
        { value: 'TA', text: 'TA' },
        { value: 'SO', text: 'SO' },
        { value: 'NoTeam', text: 'NoTeam' }
      ],
      modalWidth: MODAL_WIDTH,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        empNo: '',
        level: 2,
        teamName: 'NoTeam'
      },
      agree: false,
      rule: {
        required: v => !!v || '필수 항목입니다.',
        minLength: length => v => v.length >= length || `${length}자리 이상으로 입력하세요.`,
        maxLength: length => v => v.length <= length || `${length}자리 이하으로 입력하세요.`,
        email: v => /.+@.+/.test(v) || '이메일 형식에 맞지 않습니다.',
        agree: v => !!v || '약관에 동의해야 진행됩니다.'
      },
      valid: false
    }
  },
  created () {
    this.modalWidth = window.innerWidth < MODAL_WIDTH
      ? MODAL_WIDTH / 2
      : MODAL_WIDTH
  },
  methods: {
    async createByAdmin () {
      if (!this.$refs.form.validate()) return this.$toasted.global.error('입력 폼을 올바르게 작성해주세요.')
      await this.$axios.post(`/admin/user/${this.form.empNo}/createclient`, {
        email: this.form.email,
        // emailVerified: false,
        // phoneNumber: '+11234567890',
        password: this.form.empNo,
        displayName: `${this.form.lastName} ${this.form.firstName}`,
        level: this.form.level,
        teamName: this.form.teamName
        // photoURL: 'http://www.example.com/12345678/photo.png',
        // disabled: false
      })
    }
  }
}
</script>

<style>
</style>
