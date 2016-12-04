import React, { Component } from 'react'
import {Text} from 'react-native'

class Header extends Component {
    render() {
        const {children, style} = this.props
        return <Text style={[this.typography, style]}>{children}</Text>
    }
}

export class H1 extends Header {
   constructor(){
        super()
        this.typography = {fontSize:25}
    } 
}


export class H2 extends Header {
   constructor(){
        super()
        this.typography = {fontSize:20}
    } 
}