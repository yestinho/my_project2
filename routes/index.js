var express = require('express')
var app = express()

app.get('/', function(req, res) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
	// render to views/index.ejs template file
	res.render('index', {title: 'Application2',name: '',
	course: '',
	email: '',data1: rows
})			
	
})
})
})
app.delete('/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('index')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				req.getConnection(function(error, conn) {
					conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
				// render to views/index.ejs template file
				res.render('index', {title: ' Application2',name: '',
				course: '',
				email: '',data1: rows
			})			
				
			})
			})
			}
		})
	})
})



/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;
