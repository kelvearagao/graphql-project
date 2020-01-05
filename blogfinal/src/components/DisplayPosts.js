import React, { Component } from 'react'
import { listPosts } from '../graphql/queries'
import { API, graphqlOperation} from 'aws-amplify'
import  { onCreatePost, onDeletePost } from '../graphql/subscriptions'
import DeletePost from './DeletePost'
import EditPost from './EditPost'

class DisplayPosts extends Component {

    state  = {
        posts: []
    }

    componentDidMount = async () => {
        this.getPosts()
        
        this.createPostListener = API.graphql(graphqlOperation(onCreatePost))
            .subscribe({
                next: postData => {
                    const newPost = postData.value.data.onCreatePost
                    const prevPosts = this.state.posts.filter(post => post.id !== newPost.id)

                    const updatePosts = [
                        newPost, ...prevPosts
                    ]

                    this.setState({
                        posts: updatePosts
                    })
                }
            })

        this.deletePostListener = API.graphql(graphqlOperation(onDeletePost))
            .subscribe({
                next: postData => {
                    const deletedPost = postData.value.data.onDeletePost
                    const prevPosts = this.state.posts.filter(post => post.id !== deletedPost.id)

                    const updatePosts = [
                        ...prevPosts
                    ]

                    this.setState({
                        posts: updatePosts
                    })
                }
            })
    }

    componentWillUnmount() {
        this.createPostListener.unsubscribe()
        this.deletePostListener.unsubscribe()
    }

    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts))

        this.setState({
            posts: result.data.listPosts.items
        })
    }

    render() {
        const { posts } = this.state

        return (
            <div>
                <h1>Hello World</h1>

                <ul className="posts">
                    {posts.map((p) => (
                        <li key={ p.id }>
                            <h2>{ p.postTitle }</h2>
                            <span>Wrote by: { p.postOwnerUsername }</span> 
                            { " " }
                            <span>on</span> <time>{new Date(p.createdAt).toDateString() }</time>
                            <div>{ p.postBody }</div>

                            <br />

                            <EditPost />
                            <DeletePost data={p} />
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default DisplayPosts