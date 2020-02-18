# rguthrieGoogleBooks
Search and Save from Google Books with this simple full-stack app, now on heroku.

This a MERN app; the server is Express/Node JS using MongoDB, and the client is a React app which uses the Google API
for book information and to the server for DB CRUD operations.

The package was initialized from a MERN template stored on GitHub.  This template was built by the react package's 
create-react-app script for the npm CLI.  

The app is deployed on GitHub pages at:

https://rguthrie000.github.io/rguthrieGoogleBooks/

The repository on GitHub is:  rguthrie000/rguthrieGoogleBooks

The app is deployed in production configuration on heroku:

https://evening-sierra-31664.herokuapp.com/

# Design Notes

File App.js is the state and HTML body file. Custom React components for the Search Form (SearchForm) and the 
lists of books (BookCard) are used within the HTML body in App.

Data flows down to the components using the 'conventional' props process.  

App.js uses The create-react-app script supplied with the react package was used to create the startup and initial HTML file.
A bootstrap.com link was added to the index.HTML file, and the utils/API file was created,
but otherwise only the files in /src are application-specific.

## This application was developed with:
VS Code - Smart Editor for HTML/CSS/JS
node.js - JavaScript command-line interpreter
Google Chrome Inspector - inspection/analysis tools integrated in Chrome Browser.
react - middleware for optimized DOM manipulation and integrated JSX coding.
github - version control, content repository.
heroku - web deployment, including database hosting.

## Versioning

GitHub is used for version control; the github repository is 
rguthrie000/rguthrieUserDirectory.

## Author
rguthrie000 (Richard Guthrie)

## Acknowledgments
rguthrie000 is grateful to the UCF Coding Bootcamp - we rock!



