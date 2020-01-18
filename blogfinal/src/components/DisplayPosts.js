import React, { Component } from 'react'
import { listPosts } from '../graphql/queries'
import { API, graphqlOperation} from 'aws-amplify'
import  { onCreatePost, onDeletePost, onUpdatePost, onCreateComment } from '../graphql/subscriptions'
import DeletePost from './DeletePost'
import EditPost from './EditPost'
import CreateCommentPost from './CreateCommentPost'
import CommentPost from './CommentPost'

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

        this.updatePostListener = API.graphql(graphqlOperation(onUpdatePost))
            .subscribe({
                next: postData => {
                    const updatedPost = postData.value.data.onUpdatePost
                    const index = this.state.posts.findIndex(post => post.id === updatedPost.id)

                    const updatePosts = [
                        ...this.state.posts.slice(0, index),
                        updatedPost,
                        ...this.state.posts.slice(index + 1)
                    ]

                    this.setState({
                        posts: updatePosts
                    })
                }
            })
        
        this.createPostCommentListener = API.graphql(graphqlOperation(onCreateComment))
            .subscribe({
                next: commentData => {
                    const createdComment = commentData.value.data.onCreateComment
                    let posts = [ ...this.state.posts]

                    for (let post of posts) {
                        if (createdComment.post.id === post.id) {
                            post.comments.item.push(createdComment)
                        }
                    }

                    this.setState({ posts })
                }
            })
    }

    componentWillUnmount() {
        this.createPostListener.unsubscribe()
        this.deletePostListener.unsubscribe()
        this.updatePostListener.unsubscribe()
        this.createPostCommentListener.unsubscribe()
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

                            <span>
                                <EditPost data={p} />
                                <DeletePost data={p} />
                            </span>
                            <span>
                                <CreateCommentPost postId={p.id} />
                                { p.comments.items.length > 0 && 
                                    <span>Comments: </span>
                                }
                                {
                                    p.comments.items.map((comment, index) => 
                                        <CommentPost key={index} commentData={comment} />)
                                }
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default DisplayPosts