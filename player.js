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
        <select name="serie" @change="getIDCity($event)" v-model="idSerie">
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
            <img :src="urlphoto.url">
            <button v-on:click="$emit('valider')">Valider</button>
        </div>
        `,
    props: ['urlphoto'],
})


/*-----------------------------------------------------------------------INSTANCE DE VUE--------------------------------------------------------------------------------------*/

var app = new Vue({
    el: "#application",

    data: {
        errors: [],
        pseudo: null,
        age: null,

        loading: true,
        errored: false,
        errorText: '',
        isStarted: false,
        listeSeries: [],

        compteurPhotos: 0,
        listePhotos: [
            {
                "id": "1",
                "desc": "ça existe",
                "position": "ici",
                "url": "BD.png"
            },
            {
                "id": "2",
                "desc": "ça existe",
                "position": "ici",
                "url": "nativescript1.png"
            }
        ],
        erreur: false,
        token: '',
        idPartie: '',
        seriePlayed: '',
        selected: '',
        score: 0,
        click: '',
        timer: 0,

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
            //console.log(this.seriePlayed)
        },


        getClick() {
            //affichage position du clic
            this.map.on('click', function (e) {
                this.click = e.latlng.lat + ", " + e.latlng.lng;
                //console.log(this.click)
            })
        },

        checkForm: function (e) {
            if (this.pseudo && this.serie) return true;
            this.errors = [];
            if (!this.pseudo) this.errors.push("Un pseudo est requis.");
            if (!this.serie) this.errors.push("Veuillez choisir une série.");
            e.preventDefault();
        },

        getAllSeries() {
            axios
                .get('http://localhost:8081/series',
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
            let url = 'http://localhost:8080/partie/' + this.seriePlayed;
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
            let url = 'http://localhost:8080/partie/' + this.id;
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
            if (this.seriePlayed == null || this.pseudo == null) {
                this.erreur = true;
            }
            else {
                //console.log("TEST" )
                console.log("série: " + this.seriePlayed);
                this.time = 20;
                this.startTimer();
                //console.log(this.seriePlayed)
                this.isStarted = true;

                this.partiePost(this.pseudo)
                    .then(response => {
                        this.id = response.data.id;
                        this.token = response.data.token;
                        console.log("id :" + this.id);
                        console.log("token: " + this.token);
                        console.log("réponse POST: ", response);
                        let url = 'http://localhost:8080/partie/' + this.id;
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
                                //resolve(response);
                                this.lat1 = response.data.serie.lat1
                                this.long1 = response.data.serie.lon1
                                this.lat2 = response.data.serie.lat2
                                this.long2 = response.data.serie.lon2
                                this.listePhotos = response.data.photo
                                console.log("lat1: "+this.lat1)
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

                            })
                            .catch(error => {
                                //  reject(error);
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
            this.time = 20
            if (this.compteurPhotos < 11) {
                this.compteurPhotos++
                this.calculScore()
                this.startTimer()
            }
            this.map.remove()
            setTimeout(this.initMap(), 1)
            //console.log("MAP : " + this.map)
        },

        //Met à jour le score du joueur
        calculScore() {
            if (this.click < this.listePhotos[this.compteurPhotos].dist) {
                points = 5
                if (this.time >= 15) {
                    point *= 4
                }
                else if ((this.time > 15) && (this.time >= 10)) {
                    point *= 2
                }
                else if ((this.time > 10) && (this.time >= 20)) {
                    point *= 1
                }
                else if (this.time <= 0) {
                    points = 0
                }
                this.score += points
            }
            if (this.click < (this.listePhotos[this.compteurPhotos].dist) * 2) {
                points = 3
                if (this.time >= 15) {
                    point *= 4
                }
                else if ((this.time > 15) && (this.time >= 10)) {
                    point *= 2
                }
                else if ((this.time > 10) && (this.time >= 20)) {
                    point *= 1
                }
                else if (this.time <= 0) {
                    points = 0
                }
                this.score += points
            }
            if (this.click < (this.listePhotos[this.compteurPhotos].dist) * 3) {
                points = 1
                if (this.time >= 15) {
                    point *= 4
                }
                else if ((this.time > 15) && (this.time >= 10)) {
                    point *= 2
                }
                else if ((this.time > 10) && (this.time >= 20)) {
                    point *= 1
                }
                else if (this.time <= 0) {
                    points = 0
                }
                this.score += points
            }
        },

        //Retour au menu de sélection
        backHome() {
            this.isStarted = false
        },

        //Sauvegarde le score du joueur
        saveScore() {
            axios
                .put('http://localhost:8080/partie/' + this.idPartie,
                    {
                        "score": "" + this.score
                    },
                    {
                        headers: { "Content-Type": "application/json" /*, "token": this.token */ },
                    })
                .then(response => {
                })
                .catch(e => {
                    this.errors.push(e)
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