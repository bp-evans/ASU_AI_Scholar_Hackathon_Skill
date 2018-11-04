/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('3EVHYE-KYTHGWP5R5');
const fs = require('fs');

//----------Custom Intent Handlers-----------//

// Custom campus easter egg game intent 
const MysteryGameHanlder = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'MysteryGameIntent';
  },
  handle(handlerInput) {
    let slot = handlerInput.requestEnvelope.request.intent.slots.code.value;
    let speechText;
    if (slot === "bear") {
      speechText = "Correct, please write down 1 1 2 4 and turn it in for your prize!";
    } else {
      speechText = "Please speak the special code";
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
}

//Canvas API simulation for general classProgress.json file
const CanvasProgressHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'CanvasProgressIntent'
  },
  handle(handlerInput) {
    let jsonData = require('./classProgress.json');
    speechText = "You are required to complete " + jsonData.requirementcount + " modules, and so far you have finished " + jsonData.completedcount + " modules.";
    speechText += " Your next due assignment is: " + jsonData.nextrequirement + " and must be completed by " + jsonData.completed;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
}

//Canvas API scheduling/google sheets demo
const CanvasDateHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'CanvasDateIntent'
  },
  handle(handlerInput) {
    let speechText;
    let slot = handlerInput.requestEnvelope.request.intent.slots.item.value;
    let file = "./"+slot+".json";
    let jsonData = require(file);
    if (file === "./Chinese.json") {
      speechText = "In Chinese you have 3 projects, the dates are: " + jsonData.pdates+".";
      speechText += " You also have 2 oral tests, thedates are: " + jsonData.odates + ". as well as two written tests, the dates are: " + jsonData.wdates+".";
      speechText += " Finally, you have a quiz once a week, the next one is on " + jsonData.qdates;
    } else if (file === "./math.json") {
      speechText = "In Math you have 2 major tests, the dates are: "+jsonData.testdates+"."
      speechText += " You also have a webwork due every two weeks, the next one is due: " + jsonData.webworkdates;
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
}



//Canvas API simulation for general term.json file
const CanvasTermHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'CanvasTermIntent'
  },
  handle(handlerInput) {
    let jsonData = require('./term.json');
    let speechText;
    speechText = "The current term is the " + jsonData.name + ". The start date of this is " + jsonData.startat + ". And this term ends on " + jsonData.end;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
}

//Canvas API simulation for general class .json file
const CanvasHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'CanvasClassIntent'
  },
  handle(handlerInput) {
    let slot = handlerInput.requestEnvelope.request.intent.slots.item.value;
    let speechText;
    let file = "./"+slot+".json";
    let jsonData = require(file);
    console.log(jsonData);
    speechText = "So far in your class" + jsonData.siscourseid + " you have an " + jsonData.grade + ". At the moment you are " + jsonData.courseprogress + " of the way through the course.";
    speechText += " Your course has " + jsonData.totalstudents + " students, and its description is: " + jsonData.description;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
}

//text file setting
const TextFileHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'TextFileIntent'
  },
  handle(handlerInput) {
    let speechText;
    let slot = handlerInput.requestEnvelope.request.intent.slots.file.value;
    let file = slot + ".txt"
    var text = fs.readFileSync(file).toString('utf-8');
    speechText = text;

    speechText.replace('undefined','');

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
}

//Wolfram alpha calculator
const WolframHandler = {
  canHandle(handlerInput) {
    console.log(handlerInput.requestEnvelope);
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'WolframIntent';
  },
  async handle(handlerInput) {
    let slot = handlerInput.requestEnvelope.request.intent.slots.q.value;
    let speechText;
    let ans;
    let res = await waApi.getShort(slot).then(function(result) {
      ans = result;

      return ans;
    },console.error);

    let sp = res;

    sp.replace("/", "divided by");
    sp.replace("-", "minus");
    sp.replace("+", "plus");

    if (ans === null || ans === undefined) {
      speechText = "Sorry, I didn't find anything";
    } else {
      speechText = "Here is what I found: " + sp;
    }
    

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();

  }
}

// Custom help/options intent for the skill
const HelpEducateHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelpEducateIntent';
  },
  handle(handlerInput) {
    let speechText;
    speechText = "You can say read and then a file name to read notes to you. Say calculate and then a math question to use the wolfram alpha calculator.";
    speechText += " You can also ask things like how are things going in my math class, what academic term am i in, or how far am i through my class";
    speechText += " Also, there is a way to get some cool ASU stuff, if you know what to look for";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//-----------Below is Preset Intents----------//

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the on the spot app, i am your personal academic assistant. You can say help to learn more.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    TextFileHandler,
    HelpEducateHandler,
    CanvasTermHandler,
    CanvasDateHandler,
    CanvasProgressHandler,
    MysteryGameHanlder,
    WolframHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CanvasHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
