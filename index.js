//uses is-my-json-valid to validate geoJSON schema
//adapted from Jason Sanford's geoJSON Lint
var validator = require('is-my-json-valid')
var schemas = require('./schemas')

var verify = function (data){
    var result = false
    try{
        validate_geojson(data)
        result = true
    }
    catch(e){
        console.log(e)
        result = false
    }
    finally{
        return result
    }
}

function validate_geojson (data){


    geojson_types = {
        'Point': schemas.point,
        'MultiPoint': schemas.multipoint,
        'LineString': schemas.linestring,
        'MultiLineString': schemas.multilinestring,
        'Polygon': schemas.polygon,
        'MultiPolygon': schemas.multipolygon,
        'GeometryCollection': schemas.geometrycollection,
        'Feature': schemas.feature,
        'FeatureCollection': schemas.featurecollection,
    }

    special_cases = ['Feature', 'FeatureCollection', 'GeometryCollection']

    if ( !geojson_types.hasOwnProperty(data.type)){

        throw new GeoJSONValidationException(String(data.type) + ' is not a valid GeoJSON type.');

    }

    if (data.type == 'Polygon'){
        validatePolygon(data);
    }

    if (special_cases.indexOf(data.type) != -1){
        //special cases
        validate_special_case(data);
    }
    else{
        //validate geojson using is-my-json-valid
        var validate = validator(geojson_types[data.type], {schemas:  {position: schemas.position} })
        result = validate(data)

        if (result != true){
            throw new GeoJSONValidationException(validate.errors)
        }
    }
    return;
}

function validate_special_case (data){

    function validateFeature(data){
        if ( !data.hasOwnProperty('geometry') ) throw new GeoJSONValidationException('A Feature must have a "geometry" property.');
        if ( !data.hasOwnProperty('properties') ) throw new GeoJSONValidationException('A Feature must have a "properties" property.');
        if ( !data.hasOwnProperty('type') ) throw new GeoJSONValidationException('A Feature must have a "type" property.');
        if ( data.geometry != null) validate_geojson(data.geometry);
    }

    if (data.type == 'Feature'){
        validateFeature(data)
    }else if (data.type == 'FeatureCollection'){
        if (!data.hasOwnProperty('features')) throw new GeoJSONValidationException('A FeatureCollection must have a "features" property.') ;
        else if (!data.features instanceof Array ) throw new GeoJSONValidationException('A Feature Collection' + "'"+'s "features" property must be an array.'  );
        for (feature in data.features) validateFeature(data.features[feature]);
    }else if (data.type == 'GeometryCollection'){
        if (!data.hasOwnProperty('geometries')) throw new GeoJSONValidationException('A GeometryCollection must have a "geometries" property.');
        else if (!data.geometries instanceof Array) throw new GeoJSONValidationException('A GeometryCollection' +"'"+'s "geometries" property must be an array.');
        for (geometry in data.geometries){
            if (geometry != null) validate_geojson(data.geometries[geometry]);
        }
    }
}

Array.prototype.equals = function (array) {
    //prototype equals method for array comparison
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}  

function validatePolygon (polygon){

    function checkFirstLastPoints(element, index, array){

        first = element[0]
        last = element[element.length-1]

        if (!first.equals(last) ){
            throw new GeoJSONValidationException('A Polygon' +"'"+ 's first and last points must be equivalent.')
        }
    }

    polygon.coordinates.forEach(checkFirstLastPoints)
}

function GeoJSONValidationException (message) {
   this.message = message;
   this.name = "GeoJSONValidationException";
}

exports.validate = verify


