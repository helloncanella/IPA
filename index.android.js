import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Navigator } from 'react-native';
import {LanguageSelector} from './components/language-selector.js'
import {IPAChart} from './components/ipa-chart.js'

const routes = [
    { id: 'language-selector' },
    { id: 'ipa-chart' }
]

export default class IPA extends Component {

    render() {

        let properties = {
            initialRoute: {
                id: 'language-selector'
            },
            renderScene: (route, navigator) => {
                if (route.id === 'language-selector') {
                    return <LanguageSelector navigator={navigator} />
                } else if (route.id === 'ipa-chart') {
                    return <IPAChart navigator={navigator} />
                }
            }

        }

        return <Navigator {...properties} />
    }

}


AppRegistry.registerComponent('IPA', () => IPA);
