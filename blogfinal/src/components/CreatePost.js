import React, { Component } from 'react'
import { graphqlOperation, API, Auth } from 'aws-amplify'
import { createPost } from '../graphql/mutations'
import { timingSafeEqual } from 'crypto'

class CreatePost extends Component {

    state = {
        postOwnerId: "",
        postOwnerUsername: "",
        postTitle: "",
        postBody: ""
    }

    componentDidMount = async () => {
        await Auth.currentUserInfo()
            .then(user => {
                this.setState({
                    postOwnerId: user.attributes.sub,
                    postOwnerUsername: user.username
                })
            })
    }

    handleChangePost = event => this.setState({
        [event.target.name]: event.target.value
    })

    handleAddPost = async event => {
        event.preventDefault()

        const input = {
            postOwnerId: this.state.postOwnerId,
            postOwnerUsername: this.state.postOwnerUsername,
            postTitle: this.state.postTitle,
            postBody: this.state.postBody,
            createdAt: new Date().toISOString()
        }

        await API.graphql(graphqlOperation(createPost, { input }))

        this.setState({ postTitle: "", postBody: "" })
    }

    render() {
        return (
            <form className="addPost" onSubmit={this.handleAddPost} >
                <input type="text" placeholder="title" name="postTitle" 
                    value={this.state.postTitle}
                    onChange={this.handleChangePost}
                    required/>

                <textarea type="text" rows="3" cols="40" placeholder="New Blog Post" name="postBody" 
                    value={this.state.postBody}
                    onChange={this.handleChangePost}
                    required/>

                <input type="submit" />
            </form>
        )
    }
}

export default CreatePost