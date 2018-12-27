const readline = require('readline');
const translator = require('./translator');

const consoleReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Translate CLI>'
});

consoleReader.prompt();
console.log('Type getoff to exit');

const askQuestion = () => {
    consoleReader.question('Enter text to translate: ', (textToTranslate) => {
        if (textToTranslate.match(/getoff/i)) {
            getoff();
            return;
        }
        translator.translate(textToTranslate)
            .then(translatedText => console.log(translatedText))
            .then(() => askQuestion());
    });
}

const getoff = () => {
    consoleReader.question('Are you sure you want to exit? ', (answer) => {
        if (answer.match(/^y(es)?$/i)) {
            translator.closeBrowser()
                .then(() => {
                    console.log("Thanks for using me. Built with ❤️  by @ajibigad");
                    process.exit();
                })
            return;
        }
        consoleReader.resume();
        askQuestion();
    });
};

translator.bootBrowser()
    .then(()=> askQuestion());