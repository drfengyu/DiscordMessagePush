const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
app.use(bodyParser.json());
app.post('/api/event', (req, res) => {
//  if (req.body.hasOwnProperty('challenge')) {
//    res.status(200).send({ challenge: req.body.challenge });
//  } else {
//    res.status(400).send('No challenge found in request');
//  }
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
      break;
    case 'im.message.message_read_v1':
      // 生成消息已读的通知
      message = `${req.body.user.name} 已读一条消息。`;
      break;
    case 'im.message.receive_v1':
      // 生成接收到新的群聊消息的通知
      console.log(req.body.event.message);
      message = `接收到新的群聊消息：${req.body.event.message.content}`;
      break;
    default:
      console.log(`收到未支持的事件类型：${eventType}`);
      return res.status(200).send('OK');
  }
  console.log(message);
  // 在Discord中发布通知
  axios.post(process.env.DISCORD_WEBHOOK_URL, {content: message})
    .then(() => console.log('Discord通知已发送！'))
    .catch(err => console.error(err));
  return res.status(200).send('OK');
});
module.exports = app;
