import 'dotenv/config'
import fs from 'fs'

(async () => {
    fs.readdirSync('./', {
        withFileTypes: true
    }).forEach(async file => {
        if (file.isDirectory() && file.name != 'node_modules' && file.name != 'utils') {
            console.log(`Starting ${file.name} module.`)
            try {
                const module = await import(`./${file.name}/${file.name}.js`)

                module.default.init()
            } catch (err) {
                console.log(`Error while starting ${file.name} module, ${err}.`)
                throw err
            }
        }
    })
})()