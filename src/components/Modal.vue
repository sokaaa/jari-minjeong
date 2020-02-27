<template>
<modal name="demo-login" transition="pop-out" :width="modalWidth" :height="700">
  <v-card color="transparent" height="500" flat>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-card-title primary-title>
        <span class="title">회원가입</span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-actions>
        <v-btn color="primary" block @click="signInWithGoogle">
          <v-icon>mdi-google</v-icon>
          <v-divider vertical class="mx-3"></v-divider>
          Google 계정으로 가입
        </v-btn>
      </v-card-actions>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <v-flex xs5>
            <v-divider class="mt-2"></v-divider>
          </v-flex>
          <v-flex xs2>
            또는
          </v-flex>
          <v-flex xs5>
            <v-divider class="mt-2"></v-divider>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-text>
        <v-text-field
          label="성"
          v-model="form.lastName"
          :rules="[rule.required, rule.minLength(1), rule.maxLength(2)]"
          ></v-text-field>
        <v-text-field
          label="이름"
          v-model="form.firstName"
          :rules="[rule.required, rule.minLength(1), rule.maxLength(10)]"
          required
          ></v-text-field>
        <v-text-field
          label="이메일"
          v-model="form.email"
          :rules="[rule.required, rule.minLength(7), rule.maxLength(50), rule.email]"
          required
          ></v-text-field>
        <v-text-field
          label="비밀번호"
          v-model="form.password"
          :rules="[rule.required, rule.minLength(6), rule.maxLength(50)]"
          type="password"
          required
          ></v-text-field>
        <div class="recaptcha-terms-text">이 페이지는 reCAPTCHA로 보호되며, Google 개인정보처리방침 및 서비스 약관의 적용을 받습니다.</div>
      </v-card-text>

      <v-card-actions>
        <v-checkbox
          label="약관에 동의함"
          v-model="agree"
          :rules="[rule.agree]"
          required
        ></v-checkbox>
        <v-spacer></v-spacer>
        <v-btn color="primary" :disabled="!valid" @click="createWithEmailAndPassword">
          회원가입
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
  </modal>
</template>

<script>
const MODAL_WIDTH = 656

export default {
  name: 'DemoLoginModal',
  data () {
    return {
      modalWidth: MODAL_WIDTH,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
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
    async signInWithGoogle () {
      const provider = new this.$firebase.auth.GoogleAuthProvider()
      this.$firebase.auth().languageCode = 'ko'
      await this.$firebase.auth().signInWithPopup(provider)
    },
    async createWithEmailAndPassword () {
      if (!this.$refs.form.validate()) return this.$toasted.global.error('입력 폼을 올바르게 작성해주세요.')
      await this.$firebase.auth().createUserWithEmailAndPassword(this.form.email, this.form.password)
      const user = this.$firebase.auth().currentUser // 회원가입 시 바로 로그인이 얘 때문인 듯 // 아닌걸로
      // eslint-disable-next-line no-unused-vars
      const result = await user.updateProfile({ // db에 onCreate 때문에 이게 저장 안되는 문제 어떻게 해결?
        displayName: `${this.form.lastName} ${this.form.firstName}`
      })
      this.$axios.patch(`/admin/user/${user.uid}/displayName`, {
        displayName: user.displayName
      })
      // console.log(result)
    }
  }
}
</script>

<style scoped>
.recaptcha-terms-text {
    font-size: 12px;
    font-weight: 200;
    color: #637282
}
</style>
