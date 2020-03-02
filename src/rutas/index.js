const { Router } = require('express');
const router = Router();
const User = require('../modulos/users');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send('hello')
});

router.post('/signup', async (req, res) => {
    const { firstName, lastName, userName, age, height, weight, geb, email, password } = req.body;
    const newUser = new User({firstName, lastName, userName, email, password, age, height, weight, geb});
    await newUser.save();
		const token = await jwt.sign({_id: newUser._id}, 'secretkey');
    res.status(200).json({token});
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});
    if (!user) return res.status(401).send('The email doesnt exists');
    if (user.password !== password) return res.status(401).send('Wrong Password');

		const token = jwt.sign({_id: user._id}, 'secretkey');

    return res.status(200).json({token});
});

router.get('/data/:id', verifyToken, async (req, res) => {
    const user = await User.findOne({email: req.params.id});
    const senduser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      age: user.age,
      height: user.height,
      weight: user.weight,
      geb: user.geb
    }
    res.json(senduser);
});

router.put('/dataupdate/:id',  verifyToken, async (req, res) => {
  const { age, height, weight, geb } = req.body;
  console.log(req.body);
  console.log(req.params.id);
  await User.findByIdAndUpdate(req.params.id, {age, height, weight, geb});
  res.json({status: 'Update succesfull'});
});


async function verifyToken(req, res, next) {
	try {
		if (!req.headers.authorization) {
			return res.status(401).send('Unauhtorized Request');
		}
		let token = req.headers.authorization.split(' ')[1];
		if (token === 'null') {
			return res.status(401).send('Unauhtorized Request');
		}

		const payload = await jwt.verify(token, 'secretkey');
		if (!payload) {
			return res.status(401).send('Unauhtorized Request');
		}
		req.userId = payload._id;
		next();
	} catch(e) {
		//console.log(e)
		return res.status(401).send('Unauhtorized Request');
	}
}

module.exports = router;
