const readline = require('readline');
const validUrl = require('valid-url');
const captureURL = require('./libs/crawler').captureURL;

const askForURL = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question(question, (answer) => {
    if (answer !== null && validUrl.isUri(answer)) url = answer;
    rl.close();
    main.next();
  });

  rl.on('close', function () {});
}

function* eventsOfCaptureURL() {
  console.log('Welcome to Capture URL Tool!');
  yield askForURL('What full URL do you want to capture? ');
  yield captureURL(url, main);
  yield endOfCaptureURL();
}

const endOfCaptureURL = () => {
  console.log('Done! check the outputs folder');
  process.exit();
}

//main process
let url = '';
let main = eventsOfCaptureURL();

main.next();