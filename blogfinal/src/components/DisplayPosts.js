import React, { Component } from 'react'
import { listPosts } from '../graphql/queries'
import { API, graqlOperation, graphqlOperation} from 'aws-amplify'

class DisplayPosts extends Component {

    componentDidMount = async () => {
        this.getPosts()
    }

    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts))
        console.log('all posts', JSON.stringify(result.data.listPosts.items))
    }

    render() {
        return (
            <div>Hello World</div>
        )
    }
}

export default DisplayPosts