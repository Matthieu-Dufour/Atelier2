   
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
                reponse: 0,
                timer: 0,

                //TIMER
                isRunning: false,
		        minutes:0,
		        secondes:0,
		        time:20,
		        timer:null,
            },

            methods:{
                
                checkForm:function(e) {
                    if(this.pseudo && this.serie) return true;
                    this.errors = [];
                    if(!this.pseudo) this.errors.push("Un pseudo est requis.");
                    if(!this.serie) this.errors.push("Veuillez choisir une série.");
                    e.preventDefault();
                },
                
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

                validChoice(){
                    this.time = 20
                    if(this.compteurPhotos  < 11){
                        this.compteurPhotos ++
                        this.calculScore()
                        this.startTimer()
                    }
                },

                calculScore(){
                    if(this.reponse < this.listePhotos[this.compteurPhotos].dist){
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
                    if(this.reponse < (this.listePhotos[this.compteurPhotos].dist)*2){
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
                    if(this.reponse < (this.listePhotos[this.compteurPhotos].dist)*3){
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

                play(){

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