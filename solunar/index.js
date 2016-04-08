var DAYS_IN_WEEK = 7;

(function() {

  var viewer = d3.select('#visuals');

  var table = viewer.append('table');

  var thead = table.append('thead').html(
    '<th>Sunday</th>' +
    '<th>Monday</th>' +
    '<th>Tuesday</th>' +
    '<th>Wednesday</th>' +
    '<th>Thursday</th>' +
    '<th>Friday</th>' +
    '<th>Saturday</th>'
  );
  var tbody = table.append('tbody');

  var boxWidth = 100;
  var boxHeight = boxWidth;
  var moonRadius = boxWidth / 2;
  var shadowRadius = moonRadius;

  var wholeYear = false;
  var wholeYearBox = d3.select('#whole-year');

  var dispatch = d3.dispatch('whole_year_change');

  var projection = d3.geo.orthographic()
    .scale(moonRadius - 1)
    .translate([boxWidth / 2, boxHeight / 2])
    .clipAngle(90)
    .precision(0);

  wholeYearBox.on('change', function() {
    dispatch.whole_year_change(d3.select(this).node().checked);
  });

  d3.csv('data/sunrise_sunset_2016.csv')
    .row(function(d) {
      var day = d.Month + ' ' + d.Day + ', ' + d.Year;

      // Our data is set to -05:00 UTC with no Daylight Savings adjustments
      var riseHour = 5 + Number(d.Rise.substring(0, 2));
      var riseMin = d.Rise.substring(2);
      var riseTime = riseHour + ":" + riseMin + ":00 UTC";

      var setHour = 5 + Number(d.Set.substring(0, 2));
      var setMin = d.Set.substring(2);
      var setTime = setHour + ":" + setMin + ":00 UTC"

      return {
        rise: new Date(day + ' ' + riseTime),
        set: new Date(day + ' ' + setTime),
        moon: Number(d.Moon),
      };
    })
    .get(function(error, rows) {

      drawCalendar(rows);

      dispatch.on('whole_year_change', function(bool) {
        wholeYear = bool;
        drawCalendar(rows);
      });
    });

  function drawCalendar(rows) {
    tbody.html('');

    var validRows = rows.filter(function(day) {
      if (wholeYear) { return true; }
      return day.rise >= new Date(Date.now() - 1000*60*60*24)
    });

    var weeks = countWeeks(validRows);
    var dayOfWeekOfFirstDay = validRows[0].rise.getDay();
    var dayOfWeekOfLastDay = validRows[validRows.length - 1].rise.getDay();

    for (var i = 0; i < weeks; i++) {
      var tr = tbody.append('tr')
        .classed('week-' + i, true);
    }

    validRows.forEach(function(day, j) {
      var week = Math.floor((j + dayOfWeekOfFirstDay) / 7);
      d3.select('.week-' + week).append('td')
        .classed('day-' + j, true);
    });

    var dataCells = tbody.selectAll('td').data(validRows)
      .attr('data-moon', function(d){return d.moon});

    if (wholeYear) {
      wholeYearBox.attr('checked', 'checked');
    }

    d3.select('.year')
      .text(validRows[0].rise.getFullYear());

    var date = dataCells.append('h3')
      .html(function(d) {return d.rise.toDateString().substring(4, 10);});

    var sun = dataCells.append('p')
      .html(function(d) {
        return 'Sunrise: ' + d.rise.toTimeString().substring(0, 5) +
        '<br>' + 'Sunset: ' + d.set.toTimeString().substring(0, 5);
      });

    projection.rotate([0, 0, 0]);
    var path = d3.geo.path().projection(projection);

    var svg = dataCells.append('svg')
      .attr('height', boxHeight)
      .attr('width', boxWidth)
      .style('background', 'black');
    svg.append('defs')
      .append('path')
        .datum({type: 'Sphere'})
        .attr('id', 'sphere')
        .attr('d', path);
    svg.append("use")
        .attr("class", "fill")
        .attr("xlink:href", "#sphere");
    var moon = svg.append('path')
      .attr('class', 'darkside')
      .attr('d', function(d) {

        // TODO: d.moon is the percentage of moon visible, NOT rotation - need some calculus here
        projection.rotate([-d.moon * 180, 0, 0]);
        path = d3.geo.path().projection(projection);
        return path(d3.geo.circle().angle(90).origin([0, 0])());
      });

    for (var k = 0; k < dayOfWeekOfFirstDay; k++) {
      d3.select('.week-0').insert('td', '.day-0');
    }

    for (var l = 0; l < 6 - dayOfWeekOfLastDay; l++) {
      d3.select('tr:last-child').append('td');
    }
  }

}());


function countWeeks(days) {
  var dayOfWeekOfFirstDay = days[0].rise.getDay();
  var firstSunday = (DAYS_IN_WEEK - dayOfWeekOfFirstDay) % DAYS_IN_WEEK;
  var weeks = Math.ceil((days.length - firstSunday) / DAYS_IN_WEEK) + 1;
  return weeks;
}
