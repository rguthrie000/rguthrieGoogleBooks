import React, { useState, useEffect } from "react";
import API from "./utils/googleAPI";
import SearchForm from "./components/SearchForm";
import BookCard from "./components/BookCard";
import "./App.css";

function App() {
  const debug = false;

//******************
//*   State Data   *
//******************
  
  // Nav boolean - show Search, or show Saved
  const [navIsSearch,setNavIsSearch] = useState();

  // The Search Form is supported by the search object.
  const [search,setSearch] = useState({
    title         : '',
    author        : '',
    subject       : ''
  });
  
  // Books are maintained in lists, each with an associated list index.

  // This is the list to hold search results.
  const [searchBooks,setSearchBooks] = useState({
    trigger : true,
    vols : []
  });

  // This is the list to hold saved books.
  const [savedBooks,setSavedBooks] = useState({
    trigger : true,
    vols : []
  });

  // One book looks like this. This is not Google Books' format. Some
  // of the data is obtained in the book-match search, the remainder is
  // obtained when the user requests to view a summary. (The summary
  // information comes from a separate single-book request.)
  // const vol = {
  //   added         : '',   // determined at time of Save to DB
  //   googleId      : '',   // found in pattern-match (general) search
  //   title         : '',   // found in pattern-match (general) search
  //   subtitle      : '',   // found in single-book search
  //   authors       : '',   // found in pattern-match (general) search
  //   published     : '',   // found in single-book search
  //   imageUrl      : '',   // found in single-book search
  //   description   : '',   // found in single-book search
  //   viewDetails   : false // default is false
  // };
  
//******************
//*   Functions    *
//******************
  
  // When ready...
  useEffect( () => {
    setNavIsSearch(false);
    // componentDidMount() functionality -- fetch the saved books
    // for quicker loading of the 'Saved' page.
    loadSavedBooks();
  },
  // no monitoring.
  []);

  // togglePage() changes the logic state of boolean navIsSearch.
  function togglePage() {
    setNavIsSearch(navIsSearch ? false : true);
  }

  // loadSavedBooks() fetches the DB content from the server.
  function loadSavedBooks() {
    fetch('/api/read')
    .then( (data) => {
      // data is the savedBooks array
      data.json().then( (res) => {
        let bArr = [];
        res.forEach( (book) => {
          bArr.push({
            added         : book.added,
            googleId      : book.googleId,
            title         : book.title, 
            subtitle      : book.subtitle? book.subtitle : '',
            authors       : book.authors,
            published     : book.published,
            imageUrl      : book.imageUrl,
            description   : book.description,
            viewDetails   : false
          });
        })
        if (debug) {console.log(`Saved books: ${bArr.length}`);}
        setSavedBooks({trigger:savedBooks.trigger+1,vols:bArr});
      })
    })
    .catch( (err) => console.log(err));
  }

  // handleFormChange() updates the search object as the user types
  // in the form fields. react renders them as they are changed.
  function handleFormChange(event) {
    event.preventDefault();
    // Get the value and name of the input which triggered the change
    const name  = event.target.name;
    const value = event.target.value;
    // And update the state so the user can see feedback as the input is typed.
    setSearch({...search, [name] : value});
  };

  // handleFormSubmit() asks for a Google Books search using the 
  // current value of the search object. the response list is converted 
  // to a books object, which tracks a selected index and an array of 
  // volume objects, each of which has some properties known from the 
  // search, and other properties which are not used until the user
  // selects to view the volume -- at which time those properties are 
  // found from a single-volume search.
  function handleFormSubmit(event) {
    event.preventDefault();

    API.getBooks(search)
    .then( (res) => {
      let bArr = [];
      if (res.data.items) {
        if (debug) {console.log(res.data.items);}
        let authorStr = '';
        let b = {};
        for (let i = 0; i < res.data.items.length; i++) {
          b = res.data.items[i];
          if (b.volumeInfo.authors) {
            authorStr = 
              b.volumeInfo.authors.reduce((s,elt,i) => (s += (!i ? elt : `, ${elt}`)) , '');
          } else {
            authorStr = '';
          }    
          bArr.push({
            added       : '',
            googleId    : b.id,
            title       : b.volumeInfo.title,
            subtitle    : '',
            authors     : authorStr,
            published   : '',
            imageUrl    : '',
            description : '',
            viewDetails : false
          });  
        }
      }
      setSearchBooks({trigger:searchBooks.trigger+1,vols:bArr});
      if (!navIsSearch) {
        setNavIsSearch(true);
      }
    })
    .catch( (err) => console.log(err));
  }

  // toggleView() is the response to the view/titleOnly button.
  // The page component uses the viewDetail property to determine
  // how much content to display for a book, so the full summary
  // content must be present when viewDetails is true.
  function toggleView(event) {
    let googleId = event.target.value;
    // The list of volumes is part of the react state, so ultimately
    // we want to make sure react knows when it has been updated.
    // This technique is expensive, but readable and maintainable.
    // Start by copying the list of volumes.
    let bArr = navIsSearch ? searchBooks.vols : savedBooks.vols;
    
    let index = bArr.findIndex( (elt) => (elt.googleId === googleId));
    if (debug) {console.log(`toggle ${bArr[index].title} at index ${index}, googleId ${googleId}`);}

    if (bArr[index].viewDetails) {
      // toggle viewDetails
      bArr[index].viewDetails = false;
      // using setBooks tells react the data has changed.
      if (navIsSearch) {
        setSearchBooks({trigger:searchBooks.trigger+1,vols:bArr});
      } else {
        setSavedBooks({trigger:savedBooks.trigger+1,vols:bArr});
      }
    } else {
      // toggle viewDetails
      bArr[index].viewDetails = true;
      // then let's see if we already have the content from a 
      // single-book search
      if (bArr[index].description) {
        // if there's a description, we've been this way before
        // and already have a summary. still, we need to finish
        // the update of the viewDetails property.
        if (navIsSearch) {
          setSearchBooks({trigger:searchBooks.trigger+1,vols:bArr});
        } else {
          setSavedBooks({trigger:savedBooks.trigger+1,vols:bArr});
        }  
      } else {
        // oops, no description, so let's fetch the volume info.
        if (debug) {console.log(`fetching volume, list item ${index}, googleId ${bArr[index].googleId}`)}
        API.getVolume(bArr[index].googleId)
        .then ( (b) => {
          if (debug) {console.log(b);}
          // and use it to augment the volume info.
          // early experience with Google Books is that some books don't have imageLinks.
          let iUrl = (!b.data.volumeInfo.imageLinks) ? '' : b.data.volumeInfo.imageLinks.thumbnail;
          let desc = '';
          if (b.data.volumeInfo.description) {
            desc = b.data.volumeInfo.description;
            desc = desc.replace(/<p>/g  ,'');
            desc = desc.replace(/<\/p>/g,'');
            desc = desc.replace(/<b>/g  ,'');
            desc = desc.replace(/<\/b>/g,'');
            desc = desc.replace(/<i>/g  ,'');
            desc = desc.replace(/<\/i>/g,'');
            desc = desc.replace(/<br>/g ,'');
          }
          let authorStr = 
            b.data.volumeInfo.authors.reduce((s,elt,i) => (s += (!i ? elt : `, ${elt}`)) , '');
          bArr[index] = {
            added       : '',
            googleId    : googleId,
            title       : b.data.volumeInfo.title, 
            subtitle    : b.data.volumeInfo.subtitle, 
            authors     : authorStr,
            published   : b.data.volumeInfo.publishedDate.slice(0,4),
            imageUrl    : iUrl,
            description : desc,
            viewDetails : true
          }  
          // now update the state information.
          if (navIsSearch) {
            setSearchBooks({trigger:searchBooks.trigger+1,vols:bArr});
          } else {
            setSavedBooks({trigger:savedBooks.trigger+1,vols:bArr});
          }  
        });
      }
    }
  }

  // saveToDB() removes the volume from the display list, then
  // posts the volume to the server for storage
  function saveToDB(event) {
    let googleId = event.target.value;
    let bArr = searchBooks.vols;
    // find the index of the element with our googleId
    let index = bArr.findIndex((elt) => elt.googleId === googleId);
    // grab it as an array of length 1, and also alter (the copy of) searchBooks
    let bookSaved = bArr.splice(index,1);
    // and now fix searchBooks
    setSearchBooks({trigger:searchBooks.trigger+1,vols:bArr});
    if (debug) {console.log(`saveToDB: title ${bookSaved[0].title} at index ${index}, document ${JSON.stringify(bookSaved[0])}`);}
    fetch('/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookSaved[0])
    })
    .then ( () => {
      // refresh the list of saved books for faster loading of the
      // 'Saved' page.
      loadSavedBooks();
    })
    .catch( (err) => console.log(err));
  };

  function deleteBook(event) {
    let googleId = event.target.value;
    let bArr = savedBooks.vols;
    let index = bArr.findIndex((elt) => elt.googleId === googleId);
    let bookDelete = bArr.slice(index,1);
    setSavedBooks({trigger:savedBooks.trigger+1,vols:bArr});
    if (debug) {console.log(`Delete: , at index ${index}, document ${JSON.stringify(bookDelete[0])}`);}
    fetch(`/api/delete/${googleId}`)
    .then( (data) => {
      if (debug) {console.log(data);}
      // update savedBooks from the DB
      loadSavedBooks();
    });
  };

  //************************
  //*   render functions   *
  //************************
  
  function singleCard(elt) {            
    return (
      <div className="book-card" key={elt.googleId}>
        <BookCard 
          googleId   ={elt.googleId}
          title      ={elt.title}
          subtitle   ={elt.subtitle}
          authors    ={elt.authors}
          published  ={elt.published}
          imageUrl   ={elt.imageUrl}
          description={elt.description}
          viewDetails={elt.viewDetails}
          toggleView ={toggleView}
          saveToDB   ={saveToDB}
          deleteBook ={deleteBook}
          navIsSearch={navIsSearch}
        />
      </div>
    )
  }

  function generateCards(searchTrue) {
    if (searchTrue) {
      return(searchBooks.vols.map( (elt) => singleCard(elt)));
    } else {
      return( savedBooks.vols.map( (elt) => singleCard(elt)));
    }
  }

  return (
      <div className="container App">
        <div className="row App-header">
          <div id="nameBox">
              <h5>rguthrie's</h5>
              <h4>My Google Books</h4>
          </div>
          <div className="nav-button">
            <button className="page-choice" onClick={togglePage}>Go to {navIsSearch?"Saved":"Search"}</button>
          </div>
          <div>
            <SearchForm
              title={search.title}
              author={search.author}
              subject={search.subject}
              handleFormChange={handleFormChange}
              handleFormSubmit={handleFormSubmit}
            />
          </div>
          <h1 className="nav-title">{navIsSearch? "Search" : "Saved"}</h1>
        </div>
        <div>
          {generateCards(navIsSearch)}
        </div>
      </div>
    // </Router>
  );

}

export default App;
