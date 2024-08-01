//Charger le DOM
document.addEventListener("DOMContentLoaded", (event) => {
    //Point de départ de la map
    const map = L.map('map').setView([47.216671, -1.55], 13);
    //Affichage de la map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    //Icon(Img de l'iss)
    const issIcon = L.icon({
        iconUrl : '/images/iss.png',
        iconSize: [50,50],
        iconAnchor : [25,25]
    });
    //Marquer actuelle ( pour suprimer l'ancienne possition)
    let marqueurActuel = null;
    //Les pointillés
    let itineraire = L.polyline([], {
        color: 'black',            // Couleur de la ligne
        dashArray: '5, 10'       // Motif des pointillés : 5 pixels de ligne, 10 pixels d'espace
    }).addTo(map);
    //fonction de mise a jout de position de ISS
    function miseajourPosition(){
        //requette HTTP pour récupéré resource API
        fetch('http://api.open-notify.org/iss-now.json')
        //Conversion de donnée en JSON
            .then(r => r.json())
            //Traitement des donné
            .then(reponse =>{
                //Récupére la latitude et longitude grace a l'api
                const latitude = reponse['iss_position']['latitude'];
                const longitude = reponse['iss_position']['longitude'];
                //Selectionne la balise et on insert pour afficher en toString la latitude et longitude 
                const gps = document.getElementById('gps');
                gps.innerText = `Latitude = ${latitude} | longitude = ${longitude}`
                itineraire.addLatLng([latitude, longitude]);
                //Offre la possibilité de supprimer une couche dans un bloc de données dans un document ArcMap
                if(marqueurActuel){
                    map.removeLayer(marqueurActuel);

                };
                //On ajoute le marquer sur la map avec API (latitude, longitude) + les information IssIcon
                marqueurActuel = L.marker([latitude, longitude], { icon: issIcon }).addTo(map);
        });
    };    
    //Toute les 1000Seconde miseAjour des position et ajoute un nouveau marker
    setInterval(miseajourPosition,1000);
    //Pour initailiser le premier marquer 
    miseajourPosition();
});