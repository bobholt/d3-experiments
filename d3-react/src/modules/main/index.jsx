import React from 'react';
import {FormattedMessage} from 'react-intl';

import BaseComponent from '../../classes/base-component';

import NFL from '../nfl';

import strings from './strings';

class Main extends BaseComponent {
  render() {
    return (
      <main>
        <h1><FormattedMessage {...strings.hello_world} /></h1>
        <NFL />
      </main>
    );
  }
}

export default Main;
