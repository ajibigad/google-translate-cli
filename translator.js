const puppeteer = require('puppeteer');

const launchOptions = {
    headless: true,
    slowMo: 0
}

const translator = {
    previousText: '',
    previousTranslation: '',

    async bootBrowser() {
        console.log("Starting up the browser");
        this.browser = await puppeteer.launch(launchOptions);
        this.page = await this.browser.newPage();
        return await this.page.goto('https://translate.google.com');
    },

    async closeBrowser() {
        console.log("Closing the browser");
        return await this.browser.close();
    },

    async translate(textToTranslate) {
        console.log("Trying to translate ", textToTranslate);
        if (this.previousText.length > 0 && this.previousText === textToTranslate) {
            console.log(`Input: ${this.previousText} \nResult: ${this.previousTranslation}`);
            return this.previousTranslation;
        }
        try {
            const sourceBox = await this.page.$('#source');
            for (let i = 0; i < this.previousText.length; i++) {
                await sourceBox.press('Backspace');
            }
            await sourceBox.type(textToTranslate);
            await sourceBox.dispose();

            console.log("Waiting for translation");

            const translatedBoxSelector = 'body > div.frame > ' +
                'div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > ' +
                'div.tlid-source-target.main-header > div.source-target-row > ' +
                'div.tlid-results-container.results-container > div.tlid-result.result-dict-wrapper > ' +
                'div.result.tlid-copy-target > div.text-wrap.tlid-copy-target > ' +
                'div > span.tlid-translation.translation';

            await this.page.waitForSelector(translatedBoxSelector, {
                visible: true
            });

            const inputText = await this.page.$eval('#input-wrap > div.text-dummy', e => e.innerHTML);
            const translatedText = await this.page.$eval(translatedBoxSelector,
                e => e.querySelector('span') ? e.querySelector('span').innerHTML : e.innerHTML);
            
            console.log(`Input: ${inputText} \nResult: ${translatedText}`);

            this.previousText = textToTranslate;
            this.previousTranslation = translatedText;

            // await this.closeBrowser()
            //     .then(() => "Browser closed");

            return translatedText;
        } catch (ex) {
            console.error(ex);
            return;
        }
    }
}

module.exports = translator;