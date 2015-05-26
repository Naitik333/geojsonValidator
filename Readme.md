**Validates geojson using is-my-json-valid. Based off of the geojsonlint design & adapted as a module.**

- [Installation](#installation)
- [Usage](#usage)

## Installation
`npm install geojsonvalidator`

## usage
```javascript
var geoval = require("geojsonvalidator");

var polygon = { "type": "Polygon",
    "coordinates": 
    [
    	[ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
    ]
}

geoval.validate(polygon)
//returns true or returns false with helpful error message:
