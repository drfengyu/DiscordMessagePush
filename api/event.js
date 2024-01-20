module.exports = async (req, res) => {
    const { method, headers, url } = req;
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // 获取 POST 请求中的 JSON 数据
        let parsedBody = JSON.parse(body);
        // 检查是否存在 challenge 属性
        if (parsedBody.hasOwnProperty('challenge')) {
            let { challenge } = parsedBody;
            // 返回同样的 challenge
            res.status(200).send(challenge);
        } else {
            // 没有找到 challenge 属性
            res.status(400).send('No challenge specified in request.');
        }
    });
};
