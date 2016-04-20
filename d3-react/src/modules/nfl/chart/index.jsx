import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {FormattedMessage} from 'react-intl';

import BaseComponent from '../../../classes/base-component';

import Axis from './axis';
import Point from './point';

import strings from '../strings';

import './index.styl';

import {
  HEIGHT,
  MARGIN,
  UPDATE_INTERVAL,
  WIDTH,
} from '../settings';

class Chart extends BaseComponent {

  render() {
    const {
      currentPlayers,
      height,
      showPlayerName,
      xIndicator,
      xScale,
      yIndicator,
      yScale,
    } = this.props;

    return (
      <svg height={HEIGHT} width={WIDTH}>
        <g
          className="graph"
          transform={`translate(${MARGIN}, ${MARGIN})`}
        >
          <ReactCSSTransitionGroup
            component="g"
            className="players"
            transitionName="player"
            transitionAppear={true}
            transitionAppearTimeout={UPDATE_INTERVAL}
            transitionEnter={true}
            transitionEnterTimeout={UPDATE_INTERVAL}
            transitionLeave={true}
            transitionLeaveTimeout={UPDATE_INTERVAL / 2}
          >
            {currentPlayers.map((player, i) => {
              return (
                <Point
                  key={`player-${player.Name.replace(/\s+/g, ' ')}`}
                  name={player.Name}
                  showPlayerName={showPlayerName}
                  xScale={xScale}
                  xValue={player[xIndicator]}
                  yScale={yScale}
                  yValue={player[yIndicator]}
                />
              );
            })}
          </ReactCSSTransitionGroup>
        </g>
        <Axis
          axis="x"
          scale={xScale}
          ticks={10}
          transform={`translate(${MARGIN}, ${height + MARGIN})`}
        />
        <Axis
          axis="y"
          orient="left"
          scale={yScale}
          transform={`translate(${MARGIN}, ${MARGIN})`}
        />
      </svg>
    );
  }
}

export default Chart;
