import React from 'react'
import { shallow, mount } from 'enzyme'
import Monthpicker from '..'

describe('<Monthpicker />', () => {
  it('renders its children', () => {
    const wrapper = shallow(
      <Monthpicker month={1} year={2010} onChange={jest.fn()}>Child</Monthpicker>
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('event handling: ', () => {
    it('opens the overlay when clicking on the child', () => {
      const wrapper = mount(
        <Monthpicker initialYear={2010} month={1} year={2010} onChange={jest.fn()}>
          <div className='child'>Child</div>
        </Monthpicker>
      )

      const child = wrapper.find('.child').first()

      child.simulate('click')

      expect(wrapper).toMatchSnapshot()
    })

    it('closes the overlay when clicking anywhere outside the overlay', () => {
      const wrapper = mount(
        <Monthpicker initialYear={2010} month={1} year={2010} onChange={jest.fn()}>
          <div className='child'>Child</div>
        </Monthpicker>
      )

      const child = wrapper.find('.child').first()

      child.simulate('click')
      child.simulate('click')

      expect(wrapper).toMatchSnapshot()
    })

    it('sets the focussed date to 1 month later when hitting ArrowRight', () => {
      const initialyFocussedMonth = 1
      const wrapper = mount(
        <Monthpicker initialYear={2010} month={initialyFocussedMonth} year={2010} onChange={jest.fn()}>
          <div className='child'>Child</div>
        </Monthpicker>
      )

      const child = wrapper.find('.child').first()
      child.simulate('click')

      wrapper.simulate('keyDown', { key: 'ArrowRight' })

      const focussedMonth = wrapper.findWhere(node => node.key() === 'Februar')
      expect(focussedMonth).toMatchSnapshot()
    })

    it('sets the focussed date to 1 month earlier when hitting ArrowLeft', () => {
      const initialyFocussedMonth = 2
      const wrapper = mount(
        <Monthpicker initialYear={2010} month={initialyFocussedMonth} year={2010} onChange={jest.fn()}>
          <div className='child'>Child</div>
        </Monthpicker>
      )

      const child = wrapper.find('.child').first()
      child.simulate('click')

      wrapper.simulate('keyDown', { key: 'ArrowLeft' })

      const focussedMonth = wrapper.findWhere(node => node.key() === 'Januar')
      expect(focussedMonth).toMatchSnapshot()
    })

    it('sets the focussed date to 3 month later when hitting ArrowDown', () => {
      const initialyFocussedMonth = 1
      const wrapper = mount(
        <Monthpicker initialYear={2010} month={initialyFocussedMonth} year={2010} onChange={jest.fn()}>
          <div className='child'>Child</div>
        </Monthpicker>
      )

      const child = wrapper.find('.child').first()
      child.simulate('click')

      wrapper.simulate('keyDown', { key: 'ArrowDown' })

      const focussedMonth = wrapper.findWhere(node => node.key() === 'April')
      expect(focussedMonth).toMatchSnapshot()
    })

    it('sets the focussed date to 3 month earlier when hitting ArrowUp', () => {
      const initialyFocussedMonth = 4
      const wrapper = mount(
        <Monthpicker initialYear={2010} month={initialyFocussedMonth} year={2010} onChange={jest.fn()}>
          <div className='child'>Child</div>
        </Monthpicker>
      )

      const child = wrapper.find('.child').first()
      child.simulate('click')

      wrapper.simulate('keyDown', { key: 'ArrowUp' })

      const focussedMonth = wrapper.findWhere(node => node.key() === 'Januar')
      expect(focussedMonth).toMatchSnapshot()
    })
  })

  it('calls onChange with the selected month and year', () => {
    const handleChange = jest.fn()
    const wrapper = mount(
      <Monthpicker month={1} year={2018} onChange={handleChange}>
        <div className='child'>Child</div>
      </Monthpicker>
    )

    const child = wrapper.find('.child').first()
    child.simulate('click')

    wrapper.findWhere(node => node.key() === 'Mai').simulate('click')

    expect(handleChange).toHaveBeenCalledWith({ month: 5, year: 2018 }, expect.anything())
  })

  it('calls onChange with the given format', () => {
    const handleChange = jest.fn()
    const targetFormat = 'MM.YYYY'

    const wrapper = mount(
      <Monthpicker format={targetFormat} month={1} year={2018} onChange={handleChange}>
        <div className='child'>Child</div>
      </Monthpicker>
    )

    const child = wrapper.find('.child').first()
    child.simulate('click')

    wrapper.findWhere(node => node.key() === 'Mai').simulate('click')

    expect(handleChange).toHaveBeenCalledWith('05.2018', expect.anything())
  })

  it('allows specifiyng the primary and secondary colors', () => {
    const wrapper = mount(
      <Monthpicker
        primaryColor='green'
        secondaryColor='red'
        month={1}
        year={2018}
        onChange={jest.fn()}
      >
        <div className='child'>Child</div>
      </Monthpicker>
    )

    const child = wrapper.find('.child').first()
    child.simulate('click')

    expect(wrapper).toMatchSnapshot()
  })
})
