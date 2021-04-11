<template>
    <div class="col-sm-12 offset-sm-12">
        <nav class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row fixed-top">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">Hello {{userName}}</a>
            </div>

            <ul class="nav navbar-nav navbar-right">
                <li>
                <!--<a href="#" @click="logout"><span class="glyphicon glyphicon-log-in"></span> Logout</a>-->
                 <router-link :to="{name: 'login'}"  @click="logout" >Logout</router-link>
                </li>
            </ul>
        </nav>
        <div >
            <full-calendar class="calendar" :events="getListEvents"  :editable="true" :selectable="true" :config="config" @event-created="eventCreated" @event-selected="cancelRoom"   ></full-calendar>
             <div v-if="showModal">
                <transition name="modal">
                  <div class="modal-mask">
                    <div class="modal-wrapper">
                      <div class="modal-dialog" role="document">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 v-if="toBook" class="modal-title">Book Room</h5>
                            <h5 v-if="toCancel" class="modal-title">Cancel</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true" @click="reset">&times;</span>
                            </button>
                          </div>
                          <div v-if="toBook" class="modal-body">
                                <table style="width:100%">
                                  <tr>
                                    <td><span style ="font-weight:bold">Label: </span></td>
                                    <td><input  v-model="nameEvent" id="labelEvent" placeholder="Enter label"></td>
                                  </tr>
                                  <tr>
                                    <td><span style ="font-weight:bold">Start Selected: </span></td>
                                    <td> {{selectedSlot.start}}</td>
                                  </tr>
                                  <tr>
                                      <td><span style ="font-weight:bold">End Selected: </span></td>
                                      <td> {{selectedSlot.end}}</td>
                                </tr>
                                </table>
                          </div>
                          <div v-if="toBook" class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="reset">Close</button>
                            <button  type="button" class="btn btn-primary" @click="book">Book</button>

                          </div>
                         <div v-if="toCancel" class="modal-footer">
                          <button type="button" class="btn btn-secondary" @click="reset">Close</button>

                          <button type="button" class="btn btn-primary" @click="cancel">Cancel</button>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapState} from "vuex";
import { FullCalendar } from 'vue-full-calendar'
import "fullcalendar-scheduler";
import 'fullcalendar/dist/fullcalendar.css';
import "fullcalendar-scheduler/dist/scheduler.min.css";
import {RESOURCES} from '../utils/constants'

export default {
    components: {
        FullCalendar,
    },
    data() {
        return {
        testresources: [],
        toBook: false,
        toCancel: false,
        show: true,
        nameEvent: '',
        showModal: false,
        selectedSlot: {},
        objNewSlot: {},
        objCancelledSlot: {},
        form: {
            roomID: 'coka',
            start: 'id',
        },
        userName: localStorage.getItem('username'),

        config: {
            defaultDate: "20191028",
            resourceAreaWidth:"120px",
            slotWidth:"50px",
            minTime: "9:00:00",
            maxTime: "18:00:00",
            hiddenDays: [ 0, 6 ],
            schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
            defaultView: "timelineDay",
            contentHeight: 'auto',
            resourceLabelText: "Rooms",
            resources: localStorage.getItem('company') == 'COLA' ? RESOURCES.COLA : RESOURCES.PEPSI,

        },
        events4: [{
            title : "koko",
            start : new Date('12 April 2021 10:00 UTC'),
            resourceId : "CO1", // should have another obj for the logistic
            end : new Date('12 April 2021 11:00 UTC'),
            }],
        events: this.$store.getters.allEvents,
        }
    },
    computed: {
        ...mapState({
            token: "token"
        }),
        testData() {
              return this.$store.state.user;
        },
        getListEvents() {
            return this.$store.getters.allEvents;
        },
        userResources() {
         return this.$store.getters.resources;
        }
    },
    watch: {
        listEvents (newCount, oldCount) {
            console.log("changed", newCount, oldCount)
        }
    },
    async created(){
        this.testResources = localStorage.getItem('company') == 'COLA' ? RESOURCES.COLA : RESOURCES.PEPSI
        this.$store.commit('setToken', localStorage.getItem('token'))
        let res = await this.fetchAllEvents()
        console.log('fetched', res.data.data)
        this.$store.commit('setAvailibilities', res.data.data)
        let mytest = res.data.data
        mytest.map(x => {
            x.start = new Date(x.start).toISOString();
            x.end = new Date(x.end).toISOString();
        });
        console.log('finall', mytest)
        this.events = mytest
    },
    mounted(){
        this.resources = this.$store.getters.resources;
    },

    methods: {
        reset(){
            this.showModal = false;
            this.toBook = false;
            this.toCancel = false;
        },
        cancelRoom(arg){

            this.toCancel = true;
            this.showModal = true;
            let startDate = arg.start._d.toISOString()
            let endDate = arg.end._d.toISOString()
            var ts_Start = Date.parse(startDate);
            var ts_End = Date.parse(endDate)
            this.objCancelledSlot.start= ts_Start
            this.objCancelledSlot.end= ts_End
            this.objCancelledSlot.resource= arg.resourceId
        },
        eventCreated(...test) {
            console.log(test);
            this.toBook = true;
            this.showModal = true;
            let resourceSelected = test[0].resource.id
            let startDate = test[0].start._d.toISOString()
            let endDate = test[0].end._d.toISOString()
            var ts_Start = Date.parse(startDate);
            var ts_End = Date.parse(endDate)
            this.objNewSlot.start= ts_Start
            this.objNewSlot.end= ts_End
            this.objNewSlot.resource= resourceSelected
            this.selectedSlot.start =new Date(ts_Start).toUTCString()
            this.selectedSlot.end =new Date(ts_End).toUTCString()
        },

        handleDateClick: function(arg) {
            alert('date click! ' + arg.dateStr)
        },
        book(){

            this.showModal = false;
            this.toBook = false;
            this.objNewSlot.eventName = this.nameEvent

            axios.post(`${process.env.VUE_APP_URL}/api/room/book`, this.objNewSlot,
            {
                headers: {
                'auth-token': `${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                if(response.status === 200) {
                    console.log("got this fron server", response)
                    // commit this array to store response.data.data
                    this.$store.commit('setEvents', response.data.data)
                }
            })
            .catch((error) => {
                if(error.response) {
                console.log(error.response.data)
                }
            })

        },
        async fetchAllEvents(){
           let res = await axios.get(`${process.env.VUE_APP_URL}/api/room/availibilities`, {
                           headers: {
                             'auth-token': `${localStorage.getItem('token')}`
                           }
                         });
           return res;
        },
        async cancel(){
            console.log('cancelling appointment')
             let response = await axios.post(`${process.env.VUE_APP_URL}/api/room/cancel`, this.objCancelledSlot,
             {
                   headers: {
                     'auth-token': `${localStorage.getItem('token')}`
                   }
                 });
                if(response.status === 200) {
                    console.log("got this fron server", response)
                    // commit this array to store response.data.data

                    this.$store.commit('setEvents', response.data.data)

                }

            this.showModal = false;
        },
        logout(){

            try{
                this.$router.push({ path : '/login' });
                localStorage.removeItem('token')
                localStorage.removeItem('company')
            }catch(err){
              console.log('errr logout', err)
            }

        }
    }


    }
</script>