import d3 from 'd3';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import BaseComponent from '../../classes/base-component';

import Chart from './chart';
import ChartControls from './chart-controls';

import strings from './strings';

import './index.styl';

import {
  YEAR_START,
  UPDATE_INTERVAL,
  MARGIN,
  WIDTH,
  HEIGHT,
} from './settings';

class NFL extends BaseComponent {

  constructor(props) {
    super(props);

    // Require the CSV data for d3
    this.passingData = require('./data/2006-2015-passing.csv');

    // Height/Width of the chart area
    this.width = WIDTH - 2 * MARGIN;
    this.height = HEIGHT - 2 * MARGIN;

    // Set Scales
    this.xScale = d3.scale.linear().range([0, this.width]);
    this.yScale = d3.scale.linear().range([this.height, 0]);

    // Set initial options
    this.xIndicator = 'Rk';
    this.yIndicator = 'QBR';
    this.year = YEAR_START;

    // Set empty set of labels
    this.labels = [];

    // Set initial state
    this.state = {
      currentPlayers: [],
    }
  }

  componentDidMount() {

    // Get Data and Draw the Chart
    d3.csv(this.passingData)
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
      .get(this.drawChart);
  }

  // Calculate min/max of particular attribute data
  calcExtents(data, indicator) {
    const allValues = data.map(player => {
      return player[indicator];
    });

    return d3.extent(allValues);
  }

  // "Draws" the chart by changing this.state.currentPlayers.
  // React handles the draw.
  drawChart(error, originalRows) {

    // Store the rows if they're passed in (first time this is invoked)
    // Otherwise, use the stored list
    const rows = this.rows = originalRows || this.rows;

    // If we haven't populated the labels, do it now
    if (!this.labels.length) {
      this.labels = Object.keys(rows[0]).filter(label =>
        label !== 'QBrec' &&
        label !== 'Tm' &&
        label !== 'Pos' &&
        label !== 'Year' &&
        label !== 'Name'
      );
    }

    // Recalculate scale domains for new indicators
    this.xScale.domain(this.calcExtents(rows, this.xIndicator));
    this.yScale.domain(this.calcExtents(rows, this.yIndicator));

    // Set current players to QBs in the current year that have stats
    // in the 2 categories
    this.setState({
      currentPlayers: rows.filter(player =>
        player.Year === this.year &&
        player.Pos.toUpperCase() === 'QB' &&
        player[this.xIndicator] != null &&
        player[this.yIndicator] != null
      ).sort((a, b) => b[this.xIndicator] - a[this.xIndicator]),
      error,
    });
  }

  showPlayerName(name) {
    console.log(name);
  }

  // Change the x-axis indicator and trigger a recalculation of
  // this.state.currentPlayers
  updateXIndicator(indicator) {
    this.xIndicator = indicator;
    this.drawChart();
  }

  // Change the y-axis indicator and trigger a recalculation of
  // this.state.currentPlayers
  updateYIndicator(indicator) {
    this.yIndicator = indicator;
    this.drawChart();
  }

  // Change the current year and trigger a recalculation of
  // this.state.currentPlayers
  updateYear(year) {
    this.year = year;
    this.drawChart();
  }

  // Draw a header, chart controls, and the chart
  render() {
    return (
      <section className="nfl">
        <h1><FormattedMessage {...strings.heading_passing} /></h1>
        <h2>{this.year}</h2>
        <ChartControls
          updateXIndicator={this.updateXIndicator}
          updateYIndicator={this.updateYIndicator}
          updateYear={this.updateYear}
          labels={this.labels}
          xIndicator={this.xIndicator}
          yIndicator={this.yIndicator}
          year={this.year}
        />
        <Chart
          currentPlayers={this.state.currentPlayers}
          height={this.height}
          showPlayerName={this.showPlayerName}
          xIndicator={this.xIndicator}
          xScale={this.xScale}
          yIndicator={this.yIndicator}
          yScale={this.yScale}
        />
      </section>
    );
  }
}

export default NFL;
