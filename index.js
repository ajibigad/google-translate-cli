const translator = require('./translator')
const express = require('express')
const app = express()
const port = 3000

app.get('/translate', (req, res) => {
    if (!req.query) {
        res.end();
        return;
    }
    translator.translate(req.query.q)
        .then((translatedText) => {
            res.json({ translatedText });
        });
})

app.get('/refresh', (req, res) => {
    translator.closeBrowser()
        .then(() => translator.bootBrowser().then(() => res.end()));
})

translator.bootBrowser()
    .then(() => app.listen(port, () => console.log(`app listening on port ${port}!`)),
        () => {
            console.log("error occured while opening the browser");
            process.exit()
        });
