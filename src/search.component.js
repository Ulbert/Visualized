import React, { Component } from 'react';

export default class Search extends Component {
    constructor(props) {
        super(props);

        this.onAddSearchTerm = this.onAddSearchTerm.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            searchTerm: '',
        }
    }

    onAddSearchTerm(e) {
        this.setState({
            searchTerm: e.target.value
        });
    }

    onSubmit(e) {
        //e.preventDefault();
        
        console.log("this.state", this.state);
    }

    render() {
        return (
            <div>
                <h3>Search for a show!</h3>

                <form onSubmit={this.onSubmit}>
                        <label>Title: </label>
                        <input  type="text" name="title"
                                value={this.state.searchTerm}
                                onChange={this.onAddSearchTerm}
                                />

                    <button type="submit">Search</button>
                </form>
            </div>
        )
    }
}