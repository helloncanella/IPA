import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

var Sound = require('react-native-sound');

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

    constructor() {
        super()
        this.state = {
            audio: null
        }
    }

    onPress() {
        const {storedAudio} = this.state

        if (storedAudio) storedAudio.release()

        var audio = new Sound('consonants_alveolar_trill_examples_spanish_amor_eterno', '', (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else { // loaded successfully
                this.setState({ audio })
                audio.setVolume(1);
                audio.play()
            }
        });

    }

    loadAllSounds({loadExamples = false, IPASymbol}) {

        const

            {speechSound, currentLanguage} = this.props

            , {examples = null, name, sound} = objectContent[speechSound]

            , thereAreExamples = examples && examples[currentLanguage] && examples[currentLanguage].length

            , soundsLoadingPromises = []

            , symbolLoading = new Promise((resolve, reject) => {

            })

        soundsLoadingPromises.push(symbolLoading)


        if (thereAreExamples && playExamples) {

            let examplesLoading = new Promise((resolve, reject) => {

            })

            soundsLoadingPromises.push(examplesLoading)

        }


        return Promise.all(soundsLoadingPromises).then(values => {
            const symbolSound = values[0]

            if (values[1]) {
                let examplesSound = values[1],
                return Object.assign({}, symbolSound, examplesSound)
            }

            return symbolSound
        })

    }

    playSequentially(audios) {

    }

    onSelectedSymbol({IPASymbol, playExamples = false}) {

        const onLoaded = (audios) => {
            this.playSequentially(audios)
        }

        const onError = (error) => {
            console.log(error)
        }

        this.loadAllSounds({ loadExamples: playExamples, IPASymbol }).then(onLoaded, onError)

    }


    content() {

        const {currentLanguage, speechSound} = this.props
            , content = objectContent[speechSound]
            , style = { padding: 10, borderWidth: 1, borderColor: 'black', width: 60, height: 60 }
            , symbols = []
            , self = this

        for (var IPASymbol in content) {

            let {examples = null} = content[IPASymbol]

            //if there the sound (IPASymbol) in the currentLanguage, render it.
            if (examples && examples[currentLanguage]) {

                const

                    properties = {
                        key: IPASymbol,
                        style,
                        onPress: function onPress() {
                            self.onSelectedSymbol({ IPASymbol })
                        },
                        onLongPress: function onLongPress() {
                            self.onSelectedSymbol({ IPASymbol, playExamples: true })
                        }
                    }

                    , ipaSound = (
                        <TouchableHighlight {...properties}>
                            <View>
                                <Text style={{ fontSize: 25, textAlign: 'center' }}>{IPASymbol}</Text>
                            </View>
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

