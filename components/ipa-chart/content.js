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
            audio: null,
            selectedIPA: '',
            wordExample: '',
            error: '', 
            nextAudioExecution: null
        }
    }

    loadSound({description, audioPath, type}) {

        return new Promise((resolve, reject) => {

            var audioResource = new Sound(audioPath, '', (error) => {
                if (error) { reject(error); return }
                audioResource.setVolume(1)
                resolve({ description, audioResource, type })
            });

        })
    }

    destroyOldAudioExecution(){
        clearTimeout(this.state.nextAudioExecution)
        this.setState({nextAudioExecution: null})
    }

    loadAllSounds({loadExamples = false, IPASymbol}) {

        const

            {speechSound, currentLanguage} = this.props

            , {examples = null, name, sound} = objectContent[speechSound][IPASymbol]

            , languageExamples = examples[currentLanguage]

            , IPAname = name, IPAsound = sound

            , self = this

            , thereAreExamples = examples && languageExamples && languageExamples.length


        let audiosToLoad = [{ description: IPAname, audioPath: IPAsound, type: 'ipa' }]


        if (thereAreExamples && loadExamples) {

            let audioExamples = languageExamples.map((example) => {
                let {audio, word} = example

                return { audioPath: audio, description: word, type: 'example' }
            })

            audiosToLoad = Object.assign([], [].concat(audiosToLoad, audioExamples))

        }


        let audiosLoading = audiosToLoad.map((audio) => {
            return this.loadSound(audio)
        })


        return Promise.all(audiosLoading).then((loadedAudios) => loadedAudios, (error) => error)

    }

    releaseLastAudio() {
        const storedAudio = this.state.audio
        if (storedAudio) storedAudio.release()
    }

    playAudiosSequentially(audios) {

        let self = this

       this.releaseLastAudio()

        if(audios.length){
            let {audioResource} = audios[0]

                , duration = audioResource.getDuration()*1000 

                , nextAudios = audios.slice(1,audios.length)

                , nextAudioExecution 
           
            nextAudioExecution =  setTimeout(function(){self.playAudiosSequentially(nextAudios)}, duration)

            this.setState({audio: audioResource, nextAudioExecution}) 

            audioResource.play()

        }

    }


    onSelectedSymbol({IPASymbol, playExamples = false}) {

        this.destroyOldAudioExecution() 

        const onLoaded = (audiosLoaded) => {
            this.playAudiosSequentially(audiosLoaded)
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

        for (let IPASymbol in content) {

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

