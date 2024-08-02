//Charger le DOM
    document.addEventListener("DOMContentLoaded", (event) => {
        //Heures
        function miseAjourHeure(){
            let dateHeures = new Date();
            let dateFormat = dateHeures.toLocaleDateString('fr-FR',{
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'});
            const baliseHeureDate = document.getElementById('heureDate');
            baliseHeureDate.innerText = dateFormat;
        }
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
            iconSize : [30,30],
            iconAnchor : [25,25]
        });
        const aigleIcon = L.icon({
            iconUrl : '/images/aigle.png',
            iconSize : [30,30],
            iconAnchor : [25,25]
        });
        const avionIcon = L.icon({
            iconUrl : '/images/avion.png',
            iconSize : [30,30],
            inconAnchor : [25,25]
        });
        const planeteIcon = L.icon({
            iconUrl : '/images/planete-terre.png',
            iconSize : [30,30],
            iconAnchor : [25,25]
        });
        const fusee = L.icon({
            iconUrl : '/images/fusee.png',
            iconSize : [30,30],
            iconAnchor : [25,25]
        });
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
                    case 'avion':
                        nouvelIcon = avionIcon;
                        break;
                    case 'planete':
                        nouvelIcon = planeteIcon;
                        break;
                    case 'fusee' : 
                    nouvelIcon = fusee;
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
        let dernierPoint = null;
        //Les pointillés
        let itineraire = L.polyline([], {
            color: 'black',            // Couleur de la ligne
            dashArray: '5, 10'       // Motif des pointillés : 5 pixels de ligne, 10 pixels d'espace
        }).addTo(map);
        //fonction de mise a jout de position de ISS
        function miseajourPosition(){
            //requette HTTP pour récupéré resource API
            fetch('https://api.wheretheiss.at/v1/satellites/25544')
            //Conversion de donnée en JSON
                .then(r => r.json())
                //Traitement des donné
                .then(reponse =>{
                    //Récupére la latitude et longitude grace a l'api
                    const latitude = reponse['latitude'];
                    const longitude = reponse['longitude'];
                    const vitesseReponse = reponse['velocity'];
                    const altitude = reponse['altitude'];
                    const vitesse = Math.floor(vitesseReponse);
                    //Selectionne la balise et on insert pour afficher en toString la latitude et longitude 
                    const gps = document.getElementById('gps');
                    gps.innerHTML = `Latitude : ${latitude}<br>Longitude : ${longitude}<br> Vitesse : ${vitesse}Km/h<br> Altitude : ${altitude}Km `;
                    itineraire.addLatLng([latitude, longitude]);
                    //Gestion de continuité de la longitude 
                    if (dernierPoint) {
                        const dernierLongitude = dernierPoint.lng;
                        if (Math.abs(longitude - dernierLongitude) > 180) {
                            if (longitude > dernierLongitude) {
                                longitude -= 360;
                            } else {
                                longitude += 360;
                            }
                        }
                    }
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
                            fetch(`http://api.geonames.org/oceanJSON?formatted=true&lat=${latitude}&lng=${longitude}&username=nicolasdev44`)
                                .then(r => r.json())
                                .then(reponse => {
                                    const reponseMer = reponse['ocean']['name'];
                                    adresseISS.innerText = reponseMer;
                                    console.log(reponseMer)
                                    fetch('/traduction.json')
                                        .then(r => r.json())
                                        .then(reponse => {
                                            const traductionFrançais = reponse[reponseMer];
                                            adresseISS.innerText = traductionFrançais;
                                        })
                                })
                                .catch(error => adresseISS.innerText= 'Veuillez nous excuser il y a un problème avec L API');
                        }else{
                        adresseISS.innerText = reponseAdresse;
                        }
                    })
                    .catch(error => console.error('Erreur :', error));
            })
            .catch (error => adresseISS.innerText = "Veuillez nous excuser, le nombre de requêtes API a atteint son maximum");
        };    

        //Toute les 1000Seconde miseAjour des position et ajoute un nouveau marker
        setInterval(miseajourPosition,1000);
        setInterval(miseAjourHeure,1000);
        //Pour initailiser le premier marquer 
        miseajourPosition();
        miseAjourHeure();

    });