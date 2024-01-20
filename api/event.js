module.exports = async (req, res) => {
    const { challenge } = req.body;
    // 回复飞书发出的 challenge 值
    res.status(200).send(challenge);
};
