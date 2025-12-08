const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mysql = require('mysql2/promise')
const cors = require('cors');


let conn = null

const initMySQL = async () => {
	conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pc_part_picker',
	port: '3306'
  })
}

app.use(cors());
app.get('/cpu', async (req, res) => {
    const results =  await conn.query('SELECT * FROM cpu')
    res.json(results[0])
})

app.get('/mainboard', async (req, res) => {
    const results =  await conn.query('SELECT * FROM mainboard')
    res.json(results[0])
})

app.use(bodyparser.json());

//start server
const port = 8000;
app.listen(port, async () => {
	console.log('http server run at : ' +  port);
	await initMySQL();
});

// POST create new user
// app.post('/users', async (req, res) => {
// 	try {
// 		let user = req.body;
// 		const results = await conn.query('INSERT INTO users SET ?', user);
// 		console.log('result : ', results);

// 		res.json({
// 		message: 'insert ok',
// 		data: results[0]
// 		});
// 	}catch (error) {
// 		console.error('error message : ', error.message)
// 		res.status(500).json({
// 			message: 'somthing wrong',
// 		})
// 	}
// })

// GET user by id
// app.get('/users/:id', async (req, res) => {
// 	try {
// 		let id = req.params.id;
// 		const results =  await conn.query('SELECT * FROM users WHERE user_id = ?', id);

// 		if (results[0].length == 0) {
// 			throw { statusCode: 404, message: 'หาไม่เจอ T T'}
// 		}

// 		res.json(results[0][0]);
// 	} catch (error) {
// 		console.error('error message : ', error.message)
// 		let statusCode = error.statusCode || 500
// 		res.status(statusCode).json({
// 			message: 'somthing wrong',
// 			errorMessage: error.message
// 		})
// 	}
// });

// PUT update user
// app.put('/users/:id', async (req, res) => {
// 	let id = req.params.id;
// 	let updateUser = req.body;

// 	try {
// 		const results = await conn.query('UPDATE users SET ? WHERE user_id = ?', [updateUser, id]);
// 		console.log('result : ', results);
// 		res.json({
// 		message: 'update ok',
// 		data: results[0]
// 		});
// 	}catch (error) {
// 		console.error('error message : ', error.message)
// 		res.status(500).json({
// 			message: 'somthing wrong',
// 		})
// 	}
// })

// DELETE user
// app.delete('/users/:id', async (req, res) => {
// 	let id = req.params.id;
// 	try {
// 		const results = await conn.query('DELETE FROM users WHERE user_id = ?', id);
// 		console.log('result : ', results);
// 		res.json({
// 		message: 'delete ok',
// 		data: results[0]
// 		});
// 	}catch (error) {
// 		console.error('error message : ', error.message)
// 		res.status(500).json({
// 			message: 'somthing wrong',
// 		})
// 	}
// })
