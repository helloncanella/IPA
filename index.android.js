/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Navigator
} from 'react-native';

import { Container, Content, List, ListItem, Thumbnail, Text, Footer, FooterTab, Button, Icon, Badge } from 'native-base';

export default class IPA extends Component {
  render() {
    return (
      <Container>
        <Content>
  
        </Content>
        <Footer >
          <FooterTab>
            <Button active={true}>
              æ
            </Button>
            <Button active={true}>
              <Icon name='ios-camera-outline' />
            </Button>
            <Button active={false}>
              <Icon name='ios-compass' />
            </Button>
            <Button>
              <Icon name='ios-contact-outline' />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('IPA', () => IPA);
