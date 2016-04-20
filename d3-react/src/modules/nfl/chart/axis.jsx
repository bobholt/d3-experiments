import d3 from 'd3';
import React from 'react';

import BaseComponent from '../../../classes/base-component';

class Axis extends BaseComponent {

  constructor(props) {
    super(props);

    this.axis = d3.svg.axis();

    if (props.orient) {
      this.axis.orient(props.orient);
    }

    if (props.ticks) {
      this.axis.ticks(props.ticks);
    }

    if (props.scale) {
      this.axis.scale(props.scale);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.axis.scale(nextProps.scale);
    d3.select(`.${this.props.axis}.axis`).call(this.axis);
  }

  render() {
    return (
      <g className={`${this.props.axis} axis`} transform={this.props.transform} />
    );
  }
}

export default Axis;
