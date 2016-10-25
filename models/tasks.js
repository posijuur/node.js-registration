var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit : 10,
	host     	: 'localhost',
	database	: 'todo', 
	user     	: 'root',
	password : 'mysql'
});

var Sync = require('sync');

var Tasks = {
	list: function(callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			connection.query('SELECT * FROM tasks', callback);
			connection.release();
		});
	},

	add: function(task, callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			connection.query('INSERT INTO tasks SET ?', {task: task}, function(err, result) {
				if (err) {
					connection.release();
					throw err;
				}
				connection.release();
			});
		});
	},
	
	change: function(id, text) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			connection.query('UPDATE tasks SET ? WHERE ?', [{task: text} , {id: id}], function (err, result) {
				console.log(result);
				if (err) {
					connection.release();
					throw err;
				}
				connection.release();
			});
		});
		
	},

	// complete: function(id, callback) {
	// 	// TODO
	// },

	delete: function(id) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			connection.query('DELETE FROM tasks WHERE ?', {id: id}, function(err, result) {
				// console.log(result);
				if (err) {
					connection.release();
					throw err;
				}
				connection.release();
			});
		});
	}
};

var registrate = {
	searchUser: function (username, callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log("searchUserx1");
				connection.release();
				throw err;
			}
			console.log('connection.username:'+ username);
			// console.log();
			connection.query("SELECT login FROM users WHERE ?", {login: username}, callback);
			connection.release();
		});
	},
	searchUserPassword: function (password, callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log("searchUserPassword");
				connection.release();
				throw err;
			}
			console.log('connection.username:'+ password);
			// console.log();
			connection.query("SELECT password FROM users WHERE ?", {password: password}, callback);
			connection.release();
		});
	},
	createTable: function (login) {
		console.log(login);
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log(1);
				connection.release();
				throw err;
			}
			var sql = "CREATE TABLE "+ login;
			connection.query("CREATE TABLE " + login + "(id int(11) NOT NULL PRIMARY KEY auto_increment, task tinytext NOT NULL)", 
				function(err, result) {
				if (err) {
					console.log(2);
					connection.release();
					throw err;
				}
				console.log(result);
				console.log("CREATE TABLE ");
				connection.release();
			});
		});
	},
	addUserInfo: function(login, password, callback) {
		console.log("login, password"+ login, password);
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			connection.query("INSERT INTO users (login, password) VALUES (?, ?)", [login, password], function(err, result) {
				if (err) {
					connection.release();
					throw err;
				}
				console.log('123321'+result);
				connection.release();
			});
		});
	},
	listDateUser: function(table, callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			console.log('SELECT * FROM '+table);
			connection.query('SELECT * FROM '+table, callback);
			connection.release();
		});
	},
	addTask: function(task,table, callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			var str = "INSERT INTO "+table+ " SET ?";
			console.log(str);
			connection.query(str, {task: task}, function(err, result) {
				if (err) {
					connection.release();
					throw err;
				}
				connection.release();
			});
		});
	},
	
	changeTask: function(id, text, table) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			var str = "UPDATE " +table+ " SET ? WHERE ?";
			console.log("UPDATE " +table+ " SET ? WHERE ?");
			connection.query(str, [{task: text} , {id: id}], function (err, result) {
				console.log(result);
				if (err) {
					connection.release();
					throw err;
				}
				connection.release();
			});
		});
		
	},
deleteTask: function(id, table) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			var str = "DELETE FROM " +table+ " WHERE ?";
			console.log("DELETE FROM " +table+ " WHERE ?");
			connection.query(str, {id: id}, function(err, result) {
				if (err) {
					connection.release();
					throw err;
				}
				connection.release();
			});
		});
	}
}

module.exports = Tasks;
module.exports = registrate;

// (

// 				'id' int(11) NOT NOT auto_increment,
// 				'task' tinytext utf8_general_ci NOT NOT

// 				)