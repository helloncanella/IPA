import React, { Component } from 'react'
import { Container, Content, Thumbnail } from 'native-base'



export class LanguageSelector extends Component {
    
    renderLanguageList(){
        return 
    }

    render() {
        return (
            <Container className="language-selector">
                <Content>
                    {this.renderLanguageList()}
                </Content>    
            </Container>
        )
    }
}