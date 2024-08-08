//Charger le DOM
document.addEventListener("DOMContentLoaded", (event) => {
    let latitudeISS;
    let longitudeISS;
    let altitudeISS;
    //Point de départ de la map
    const map = L.map('map').setView([47.216671, -1.55], 13);
    //Affichage de la map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    //Icon
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
        iconAnchor : [25,25]
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

        //Gerer le gengement de selection 
        document.getElementById('iconSelect').addEventListener('change', function(){
            changementIcon(this.value);
        });
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
                //Récupére la latitudeISS et longitudeISS grace a l'api
                latitudeISS = reponse['latitude'];
                longitudeISS = reponse['longitude'];
                const vitesseReponse = reponse['velocity'];
                altitudeISS = reponse['altitude'];
                const vitesse = Math.floor(vitesseReponse);
                //Selectionne la balise et on insert pour afficher en toString la latitudeISS et longitudeISS 
                const gps = document.getElementById('gps');
                gps.innerHTML = `latitude : ${latitudeISS}<br>longitude : ${longitudeISS}<br> Vitesse : ${vitesse}Km/h<br> altitude : ${altitudeISS}Km `;
                itineraire.addLatLng([latitudeISS, longitudeISS]);
                //Gestion de continuité de la longitudeISS 
                if (dernierPoint) {
                    const dernierLongitudeISS = dernierPoint.lng;
                    if (Math.abs(longitudeISS - dernierLongitudeISS) > 180) {
                       itineraire.addLatLng([latitudeISS, longitudeISS]);
                    }else{
                        itineraire.addLatLng([latitudeISS, longitudeISS]);
                    }
                    dernierPoint = L.latLng(latitudeISS, longitudeISS);
                }
                    //récupére les la géolocalisation de l'utilisateur 
                if('geolocation' in navigator){
                     navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const latitudeUser = position.coords.latitude;
                            const longitudeUser = position.coords.longitude;
                            const geolocationIcon = L.icon ({
                            iconUrl : '/images/geolocalisation.png',
                            iconSize : [50,50],
                            iconAnchor : [25,25]
                            });
                            const distanceAvecISS = calculerDistance(latitudeISS,longitudeISS,altitudeISS,latitudeUser,longitudeUser);
                            const marquerUser = L.marker([latitudeUser,longitudeUser], {icon : geolocationIcon}).addTo(map)
                            marquerUser.bindPopup(`Tu te trouve actuellement à ${distanceAvecISS} km de l'ISS`)
                            setTimeout(()=>{
                                marquerUser.closePopup();
                            },5000);
                    
                        },
                    (error) => {
                        console.error('Une erreur c est produite');
                    },
                    {
                        enableHighAccuracy: true,// si dispo meilleur gps 
                        timeout : 5000, // delais max avt echec 
                        maximumAge : 0 //Ne pas garder les coordonnée en cache
                    }
                );
                }else{
                    console.error('N est pas supporter pas ne navigateur');
                };
                //Offre la possibilité de supprimer une couche dans un bloc de données dans un document ArcMap
                if(marqueurActuel){
                    map.removeLayer(marqueurActuel);

                };
                //On ajoute le marquer sur la map avec API (latitudeISS, longitudeISS) + les information IssIcon
                marqueurActuel = L.marker([latitudeISS, longitudeISS], { icon: marqueurActuel?marqueurActuel.options.icon : issIcon }).addTo(map);
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitudeISS}&lon=${longitudeISS}`)
                .then(r=> r.json())
                .then(reponse => {
                    const reponseAdresse = reponse['display_name'];
                    const adresseISS = document.getElementById('adresseISS');
                    if(reponseAdresse == null){
                        fetch(`http://api.geonames.org/oceanJSON?formatted=true&lat=${latitudeISS}&lng=${longitudeISS}&username=nicolasdev44`)
                            .then(r => r.json())
                            .then(reponse => {
                                const reponseMer = reponse['ocean']['name'];
                                console.log(reponseMer)
                                fetch('/traduction.json')
                                    .then(r => r.json())
                                    .then(reponse => {
                                        const traductionFrançais = reponse[reponseMer];
                                        if(traductionFrançais == undefined){
                                            adresseISS.innerText = reponseMer;
                                        }else{
                                            adresseISS.innerText = traductionFrançais;
                                        };
                                    })
                            })
                            .catch(error => adresseISS.innerText= 'Veuillez nous excuser il y a un problème avec L API');
                    }else{
                    adresseISS.innerText = reponseAdresse;
                    }
                })
                .catch(error => console.error('Erreur :', error));
        })
        .catch (error => adresseISS.innerText = "Veuillez nous excuser, il Y a un probléme avec L'API");
    };


    //Toute les 1000Seconde miseAjour des position et ajoute un nouveau marker
    setInterval(miseajourPosition,1000);
    setInterval(miseAjourHeure,1000);
    //Pour initailiser le premier marquer 
    miseajourPosition();
    miseAjourHeure();



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
    };
    //function pour calculer user vs iss en km qui les sépare 
    function calculerDistance(latA,longA,distA,latB,longB){
        //Rayon de la Terre en kilometre
        const R = 6371;
        //COnvertion des degrés en radians 
        let radLatA = latA * Math.PI / 180;
        let radLongA = longA * Math.PI / 180; 
        let radLatB = latB * Math.PI /180;
        let radLongB = longB * Math.PI /180;
        // Conversion en coordonnées cartésiennes
        //Iss
        let xA = distA * Math.cos(radLatA) * Math.cos(radLongA);
        let yA = distA * Math.cos(radLatA) * Math.sin(radLongA);
        let zA = distA * Math.sin(radLatA);
        //Point user 
        let xB = R * Math.cos(radLatB) * Math.cos(radLongB);
        let yB = R * Math.cos(radLatB) * Math.sin(radLongB);
        let zB = R * Math.sin(radLatB);
        //Calcule distance 
        const distanceEntreAB = Math.floor(Math.sqrt(Math.pow(xB-xA,2)+Math.pow(yB-yA,2)+Math.pow(zB-zA,2)));
        console.log(distanceEntreAB)
        return distanceEntreAB;
    };
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
    };
        
});