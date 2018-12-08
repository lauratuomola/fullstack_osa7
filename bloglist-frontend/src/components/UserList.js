import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class UserList extends React.Component {
  render() {
    const { users } = this.props
    return (
      <div>
        <h2>users</h2>
        <Table striped bordered>
          <thead>
            <tr>
              <th />
              <th>blogs added</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <Link to={`/users/${user._id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default UserList
