(function() {
  var viewer = d3.select('#visuals');

  var xIndicator = 'Rk';
  var yIndicator = 'QBR';

  var radius = 5;

  var startYear = 2006;
  var endYear = 2015;
  var year = startYear;
  var updateInterval = 2500;

  var margin = 30;
  var width = 960 - 2 * margin;
  var height = 640 - 2 * margin;

  var h2 = viewer.append('h2')
    .text(year);

  var controls = viewer.append('section')
    .attr('class', 'controls')
    .html(
      '<label for="year">Year</label> ' +
      '<input name="year" id="year" class="year" type="range"> ' +
      '<br>' +
      '<label for="x-axis">X-Axis</label> ' +
      '<select name="x-axis" id="y-axis" class="x-axis"></select> ' +
      '<br>' +
      '<label for="y-axis">Y-Axis</label> ' +
      '<select name="y-axis" id="y-axis" class="y-axis"></select> '
    );

  var input = controls.select('.year')
    .attr('min', startYear)
    .attr('max', endYear)
    .attr('value', year);

  var svg = viewer.append('svg')
    .attr('height', height + 2 * margin)
    .attr('width', width + 2 * margin);

  var chart = svg.append('g')
    .attr('transform', 'translate(' + margin + ',' + margin + ')');
  var players = chart.append('g');

  var xScale = d3.scale.linear().range([0, width]);
  var yScale = d3.scale.linear().range([height, 0]);
  var yearScale = d3.scale.category10().domain([2006,2015]);

  var dispatch = d3.dispatch('player_select', 'year_change', 'x_change', 'y_change');

  d3.csv('data/2006-2015-passing.csv')
    .row(function(d) {
      d.Rk = Number(d.Rk);
      d.Age = Number(d.Age);
      d.G = Number(d.G);
      d.GS = Number(d.GS);
      d.QBrec = d.QBrec.split('-');
      d.Cmp = Number(d.Cmp);
      d.Att = Number(d.Att);
      d['Cmp%'] = Number(d['Cmp%']);
      d.Yds = Number(d.Yds);
      d.TD = Number(d.TD);
      d['TD%'] = Number(d['TD%']);
      d.Int = Number(d.Int);
      d['Int%'] = Number(d['Int%']);
      d.Lng = Number(d.Lng);
      d['Y/A'] = Number(d['Y/A']);
      d['AY/A'] = Number(d['AY/A']);
      d['Y/C'] = Number(d['Y/C']);
      d['Y/G'] = Number(d['Y/G']);
      d.Rate = Number(d.Rate);
      d.QBR = Number(d.QBR);
      d.Sk = Number(d.Sk);
      d.SkYds = Number(d.SkYds);
      d['NY/A'] = Number(d['NY/A']);
      d['ANY/A'] = Number(d['ANY/A']);
      d['Sk%'] = Number(d['Sk%']);
      d['4QC'] = Number(d['4QC']);
      d.GWD = Number(d.GWD);
      d.Year = Number(d.Year);
      return d
    })
    .get(function(error, rows) {

      var xSelect = d3.select('.x-axis');
      var ySelect = d3.select('.y-axis');

      var labels = Object.keys(rows[0]).filter(function(label) {
        return label !== 'QBrec' &&
          label !== 'Tm' &&
          label !== 'Pos' &&
          label !== 'Year' &&
          label !== 'Name';
      });

      var xOptions = xSelect.selectAll('option').data(labels)
        .enter().append('option')
          .attr('value', function(d) {return d})
          .text(function(d) {return d});

      var yOptions = ySelect.selectAll('option').data(labels)
        .enter().append('option')
          .attr('value', function(d) {return d})
          .text(function(d) {return d});

      var currentX = xSelect.select('[value="' + xIndicator + '"]')
        .attr('selected', 'selected');

      var currentY = ySelect.select('[value="' + yIndicator + '"]')
        .attr('selected', 'selected');

      var validPlayers = rows.filter(function(player) {
        return player.Pos === 'QB' &&
          // player.G >= 8 && // played more than half the games
          player[xIndicator] &&
          player[yIndicator];
      })

      xScale.domain(calcExtents(validPlayers, xIndicator));
      yScale.domain(calcExtents(validPlayers, yIndicator));

      var xAxis = d3.svg.axis().ticks(10).scale(xScale);
      var yAxis = d3.svg.axis().orient('left').scale(yScale);

      chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

      chart.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0, 0)')
        .call(yAxis)

      plotPlayers(validPlayers, year);

      dispatch.on('player_select', function(name) {
        console.log(name);
      });

      dispatch.on('year_change', function(year) {
        h2.text(year);
        plotPlayers(validPlayers, year);
      });

      dispatch.on('x_change', function(indicator) {
        xIndicator = indicator;
        xScale.domain(calcExtents(validPlayers, xIndicator));
        xAxis.scale(xScale);
        d3.select('.x.axis').call(xAxis);
        plotPlayers(validPlayers, year);
      });

      dispatch.on('y_change', function(indicator) {
        yIndicator = indicator;
        yScale.domain(calcExtents(validPlayers, yIndicator));
        yAxis.scale(yScale);
        d3.select('.y.axis').call(yAxis);
        plotPlayers(validPlayers, year);
      });

      xSelect.on('change', function() {
        dispatch.x_change(d3.select(this).node().value);
      });

      ySelect.on('change', function() {
        dispatch.y_change(d3.select(this).node().value);
      });

      input.on('input', function() {
        dispatch.year_change(Number(d3.select(this).node().value));
      });
    });


  function plotPlayers(rows, year) {
    var validPlayers = rows.filter(function(player) {
      return player.Year === year;
    });

    var currentPlayers = players.selectAll('circle')
      .data(validPlayers, function(d) {return d.Name});

    var enteringPlayers = currentPlayers.enter();
    var exitingPlayers = currentPlayers.exit();

    currentPlayers
    .sort(function(a, b) {return b[xIndicator] - a[xIndicator]})
    .transition()
      .duration(updateInterval)
      .ease('linear')
    .style('fill', 'black')
    .attr('r', radius)
    .attr('cx', function(d) {return xScale(d[xIndicator]);})
    .attr('cy', function(d) {return yScale(d[yIndicator]);})
    .style('fill-opacity', 1);

    enteringPlayers.append('circle')
      .attr('r', 1e-8)
      .attr('cx', function(d) {return xScale(d[xIndicator]);})
      .attr('cy', function(d) {return yScale(d[yIndicator]);})
      .style('fill', 'red')
      .style('fill-opacity', 1e-8)
      .on('click', function(d) {
        dispatch.player_select(d.Name);
      })
      .transition()
        .duration(updateInterval)
        .ease('linear')
        .attr('r', radius)
        .style('fill', 'black')
        .style('fill-opacity', 1);

    exitingPlayers.transition()
      .duration(updateInterval / 2)
      .ease('linear')
    .attr('r', 1e-8)
    .style('fill-opacity', 1e-8)
    .remove();
  }

  // Calculates the extents of the data for a specific indicator. Extents are
  // are the bounds of our data. For example, the array [1,2,3,4] has the extent
  // [1,4]. In order to get a consistent extent for our scale (that won't shift as
  // we change years,) we need to go through all the years and all the countries
  // and find the min and max of those.
  function calcExtents(data, indicator) {

    // first find all the data points for a specific indicator across
    // all countries and join them into one array.
    var allValues = data.map(function(player) {
      return player[indicator];
    });

    // now go through all the data points and find the extent using d3's
    // `extent` function.
    var extent = d3.extent(allValues);

    return extent;
  }
}());
