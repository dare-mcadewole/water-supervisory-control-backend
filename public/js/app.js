/*
 * File: ''
 * Created by Dare McAdewole <dare.dev.adewole@gmail.com>
 * Created on Wed Jul 03 2019
 *
 * Copyright (c) 2019 Echwood Inc.
 *
 * Description:
 *       
 */
Vue.use(Buefy);

var app = new Vue({
    el: '#app',

    mounted () {
        var socket = io('http://localhost:5555/wms?token=hEmG3Zw1frt5ZGuQ609II7KRstubkBG5');
        socket.on('connect', () => {
            this.isConnected = true;
            this.$toast.open('Connected to WMS server');
            socket.on('wms-sensor-data', ({ tank, sensor, value }) => {
                this.tanks[tank-1][sensor-1].value = value;
                this.$toast.open(`Tank ${tank}, Sensor ${sensor} has been updated!`);
                this.tanks.forEach((tank, index) => {
                    if (tank[0].value - tank[1].value > this.flowGap) {
                        tank[0].isOn = false;
                        socket.emit('wms-tank-off', {
                            tankId: index+1,
                            comment: 'LEAKAGE'
                        });
                    } else if (!tank[0].isOn) {
                        tank[0].isOn = true;
                        socket.emit('wms-tank-on', {
                            tankId: index+1
                        });
                    }
                });
            });
        });
    },

    data: {
        flowGap: 3,
        isConnected: false,
        tanks: [
            [ { value: 67, isOn: true }, { value: 66, isOn: true } ],
            [ { value: 78, isOn: true }, { value: 65, isOn: true } ],
            [ { value: 62, isOn: true }, { value: 60, isOn: true } ],
            [ { value: 123, isOn: true }, { value: 126, isOn: true } ]
        ]
    },

    computed: {
        isThereLeakage () {}
    },

    methods: {
        difference (sensor1, sensor2) {
            return Math.abs(sensor1 - sensor2);
        }
    }
});
