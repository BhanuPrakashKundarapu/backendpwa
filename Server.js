const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcj = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./Models/UserDetails");
const Passport = require("./middleware/Passport");
mongoose
	.connect("mongodb://127.0.0.1:27017/Enormous")
	.then(() => {
		console.log("database is connected Successfully");
	})
	.catch((err) => {
		console.log(err);
	});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
	res.send("hello world");
});
app.post("/signup", async (req, res) => {
	try {
        console.log(req.body)
        var { name, email, password } = req.body;
        email=email?.toLowerCase();
		console.log(name, email, password);
		const userFind = await UserModel.findOne({ email: email });
		if (userFind) {
			return res.json({ status: 400, message: "user already exists" });
		}
		const createCopy = new UserModel({
			name: name,
			email: email,
			password: bcj.hashSync(password, 10),
		});

		const taskDone = await createCopy.save();
		if (taskDone) {
			return res.json({ status: 200, message: "registered successfully" });
		} else {
			return res.json({ status: 400, message: "Something went wrong" });
		}
	} catch (err) {
		return res.json({ status: 500, message: err });
	}
});

app.post("/signin", async (req, res) => {
	try {
        console.log(req.body)
		var { email, password } = req.body;
        console.log(email,password)
        // n.toLowerCase()
        email=email?.toLowerCase()
		const userFind = await UserModel.findOne({ email: email });
        console.log(userFind)
		if (!userFind) {
			return res.json({
				status: 401,
				message: "no user found with this email",
			});
		}
		const checkpass = bcj.compareSync(password, userFind.password);
        console.log(checkpass)
		if (!checkpass) {
			return res.json({ status: 401, message: "password is incorrect" });
		}
		const payload = {
			user: {
				id: userFind._id,
			},
		};
		jwt.sign(payload, "UDWBhKJE", { expiresIn: "1h" }, (err, token) => {
			if (err) {
				return res.json({ status: 400, message: err });
			}
			return res.json({
				status: 200,
				message: "login successfully",
				token: token,
			});
		});
	} catch (error) {
		console.log(error);
		return res.json({ status: 500, message: error });
	}
});

app.get("/profile", Passport, async (req, res) => {
	const id = req.user.id;
	try {
		const userFind = await UserModel.findById(id);
		if (!userFind) {
			return res.json({ status: 404, message: "user not found" });
		}
		return res.json({ status: 200, message: "profile found", user: userFind });
	} catch (error) {
		return res.json({ status: 500, message: error });
	}
});

app.listen(9090, () => {
	console.log("server is running on port 3000");
});
