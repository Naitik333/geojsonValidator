//schemas
exports.position = {
    type: "array",
    minItems: 2,
    maxItems: 3,
    items: {
        required: true,
        type: "number"
    }
}

exports.point = {
    type: "object",
    properties: {
        type: {
            format: "^Point$"
        },
        coordinates: {
            required: true,
            $ref: '#position'
        }
    }
}

exports.multipoint = {
    required: true,
    type: "object",
    properties: {
        type: {
            pattern: "^MultiPoint$"
        },
        coordinates: {
            required: true,
            type: "array",
            minItems: 2,
            items: {$ref: '#position'}
        }
    }
}

exports.linestring = {
    required: true,
    type: "object",
    properties: {
        type: {
            format: "^LineString$"
        },
        coordinates: {
            required: true,
            type: "array",
            minitems: 2,
            items: {$ref: '#position'}
        }
    }
}

exports.multilinestring = {
    required: true,
    type: "object",
    properties: {
        type: {
            required: true,
            format: "^MultiLineString$",
        },
        coordinates: {
            required: true,
            type: "array",
            items: {
                required: true,
                type: "array",
                minitems: 2,
                items: {$ref: '#position'}
            }
        }
    }
}

exports.polygon = {
    required: true,
    type: "object",
    properties: {
        type: {
            required: true,
            format: "^Polygon$"
        },
        coordinates: {
            required: true,
            type: "array",
            items: {
                required: true,
                type: "array",
                minitems: 4,
                items: {$ref: '#position'}
            }
        }
    }
}

exports.multipolygon = {
    required: true,
    type: "object",
    properties: {
        type: {
            format: "^MultiPolygon$"
        },
        coordinates: {
            required: true,
            type: "array",
            items: {
                type: "array",
                items: {
                    type: "array",
                    minitems: 4,
                    items: {$ref: '#position'}
                }
            }
        }
    }
}
//unused
exports.geometrycollection = {
    required: true,
    type: "object",
    properties: {
        type: {
            format: "^GeometryCollection$"
        },
        geometries: {
            required: true,
            type: "array",
            items: {
                required: true,
                type: "object",
                anyOf: [ 
                {$ref:'#point'},
                {$ref:'#multipoint'},
                {$ref:'#linestring'},
                {$ref:'#multilinestring'},
                {$ref:'#polygon'},
                {$ref:'#multipolygon'}]
            }
        }
    }
}

exports.feature = {
    required: true,
    type: "object",
    properties: {
        type: {
            format: "^Feature$"
        },
        properties: {
            required: true,
            type: [
                "object",
                null
            ]
        },
        geometry: {
            required: true,
            type: "object",
                anyOf: 
                [ 
                {$ref:'#point'},
                {$ref:'#multipoint'},
                {$ref:'#linestring'},
                {$ref:'#multilinestring'},
                {$ref:'#polygon'},
                {$ref:'#multipolygon'}, 
                {$ref:'#geometrycollection'}
                ]
    
        }
    }
}

exports.featurecollection = {
    required: true,
    type: "object",
    properties: {
        type: {
            format: "^FeatureCollection$"
        },
        features: {
            required: true,
            type: "array",
            items: {$ref: '#feature'}
        }
    }
}