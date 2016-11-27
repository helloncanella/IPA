
var
    fs = require('fs')
    , languages = require('./language-list')
    , request = require('request')
    , file = fs.readFileSync('consonants.tsv').toString('utf8')
    , rows = file.split('\n')
    , header = []
    , finalJSON = {}


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
            , audioRoot = `../assets/audio/consonants/${name.replace(/\s/g, '-').toLowerCase()}/`

        finalJSON[ipaSymbol] = {}
        finalJSON[ipaSymbol].examples = {}

        cells.forEach(function (cell, i) {

            var key = header[i], value = cell

            if (isValid(value)) {

                if (key === 'sound') {
                    var
                        pathToSave = audioRoot + 'sound.mp3'
                        , url = value

                    downloadAudio({ url, pathToSave }, function (error) {
                        if (error) console.log(error)
                        finalJSON[ipaSymbol][key] = pathToSave
                    })

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

                        finalJSON[ipaSymbol].examples[language].push({ word: example, audio: pathToSave })
                    })

                } else {
                    finalJSON[ipaSymbol][key] = value.toLowerCase()
                }
            }


        })




    }






})


fs.writeFile('consonants.json', JSON.stringify(finalJSON, null, 4))


function downloadAudio({url, pathToSave}, callback) {

    var path;


    if (callback) callback(null)


    return path
}

function isValid(value) {
    if (value === '' || value === '-' || value === '\r') return false

    return true
}