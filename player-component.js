
Vue.component('series', {
        template:
        `
        <p>
        <label for="serie">Choisissez une série</label>
        <select name="serie">
            <option v-for="s in nbseries" :value="s.id">{{s.ville}}</option>
        </select>
        </p>
        `,

        props:['nbseries'],
        
})

Vue.component('photos', {
    template:
    `
    <div>
        <img :src="urlphoto.url">
        <button v-on:click="$emit('valider')">Valider</button>
    </div>
    `,

    props:['urlphoto'],

})
