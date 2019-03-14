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
        //reponse: e.latlng.toString(),
        timer: 0,

        //TIMER
        isRunning: false,
        minutes:0,
        secondes:0,
        time:20,
        timer:null,

        map: L.map('map').setView([51.505, -0.09], 13),

        marker: L.marker([51.5, -0.09]).addTo(map),

        circle: L.circle([51.508, -0.11], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
            }).addTo(map),

        polygon: L.polygon([
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047]
           ]).addTo(map),

           popup: L.popup()
           .setLatLng([51.5, -0.09])
           .setContent("I am a standalone popup.")
           .openOn(map),

           marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup()
    },

    methods:{
        
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
