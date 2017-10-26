var directionsDisplay;
var map;
var placeSearch, origin, destination;

var numberStep = 0;
var tabStep = [];
var waypts = [];

var km,time;

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
        waypoints: waypts,
        travelMode : google.maps.DirectionsTravelMode.DRIVING
        
    };

    var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
    directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
        // console.log(response.routes[0].legs[0].distance.text);
        if(status == google.maps.DirectionsStatus.OK){
            console.log(response);
            directionsDisplay.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
            km = response.routes[0].legs[0].distance.text;
            time = response.routes[0].legs[0].duration.text;
            
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
    
    document.getElementById('expandArr').className='material-icons details show';

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

fill = function(q)
{
    // console.log(this.gm_accessors_.place.Fc.gm_accessors_.input.Fc.b.name);
    var prov = this.gm_accessors_.place.Fc.gm_accessors_.input.Fc.b.name;
    var num = parseInt(prov.replace('etape',''));
    // console.log(typeof(num))
    var place = tabStep[num].getPlace();
    // console.log(place)
    waypts.push({
        location :place.name,
        stopover : true
    });

    document.getElementById('expandStep'+num).className='material-icons details show';
    
    for (var component in componentForm) {
        // console.log(component+'_step'+num)
        document.getElementById(component+'_step'+num).value = '';
        document.getElementById(component+'_step'+num).disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        // console.log(addressType)
        if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType+'_step'+num).value = val;
        }
    }
}


function prix()
{
    
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

$('#addStep').on('click',function(){
    if(numberStep != 0 )
    {
        $('.step').append('<div class="row><div class="col s4 offset-s1"><hr></div></div>');
    }

    $('.step').append('<div id="step' + numberStep + '" class="row"></div>');
    var step = $('#step' + numberStep);
    $(step).append('<fieldset class="col s4 offset-s1"></fieldset>');
    var fieldset = $(step).children();
    $(fieldset).append('<legend>Etape '+ numberStep +'</legend>');
    $(fieldset).append('<input type="text" name="etape'+ numberStep +'" id="etape'+ numberStep +'"><label for="etape'+ numberStep +'">Etape '+ numberStep +'</label><br>');
    $(fieldset).append('<i id="expandStep' + numberStep + '" class="material-icons details hide">expand_more</i>');
    $(fieldset).append('<div id="complete_adress_step' + numberStep + '" class="hide"></div>');
    $('#complete_adress_step' + numberStep).append('<div class="row"><div class="col s3"><input type="text" name="numStep' + numberStep + '" id="street_number_step' + numberStep + '"><label for="numStep' + numberStep + '">n°</label></div><div class="col s9"><input type="text" name="rueStep' + numberStep + '" id="route_step' + numberStep + '"><label for="rueStep' + numberStep + '">rue</label></div></div>');
    $('#complete_adress_step' + numberStep).append('<div class="row"><div class="col s3"><input type="text" name="cpStep' + numberStep + '" id="postal_code_step' + numberStep + '"><label for="cpStep' + numberStep + '">code postal</label></div><div class="col s9"><input type="text" name="villeStep' + numberStep + '" id="locality_step' + numberStep + '"><label for="villeStep' + numberStep + '">ville</label></div></div>');
    $('#complete_adress_step' + numberStep).append('<div class="row"><div class="col s6"><input type="text" name="area_step' + numberStep + '" id="administrative_area_level_1_step' + numberStep + '"><label for="area_step' + numberStep + '">Région</label></div><div class="col s6"><input type="text" name="country_step' + numberStep + '" id="country_step' + numberStep + '"><label for="country_step' + numberStep + '">Pays</label></div></div>');
    $('#complete_adress_step' + numberStep).append('<button id="clear_dep" class="btn hide">Clear</button>');
    $('#complete_adress_step' + numberStep).append('<i id="etapeHide'+ numberStep +'" class="material-icons hide_details">expand_less</i>');

    tabStep[numberStep] = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */($('#etape'+numberStep)[0]),
        {types: ['geocode']});
    
    tabStep[numberStep].addListener('place_changed',fill)
    
    $('#expandStep'+numberStep).on('click',function(){
        var parent = $(this).parent();
        // console.log($(parent).children('.hide'));
        $(parent).children('.hide').addClass('show');
        $(parent).children('.hide').removeClass('hide');
        $(this).addClass('hide');
        $(this).removeClass('show');
    });

    $('#etapeHide'+ numberStep).on('click',function(){
        var parent = $(this).parent().parent();
        // console.log($(parent).children('.hide'));
        $(parent).children('.show').addClass('hide');
        $(parent).children('.show').removeClass('show');
        $(parent).children('.details').addClass('show');
        $(parent).children('.details').removeClass('hide');
    });

    numberStep++;
});

