        var app = new Vue({
            el:"#application",
            
            data : {
                errors:[],
                pseudo:null,
                age:null,
                
                loading: true,
                errored: false,
                errorText: '',

                isStarted: false,
                listeSeries: [
                    {
                        "id":"1",
                        "ville":"Nancy", 
                        "map_ref":"1",
                        "dist":"1"
                    },
                    {
                        "id":"2",
                        "ville":"Reims", 
                        "map_ref":"2",
                        "dist":"1"
                    }
                ],

                compteurPhotos: 0,
                listePhotos: [
                    {
                        "id":"1",
                        "desc":"ça existe",
                        "position":"ici",
                        "url":"BD.png"
                    },
                    {
                        "id":"2",
                        "desc":"ça existe",
                        "position":"ici",
                        "url":"nativescript1.png"
                    }
                ],
                score: 0,
                click: '',
                timer: 0,

                //TIMER
                isRunning: false,
		        minutes:0,
		        secondes:0,
		        time:20,
                timer:null,

                //MAP
                map: null,
                tileLayer: null,
                layers: [
                    {
                        id: 0,
                        name: 'Restaurants',
                        active: false,
                        features: [
                            {
                            id: 0,
                            name: 'Bogart\'s Smokehouse',
                            type: 'marker',
                            coords: [38.6109607, -90.2050322],
                            }
                        ],
                    },
                ],
            },

            mounted() { /* Code to run when app is mounted */ 
                this.initMap();
            },

            methods:{
                //MAP
                initMap() {
                    this.map = L.map('map').setView([38.63, -90.23], 12);
        
                    this.tileLayer = L.tileLayer(
                      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                      {
                        maxZoom: 18,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                      }
                    );
                    
                    this.tileLayer.addTo(this.map);
                },
        
                getClick() {
                    //affichage position du clic
                    this.map.on('click', function (e) {
                        this.click= e.latlng.lat + ", " + e.latlng.lng;
                        console.log(this.click)
                    })
                },
                
                checkForm:function(e) {
                    if(this.pseudo && this.serie) return true;
                    this.errors = [];
                    if(!this.pseudo) this.errors.push("Un pseudo est requis.");
                    if(!this.serie) this.errors.push("Veuillez choisir une série.");
                    e.preventDefault();
                },
                
                //Créer et lance la partie
                startGame(){
                    this.time = 20
                    this.startTimer()
                    console.log("un mot")
                    this.isStarted = true
                   /*axios.post(``, {
                        body: this.postBody
                    })
                    .then(response => {console.log("un mot")})
                    .catch(e => {
                        this.errors.push(e)
                    })*/
                },

                //Déroulement du jeu
                play(){    
                    
                },

                //Valide la réponse du joueur
                validChoice(){
                    this.time = 20
                    if(this.compteurPhotos  < 11){
                        this.compteurPhotos ++
                        this.calculScore()
                        this.startTimer()
                    }
                },

                //Met à jour le score du joueur
                calculScore(){
                    if(this.click < this.listePhotos[this.compteurPhotos].dist){
                        points = 5
                        if(this.time >= 15){
                            point *= 4
                        }
                        else if((this.time > 15) && (this.time >= 10)){
                            point *= 2
                        }
                        else if((this.time > 10) && (this.time >= 20)){
                            point *= 1
                        }
                        else if(this.time <= 0){
                            points = 0
                        }
                        this.score += points
                    }
                    if(this.click < (this.listePhotos[this.compteurPhotos].dist)*2){
                        points = 3
                        if(this.time >= 15){
                            point *= 4
                        }
                        else if((this.time > 15) && (this.time >= 10)){
                            point *= 2
                        }
                        else if((this.time > 10) && (this.time >= 20)){
                            point *= 1
                        }
                        else if(this.time <= 0){
                            points = 0
                        }
                        this.score += points
                    }
                    if(this.click < (this.listePhotos[this.compteurPhotos].dist)*3){
                        points = 1
                        if(this.time >= 15){
                            point *= 4
                        }
                        else if((this.time > 15) && (this.time >= 10)){
                            point *= 2
                        }
                        else if((this.time > 10) && (this.time >= 20)){
                            point *= 1
                        }
                        else if(this.time <= 0){
                            points = 0
                        }
                        this.score += points
                    }
                },

                //Retour au menu de sélection
                backHome(){
                    this.isStarted = false
                },

                //Sauvegarde le score du joueur
                saveScore(){

                    this.backHome()
                },

                //GESTION DU TIMER
                startTimer () {
			        this.isRunning = true
			        if (!this.timer) {
				        this.timer = setInterval( () => {
						    if (this.time > 0) {
							    this.time--
						    }
				        }, 1000 )
                    }
                },
                

            },
            
            computed:{
                // emplacement ou effectue les calculs qu'on ferait quand l'événement onDOMReady est ok


            },

        });