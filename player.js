/*------------------------------------------------------------------------COMPONENTS------------------------------------------------------------------------------------------*/
Vue.component('series', {
    data: function () {
        return {
            idSerie: '',
        }
    },
    methods: {
        getIDCity(event) {
            this.idSerie = event.target.value;
            //console.log(this.idSerie)
            this.$emit("getidserie", this.idSerie)
        },
    },
    template:
        `
        <p>
        <label for="serie">Choisissez une série</label>
        </br>
        <select class="mdb-select md-form colorful-select dropdown-primary" name="serie" @change="getIDCity($event)" v-model="idSerie">
            <option disabled value="">Choisissez</option>
            <option v-for="s in nbseries" :value="s.id">{{s.ville}}</option>
        </select>
        </p>
        `,
    props: ['nbseries', 'selected']
})

Vue.component('photos', {
    
    template:
        `
        <div>
            <img :src="'.'+urlphoto.url">
            </br></br>
            <button class="btn btn-primary" v-on:click="$emit('valider')">Valider</button>
        </div>
        `,
    props: ['urlphoto'],
})


/*-----------------------------------------------------------------------INSTANCE DE VUE--------------------------------------------------------------------------------------*/

var app = new Vue({
    el: "#application",

    data: {

        host: "localhost",

        errors: [],
        pseudo: null,
        age: null,

        loading: true,
        errored: false,
        errorText: '',
        isStarted: false,
        listeSeries: [],

        compteurPhotos: 0,
        listePhotos: [],
        erreur: false,
        token: '',
        idPartie: '',
        seriePlayed: '',
        selected: '',
        score: 0,
        click: '',
        timer: 0,
        over: false,

        //TIMER
        isRunning: false,
        minutes: 0,
        secondes: 0,
        time: 20,
        timer: null,

        //MAP
        lat1: '',
        long1: '',
        lat2: '',
        long1: '',
        mapMarker: null,
        ajoutLatitude: null,
        ajoutLongitude: null,
        photoPos: null,

        map: null,
        tileLayer: null,
        layers: [
            {

            },
        ],
    },

    mounted() { /* Code to run when app is mounted */
        this.getAllSeries();

    },

    methods: {
        //MAP
        initMap(coord) {
            this.map = L.map('map', { zoomControl: false }).fitBounds(coord);

            this.tileLayer = L.tileLayer(
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                {
                    maxZoom: 18,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                }
            );
            this.tileLayer.addTo(this.map);
            this.map.dragging.disable();
            this.map.touchZoom.disable();
            this.map.doubleClickZoom.disable();
            this.map.scrollWheelZoom.disable();
        },

        getIdSerie(id) {
            this.seriePlayed = id
        },


        getClickPosition(event) {
            /* Retourne la position du click sur la map photo */
            var latlng = this.map.mouseEventToLatLng(event);
            this.ajoutLatitude = latlng.lat;
            this.ajoutLongitude = latlng.lng;
            if (this.mapMarker == null) {
                this.mapMarker = new L.marker([this.ajoutLatitude, this.ajoutLongitude]);
                this.mapMarker.addTo(this.map);
            } else {
                this.mapMarker.setLatLng([this.ajoutLatitude, this.ajoutLongitude]);
            }
            this.click = L.latLng([this.ajoutLatitude, this.ajoutLongitude]);
            console.log("click: " + this.click);
        },

        // getClick() {
        //     //affichage position du clic
        //     this.map.on('click', function (e) {
        //         this.click = e.latlng.lat + ", " + e.latlng.lng;
        //         console.log("Click: " + this.click);
        //     })
        // },

        getAllSeries() {
            axios
                .get('http://'+this.host+':8081/series',
                    {
                        headers:
                            { 'Access-Control-Allow-Origin': 'http://localhost:8081/series' }
                    }
                )
                .then(response => {
                    this.listeSeries = response.data
                })
                .catch(error => {
                    this.errored = true
                    this.errorText = error
                })
                .finally(() => {
                    //Cette méthode est appelée quand le callback d'une promise est éxécuté : resolve ou reject peu importe.
                    // Cela évite de dupliquer le traitement dans le .then et dans le .catch
                    this.loading = false
                })
        },

        partiePost(pseudo) {
            let url = 'http://'+this.host+':8080/partie/' + this.seriePlayed;
            return new Promise(function (resolve, reject) {
                console.log("pseudo: " + app.$data.pseudo);
                axios
                    .post(url,
                        {
                            joueur: "" + pseudo
                        },
                        {
                            headers:
                            {
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },

        getPartie() {
            let url = 'http://'+this.host+':8080/partie/' + this.id;
            return new Promise(function (resolve, reject) {
                axios
                    .get(url,
                        {
                            headers:
                            {
                                'Content-Type': 'application/json',
                                'token': this.token
                            }
                            , proxy:
                            {
                                host: 'http://www-cache.iutnc.univ-lorraine.fr',
                                port: 3128
                            }
                        })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },

        startGame() {
            console.log("over: "+this.over)
            if (this.seriePlayed == '' || this.pseudo == null) {
                this.erreur = true;
            }
            else {
                //console.log("TEST" )
                console.log("série: " + this.seriePlayed);
                this.time = 20;
                this.startTimer();
                this.isStarted = true;

                this.partiePost(this.pseudo)
                    .then(response => {
                        this.id = response.data.id;
                        this.token = response.data.token;
                        console.log("id :" + this.id);
                        console.log("token: " + this.token);
                        console.log("réponse POST: ", response);
                        let url = 'http://'+this.host+':8080/partie/' + this.id;
                        axios
                            .get(url,
                                {
                                    headers:
                                    {
                                        'Content-Type': 'application/json',
                                        'token': this.token
                                    }
                                    , proxy:
                                    {
                                        host: 'http://www-cache.iutnc.univ-lorraine.fr',
                                        port: 3128
                                    }
                                })
                            .then(response => {
                                this.lat1 = response.data.serie.lat1;
                                this.long1 = response.data.serie.lon1;
                                this.lat2 = response.data.serie.lat2;
                                this.long2 = response.data.serie.lon2;
                                this.dist = response.data.serie.dist;
                                this.listePhotos = response.data.photo;
                                console.log("lat1: " + this.lat1);
                                console.log("réponse getPartie:", response);
                                setTimeout(() => this.initMap(
                                    [
                                        [
                                            parseFloat(new Array(
                                                new Array(this.lat1, this.long1),
                                                new Array(this.lat2, this.long2)
                                            )
                                            ),
                                            parseFloat(this.long1)
                                        ],
                                        [
                                            parseFloat(this.lat2),
                                            parseFloat(this.long2)
                                        ]
                                    ]), 1);
                                console.log("liste photos: " ,this.listePhotos)
                            })
                            .catch(error => {
                                console.log("Erreur getPartie(): ", error);
                            })
                    })
                    .catch(error => {
                        console.log("Erreur partiePost(): ", error);
                    })
            }
        },

        //Valide la réponse du joueur
        validChoice() {
            this.mapMarker = null;
            this.time = 20;
            if (this.compteurPhotos < 10) {
                this.compteurPhotos++;
                console.log("compteurPhoto: " + this.compteurPhotos)
                this.calculScore()
                this.startTimer();
                this.map.remove();
                setTimeout(() => this.initMap(
                    [
                        [
                            parseFloat(new Array(
                                new Array(this.lat1, this.long1),
                                new Array(this.lat2, this.long2)
                            )
                            ),
                            parseFloat(this.long1)
                        ],
                        [
                            parseFloat(this.lat2),
                            parseFloat(this.long2)
                        ]
                    ]), 1);
                this.over = false;
            }
            if(this.compteurPhotos >= 10){
                this.over = true;
            }
        },

        //Met à jour le score du joueur
        calculScore() {
            let photoLat = this.listePhotos[this.compteurPhotos-1].lat;
            let photoLon = this.listePhotos[this.compteurPhotos-1].lon;
            this.photoPos = L.latLng([photoLat, photoLon]);
            if (L.GeometryUtil.length([this.click, this.photoPos]) < this.dist) {
                points = 5
                if (this.time >= 15) {
                    points *= 4
                }
                else if ((this.time > 15) && (this.time >= 10)) {
                    points *= 2
                }
                else if ((this.time > 10) && (this.time >= 20)) {
                    points *= 1
                }
                else if (this.time <= 0) {
                    points = 0
                }
                this.score += points
            }
            if ((L.GeometryUtil.length([this.click, this.photoPos]) > this.dist) && (L.GeometryUtil.length([this.click, this.photoPos]) < (this.dist * 2))) {
                points = 3
                if (this.time >= 15) {
                    points *= 4
                }
                else if ((this.time > 15) && (this.time >= 10)) {
                    points *= 2
                }
                else if ((this.time > 10) && (this.time >= 20)) {
                    points *= 1
                }
                else if (this.time <= 0) {
                    points = 0
                }
                this.score += points
            }
            if ((L.GeometryUtil.length([this.click, this.photoPos]) > (this.dist*2)) && (L.GeometryUtil.length([this.click, this.photoPos]) < (this.dist *3))) {
                points = 1
                if (this.time >= 15) {
                    points *= 4
                }
                else if ((this.time > 15) && (this.time >= 10)) {
                    points *= 2
                }
                else if ((this.time > 10) && (this.time >= 20)) {
                    points *= 1
                }
                else if (this.time <= 0) {
                    points = 0
                }
                this.score += points
            }
        },

        //Retour au menu de sélection
        backHome() {
            this.isStarted = false;
            this.compteurPhotos = 0;
            this.listePhotos = [];
            this.token = '';
            this.idPartie = '';
            this.seriePlayed = '';
            this.score = 0;
            this.pseudo = null;
        },

        //Sauvegarde le score du joueur
        saveScore() {
            console.log("idPartie: " + this.id)
            axios
                .put('http://'+this.host+':8080/partie/' + this.id,
                    {
                        "score": "" + this.score,
                        "status": "stop"
                    },
                    {
                        headers: { "Content-Type": "application/json" /*, "token": this.token */ },
                    })
                .then(response => {
                    console.log("Score: " + this.score);
                })
                .catch(e => {
                    this.errors.push(e)
                    console.log("erreur score: ", error)
                })
            this.backHome()
        },

        //GESTION DU TIMER
        startTimer() {
            this.isRunning = true
            if (!this.timer) {
                this.timer = setInterval(() => {
                    if (this.time > 0) {
                        this.time--
                    }
                }, 1000)
            }
        },

    },

    computed: {
        // emplacement ou effectue les calculs qu'on ferait quand l'événement onDOMReady est ok

    },

});