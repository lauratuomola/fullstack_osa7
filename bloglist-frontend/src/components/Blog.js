import React from 'react'

class Blog extends React.Component {
  render() {
    const { blog, like } = this.props

    return (
      <div>
        <h2>
          {blog.title} {blog.author}
        </h2>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          {blog.likes} likes <button onClick={like}>like</button>
        </div>
        <div>added by {blog.user.name}</div>
      </div>
    )
  }
}

export default Blog
