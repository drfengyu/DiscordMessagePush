module.exports = async (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { challenge } = JSON.parse(body);
    res.status(200).send(challenge);
  });
};
