import React from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

class Togglable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <Button bsStyle= "primary" onClick={this.toggleVisibility}>
            {this.props.buttonLabel}
          </Button>
        </div>
        <div style={showWhenVisible}>
          {this.props.children}
          <Button onClick={this.toggleVisibility}>cancel</Button>
        </div>
      </div>
    )
  }
}
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
