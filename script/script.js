var directionsDisplay;
var map;
var placeSearch, origin, destination;

var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };


clear = function()
{
    event.preventDefault();
    var parent = this.parentNode.elements;
    var parentName = this.getAttribute('id');
    
    Object.keys(parent).forEach(function(element){
        parent[element].value="";
    });

    this.className='btn hide';

    if(parentName == 'clear_dep')
    {
        document.getElementById('complete_adress_dep').className='hide';
    }
}

init = function()
{
    // Direciton
    var haight = new google.maps.LatLng(49.111769, 6.234958);
    var mapOptions = {
        zoom: 14,
        center: haight,
        mapTypeId : google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    directionsDisplay = new google.maps.DirectionsRenderer(
        {
            map : map
        }
    );

    // Autocomplete
    origin = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('origin')),
        {types: ['geocode']});

        
    origin.addListener('place_changed', fillOrigin);
    
    destination = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('destination')),
        {types: ['geocode']});

        
    destination.addListener('place_changed', fillDestination);

    var clear_dep = document.getElementById('clear_dep');
    clear_dep.addEventListener('click',clear);
};


calculate = function()
{
    var origin = document.getElementById('origin').value;
    var destination = document.getElementById('destination').value;

    var request =
    {
        origin : origin,
        destination : destination,
        travelMode : google.maps.DirectionsTravelMode.DRIVING,
    };

    var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
    directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
        // console.log(response.routes[0].legs[0].distance.text);
        document.getElementById('km').innerHTML=response.routes[0].legs[0].distance.text;
        document.getElementById('distance').className='show';
        if(status == google.maps.DirectionsStatus.OK){
            directionsDisplay.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
        }
    });
};


fillOrigin = function () {
    // Get the place details from the autocomplete object.
    var place = origin.getPlace();

    document.getElementById('expandDep').className='material-icons details show';

    for (var component in componentForm) {
        document.getElementById(component+'_dep').value = '';
        document.getElementById(component+'_dep').disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType+'_dep').value = val;
        }
    }
}

fillDestination = function(){
    // Get the place details from the autocomplete object.
    var place = destination.getPlace();
    
    document.getElementById('complete_adress_arr').className='show';
    document.getElementById('clear_arr').className='btn show';

    for (var component in componentForm) {
        document.getElementById(component+'_arr').value = '';
        document.getElementById(component+'_arr').disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType+'_arr').value = val;
        }
    }
}

$('.details').on('click',function(){
    var parent = $(this).parent();
    // console.log($(parent).children('.hide'));
    $(parent).children('.hide').addClass('show');
    $(parent).children('.hide').removeClass('hide');
    $(this).addClass('hide');
    $(this).removeClass('show');
})

$('.hide_details').on('click',function(){
    var parent = $(this).parent().parent();
    // console.log($(parent).children('.hide'));
    $(parent).children('.show').addClass('hide');
    $(parent).children('.show').removeClass('show');
    $(parent).children('.details').addClass('show');
    $(parent).children('.details').removeClass('hide');
});
    



