var express = require('express')
var app = express()

app.get('/', function(req, res, next){	
	// render to views/user/add.ejs
	// render to views/index.ejs template file
	res.render('user/add', {name: '',
	course: '',
	email: ''
})			
	
})
// ADD NEW USER POST ACTION
app.post('/', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('course', 'course is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()
    if(errors){var error_msg = ''
	errors.forEach(function(error) {
		error_msg += error.msg + '<br>'
	})				
	req.flash('error', error_msg)		
	
	/**
	 * Using req.body.name 
	 * because req.param('name') is deprecated
	 */ 

	

	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
	res.render('index', {
	name: req.body.name,
	course: req.body.course,
	email: req.body.email,data1: rows
			})	
		})
	})	
	
}

    else if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			course: req.sanitize('course').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO users SET ?', user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('index', {
					name: user.name,
						course: user.course,
						email: user.email
				})			



					

				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					req.getConnection(function(error, conn) {
						conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
					// render to views/index.ejs template file
					res.render('index', {name: '',
					course: '',
					email: '',data1: rows
				})			
					
				})
				})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 

		


		res.render('index', {title: 'My Node.js Application1',
		name: req.body.name,
		course: req.body.course,
		email: req.body.email,data1: rows
				})			
    }
})
module.exports = app