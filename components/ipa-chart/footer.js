import React, {Component} from 'react'
import {View, Text} from 'react-native'

export class Footer extends Component{
    render(){
        const footerStyle = {backgroundColor:'red'}

        return (
            <View style={[footerStyle, this.props.style]}>
                <Text>oi</Text>
            </View>
        )
    }
}

