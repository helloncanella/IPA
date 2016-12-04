import React, { Component } from 'react'
import { Text } from 'react-native'

class Header extends Component {
    capitalize(string = '') {
        return [...string].map(    
            (char, index) => index ? char : char.toUpperCase()  
        ).join('')
    }                          

    render() {
        const {children, style} = this.props
        return <Text style={[this.typography, style]}>{this.capitalize(children)}</Text>
    }
}

export class H1 extends Header {
    constructor() {
        super()
        this.typography = { fontSize: 28, marginBottom: 5, fontFamily: 'Roboto' }
    }
}


export class H2 extends Header {
    constructor() {
        super()
        this.typography = { fontSize: 20, fontFamily: 'Roboto' }
    }
}