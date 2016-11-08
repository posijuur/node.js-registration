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
				connection.release();
				throw err;
			}
			connection.query("SELECT login FROM users WHERE ?", {login: username}, callback);
			connection.release();
		});
	},
	searchUserPassword: function (password, callback) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			connection.query("SELECT password FROM users WHERE ?", {password: password}, callback);
			connection.release();
		});
	},
	createTable: function (login) {
		pool.getConnection(function(err, connection) {
			if (err) {
				connection.release();
				throw err;
			}
			var sql = "CREATE TABLE "+ login;
			connection.query("CREATE TABLE " + login + "(id int(11) NOT NULL PRIMARY KEY auto_increment, task tinytext NOT NULL)", 
				function(err, result) {
				if (err) {
					connection.release();
					throw err;
				}
				connection.release();
			});
		});
	},
	addUserInfo: function(login, password, callback) {
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
			connection.query(str, [{task: text} , {id: id}], function (err, result) {
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
