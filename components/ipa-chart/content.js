import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

const consonants = require('data/consonants.json')
    , vowels = require('data/vowels.json')
    , objectContent = {consonants, vowels}

export class Content extends Component {

    render() {

        const {selectedContent} = this.props

        return (
            <View>
                <Vowels show={selectedContent === 'vowels'} />
                <Consonants show={selectedContent === 'consonants'} />
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
        
    }

    render() {

        const visibility = { display: this.props.show ? 'block' : 'none' }
            , layout = { flex: 1, flexDirection: 'row', flexWrap: 'wrap' }

        return (
            <View style={[visibility, layout]}>
                {this.content()}
            </View>
        )
    }
}

class Vowels extends IPASymbols {
    constructor() {
        super()
        this.sound = 'vowels'
    }
}

class Consonants extends IPASymbols {
    constructor() {
        super()
        this.sound = 'consonants'
    }
}

