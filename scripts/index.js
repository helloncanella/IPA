
var
    fs = require('fs')
    , _ = require('lodash')
    , languages = require('./language-list')
    , request = require('request')
    , mkdirp = require('mkdirp')
    , files = ['consonants', 'vowels']

files.forEach((speechSounds) => {

    var file = fs.readFileSync(`${speechSounds}.tsv`).toString('utf8')
        , rows = file.split('\n')
        , header = []
        , finalJSON = {}
        , promises = []


    var oldJSON = fs.existsSync(`../data/${speechSounds}.json`) ? JSON.parse(fs.readFileSync(`../data/${speechSounds}.json`)) : {}


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
                , audioName = speechSounds + '_' + name.replace(/(\s|\-)/g, '_').toLowerCase()
                , audioRoot = '../android/app/src/main/res/raw'


            finalJSON[ipaSymbol] = {}
            finalJSON[ipaSymbol].examples = {}

            cells.forEach(function (cell, i) {

                var key = header[i], value = cell

                if (isValid(value)) {

                    if (key === 'sound') {

                        var url = value, fileName = audioName

                        var downloadIPASound = new Promise(function (resolve, reject) {

                            downloadAudio({ url, pathToSave: audioRoot, fileName }, function (error) {
                                if (error) console.log(error)
                                finalJSON[ipaSymbol][key] = fileName
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


                        examples.forEach(function (word, index) {
                            var
                                url = value
                                , normalizedFileName = `${audioName}_examples_${language}_${word}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"").replace(/(\s|\-)/g,"_")
                                , wordWasDownloaded = false


                            if (oldJSON[ipaSymbol]) {
                                wordWasDownloaded = !!_.find(oldJSON[ipaSymbol].examples[language], function (o) { return o.word === word })
                            }

                            finalJSON[ipaSymbol].examples[language] = oldJSON[ipaSymbol] ? (oldJSON[ipaSymbol].examples[language] || []) : []

                            if (word && !wordWasDownloaded) {

                                var downloadExample = new Promise(function (resolve, reject) {

                                    downloadAudioExample({ word, pathToSave: audioRoot, fileName:normalizedFileName, language }, function (error) {
                                        if (error) {
                                            console.log(error);
                                            resolve();
                                            return
                                        }

                                        finalJSON[ipaSymbol].examples[language].push({ word, audio: normalizedFileName })
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
        var object = Object.assign({}, oldJSON, finalJSON)
        fs.writeFile(`../data/${speechSounds}.json`, JSON.stringify(object, null, 4))
    })

})




function downloadAudioExample({word, language, pathToSave, fileName}, callback) {

    console.log(word)

    var apiKey = '3cdf9af00cb2273d48dc993b77f3f499'
        , additionalUrl = language === 'portuguese' ? 'country/brazil' : '' //TODO: remove the condition (Now I'm tired)
        , url = `https://apicommercial.forvo.com/key/${apiKey}/format/json/action/word-pronunciations/word/${word}/language/${language}/${additionalUrl}`


    request(url, function (error, response, body) {

        if (error) {
            callback(error)
            return
        }


        if (response.statusCode == 200) {

            var item = JSON.parse(body).items ? JSON.parse(body).items[0] : ''

            

            if (item) {
                var pathmp3 = JSON.parse(body).items[0].pathmp3
                downloadAudio({ url: pathmp3, pathToSave, fileName }, callback)
            } else {
                callback('The word is not available or forvo requests daily limit reached')
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
        .pipe(fs.createWriteStream(pathToSave + '/' + fileName))
        .on('finish', function () {
            callback(null)
            console.log('downloaded file ' + fileName)
        })
}

function isValid(value) {
    if (value === '' || value === '-' || value === '\r') return false

    return true
}