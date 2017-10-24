# IoT-DemoJam_Alexa
Internet of Things DemoJam :: Alexa

---
## How to deploy
### First you will need an AWS account.
If you do not already have an Amazon AWS account, you can create a free account at https://aws.amazon.com/.

You will need to enter credit card information when signing up, but just select the free Basic plan when asked. You will also need to verify your phone number through an automated call.

After you’ve signed up, you can verify you’re on the free plan by going to [this page](https://console.aws.amazon.com/support/plans/home?region=us-east-1#/) and checking that it says “Current support plan: Basic” at the top.

You will also want to ensure that your account is using the appropriate/closest server location i.e. "US East (N. Virginia)" in the upper right corner of the page.

### Next you will need to create an AWS:Compute:Lambda Service.
1) Go to: https://aws.amazon.com/ and sign-in to your account.
2) Select the "Lambda" service.
3) Press the "Create function" button.
4) On the next page, select the "alexa-skill-kit-sdk-factskill" blueprint.  This will load the "alexa-sdk" by default.
5) Fill out the "Basic Information":
   > Name: IoT-DemoJam_Alexa-Lambda  
   > Role: Select "Create a custom role"
6) On the new page that comes up, leave the values as-is and press the "Allow" button.
7) Back on the create function page, press the "Create function" button.
8) Take note of the ARN value at the top of the screen for later.
   > i.e. "arn:aws:lambda:us-east-1:**...**:function:IoT-DemoJam_Alexa-Lambda"
9) Replace the code on screen in the "index.js" entry with the [code](https://github.com/MichaelFitzurka/IoT-DemoJam_Alexa/blob/master/index.js) from the project.
   > NOTE: The correct APP_ID has not been generated yet, so leave the value as-is for now, and we can fix it later.
10) In the "Basic settings" area, give it a description.
    > i.e. "IoT DemoJam :: Alexa Lambda"
11) Press the "Save and test" button.
12) Fill out the "Configure test event":
    > Leave "Create new test event" selected.  
    > Leave the "Event template" as "Hello World".  
    > Enter the "Event name" as "IoTDemoJamAlexaLambdaTest"  
    > Enter the JSON as:
    ```json
    {
      "locale": "en-US"
    }
    ```
13) Press the "Create" button.
14) Press the "Test" button.
15) You will actually get a failed execution result; check that it is failing for the "right" reason.  
The Details error message should say "Process exited before completing request"  
The Log output should say "Cannot read property 'locale' of undefined"
> NOTE: I'm not sure why this error occurs on test, even after googling it, but rest assured the lambda will work with this error.
16) Now, select the "Triggers" tab, and press the "+ Add trigger" button.
17) Click in the empty box, and select the "Alexa Skills Kit" option, and press the "Submit" button.

### Now we can create the Alexa Skill.
1) Head over to: https://developer.amazon.com and create a free Amazon Developers account, if you do not have one already.  
   You can select "No" for both options on the “Payments” screen.
2) Select the Alexa tab, and then Press "Get Started >" under "Alexa Skills Kit".
3) Press the "Add a New Skill" button.
4) Fill out the "Skill Information" page:
   > Skill Type: "Custom Interaction Model"  
   > Language: "English (U.S.)"  
   > Name: "IoT DemoJam :: Alexa Skill"  
   > Invocation Name: "the gateway"  
   So when talking to Alexa, we will invoke the skill by saying *"Alexa, ask **the gateway** for a status report."*
5) Press the "Save" button, you will stay on the same "Skill Information" page, but take note of your generated "Application Id".  
   > i.e. "amzn1.ask.skill.**...**".  
   This is the APP_ID needed for the Lambda code.
6) Press the "Next" button.
7) For the "Interaction Model", press the "Launch Skill Builder" button.
8) Select the "</> Code Editor" menu on the left and simply drag and drop the [IntentSchema.json](https://github.com/MichaelFitzurka/IoT-DemoJam_Alexa/blob/master/IntentSchema.json) file into the "Drag and drop your .json file" area.
9) Press the "Apply Changes" button, then the "Save Model" menu item, followed by the "Build Model" menu item and wait it out.
10) After receiving the successful build message, press the "Configuration" menu item.
11) On the "Configuration" page:
    > Select the "Service Endpoint Type" of "AWS Lambda ARN (Amazon Resource Name)"  
    > Enter the "Default" value as the ARN from Step 8 when creating your Lambda:  
    > i.e. "arn:aws:lambda:us-east-1:**...**:function:IoT-DemoJam_Alexa-Lambda"
12) Press the "Save" button", and you should get a "Successfully updated the publishing information." message.

You can leave the skill in the testing phase, since you don't need your skill to be publicly available in order to use it in your demo.

### Next we create an AWS:Messaging:SNS for pushing live data to Alexa
See: http://docs.aws.amazon.com/sns/latest/dg/sns-lambda.html and https://aws.amazon.com/blogs/mobile/invoking-aws-lambda-functions-via-amazon-sns/ for more information.
1) Go back to: https://aws.amazon.com/ and sign-in to your account if you left it.
2) Select the "Simple Notification Service".
3) When the page comes up, press the "Get started" button.
4) First select the "Create topic" action.
5) Fill out the "Create new topic" form:
   > Topic name: "iotdj-alexa-sns"  
   > Display name: "IoTDJ-ASNS"
6) Press the "Create topic" button.
7) On the "Topic details" page, press the "Create subscription" button.
8) Fill out the "Create subscription" form:
   > Topic ARN: should already be filled out with the SNS ARN  
   > Protocol: "AWS Lambda"  
   > Endpoint: Click the drop down and you should see your ARN for the Alexa-Lambda, select it.  
   > Version or alias: "default".
9) Press the "Create subscription" button, and we're done.

### Now we can go back and update the Lambda
1) Go back to: https://aws.amazon.com/ and sign-in to your account if you left it.
2) Select the "Lambda" service, and then select the lambda function we created.
3) Update line 7 of the **index.js** file with the application id from the Alexa Skill, Step 11 above.
4) Press the "Save" button.

## Notes
You do not actual need an Alexa device to use your skill.  You can use https://echosim.io/ on any web browser, log in with your account and test away.  For the demo I used the free "Reverb" app on my iPhone.
