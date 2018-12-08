import React from 'react'
import App from './App'
import renderer from 'react-test-renderer'

it('matches with snaphot', () => {
  const tree = renderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})
