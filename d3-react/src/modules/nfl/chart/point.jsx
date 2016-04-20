import React from 'react';
import {FormattedMessage} from 'react-intl';

import BaseComponent from '../../../classes/base-component';

import Axis from './axis';

import strings from '../strings';

import {
  CIRCLE_RADIUS,
  UPDATE_INTERVAL,
} from '../settings';

class Point extends BaseComponent {

  componentDidMount() {
    const {
      xScale,
      xValue,
      yScale,
      yValue,
    } = this.props;

    // Let D# animate attributes. ReactTransitionGroup animates enter/exit styles
    d3.select(this.refs.circle)
      .attr('cx', xScale(xValue))
      .attr('cy', yScale(yValue))
      .transition()
        .duration(UPDATE_INTERVAL)
        .ease('linear')
        .attr('r', CIRCLE_RADIUS);
  }

  componentDidUpdate() {
    const {
      xScale,
      xValue,
      yScale,
      yValue,
    } = this.props;

    // Let D# animate attributes. ReactTransitionGroup animates enter/exit styles
    d3.select(this.refs.circle)
      .transition()
        .duration(UPDATE_INTERVAL)
        .ease('linear')
        .attr('cx', xScale(xValue))
        .attr('cy', yScale(yValue))
        .attr('r', CIRCLE_RADIUS);
  }

  render() {
    const {
      name,
      showPlayerName,
      xScale,
      xValue,
      yScale,
      yValue,
    } = this.props;

    return (
      <circle
        onClick={() => {showPlayerName(name)}}
        r={1e-8}
        ref="circle"
      />
    );
  }
}

export default Point;
