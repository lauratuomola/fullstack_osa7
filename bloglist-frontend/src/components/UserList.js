import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

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
UserList.propTypes = {
  users: PropTypes.array.isRequired
}
export default UserList
