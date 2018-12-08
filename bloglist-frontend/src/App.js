import React from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import {
  Nav,
  Navbar,
  NavItem,
  ListGroup,
  ListGroupItem,
  Form,
  Button
} from 'react-bootstrap'
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom'
import User from './components/User'
import UserList from './components/UserList'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      user: null,
      username: '',
      password: '',
      title: '',
      author: '',
      url: '',
      notification: null,
      users: []
    }
  }

  UNSAFE_componentWillMount = () => {
    blogService.getAll().then(blogs => this.setState({ blogs }))
    userService.getAll().then(users => this.setState({ users }))
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
      blogService.setToken(user.token)
    }
  }

  notify = (message, type = 'info') => {
    this.setState({
      notification: {
        message,
        type
      }
    })
    setTimeout(() => {
      this.setState({
        notification: null
      })
    }, 10000)
  }

  like = id => async () => {
    const liked = this.state.blogs.find(b => b._id === id)
    const updated = { ...liked, likes: liked.likes + 1 }
    await blogService.update(id, updated)
    this.notify(`you liked '${updated.title}' by ${updated.author}`)
    this.setState({
      blogs: this.state.blogs.map(b => (b._id === id ? updated : b))
    })
  }

  remove = id => async () => {
    const deleted = this.state.blogs.find(b => b._id === id)
    const ok = window.confirm(
      `remove blog '${deleted.title}' by ${deleted.author}?`
    )
    if (ok === false) {
      return
    }

    await blogService.remove(id)
    this.notify(`blog '${deleted.title}' by ${deleted.author} removed`)
    this.setState({
      blogs: this.state.blogs.filter(b => b._id !== id)
    })
  }

  addBlog = async event => {
    event.preventDefault()
    const blog = {
      title: this.state.title,
      author: this.state.author,
      url: this.state.url
    }

    const result = await blogService.create(blog)
    this.notify(`blog '${blog.title}' by ${blog.author} added`)
    this.setState({
      title: '',
      url: '',
      author: '',
      blogs: this.state.blogs.concat(result)
    })
  }

  logout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    this.notify('logged out')
    this.setState({ user: null })
  }

  login = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.notify('welcome back!')
      this.setState({ username: '', password: '', user })
    } catch (exception) {
      this.notify('käyttäjätunnus tai salasana virheellinen', 'error')
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  handleLoginChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }
  blogById = id => {
    if (id.length > 0) {
      const blog = this.state.blogs.find(a => a._id === id)
      return blog
    }
  }
  userById = id => {
    if (id.length > 0) {
      const user = this.state.users.find(a => a._id === id)
      return user
    }
  }
  render() {
    if (this.state.user === null) {
      return (
        <div className="container">
          <Notification notification={this.state.notification} />
          <h2>Kirjaudu sovellukseen</h2>
          <Form onSubmit={this.login}>
            <div>
              käyttäjätunnus
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleLoginChange}
              />
            </div>
            <div>
              salasana
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleLoginChange}
              />
            </div>
            <Button type="submit">kirjaudu</Button>
          </Form>
        </div>
      )
    }

    const byLikes = (b1, b2) => b2.likes - b1.likes

    const blogsInOrder = this.state.blogs.sort(byLikes)

    console.log(this.state.users)
    if (this.state.blogs.length > 0) {
      return (
        <div className="container">
          <Notification notification={this.state.notification} />
          <h2>Blog app </h2>
          <Router>
            <div>
              <Navbar>
                <Nav>
                  <NavItem>
                    <NavLink to="/blogs">blogs</NavLink> &nbsp;
                  </NavItem>
                  <NavItem>
                    <NavLink to="/users">users</NavLink> &nbsp;
                  </NavItem>
                  <NavItem>
                    {this.state.user.name} logged in
                    <button onClick={this.logout}>logout</button>
                  </NavItem>
                </Nav>
              </Navbar>
              <Togglable buttonLabel="create new">
                <BlogForm
                  handleChange={this.handleLoginChange}
                  title={this.state.title}
                  author={this.state.author}
                  url={this.state.url}
                  handleSubmit={this.addBlog}
                />
              </Togglable>
              <Route
                exact
                path="/users"
                render={() => (
                  <div>
                    <UserList users={this.state.users} />
                  </div>
                )}
              />
              <Route
                exact
                path="/users/:id"
                render={({ match }) => (
                  <User user={this.userById(match.params.id)} />
                )}
              />
              <Route
                exact
                path="/blogs"
                render={() => (
                  <div>
                    <h2>blogs</h2>
                    <ListGroup>
                      {blogsInOrder.map(blog => (
                        <ListGroupItem
                          key={blog._id}
                          bsStyle="info"
                          header={blog.title}
                        >
                          <Link to={`blogs/${blog._id}`}> {blog.author} </Link>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </div>
                )}
              />
              <Route
                exact
                path="/blogs/:id"
                render={({ match }) => (
                  <Blog
                    blog={this.blogById(match.params.id)}
                    like={this.like(match.params.id)}
                  />
                )}
              />
            </div>
          </Router>
        </div>
      )
    } else {
      return null
    }
  }
}

export default App
