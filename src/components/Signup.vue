
<template>
    <div class="col-sm-6 offset-sm-3">
        <h2>Register</h2>
        <form v-on:submit.prevent="submitForm">
                              <h3>Sign Up</h3>

                              <div class="form-group">
                                  <label>Full Name</label>
                                  <input type="text" id="name" v-model="form.name" class="form-control form-control-lg"/>
                              </div>
                                <!--
                              <div class="form-group">
                                  <label>Company Name</label>
                                  <input type="text" id="company" v-model="form.company" class="form-control form-control-lg"/>
                              </div>-->
                                  <div class="form-group ">
                                    <label for="inputState">Company</label>
                                    <select v-model="form.company" id="company" class="form-control">
                                      <option selected>COLA</option>
                                      <option>PEPSI</option>
                                    </select>
                                  </div>

                              <div class="form-group">
                                  <label>Email address</label>
                                  <input type="email" id="email" v-model="form.email" class="form-control form-control-lg" />
                              </div>

                              <div class="form-group">
                                  <label>Password</label>
                                  <input type="password" id="password" v-model="form.password" class="form-control form-control-lg" />
                              </div>

                              <button type="submit" class="btn btn-dark btn-lg btn-block">Sign Up</button>

                              <p class="forgot-password text-right">
                                  Already registered
                                  <router-link :to="{name: 'login'}">sign in?</router-link>
                              </p>
                          </form>
    </div>
</template>

<script>
import axios from 'axios';
//import UserService from '@/services/UserService.js';
    export default {
        data() {
            return {
            form: {
                    name: '',
                    company: '',
                    email: '',
                    password: ''

             },
             registerError: false,
             registerErrorMessage: ""
            }
        },

        methods: {
            submitForm(){
            console.log("here", process.env.VUE_APP_URL)
                 axios.post(`${process.env.VUE_APP_URL}/api/register`, this.form)
                     .then((response) => {
                         //Perform Success Action
                         console.log(response)
                          if(response.status === 200) {
                                this.$router.push({ path : '/login' });
                          }
                     })
                     .catch((error) => {
                         if(error.response) {
                             console.log(error.response.data)
                             this.registerError= true;
                             this.registerErrorMessage=error.response.data;
                           }
                     })
            }
        }
    }
</script>