export default {
	wanAuthed(req, res, next) {

		if (req.user) {
			next();
		} else {
			res.status(401).send(`${process.env.REACT_APP_API_HOME}login`);
		}
	},

	wanCheckUser(req, res, next) {
		console.log(req.session)
		console.log(req.params);
		if (req.user.userId === Number(req.params.userId)) {
			next();
		} else if (req.params.userId === 'not-logged') {
			res.status(401).send(`${process.env.REACT_APP_API_HOME}login`);
		} else {
			res.status(401).send(`${process.env.CLIENT_HOME}`)
		}
	}
}