import React, { Component } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

export class IPAChart extends Component {
    render() {

        const {navigator} = this.props

        return (
            <View className="ipa-chart">
                <TouchableHighlight onPress={()=>{navigator.push({id:'language-selector'})}}><Text>adfsda</Text></TouchableHighlight>
            </View>
        )
    }
}