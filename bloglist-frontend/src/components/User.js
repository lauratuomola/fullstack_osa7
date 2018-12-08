import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

class User extends React.Component {
  render() {
    const { user } = this.props
    return (
      <div>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        <ListGroup>
          {user.blogs.map(blog => (
            <ListGroupItem key={blog._id}>
              {blog.title} by {blog.author}
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    )
  }
}

export default User
