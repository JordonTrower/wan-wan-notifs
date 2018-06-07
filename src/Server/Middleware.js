export default {
	wanAuthed(req, res, next) {
		if (req.user) {
			next();
		} else {
			res.status(401).send(`${process.env.API_HOME}login`);
		}
	},

	wanCheckUser(req, res, next) {
		if (req.user === Number(req.params.userId)) {
			next();
		} else {
			res.status(401).send(`${process.env.CLIENT_HOME}${req.user}`)
		}
	}
}