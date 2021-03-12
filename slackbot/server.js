const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')

// Closing Issue #15

//Variables
var SlackBot = require('slackbots');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// read textfile
var questionsPath = './public/questionAnswers.txt';
var fs  = require("fs");
var lines = fs.readFileSync(questionsPath).toString().split('\n');
var questionsAndAnswers = lines.map((line, index) => { 
    let [question, answer] = line.split(' : ');
    answer = index !== lines.length-1 ? answer.slice(0, answer.length-1) : answer; // trims the /r at end for text files
    return {  question, answer}});

//weather api key
var weatherApiToken = 'd0f9e62746d125c737c10f1d6d42f3ec';

// api.openweathermap.org/data/2.5/weather?q=toronto&appid=d0f9e62746d125c737c10f1d6d42f3ec
// create a bot
var bot = new SlackBot({
    token: 'xoxb-1750534237728-1790878892455-g7oTRWwzbc69MaCdaX2HwyWD',
    name: 'Question Bot'
});


//Bot responses
bot.on('message', (data) => {
    console.log(data);
    if(data.type !== 'message' || data.subtype == 'bot_message' ) {
        return;
    }
    handleMessage(data.text);
})

var channelName = 'random';

var echoMode = false;
function handleMessage(message) {
    var mSaved = message;
    message = message.toLowerCase();
    if (message.includes('/help')) {
        botResponse('Can either retrieve weather data by calling: "get weather at: <city>" or try to have a conversation with it and see if it responds');
    }
    else if (message.includes('get weather at')) {
        console.log(message);
        let skipTo = message.indexOf('get weather at') + 'get weather at'.length;
        weatherResponse(message.slice(skipTo));
    }
    else if (message.includes('toggle echo')){
        echoMode = !echoMode;
        let m = "";
        if (echoMode){ m = "Echo mode enabled.";} else {m = "Echo mode disabled.";}
        return botResponse(m);
    }   
    else {
        if(echoMode){
            return botResponse(mSaved);
        }

        let response = questionsAndAnswers.filter(questionAndAnswer => message.includes(questionAndAnswer.question.toLowerCase()));

        if (response.length > 0) {
            return botResponse(response[0].answer);
        } 
    }
}




function botResponse(response) {  
    var params = {
        icon_emoji: ':cat:'
    };
    bot.postMessageToChannel(
        channelName,
        response,
        params
    );
}

function weatherResponse(city) {  

    const params = {
        icon_emoji: ':male-technologist:'
    }
    console.log(city);

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiToken}&units=metric`)
      .then(res => {
            let data = res.data;
            console.log(data);
            let look = data.weather[0].main;
            let temperatureCelcius = data.main.temp;
            bot.postMessageToChannel(
                channelName,
                `Temperature in: ${city} is ${temperatureCelcius} Celcius, looks to be ${look}`,
                params
            );

      })
      .catch(() => {
        bot.postMessageToChannel(
            channelName,
            'weather api error, city may not exist',
            params
        );
      });
}


app.get('/api/questionsAndAnswers', (req, res) => {
    console.log(questionsAndAnswers);
  res.send(JSON.stringify({data: questionsAndAnswers}));
});


app.get('/', (req,res) => {

    let s = "<h1>Why are you looking at this on a webpage?</h1><br>"
    s+= "It's listening on port " + port
    res.send(s)

});

app.listen(port, () => console.log(`Listening on port ${port}`));
