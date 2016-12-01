import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

const consonants = require('data/consonants.json')
    , vowels = require('data/vowels.json')
    , objectContent = { consonants, vowels }

export class Content extends Component {

    render() {

        const {selectedContent, currentLanguage} = this.props

            , properties = {
                speechSound: selectedContent,
                currentLanguage
            }

        return (
            <View>
                <IPASymbols {...properties} />
            </View>
        )

    }
}

Content.propTypes = {
    selectedContent: PropTypes.string.isRequired,
    currentLanguage: PropTypes.string.isRequired
}

class IPASymbols extends Component {

    content() {

        const {currentLanguage, speechSound} = this.props
            , content = objectContent[speechSound]
            , style = { padding: 10, borderWidth: 1, borderColor: 'black', width: 60, height: 60 }
            , symbols = []

        for (var IPASymbol in content) {

            //if there the sound (IPASymbol) in the currentLanguage, render it.
            if (content[IPASymbol].examples[currentLanguage]) {

                let ipaSound = (
                    <TouchableHighlight key={IPASymbol} style={style}>
                        <Text style={{ fontSize: 25, textAlign: 'center' }}>{IPASymbol}</Text>
                    </TouchableHighlight>
                )

                symbols.push(ipaSound)

            }

        }

        return symbols

    }

    render() {

        const layout = { flex: 1, flexDirection: 'row', flexWrap: 'wrap', }

        return (
            <View style={layout}>
                {this.content()}
            </View>
        )

    }
}

