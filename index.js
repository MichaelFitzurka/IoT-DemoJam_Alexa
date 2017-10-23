/*jslint node: true */

(function () {
    'use strict';

    var Alexa = require('alexa-sdk'),
        APP_ID = "amzn1.ask.skill.***Your-ID-Here***",
        SKILL_NAME = "IoT DemoJam :: Alexa Skill",
        ARE_WE_READY_MESSAGE = "<prosody rate=\"x-slow\">As</prosody> ready as we will <say-as interpret-as=\"interjection\">ever</say-as> be. <break time=\"2s\"/> <say-as interpret-as=\"interjection\">just kidding</say-as>. Demo is all set. <say-as interpret-as=\"interjection\">good luck</say-as>. <amazon:effect name=\"whispered\">You're gonna need it</amazon:effect>.",
        FLIGHT_CHECK_MESSAGE = "<prosody rate=\"x-slow\">Well?</prosody> <prosody rate=\"slow\">The</prosody> <prosody rate=\"x-slow\">drone</prosody> <prosody rate=\"50%\">is</prosody> <break time=\"0.2s\"/> <emphasis level=\"strong\">operational</emphasis>, <break time=\"0.2s\"/> <prosody rate=\"x-slow\">but</prosody> <break time=\"0.5s\"/> <say-as interpret-as=\"interjection\">oh boy</say-as> <break time=\"0.5s\"/> your Fitbit tells me that your heart rate has increased <emphasis level=\"moderate\">dramatically</emphasis>. Are you <emphasis level=\"strong\"><prosody rate=\"50%\">sure</prosody></emphasis> you're okay to fly?",
        DEMO_STATUS_MESSAGE = "I think the demo is going <emphasis level=\"strong\">really</emphasis> well. The audience <prosody rate=\"66%\">seems</prosody> to be enjoying it.",
        STATUS_REPORT_MESSAGE = "Status Report.  The datacenter is running {0} pod{1}.  The gateway is running {2} container{3}.  {4} sensor{5} active.  You have {6} human task{7} to complete.  {8}.  The maximum sensor temperature was {9} degree{10} Celcius.  Drone was deployed.  DemoJam was conquered.  And there was much rejoicing. <amazon:effect name=\"whispered\"><say-as interpret-as=\"interjection\">yay</say-as></amazon:effect>",
        NOT_WHAT_I_MEANT_MESSAGE = "<say-as interpret-as=\"interjection\">cheer up</say-as> <break time=\"1s\" /> Fine. <break time=\"0.5s\" /> " + STATUS_REPORT_MESSAGE,
        SOUND_CHECK_MESSAGE = "Testing, testing.  Check one, check one.  Sibilance, sibilance.",
        HELP_MESSAGE = "You are on your own.",
        HELP_REPROMPT = "What can I help you with?",
        STOP_MESSAGE = "Goodbye!",
        datacenterPodCount = 4,
        gatewayContainerCount = 2,
        sensorCount = 3,
        taskCount = 0,
        maxTemp = 32,
        status,
        alexa,
        handlers;

    String.prototype.format = function () {
        var a = this,
            k;
        for (k in arguments) {
            a = a.replace("{" + k + "}", arguments[k]);
        }
        return a;
    };

    function formatStatusReport(message) {
        return message.format(
            datacenterPodCount,
            ((datacenterPodCount === 1) ? "" : "s"),
            gatewayContainerCount,
            ((gatewayContainerCount === 1) ? "" : "s"),
            sensorCount,
            ((sensorCount === 1) ? " is" : "s are"),
            taskCount,
            ((taskCount === 1) ? "" : "s"),
            ((taskCount === 0)
                ? "<say-as interpret-as=\"interjection\">way to go</say-as>"
                : "<say-as interpret-as=\"interjection\">le sigh</say-as>"),
            maxTemp,
            ((maxTemp === 1) ? "" : "s")
        );
    }

    exports.handler = function (event, context) {
        if (event.Records && event.Records[0].Sns) {
            status = JSON.parse(event.Records[0].Sns.Message);
            datacenterPodCount = status.datacenterPodCount;
            gatewayContainerCount = status.gatewayContainerCount;
            sensorCount = status.sensorCount;
            taskCount = status.taskCount;
            maxTemp = status.maxTemp;
        } else {
            alexa = Alexa.handler(event, context);
            alexa.APP_ID = APP_ID;
            alexa.registerHandlers(handlers);
            alexa.execute();
        }
    };

    handlers = {
        'LaunchRequest': function () {
            this.emit('AreWeReadyIntent');
        },
        'AreWeReadyIntent': function () {
            this.emit(':tell', ARE_WE_READY_MESSAGE);
        },
        'FlightCheckIntent': function () {
            this.emit(':tell', FLIGHT_CHECK_MESSAGE);
        },
        'DemoStatusIntent': function () {
            this.emit(':tell', DEMO_STATUS_MESSAGE);
        },
        'NotWhatIMeantIntent': function () {
            this.emit(':tell', formatStatusReport(NOT_WHAT_I_MEANT_MESSAGE));
        },
        'SoundCheckIntent': function () {
            this.emit(':tell', SOUND_CHECK_MESSAGE);
        },
        'StatusReportIntent': function () {
            this.emit(':tell', formatStatusReport(STATUS_REPORT_MESSAGE));
        },
        'AMAZON.HelpIntent': function () {
            var speechOutput = HELP_MESSAGE,
                reprompt = HELP_REPROMPT;
            this.emit(':ask', speechOutput, reprompt);
        },
        'AMAZON.CancelIntent': function () {
            this.emit(':tell', STOP_MESSAGE);
        },
        'AMAZON.StopIntent': function () {
            this.emit(':tell', STOP_MESSAGE);
        }
    };

}());

