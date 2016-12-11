import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export class Footer extends Component {

    renderTabs() {
        return tabs.map((item) => {

            const {name, id} = item

                , {tab, tabText, activeTab} = styles

                , {selectedContent} = this.props

                , additionalTabStyle = selectedContent === id ? activeTab : {}

            return (
                <TouchableOpacity key={id} style={[tab]} onPress={() => this.props.selectContent(id)}>
                    <Text style={[tabText, additionalTabStyle]}>{name}</Text>
                </TouchableOpacity>
            )
        })
    }

    render() {

        const {footer} = styles

        return (
            <View style={footer}>
                {this.renderTabs()}
            </View>
        )

    }
}

const tabs = [
    { id: 'consonants', name: 'Consonants' },
    { id: 'vowels', name: 'Vowels' },
]

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        backgroundColor: '#E53935'
    },
    tab: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        borderTopWidth: 1, 
        borderTopColor: 'transparent'
    },
    tabText: {
        fontSize: 20,
        color: 'rgba(255,255,255, 0.5)',
        textAlign: 'center'
    },
    activeTab: {
        color: 'rgba(255,255,255, 1)'
    }
})
