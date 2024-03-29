const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const https=require('https');
var webhookId = process.env.WEBHOOK_ID;
// 给飞书群发送消息
function sendWelcome(id = webhookId, content) {
    var options = {
        hostname: 'open.feishu.cn',
        port: 443,
        path: `/open-apis/bot/v2/hook/${id}`,
        method: 'POST',
        headers: {
              'Content-Type': 'application/json'
           }
      };
      var req = https.request(options, (res) => {      
        res.on('data', (d) => {
          process.stdout.write(d);
        });
      });
      req.on('error', (e) => {
        console.error(e);
      });
      req.write(content);
      req.end();
}
app.use(bodyParser.json());
app.post('/api/event', (req, res) => {
// if (req.body.hasOwnProperty('challenge')) {
 // res.status(200).send({ challenge: req.body.challenge });
 //} else {
//  res.status(400).send('No challenge found in request');
//}
  console.log(req);
  const eventType = req.body.header.event_type;
  console.log(eventType);
  let message = '';
  switch (eventType) {
    case 'im.chat.member.bot.added_v1':
      // 生成机器人被添加到群聊的通知
      message = `机器人被添加到一个群聊中。`;
      break;
    case 'im.chat.member.user.added_v1':
      // 生成用户被添加到群聊的通知
      message = `${req.body.user.name} 被添加到一个群聊中。`;
      sendWelcome("[派对]热烈欢迎新朋友加入我们的大家庭！期待在这里你能获得你所需的帮助，同时也能向大家学习、分享你的知识和经验。在这个群里，每个人都是贡献者也是学习者。再次欢迎你的加入，希望我们能共同进步，一起成长！");
      break;
    case 'im.message.message_read_v1':
      // 生成消息已读的通知
      message = `${req.body.user.name} 已读一条消息。`;
      break;
    case 'im.message.receive_v1':
      // 生成接收到新的群聊消息的通知
      console.log(req.body.event.message.content);
      message = `收到一条新的群聊消息:${req.body.event.message.content}`;
      break;
    default:
      console.log(`收到未支持的事件类型：${eventType}`);
      return res.status(200).send('OK');
  }
  console.log(message);
  // 在Discord中发布通知
 const sendmessage=async()=>{
  await axios.post(process.env.DISCORD_WEBHOOK_URL,{"content":message},{timeout:5000})
    .then(function (response) {
    // Handle success
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);
}).catch(err => console.error(err));
  return res.status(200).send('OK');
};
 sendmessage();
});
         
      
module.exports = app;
