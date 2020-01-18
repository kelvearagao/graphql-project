import React, { Component } from 'react'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { updatePost } from '../graphql/mutations'

class EditPost extends Component {

    state = {
        show: false,
        id: "",
        postOwnerId: "",
        postOwnerUsername: "",
        postTitle: "",
        postBody: "",
        postData: {
            ...this.props.data
        }
    }

    handleModal = () => {
        this.setState({
            show: !this.state.show
        })

        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    handleTitle = event => {
        this.setState({
            postData: {...this.state.postData, postTitle: event.target.value}
        })
    }

    handleBody = event => {
        this.setState({
            postData: {...this.state.postData, postBody: event.target.value}
        })
    }

    handleUpdatePost = async event => {
        event.preventDefault()

        const input = {
            id: this.props.data.id,
            postOwnerId: this.state.postOwnerId,
            postOwnerUsername: this.state.postOwnerUsername,
            postTitle: this.state.postData.postTitle,
            postBody: this.state.postData.postBody
        }

        await API.graphql(graphqlOperation(updatePost, { input }))

        this.setState({
            show: false
        })
    }

    componentWillMount = async () => {
        await Auth.currentUserInfo()
            .then(user => {
                this.setState({
                    postOwnerId: user.attributes.sub,
                    postOwnerUsername: user.username
                })
            })
    }

    render() {
        return (
            <>
                { this.state.show && (
                    <div className="modal">
                        <button className="close" onClick={this.handleModal}>X</button>

                        <form className="add-post"
                            onSubmit={event => this.handleUpdatePost(event)}>

                            <input type="text" 
                                placeholder="Title"
                                name="postTitle" 
                                value={this.state.postData.postTitle}
                                onChange={this.handleTitle}
                            />

                            <input type="text" 
                                placeholder="Body"
                                name="postBody" 
                                value={this.state.postData.postBody}
                                onChange={this.handleBody}
                            />

                            <button>Update Post</button>
                        </form>
                    </div>
                )}

                   
                
                <button onClick={this.handleModal}>Edit</button>
            </>
        )
    }
}

export default EditPost