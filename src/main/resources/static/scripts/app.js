document.addEventListener("DOMContentLoaded", (event) => {
    let latitudeISS;
    let longitudeISS;
    let altitudeISS;
    let userGeolocated = false;

    //Point de départ de la map
    const map = L.map('map').setView([47.216671, -1.55], 13);

    //Affichage de la map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //Icones
    const icons = {
        issIcon: L.icon({iconUrl: '/images/iss.png', iconSize: [50, 50], iconAnchor: [25, 25]}),
        astronauteIcon: L.icon({iconUrl: '/images/astronaute.png', iconSize: [30, 30], iconAnchor: [25, 25]}),
        aigleIcon: L.icon({iconUrl: '/images/aigle.png', iconSize: [30, 30], iconAnchor: [25, 25]}),
        avionIcon: L.icon({iconUrl: '/images/avion.png', iconSize: [30, 30], iconAnchor: [25, 25]}),
        planeteIcon: L.icon({iconUrl: '/images/planete-terre.png', iconSize: [30, 30], iconAnchor: [25, 25]}),
        fuseeIcon: L.icon({iconUrl: '/images/fusee.png', iconSize: [30, 30], iconAnchor: [25, 25]})
    };

    document.getElementById('iconSelect').addEventListener('change', function() {
        changementIcon(this.value);
    });

    // Marqueur actuel (pour supprimer l'ancienne position)
    let marqueurActuel = null;
    let dernierPoint = null;

    // Les pointillés
    let itineraire = L.polyline([], {
        color: 'black',
        dashArray: '5, 10'
    }).addTo(map);

    // Fonction de mise à jour de position de l'ISS
    function miseajourPosition() {
        fetch('https://api.wheretheiss.at/v1/satellites/25544')
            .then(r => r.json())
            .then(reponse => {
                latitudeISS = reponse.latitude;
                longitudeISS = reponse.longitude;
                const vitesse = Math.floor(reponse.velocity);
                altitudeISS = reponse.altitude;

                const gps = document.getElementById('gps');
                gps.innerHTML = `latitude : ${latitudeISS}<br>longitude : ${longitudeISS}<br> Vitesse : ${vitesse} Km/h<br> altitude : ${altitudeISS} Km`;

                itineraire.addLatLng([latitudeISS, longitudeISS]);

                if (dernierPoint) {
                    const dernierLongitudeISS = dernierPoint.lng;
                    if (Math.abs(longitudeISS - dernierLongitudeISS) > 180) {
                        itineraire.addLatLng([latitudeISS, longitudeISS]);
                    } else {
                        itineraire.addLatLng([latitudeISS, longitudeISS]);
                    }
                    dernierPoint = L.latLng(latitudeISS, longitudeISS);
                }

                if (marqueurActuel) {
                    map.removeLayer(marqueurActuel);
                }

                marqueurActuel = L.marker([latitudeISS, longitudeISS], { icon: marqueurActuel ? marqueurActuel.options.icon : icons.issIcon }).addTo(map);

                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitudeISS}&lon=${longitudeISS}`)
                    .then(r => r.json())
                    .then(reponse => {
                        const reponseAdresse = reponse.display_name;
                        const adresseISS = document.getElementById('adresseISS');
                        if (reponseAdresse == null) {
                            fetch(`http://api.geonames.org/oceanJSON?formatted=true&lat=${latitudeISS}&lng=${longitudeISS}&username=nicolasdev44`)
                                .then(r => r.json())
                                .then(reponse => {
                                    const reponseMer = reponse.ocean.name;
                                    fetch('/traduction.json')
                                        .then(r => r.json())
                                        .then(reponse => {
                                            const traductionFrançais = reponse[reponseMer];
                                            if (traductionFrançais == undefined) {
                                                adresseISS.innerText = reponseMer;
                                            } else {
                                                adresseISS.innerText = traductionFrançais;
                                            }
                                        });
                                })
                                .catch(error => adresseISS.innerText = 'Veuillez nous excuser il y a un problème avec L API');
                        } else {
                            adresseISS.innerText = reponseAdresse;
                        }

                        if (!userGeolocated) {
                            geolocalisationUser();
                        }
                    })
                    .catch(error => console.error('Erreur :', error));
            })
            .catch(error => {
                const adresseISS = document.getElementById('adresseISS');
                adresseISS.innerText = "Veuillez nous excuser, il y a un problème avec L'API";
            });
    }

    // Fonction pour géolocaliser l'utilisateur
    function geolocalisationUser() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitudeUser = position.coords.latitude;
                    const longitudeUser = position.coords.longitude;
                    const geolocationIcon = L.icon({
                        iconUrl: '/images/geolocalisation.png',
                        iconSize: [50, 50],
                        iconAnchor: [25, 25]
                    });
                    const distanceAvecISS = calculerDistance(latitudeISS, longitudeISS, altitudeISS, latitudeUser, longitudeUser);
                    const marquerUser = L.marker([latitudeUser, longitudeUser], { icon: geolocationIcon }).addTo(map);
                    marquerUser.bindPopup(`Tu te trouves actuellement à ${distanceAvecISS} km de l'ISS`).openPopup();
                    setTimeout(() => {
                        marquerUser.closePopup();
                    }, 5000);
                    userGeolocated = true;
                },
                (error) => {
                    console.error('Une erreur s\'est produite', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            console.error('La géolocalisation n\'est pas supportée par ce navigateur.');
        }
    }

    // Fonction pour calculer la distance entre l'utilisateur et l'ISS en km
    function calculerDistance(latA, longA, distA, latB, longB) {
        const R = 6371; // Rayon de la Terre en km
        const radLatA = latA * Math.PI / 180;
        const radLongA = longA * Math.PI / 180;
        const radLatB = latB * Math.PI / 180;
        const radLongB = longB * Math.PI / 180;
        
        // Conversion en coordonnées cartésiennes
        const xA = distA * Math.cos(radLatA) * Math.cos(radLongA);
        const yA = distA * Math.cos(radLatA) * Math.sin(radLongA);
        const zA = distA * Math.sin(radLatA);

        const xB = R * Math.cos(radLatB) * Math.cos(radLongB);
        const yB = R * Math.cos(radLatB) * Math.sin(radLongB);
        const zB = R * Math.sin(radLatB);

        // Calcul de la distance
        const distanceEntreAB = Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2) + Math.pow(zB - zA, 2));
        return Math.floor(distanceEntreAB);
    }

    // Mise à jour de l'heure
    function miseAjourHeure() {
        const dateHeures = new Date();
        const dateFormat = dateHeures.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        const baliseHeureDate = document.getElementById('heureDate');
        baliseHeureDate.innerText = dateFormat;
    }

    // Initialisation
    miseajourPosition();
    setInterval(miseajourPosition, 1000);
    setInterval(miseAjourHeure, 1000);

    // Fonction pour changer l'icône
    function changementIcon(nomIcon) {
        const nouvelIcon = icons[nomIcon] || icons.issIcon;
        if (marqueurActuel) {
            marqueurActuel.setIcon(nouvelIcon);
        }
    }
});