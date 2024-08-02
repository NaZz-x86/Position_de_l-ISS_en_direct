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
    const astronauteIcon = L.icon({
        iconUrl : '/images/astronaute.png',
        iconSize : [50,50],
        iconAnchor : [25,25]
    })
    const aigleIcon = L.icon({
        iconUrl : '/images/aigle.png',
        iconSize : [50,50],
        iconAnchor : [25,25]
    })
        //function pour changer Icon
        function changementIcon(nomIcon){
            let nouvelIcon;
            switch(nomIcon){
                case 'issIcon':
                    nouvelIcon = issIcon;
                    break;
                case 'astronauteIcon':
                    nouvelIcon = astronauteIcon;
                    break;
                case 'aigleIcon':
                    nouvelIcon = aigleIcon;
                    break;
                default:
                    nouvelIcon = issIcon;
            }
            marqueurActuel.setIcon(nouvelIcon);
        }
        //Gerer le gengement de selection 
        document.getElementById('iconSelect').addEventListener('change', function(){
            changementIcon(this.value);
        })
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
                gps.innerText = `Latitude = ${latitude}  longitude = ${longitude}`
                itineraire.addLatLng([latitude, longitude]);
                //Offre la possibilité de supprimer une couche dans un bloc de données dans un document ArcMap
                if(marqueurActuel){
                    map.removeLayer(marqueurActuel);

                };
                //On ajoute le marquer sur la map avec API (latitude, longitude) + les information IssIcon
                marqueurActuel = L.marker([latitude, longitude], { icon: marqueurActuel?marqueurActuel.options.icon : issIcon }).addTo(map);
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                .then(r=> r.json())
                .then(reponse => {
                    const reponseAdresse = reponse['display_name'];
                    const adresseISS = document.getElementById('adresseISS');
                    if(reponseAdresse == null){
                        fetch(`http://api.geonames.org/oceanJSON?formatted=true&lat=${latitude}&lng=${longitude}&username=NicolasDev44`)
                            .then(r => r.json())
                            .then(reponse => {
                                const reponseMer = reponse['ocean']['name'];
                                adresseISS.innerText = reponseMer;
                                fetch('/traduction.json')
                                    .then(r => r.json())
                                    .then(reponse => {
                                        const traductionFrançais = reponse[reponseMer]
                                        console.log(traductionFrançais)
                                        adresseISS.innerText = traductionFrançais;
                                    })
                            })
                            .catch(error => adresseISS.innerText= 'Veuillez nous excuser nous avont plus de crédit API')
                    }else{
                    adresseISS.innerText = reponseAdresse;
                    }
                })
                .catch(error => console.error('Erreur :', error));
        });
    };    

    //Toute les 1000Seconde miseAjour des position et ajoute un nouveau marker
    setInterval(miseajourPosition,1000);
    //Pour initailiser le premier marquer 
    miseajourPosition();

});