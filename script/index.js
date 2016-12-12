const fs = require('fs')
    , request = require('request')
    , mkdirp = require('mkdirp')

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

        if (!object[speechSound]) {
            object[speechSound] = {}
        }

        object[speechSound][ipa] = {
            examples: []
        }

        let info = object[speechSound][ipa]

        row.forEach((cell, index) => {

            const key = header[index]

            if (key === 'sound') {

                const pathname = `./audios/${randomName()}`

                    , task = () => {

                        downloadAudio({ url: cell, pathname }, (error) => {
                            if (error) {
                                console.error(error.message)
                            }else{
                                info.sound = pathname
                                console.log('downloaded '+cell)
                            }

                            completeParallelTask()
                        })

                    }

                console.log(pathname)

                parallelTasks.push(task)


            } else if (key === 'examples') {

                let examples = cell.split(',')

                examples.forEach((example) => {

                    example = example.replace(/\s+/g, '')

                    const pathname = `./audios/${randomName()}`

                        , task = () => {
                            copyAudio({ source: `./german-source/${normalize(example)}.mp3`, pathname }, (error) => {
                                if (error) {
                                    console.error(error.message)
                                }else{
                                    info.examples.push({ word: example, sound: pathname })
                                }

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

function normalize(string){
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g,"")
}

function downloadAudio({url, pathname}, callback) {

    createFolderIfNotExist(pathname, () => {

        request
            .get(url)
            .on('error', function (err) {
                if (err && callback) callback(err)
            })
            .pipe(fs.createWriteStream(pathname))

        if (callback) callback()
    })

}

function copyAudio({source, pathname}, callback) {

    if(!fs.existsSync(source)){
        callback("File "+source+" doesn't exist")
        return
    } 

    createFolderIfNotExist(pathname, () => {
        fs.createReadStream(source).pipe(fs.createWriteStream(pathname))
        if (callback) callback()
    })

}

function createFolderIfNotExist(pathname, callback) {
    const folder = pathname.match(/((\.\/)?\w+)\//)[1]

    mkdirp(folder, function (error) {
        if (error) throw new Error(error.message)
        if (callback) callback()
    })
}

function completeParallelTask() {
    completedTasks++;

    if (completedTasks === parallelTasks.length) {
        fs.writeFile('./german.json', JSON.stringify(object, null, 4))
    }
}