const fs = require('fs');
const captureURL = require('./libs/crawler').captureURL;
const outputFolder = require('./config').outputFolder;

const testCase = [
  {
    name: 'Test when URL is empty',
    url: 'wrong url',
    tableNumber: 0
  },
  {
    name: 'Test with example URL',
    url: 'https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression',
    tableNumber: 3
  },
  {
    name: 'Test with correct url',
    url: 'https://en.wikipedia.org/wiki/Men%27s_high_jump_world_record_progression',
    tableNumber: 4
  },
  {
    name: 'Test happy case with create chart action',
    url: 'https://en.wikipedia.org/wiki/World_population',
    tableNumber: 33
  },
  {
    name: 'Test with the column of table isnt numeric completely and not create chart',
    url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population',
    tableNumber: 2
  }
]

const checking = (testCase, test) => {
  fs.readdir(outputFolder, (err, files) => {
    if (err) throw err;
    if (files.length != testCase.tableNumber) {
      console.log(`-${testCase.name}: Fail! The total table does not match, ${files.length} compare to ${testCase.tableNumber}`);
    } else {
      console.log(`-${testCase.name}: Passed`);
    }
    test.next();
  });
}

function* eventsOfCaptureURL() {
  for (let i = 0; i < testCase.length; i++) {
    yield captureURL(testCase[i].url, test);
    yield checking(testCase[i], test);
  }
  
  yield endOfCaptureURL();
}

const endOfCaptureURL = () => {
  console.log('Test complete!');
  process.exit();
}

//main process
let test = eventsOfCaptureURL();

test.next();