import React from 'react';
import "./BookCard.css"

function BookCard(props) {

  function buttonKind(sch,view) {
    if (sch) 
      return(view? 
        <button 
          className="btn btn-primary button-save" 
          value={props.googleId} 
          onClick={props.saveToDB}>Save</button>
       : 
        <noscript></noscript>);
    return (
      <button className="btn btn-primary button-save"
        value={props.googleId}
        onClick={props.deleteBook}>Delete</button>);
  }

  return (
    <>
      <div className="row">
        <h5 id="card-title"    >{props.title    }</h5>
        <h6 id="card-published">{props.published}</h6>
        <h6 id="card-authors"  >{props.authors  }</h6>
        <button className="btn btn-primary button-info" value={props.googleId} 
          onClick={props.toggleView}>{props.viewDetails ? 'Title Only':'Info'}</button>
        {buttonKind(props.navIsSearch, props.viewDetails)} 
      </div>
      {props.viewDetails ? (
        <div>
          <div className="row">
            <h6>{props.subtitle}</h6>
          </div>
          <div className="row">
            <div className="col-sm-3">
                <img id="book-thumb" src={props.imageUrl} alt={props.title}/>
            </div>
            <div className="col-sm-9 book-description">
                {props.description}
            </div>
          </div>
        </div>
        ) : (<noscript></noscript>)
      }
    </>
  );
}

export default BookCard;