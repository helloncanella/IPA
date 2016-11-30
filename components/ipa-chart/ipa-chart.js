import React, { Component } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import { Content } from 'components/ipa-chart/content.js'

export class IPAChart extends Component {

    constructor() {
        super()
        this.state = {
            selectedContent: 'consonants'
        }
    }

    onSelectContent(content) {
        this.setState({ selectedContent: content })
    }

    render() {

        const {navigator, language} = this.props
            , {selectedContent} = this.state
            , layout = { flex: 1, flexDirection: 'column', justifyContent: 'space-between' }

        return (
            <View style={layout}>
                <Content selectedContent={selectedContent} currentLanguage={language} />
            </View>
        )
    }
}


// <Footer selectContent={this.onSelectContent.bind(this)} selectedContent={selectedContent} />
// <Header navigator={navigator} currentLanguage={language} />