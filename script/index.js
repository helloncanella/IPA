const fs = require('fs')
    , request = require('request')

let completedTasks = 0
    , parallelTasks = []
    , object = {}

fs.readFile('german.tsv', function (error, data) {

    if (error) throw new Error(error.message)

    const file = data.toString()
        , rows = file.split('\r\n').map(row => row.split('\t'))
        , header = rows.shift().map(item => item.replace(/\s|\-/g, '_').toLowerCase())

    rows.forEach(function (row) {

        const speechSound = row[header.indexOf('speech_sound')]
            , ipa = row[header.indexOf('ipa')]

        if(!object[speechSound]){
            object[speechSound] = {}
        }

        object[speechSound][ipa] = {
            examples: []
        }

        let info = object[speechSound][ipa]

        row.forEach((cell, index) => {

            const key = header[index]

            if (key === 'sound') {

                const task = () => {

                    downloadAudio({ url: cell, pathToSave: './audio', resourceName: randomName() }, (error, path) => {
                        if (error) console.error(error.message)
                        info.sound = path
                        completeParallelTask()
                    })

                }

                parallelTasks.push(task)


            } else if (key === 'examples') {

                let examples = cell.split(',')

                examples.forEach((example) => { 

                    example = example.replace(/\s+/g, '')

                    const task = () => {
                        copyAudio({ source: './german-source', pathToSave: './audio', resourceName: randomName() }, (error, path) => {
                            if (error) console.error(error.message)
                            info.examples.push({ word: example, sound: 'path' })
                            completeParallelTask()
                        })
                    }

                    parallelTasks.push(task)

                })


            } else if (!(key == 'speech_sound' || key === 'ipa')) {
                info[key] = cell
            }

        })

    })

    //run tasks
    parallelTasks.forEach((task) => {
        task()
    })

})


function randomName() {
    let randomNumber = Math.random().toString(26)
    return randomNumber.slice(2, randomNumber.length)
}

function downloadAudio({url, pathToSave}, callback) {
    if (callback) callback()
}

function copyAudio({source, pathToSave}, callback) {
    if (callback) callback()
}

function completeParallelTask() {
    completedTasks++;

    if (completedTasks === parallelTasks.length) {
        fs.writeFile('./oi.json', JSON.stringify(object, null, 4))
    }
}