
var
    fs = require('fs')
    , _ = require('lodash')
    , languages = require('./language-list')
    , request = require('request')
    , mkdirp = require('mkdirp')
    , file = fs.readFileSync('consonants.tsv').toString('utf8')
    , rows = file.split('\n')
    , header = []
    , finalJSON = {}
    , promises = []


var oldJSON = fs.existsSync('consonants.json') ? JSON.parse(fs.readFileSync('consonants.json')) : {}


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
            , audioRoot = `/assets/audio/consonants/${audioName}/`

        finalJSON[ipaSymbol] = {}
        finalJSON[ipaSymbol].examples = {}

        cells.forEach(function (cell, i) {

            var key = header[i], value = cell

            if (isValid(value)) {

                if (key === 'sound') {

                    var url = value, fileName = 'sound'

                    var downloadIPASound = new Promise(function (resolve, reject) {

                        downloadAudio({ url, pathToSave: '..' + audioRoot, fileName }, function (error) {
                            if (error) console.log(error)
                            finalJSON[ipaSymbol][key] = audioRoot + fileName
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

                    examples.forEach(function (word, index) {
                        var
                            pathToSave = audioRoot + 'examples/' + language
                            , url = value
                            , wordWasDownloaded = false


                        if (oldJSON[ipaSymbol]) {
                            wordWasDownloaded = !!_.find(oldJSON[ipaSymbol].examples[language], function (o) { return o.word === word })
                        }

                        if (word && !wordWasDownloaded) {

                            var downloadExample = new Promise(function (resolve, reject) {

                                downloadAudioExample({ word, pathToSave: '..' + pathToSave, language }, function (error) {
                                    if (error) {
                                        console.log(error);
                                        resolve();
                                        return
                                    }

                                    finalJSON[ipaSymbol].examples[language].push({ word, audio: pathToSave + '/' + word })
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
    var consonants = Object.assign({}, oldJSON, finalJSON)
    fs.writeFile('consonants.json', JSON.stringify(consonants, null, 4))
})



function downloadAudioExample({word, language, pathToSave}, callback) {

    var apiKey = '5cd8ecd7ad6b916127af0a60f41e4ab0'
        , url = `https://apifree.forvo.com/key/${apiKey}/format/json/action/word-pronunciations/word/${word}/language/${language}`

    request(url, function (error, response, body) {

        if (error) {
            callback(error)
            return
        }


        if (response.statusCode == 200) {

            var item = JSON.parse(body).items ? JSON.parse(body).items[0] : ''

            if (item) {
                var pathmp3 = JSON.parse(body).items[0].pathmp3
                downloadAudio({ url: pathmp3, pathToSave, fileName: word }, callback)
            } else {
                callback('Reached diary limit')
            }

        }
    })
}


function downloadAudio({url, pathToSave, fileName}, callback) {

    var path;

    if (!fs.existsSync(pathToSave)) {
        mkdirp.sync(pathToSave);
    }


    request
        .get(url)
        .on('error', function (err) {
            if (callback) callback(err)
        })
        .pipe(fs.createWriteStream(pathToSave + fileName))
        .on('finish', function () {
            callback(null)
            console.log('downloaded file ' + fileName)
        })
}

function isValid(value) {
    if (value === '' || value === '-' || value === '\r') return false

    return true
}