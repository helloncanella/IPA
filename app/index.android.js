import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Navigator } from 'react-native';
import {LanguageSelector} from 'components/language-selector/language-selector.js'
import {IPAChart} from 'components/ipa-chart/ipa-chart.js'

const routes = [
    { id: 'ipa-chart' }
]

export default class IPA extends Component {

    render() {

        let properties = {
            initialRoute: {
                id: 'ipa-chart'
            },
            renderScene: (route, navigator) => {
                if (route.id === 'ipa-chart') {
                    return <IPAChart navigator={navigator} language='german'/>
                }
            }

        }

        return <Navigator {...properties} />
    }

}


AppRegistry.registerComponent('IPA', () => IPA);
