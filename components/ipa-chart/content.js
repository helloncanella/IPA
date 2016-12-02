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
        // Import the react-native-sound module
        if (this.state.audio) {
            this.state.audio.release() 
        }


        console.log(Sound.LIBRARY, Sound.DOCUMENT, Sound.CACHES)


        // Load the sound file 'whoosh.mp3' from the app bundle
        // See notes below about preloading sounds within initialization code below.
        var whoosh = new Sound('consonants_alveolar_trill_examples_spanish_amor_eterno', '', (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else { // loaded successfully
                console.log('duration in seconds: ' + whoosh.getDuration() +
                    'number of channels: ' + whoosh.getNumberOfChannels());
                this.setState({ audio: whoosh })
                whoosh.play()
            }
        });



        // Play the sound with an onEnd callback
        // whoosh.play((success) => {
        //     if (success) {
        //         console.log('successfully finished playing');
        //     } else {
        //         console.log('playback failed due to audio decoding errors');
        //     }
        // });

        // Reduce the volume by half
        whoosh.setVolume(1);

        // // Position the sound to the full right in a stereo field
        // whoosh.setPan(1);

        // // Loop indefinitely until stop() is called
        // whoosh.setNumberOfLoops(-1);

        // // Get properties of the player instance
        // console.log('volume: ' + whoosh.getVolume());
        // console.log('pan: ' + whoosh.getPan());
        // console.log('loops: ' + whoosh.getNumberOfLoops());

        // // Enable playback in silence mode (iOS only)
        // // Sound.enableInSilenceMode(true);

        // // Seek to a specific point in seconds
        // whoosh.setCurrentTime(2.5);

        // // Get the current playback point in seconds
        // whoosh.getCurrentTime((seconds) => console.log('at ' + seconds));

        // // Pause the sound
        // whoosh.pause();

        // // Stop the sound and rewind to the beginning
        // whoosh.stop();

        // // Release the audio player resource
        // whoosh.release();
    }


    content() {

        const {currentLanguage, speechSound} = this.props
            , content = objectContent[speechSound]
            , style = { padding: 10, borderWidth: 1, borderColor: 'black', width: 60, height: 60 }
            , symbols = []

        for (var IPASymbol in content) {

            //if there the sound (IPASymbol) in the currentLanguage, render it.
            if (content[IPASymbol].examples[currentLanguage]) {

                let ipaSound = (
                    <TouchableHighlight key={IPASymbol} style={style} onPress={this.onPress.bind(this)}>
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

