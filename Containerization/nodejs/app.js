const express = require('express');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');

const app = express();

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'database',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Set up Pug as the view engine
app.set('views', 'C:\\wamp64\\www\\webtechfinals');
app.set('view engine', 'pug');

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(
  session({
    secret: 'somesecretkey',
    resave: true,
    saveUninitialized: true,
  })
);

// Route for handling login form submission
app.post('/login.php', (req, res) => {
  const { email, password } = req.body;

  // Validate the submitted credentials and perform login logic
  // For simplicity, you can perform the login logic similar to what you have in your login.php file.

  // Example: Check if email and password are correct (this is a simplified example, you should use secure authentication mechanisms)
  const query = 'SELECT * FROM accounts WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (result.length === 1) {
      // Valid credentials
      const user = result[0];

      // Check the role of the user
      if (user.roles === 'admin') {
        // Set session variables
        req.session.userID = user.accountID; // Use a unique identifier for the user

        // Redirect to the admin page upon successful login
        res.redirect('/home.pug');
      } else {
        // Redirect to the login page with an error message
        res.redirect('/login.html?error=1');
      }
    } else {
      // Redirect to the login page with an error message
      res.redirect('/login.html?error=1');
    }
  });
});


// Route for creating a new account
app.post('/create-account', (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Validate the submitted data (add more validation as needed)

  // Set the default status to 'offline'
  const defaultStatus = 'offline';

  // Example: Insert a new account into the 'accounts' table with the default status
  const query = 'INSERT INTO accounts (firstName, lastName, email, password, roles, status) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [firstName, lastName, email, password, role, defaultStatus], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
    } else {
      // Send a JSON response indicating success
      return res.status(200).json({ message: 'Account created successfully' });
    }
  });
});

// Redirect root path to /admin
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Route for the home page
app.get('/home.pug', (req, res) => {
  if (req.session && req.session.userID) {
    const query = 'SELECT * FROM accounts WHERE roles != "admin"';

    connection.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        const users = result; // Array of user objects

        // Count online and offline users
        const onlineUsers = users.filter(user => user.status === 'online').length;
        const offlineUsers = users.filter(user => user.status === 'offline').length;

        res.render('home.pug', { users, onlineCount: onlineUsers, offlineCount: offlineUsers });
      }
    });
  } else {
    res.redirect('/login.html'); // Redirect to the login page if not authenticated
  }
});


// Route for the admin page
app.get('/admin.pug', (req, res) => {
  if (req.session && req.session.userID) {
    const query = 'SELECT * FROM accounts WHERE roles != "admin"';

    connection.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        const users = result; // Array of user objects
        res.render('admin.pug', { users });
      }
    });
  } else {
    res.redirect('/login.html'); // Redirect to the login page if not authenticated
  }
});


// Route for the login page
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for registration.html
app.get('/registration.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration.html'));
});

// Route for manage-accounts.html
app.get('/manage-accounts.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'manage-accounts.html'));
});

// Route for update-accounts.html
app.get('/update-accounts.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'update-accounts.html'));
});

app.get('/home.pug', (req, res) => {
  res.render('home.pug'); // Use res.render to render the Pug file
});


// Route for fetching accounts and rendering HTML
app.get('/fetch-accounts', (req, res) => {
  const query = 'SELECT * FROM accounts WHERE roles != "admin"';

  connection.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Build an HTML table with a delete button for each row
      let html = '<table border="1">';
      html += '<tr><th>Account ID</th><th>Email</th><th>Roles</th><th>Status</th><th>Action</th></tr>';

      result.forEach(row => {
        html += `<tr>`;
        html += `<td>${row.accountID}</td>`;
        html += `<td>${row.email}</td>`;
        html += `<td>${row.roles}</td>`;
        html += `<td>${row.status}</td>`; 
        html += `<td><button class="delete-button" data-account-id="${row.accountID}" data-account-email="${row.email}">Delete</button></td>`;
        html += `</tr>`;
      });

      html += '</table>';
      res.send(html);
    }
  });
});

// Route for fetching accounts and rendering HTML for update-accounts.html
app.get('/fetch-accounts-update', (req, res) => {
  const query = 'SELECT * FROM accounts WHERE roles != "admin"';

  connection.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Build an HTML table with an "Update Password" button for each row
      let html = '<table border="1">';
      html += '<tr><th>Account ID</th><th>Email</th><th>Password</th><th>Roles</th><th>Status</th><th>Action</th></tr>';

      result.forEach(row => {
        html += `<tr>`;
        html += `<td>${row.accountID}</td>`;
        html += `<td>${row.email}</td>`;
        html += `<td class="password-cell">${row.password}</td>`;
        html += `<td>${row.roles}</td>`;
        html += `<td>${row.status}</td>`;
        html += `<td><button class="update-password-button" data-account-id="${row.accountID}">Update Password</button></td>`;
        html += `</tr>`;
      });

      html += '</table>';
      res.send(html);
    }
  });
});

// Route for fetching the email of an account by ID
app.get('/fetch-email/:accountId', (req, res) => {
  const accountId = req.params.accountId;
  const query = 'SELECT email FROM accounts WHERE accountID = ?';

  connection.query(query, [accountId], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
      } else {
          const email = result.length > 0 ? result[0].email : '';
          res.send(email);
      }
  });
});

app.put('/update-password/:accountId', (req, res) => {
  const accountId = req.params.accountId;
  const newPassword = req.body.newPassword;

  const query = 'UPDATE accounts SET password = ? WHERE accountID = ?';

  connection.query(query, [newPassword, accountId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.sendStatus(200);
    }
  });
});

// Route for deleting an account
app.delete('/delete-account/:accountId', (req, res) => {
  const accountId = req.params.accountId;

  const query = 'DELETE FROM accounts WHERE accountID = ?';

  connection.query(query, [accountId], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
      } else {
          res.sendStatus(200);
      }
  });
});

// Start the server on port 8001
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});