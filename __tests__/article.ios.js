import 'react-native';
import React from 'react';
import Article from '../App/Views/Article';
import configureStore from '../App/configureStore.js'
import { NavigationActions } from 'react-navigation'
import renderer from 'react-test-renderer';

import testStore from '../App/testStore'

it('renders correctly', () => {
  const navigation = {
    state: {params: {id: 1}}
  }
  const tree = renderer.create(
    <Article id="1" store={testStore} navigation={navigation}/>
  );
});
