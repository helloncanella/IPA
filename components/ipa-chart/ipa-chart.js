import React, { Component } from 'react'
import { View, Text, TouchableHighlight, ScrollView, StyleSheet } from 'react-native'
import { Content } from 'components/ipa-chart/content.js'
import { Footer } from 'components/ipa-chart/footer.js'



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


        return (
            <View style={styles.container}>
                <Content selectedContent={selectedContent} currentLanguage={language} style={styles.content} />
                <Footer style={styles.footer} selectContent={this.onSelectContent.bind(this)} selectedContent={selectedContent} />
            </View>
        )
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column'
    },

    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    footer: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: 'red'
    }
})

// <Header navigator={navigator} currentLanguage={language} />