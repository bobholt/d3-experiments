var uncolored = {};

var HIGHLAND_MID = 'cornflowerblue';
var HIGHLAND_LOWER = 'steelblue';
var HIGHLAND_UPPER = 'cornflowerblue';
var MOUNTAIN_SIDE = 'sienna';
var MOUNTAIN_TOP = 'saddlebrown';
var ICE = 'white';
var PLAINS = 'peru';

// [E, N]
var roversProbes = [
  {
    name: 'beagle 2',
    landing: {
      date: 'December 25, 2003, 02:45:00 UTC',
      site: [90.4295, 11.5265],
    },
  },
  {
    name: 'curiosity',
    landing: {
      date: 'August 6, 2012, 05:17:57 UTC',
      site: [137.4417, -4.5895],
    },
  },
  {
    name: 'mars 2',
    landing: {
      date: 'November 27, 1971, 12:00:00 UTC',
      site: [-313, -45],
    },
  },
  {
    name: 'mars 3',
    landing: {
      date: 'December 2, 1971, 13:52:00 UTC',
      site: [202, -45],
    }
  },
  {
    name: 'opportunity',
    landing: {
      date: 'January 25, 2004, 05:05:00 UTC',
      site: [354.4734, -1.9462],
    },
  },
  {
    name: 'pathfinder',
    landing: {
      date: 'July 4, 1997, 16:56:55 UTC',
      site: [-33.22, 19.13],
    },
  },
  {
    name: 'phoenix',
    landing: {
      date: 'May 25, 2008, 23:53:44 UTC',
      site: [-125.7, 68.22],
    }
  },
  {
    name: 'spirit',
    landing: {
      date: 'January 4, 2004, 04:35:00 UTC',
      site: [175.472636, -14.5684],
    },
  },
  {
    name: 'viking 1',
    landing: {
      date: 'July 20, 1976, 11:53:00 UTC',
      site: [-49.97, 22.48],
    }
  },
  {
    name: 'viking 2',
    landing: {
      date: 'September 3, 1976, 22:58:00 UTC',
      site: [-225.74, 47.97],
    }
  }
];

function landingToSols(date) {
  return Math.round(((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)) / 1.027491251, 10);
}

function unitFill(name) {
  switch(name) {
    case 'polar ice deposits':
    case 'polar layered deposits':
      return ICE;
    case 'Vastitas Borealis Formation, grooved member':
      return 'royalblue';
    case 'Vastitas Borealis Formation, knobby member':
      return HIGHLAND_MID;
    case 'Vastitas Borealis Formation, ridged member':
      return HIGHLAND_UPPER;
    case 'Vasitas Borealis Formation, mottled member':
      return HIGHLAND_LOWER;
    case 'Valles Marineris interior deposits, layered material':
    case 'Valles Marineris interior deposits, floor material':
      return 'blue';
    case 'Alba Patera Formation, upper member':
    case 'Olympus Mons Formation, shield member':
      return MOUNTAIN_TOP;
    case 'Olympus Mons Formation, aureole member 1':
    case 'Olympus Mons Formation, aureole member 2':
    case 'Olympus Mons Formation, aureole member 3':
    case 'Olympus Mons Formation, aureole member 4':
    case 'Alba Patera Formation, middle member':
      return MOUNTAIN_SIDE;
    case 'Alba Patera Formation, lower member':
    case 'Olympus Mons Formation, plains member':
      return PLAINS;
    default:
      uncolored[name] = true;
      return 'brown';
  }
}

(function() {
  var viewer = d3.select('#visuals');

  var width = viewer.node().offsetWidth;
  var height = viewer.node().offsetHeight;

  var diameter = Math.min(width, height);
  var radius = diameter / 2;
  var velocity = .01;
  var then = Date.now();

  var projection = d3.geo.equirectangular()
    .scale(radius / 1.5)
    .translate([width / 2, height / 2])
    // .clipAngle(90)
    // .precision(0);
    // .scale(width / 8);

  var canvas = viewer.append('canvas')
    .attr('height', height)
    .attr('width', width);

  var context = canvas.node().getContext('2d');

  // context.font = '48px serif';
  context.strokeStyle = 'black';
  context.textAlign = 'center';
  context.textBaseline = 'bottom';

  var path = d3.geo.path().projection(projection).context(context);

  var proxy = viewer.append('proxy');

  var graticuleGroup = proxy.append('g');
  var existingGraticule = graticuleGroup.selectAll('path').data(window.graticule.features);
  var enteringGraticule = existingGraticule.enter();

  var unitGroup = proxy.append('g');
  var existingUnits = unitGroup.selectAll('path').data(window.units.features);
  var enteringUnits = existingUnits.enter();

  var structureGroup = proxy.append('g');
  var existingStructures = structureGroup.selectAll('path').data(window.structure.features);
  var enteringStructures = existingStructures.enter();

  // var localityGroup = proxy.append('g');
  // var existingLocalities = localityGroup.selectAll('path').data(window.localities.features);
  // var enteringLocalities = existingLocalities.enter();


  enteringUnits.append('path');
  enteringStructures.append('path');
  enteringGraticule.append('path');
  // enteringLocalities.append('path');

  var globe = {type: 'Sphere'};

  // d3.timer(function() {
    var angle = velocity * (Date.now() - then);
    projection.rotate([angle, 0, 0]);
    context.clearRect(0, 0, width, height);

    existingUnits.each(function(d) {
      context.fillStyle = unitFill(d.properties.UnitName);
      context.beginPath();
      path(d);
      context.fill();
      context.stroke();
      context.closePath();
    });

    existingStructures.each(function(d) {
      context.beginPath();
      path(d);
      context.stroke();
      context.closePath();
    });

    // existingLocalities.each(function(d) {
    //   var coords = projection(d.geometry.coordinates);
    //   context.fillStyle = 'black';
    //   context.fillText(d.properties.MIN_UNITNA, coords[0], coords[1]);
    //   context.beginPath();
    //   context.rect(coords[0], coords[1], 10, 10);
    //   context.fill();
    //   context.closePath();
    // });

    existingGraticule.each(function(d) {
      context.beginPath();
      path(d);
      context.stroke();
      context.closePath();
    });

    context.fillStyle = 'white';

    roversProbes.forEach(function(rover, i) {
      var loc = projection(rover.landing.site);
      context.fillText(rover.name.toUpperCase() + ' - ' + landingToSols(rover.landing.date) + ' sols',loc[0],loc[1]);
      context.beginPath();
      context.rect(loc[0], loc[1], 10, 10);
      context.fill();
      context.closePath();
    });

    context.beginPath();
    path(globe);
    context.stroke();
    context.closePath();

  // });

  console.log(uncolored);

}());
