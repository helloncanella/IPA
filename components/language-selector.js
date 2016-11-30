import React, { Component } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import {Thumbnail} from 'native-base'


var languagesJSON = require('data/languages.json')

export class LanguageSelector extends Component {

    languageList() {

        let {languages} = languagesJSON

        return languages.map((language) => {

            let {flag, name} = language
                , {navigator} = this.props

            return (
                <TouchableHighlight onPress={()=>{navigator.push({id:'ipa-chart'})}} key={name}>
                    <View>
                        <Thumbnail source={{ uri: flag }} />
                        <Text>{name}  oi</Text>
                    </View>
                 </TouchableHighlight>
            )
        })

    }

    render() {
        const {navigator} = this.props

        return (
            <View>
                {this.languageList()}
            </View>
        )


    }
}