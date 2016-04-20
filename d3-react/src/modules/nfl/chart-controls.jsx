import React from 'react';
import {FormattedMessage} from 'react-intl';

import BaseComponent from '../../classes/base-component';

import {
  YEAR_START,
  YEAR_END,
} from './settings';

import strings from './strings';

class ChartControls extends BaseComponent {

  handleXChange(e) {
    this.props.updateXIndicator(e.target.value);
  }

  handleYChange(e) {
    this.props.updateYIndicator(e.target.value);
  }

  handleYearChange(e) {
    this.props.updateYear(Number(e.target.value));
  }

  render() {
    const {
      labels,
      xIndicator,
      yIndicator,
      year,
    } = this.props;

    // Render the range selector for year and the dropdowns for the x and y
    // axis indicators
    return (
      <section className="controls">
        <label for="year"><FormattedMessage {...strings.label_year} /></label>
        <input
          className="year"
          id="year"
          min={YEAR_START}
          max={YEAR_END}
          name="year"
          onChange={this.handleYearChange}
          type="range"
          value={year}
        />
        <br />
        <label for="x-axis"><FormattedMessage {...strings.label_xaxis} /></label>
        <select
          className="x-axis"
          id="x-axis"
          name="x-axis"
          onChange={this.handleXChange}
          value={xIndicator}
        >
          {labels.map((label, i) => {
            return (
              <option value={label} key={`x-${label}-${i}`}>{label}</option>
            );
          })}
        </select>
        <br />
        <label for="y-axis"><FormattedMessage {...strings.label_yaxis} /></label>
        <select
          className="y-axis"
          id="y-axis"
          name="y-axis"
          onChange={this.handleYChange}
          value={yIndicator}
        >
          {labels.map((label, i) => {
            return (
              <option value={label} key={`y-${label}-${i}`}>{label}</option>
            );
          })}
        </select>
      </section>
    );
  }
}

export default ChartControls;
