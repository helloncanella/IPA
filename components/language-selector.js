import React, { Component } from 'react'
import { Container, Content, Thumbnail, Text, List, ListItem } from 'native-base'

var languagesJSON = require('data/languages.json')

export class LanguageSelector extends Component {

    languageList() {

        let {languages} = languagesJSON

        return languages.map((language) => {

            let {flag, name} = language
                , {navigator} = this.props

            return (
                <ListItem button onPress={()=>{navigator.push({id:'ipa-chart'})}} key={name}>
                    <Thumbnail source={{ uri: flag }} />
                    <Text>{name}</Text>
                </ListItem>
            )
        })

    }

    render() {

        let languageList = this.languageList()

        console.log(languageList)

        return (
            <Container className="language-selector">
                <Content>
                    {languageList}
                </Content>
            </Container>
        )
    }
}