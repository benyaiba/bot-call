/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Platform Quick Start Tutorial
 *
 * This is the completed code for the Messenger Platform quick start tutorial
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 * To run this code, you must do the following:
 *
 * 1. Deploy this code to a server running Node.js
 * 2. Run `npm install`
 * 3. Update the VERIFY_TOKEN
 * 4. Add your PAGE_ACCESS_TOKEN to your environment vars
 *
 */

'use strict';
const PAGE_ACCESS_TOKEN = 'DQVJ1cFp1WXhZAUWF1cEU4V1FzVVB4MUpBbTlGdDNmUDJIeW1kU1RGaGJsNk5nTzFQM2xfZAjhxd05ySklPQWhjblN5TFdLdXlHcV9tVkdsU29hLTFCZAXNhQjlNaEJkU0VMV2xIcFdHbXZAhMHdIaHNORlhBSTJkS2dXZAUdRdWRmLWNQY2lRU25uN1BCVUpsVGFIQnN1LUJYWl9qb2tVU05pZAThHbWRTRy1UU2ZA6bTZATcDVhbndRTWN1Nk00WC1NUUhZAVlJGN0ZA3';
const WEBHOOK_URL = "https://www.microad-tech.com/test/bot_call.php";
// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json());

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
	  
	  webhook_event.workplace_response_name = "";
	  webhook_event.workplace_response_message = "";
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        console.log('webhook_event.message: ' + webhook_event.message.text);
        
		let workplace_response = {
			"name": "22",
			"message": "223",
		}

		
       //bot call start
        let bot_call_body = {
          "name": webhook_event.message.text,
          "like": "0",
          }
        request({
            "uri": WEBHOOK_URL,
            "method": "POST",
            "json": bot_call_body
          }, (err, res, body) => {
            if (!err) {
              console.log('bot_call sent!');
              console.log('To workplace JSON: ' + JSON.stringify(bot_call_body));
              console.log('From workplace Response: ' + JSON.stringify(res));
              console.log('From workplace JSON: ' + JSON.stringify(body));

			  webhook_event.workplace_response_name = body.name;
			  webhook_event.workplace_response_message = body.message;
				
			  handleMessage(sender_psid, webhook_event); 
            } else {
              console.log('bot_call err: ' + JSON.stringify(err));
              console.error("Unable to send bot_call message:" + err);
            }
          }); 
        //bot call end
			workplace_response = {
				"name": webhook_event.workplace_response_name,
				"message": webhook_event.workplace_response_message,
				}
				console.log(webhook_event);
				console.log(workplace_response);
		
      } else if (webhook_event.postback) {
        
        handlePostback(sender_psid, webhook_event.postback);
      }
      
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "123";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function handleMessage(sender_psid, workplace_response) {
	console.log('--↓-handleMessage-↓--');
  let response;
  console.error("workplace_response message:" + workplace_response['workplace_response_message']);
  console.error("workplace_response name:" + workplace_response['workplace_response_name']);
  if (workplace_response['workplace_response_name']) {
//	  response = {
//		"text": workplace_response['workplace_response_name'],
//       }

	let array = workplace_response['workplace_response_name'].split(",");
		console.log(array);
		console.log(array.length);
		response = {
					"attachment": {
					"type": "template",
					"payload": {
					  "template_type": "generic",
					  "elements": [{
						"title": "一つを選んでください。",
						//"subtitle": "Tap a button to answer.",
						"buttons": []
					  }]
					}
				  }
				}
		let buttons = [];
		for(var i=0;i<3;i++) {
			console.log(array[i]);
			let temp = {
				"type":"postback",
				"title":array[i],
				"payload":"name"+i,
			}
			buttons.push(temp);
			response['attachment']['payload']['elements'][0]['buttons'].push(temp);
		}
		
		
		console.log("------");
		console.log(buttons);
		console.log("------");
		
		
		//response['attachment']['payload']['elements'][0]['buttons'].push(buttons);
		console.log("------");
		console.log(JSON.stringify(response));
		console.log("------");
		
	/*
	  response = {
        "text": "Pick a color:",
		"quick_replies":[
		  {
			"content_type":"text",
			"title":"Red",
			"payload":"yes"
		  },{
			"content_type":"text",
			"title":"Green",
			"payload":"no"
		  }
		]
		}
	*/
  } else if (workplace_response['workplace_response_message']){
	  response = {
      "text": workplace_response['workplace_response_message'],
    }
  }
  console.log('--↑-handleMessage-↑--');
  
  
  
  
  /*
  // Checks if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
  */
  // Send the response message
  console.log('--↓-Send the response message-↓--');
  callSendAPI(sender_psid, response);    
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;
  let name_selected  = received_postback.title;

  // Set the response based on the postback payload
  /*
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  */
  if (payload) {
    response = { "text": name_selected}
  }
  // Send the message to acknowledge the postback
  console.log('--↓-Output the user selected name-↓--');
  //callSendAPI(sender_psid, response);
  
  
  
  //bot call start
        let bot_call_body = {
          "name": name_selected,
          "like": "1",
          }
        request({
            "uri": WEBHOOK_URL,
            "method": "POST",
            "json": bot_call_body
          }, (err, res, body) => {
            if (!err) {
              console.log('bot_call sent!');
              console.log('To workplace JSON: ' + JSON.stringify(bot_call_body));
              console.log('From workplace Response: ' + JSON.stringify(res));
              console.log('From workplace JSON: ' + JSON.stringify(body));
			  
			  let response = { "text": body.message};
			  callSendAPI(sender_psid, response);
            } else {
              console.log('bot_call err: ' + JSON.stringify(err));
              console.error("Unable to send bot_call message:" + err);
            }
          }); 
        //bot call end
  
  
  
  
  
}

function callSendAPI(sender_psid, response) {
  console.log('--↓-callSendAPI-↓--');
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  
  console.log('sender_psid: ' + sender_psid);
  console.log('response: ' + JSON.stringify(response));
  
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
      console.log('res: ' + JSON.stringify(res));
      console.log('body: ' + JSON.stringify(body));
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
  console.log('--↑-callSendAPI-↑--');
}
