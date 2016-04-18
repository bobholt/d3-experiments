import React from 'react';
import {FormattedMessage} from 'react-intl';

import BaseComponent from '../../classes/base-component';

import strings from './strings';

class Main extends BaseComponent {
  render() {
    return (
      <h1><FormattedMessage {...strings.hello_world} /></h1>
    );
  }
}

export default Main;
