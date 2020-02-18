import React from "react";
import "./SearchForm.css";

function SearchForm(props) {
  return (
    <form id="form-search">
        <div>
            <input
            className="form-input"
            value={props.title}
            name="title"
            type="text"
            placeholder="search by title"
            onChange={props.handleFormChange}
            />
        </div>
        <div>
            <input
            className="form-input"
            value={props.author}
            name="author"
            type="text"
            placeholder="search by author"
            onChange={props.handleFormChange}
            />
        </div>
        <div>
            <input
            className="form-input"
            value={props.subject}
            name="subject"
            type="text"
            placeholder="search by subject"
            onChange={props.handleFormChange}
            />
        </div>
        <button className="btn btn-primary button-search" 
          onClick={props.handleFormSubmit}>Go!</button>
    </form>
  );
}

export default SearchForm;
