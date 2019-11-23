import React, { Component } from 'react';

export default class Add extends Component {
    constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            title: '',
        }
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onSubmit(e) {
        // e.preventDefault();
        console.log('this.state', this.state);
    }

    render() {
        return (
            <div>
                <h3>Add a show manually!</h3>

                <form onSubmit={this.onSubmit}>
                        <label>Title: </label>
                        <input  type="text"
                                name="title"
                                value={this.state.title}
                                onChange={this.onChangeTitle}
                                />
                    <button type="submit" >Add</button>
                </form>
            </div>
        )
    }
}