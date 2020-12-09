<?php
logger("------START------");
 //Token of app
 $row = "5d5b3ac477d0cfd879232a6e24eeb9ed";
 logger("row: $row");
$challenge = $_REQUEST['hub_challenge'];
  $verify_token = $_REQUEST['hub_verify_token'];
  if ($verify_token === $row) {
  echo $challenge;
  logger("challenge: $challenge");
  }
 
 $input = json_decode(file_get_contents('php://input'), true);
//Receive user
$sender = $input['entry'][0]['messaging'][0]['sender']['id'];
logger("sender: $sender");
 //User's message
 $message = $input['entry'][0]['messaging'][0]['message']['text'];
 logger("message: $message");
//Where the bot will send message
 $url = 'https://graph.facebook.com/v2.6/me/messages?access_token='.$row;
 $ch = curl_init($url);
 logger("ch: $ch");
//Answer to the message adds 1
if($message)
{
 $jsonData = '{
    "recipient":{
        "id":"'.$sender.'"
      }, 
    "message":{
        "text":"'.$message. ' 1' .'"
      }
 }';
};
 $json_enc = $jsonData;
 logger("json_enc: $json_enc");
 curl_setopt($ch, CURLOPT_POST, 1);
 curl_setopt($ch, CURLOPT_POSTFIELDS, $json_enc);
 curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));  
 if(!empty($input['entry'][0]['messaging'][0]['message'])){
    $result = curl_exec($ch);
	logger("result: $result");
	logger("------END------");
 }
 
 
 //日志记录
function logger($log_content)
{
    $max_size = 100000;
    $log_filename = "bot.txt";
    if(file_exists($log_filename) and (abs(filesize($log_filename)) > $max_size)){unlink($log_filename);}
    file_put_contents($log_filename, date('H:i:s')." ".$log_content."\r\n", FILE_APPEND);
}
 
?>