
<template>
    <div class="col-sm-6 offset-sm-3">
        <h2>Login</h2>
        <form v-on:submit.prevent="submitForm">
              <h3>Sign In</h3>
              <div class="form-group">
                  <label>Email address</label>
                  <input type="email" id="email" v-model="form.email" class="form-control form-control-lg" />
              </div>

              <div class="form-group">
                  <label>Password</label>
                  <input type="password" id="password" v-model="form.password" class="form-control form-control-lg" />
              </div>
              <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>
         </form>
    </div>
</template>

<script>
import axios from 'axios';
import {mapMutations} from 'vuex';
    export default {
        data() {
            return {
            form: {
                email: '',
                password: ''
            },
            loginError: false,
            loginErrorMessage: ""
            }
        },
        methods: {
            ...mapMutations(["setUser, setToken"]),
            submitForm(){
                 axios.post(`${process.env.VUE_APP_URL}/api/login`, this.form)
                     .then((response) => {
                         //Perform Success Action
                          if(response.status === 200) {
                               const {token, user} = response.data.data;
                               this.$store.commit('setUser', user)
                               this.$store.commit('setToken', token)
                               localStorage.setItem('token', token)
                               localStorage.setItem('username', user.name)
                               localStorage.setItem('userID', user._id)
                               localStorage.setItem('company', user.company)
                               this.$router.push({ path : '/room' });
                          }
                     })
                     .catch((error) => {
                         if(error.response) {
                          /* the request was made and the server responded
                          with a status code that falls out of the range of 2xx */
                          console.log(error.response.data)
                          this.loginError= true;
                          this.loginErrorMessage=error.response.data;
                        }
                     })
            }
        }
    }
</script>