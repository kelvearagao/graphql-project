import React from 'react'
import { Component } from "react";

class CommentPost extends Component {

    render() {
        const { content, commentOwnerUsername, createdAt } = this.props.commentData

        return (
            <div className="comment">
                <span>
                    Component by: { commentOwnerUsername }
                    on 
                    <time>{ new Date(createdAt).toDateString() }</time>
                </span>
                <p>
                    { content }
                </p>
            </div>
        )
    }
}

export default CommentPost