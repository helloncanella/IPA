
var
    fs = require('fs')
    , languages = require('./language-list')
    , request = require('request')
    , file = fs.readFileSync('consonants.tsv').toString('utf8')
    , rows = file.split('\n')
    , header = []
    , finalJSON = {}
    , promises = []


rows.forEach(function (row, index) {

    if (index === 0) {
        row.split('\t').forEach(function (cell) {
            header.push(cell.replace(/\r/g, '').replace(/\s/g, '_').toLowerCase())
        })
        return
    }

    if (header) {

        var cells = row.split('\t')
            , ipaSymbol = cells[header.indexOf('ipa')]
            , name = cells[header.indexOf('name')]
            , audioName = name.replace(/\s/g, '-').toLowerCase()
            , audioRoot = `../assets/audio/consonants/${audioName}/`

        finalJSON[ipaSymbol] = {}
        finalJSON[ipaSymbol].examples = {}

        cells.forEach(function (cell, i) {

            var key = header[i], value = cell

            if (isValid(value)) {

                if (key === 'sound') {
                    var
                        pathToSave = audioRoot + 'sound.mp3'
                        , url = value

                    var downloadIPASound = new Promise(function (resolve, reject) {

                        downloadAudio({ url, pathToSave }, function (error) {
                            if (error) console.log(error)
                            finalJSON[ipaSymbol][key] = pathToSave
                            resolve()
                        })

                    })

                    promises.push(downloadIPASound)


                } else if (languages.indexOf(key) > -1) {
                    var
                        language = key
                        , examples = value.replace(/\r/g, '').split(',').map((example) => {
                            return example.replace(/\s/, '')
                        })

                    finalJSON[ipaSymbol].examples[language] = []

                    examples.forEach(function (example, index) {
                        var
                            pathToSave = audioRoot + 'examples/' + language + '/' + example + '.mp3'
                            , url = value

                        if (example) {

                            var downloadExample = new Promise(function (resolve, reject) {

                                downloadAudioExample({ word: example, pathToSave, language, audioRoot }, function (error) {
                                    if (error) { console.log(error); return }
                                    finalJSON[ipaSymbol].examples[language].push({ word: example, audio: pathToSave })
                                    resolve()
                                })

                            })

                            promises.push(downloadExample)

                        }
                    })

                } else {
                    finalJSON[ipaSymbol][key] = value.toLowerCase()
                }
            }


        })

    }

})

Promise.all(promises).then(() => {
    fs.writeFile('consonants.json', JSON.stringify(finalJSON, null, 4))
})




function downloadAudioExample({word, pathToSave, language}, callback) {

    requestWordToForvo({word, pathToSave, language}, function (error) {
        if (error) console.log(error)
        callback(null)
    })
}


function requestWordToForvo({word, language, audioRoot}, callback) {

    var apiKey = '5cd8ecd7ad6b916127af0a60f41e4ab0'
        , url = `https://apifree.forvo.com/key/${apiKey}/format/json/action/word-pronunciations/word/${word}/language/${language}`

    request(url, function (error, response, body) {  

        if (!error && response.statusCode == 200) {

            var item = JSON.parse(body).items[0]

            if(item){

                var pathmp3 = JSON.parse(body).items[0].pathmp3
                    , pathToSave = audioRoot + `${language}`

                downloadAudio({ url: pathmp3, pathToSave }, callback)
            
                console.log(pathmp3)
            }
            
        }
    })
}


function downloadAudio({url, pathToSave}, callback) {

    var path;


    // request
    //     .get(url)
        
    //     .on('error', function (err) {
    //         if (callback) callback(err)
    //     })
        
    //     .on('response', function())        
}

function isValid(value) {
    if (value === '' || value === '-' || value === '\r') return false

    return true
}