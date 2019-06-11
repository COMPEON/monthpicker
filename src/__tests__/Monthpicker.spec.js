import React from 'react'
import { shallow, mount } from 'enzyme'
import ArrowRight from '../ArrowRight'
import ArrowLeft from '../ArrowLeft'
import { Year } from '../Monthpicker'
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
        <Monthpicker year={2010} month={1} year={2010} onChange={jest.fn()}>
          <div className='child'>Child</div>
        </Monthpicker>
      )

      const child = wrapper.find('.child').first()

      child.simulate('click')

      expect(wrapper).toMatchSnapshot()
    })

    it('closes the overlay when clicking anywhere outside the overlay', () => {
      const wrapper = mount(
        <Monthpicker year={2010} month={1} year={2010} onChange={jest.fn()}>
          <div className='child'>Child</div>
        </Monthpicker>
      )

      const child = wrapper.find('.child').first()

      child.simulate('click')
      child.simulate('click')

      expect(wrapper).toMatchSnapshot()
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

  it('works with different locales', () => {
    const wrapper = mount(
      <Monthpicker
        locale='en'
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

  describe('with allowedYears prop set', () => {
    describe('to an array', () => {
      it('allows selecting years in the allowedYears array', () => {
        const onChange = jest.fn()
        const wrapper = mount(
          <Monthpicker
            allowedYears={[2017]}
            month={10}
            year={2018}
            onChange={onChange}
          >
            <div className='child'>Child</div>
          </Monthpicker>
        )

        const child = wrapper.find('.child').first()
        child.simulate('click')

        wrapper.find(ArrowLeft).simulate('click')

        expect(wrapper.find(Year).text()).toBe('2017')
        expect(onChange).not.toHaveBeenCalled()
      })

      it('does not allow selecting years not in the allowedYears array', () => {
        const onChange = jest.fn()
        const wrapper = mount(
          <Monthpicker
            allowedYears={[2019]}
            year={2018}
            onChange={onChange}
          >
            <div className='child'>Child</div>
          </Monthpicker>
        )

        const child = wrapper.find('.child').first()
        child.simulate('click')

        wrapper.find(ArrowLeft).simulate('click')

        expect(wrapper.find(Year).text()).toBe('2018')
        expect(onChange).not.toHaveBeenCalled()
      })

      it('goes to the next allowed year when clicking the next button', () => {
        const onChange = jest.fn()
        const wrapper = mount(
          <Monthpicker
            allowedYears={[2018, 2020]}
            month={10}
            year={2018}
            onChange={onChange}
          >
            <div className='child'>Child</div>
          </Monthpicker>
        )

        const child = wrapper.find('.child').first()
        child.simulate('click')

        wrapper.find(ArrowRight).simulate('click')

        expect(wrapper.find(Year).text()).toBe('2020')
        expect(onChange).not.toHaveBeenCalled()
      })

      it('goes to the previous allowed year when clicking the previous button', () => {
        const onChange = jest.fn()
        const wrapper = mount(
          <Monthpicker
            allowedYears={[2016, 2018]}
            month={10}
            year={2018}
            onChange={onChange}
          >
            <div className='child'>Child</div>
          </Monthpicker>
        )

        const child = wrapper.find('.child').first()
        child.simulate('click')

        wrapper.find(ArrowLeft).simulate('click')

        expect(wrapper.find(Year).text()).toBe('2016')
        expect(onChange).not.toHaveBeenCalled()
      })

      it('goes to the correct year with an unsorted array', () => {
        const onChange = jest.fn()
        const wrapper = mount(
          <Monthpicker
            allowedYears={[2018, 2016, 2020]}
            month={10}
            year={2018}
            onChange={onChange}
          >
            <div className='child'>Child</div>
          </Monthpicker>
        )

        const child = wrapper.find('.child').first()
        child.simulate('click')

        wrapper.find(ArrowLeft).simulate('click')

        expect(wrapper.find(Year).text()).toBe('2016')

        const arrowRight = wrapper.find(ArrowRight)

        arrowRight.simulate('click')
        arrowRight.simulate('click')

        expect(wrapper.find(Year).text()).toBe('2020')
        expect(onChange).not.toHaveBeenCalled()
      })
    })

    describe('to an object', () => {
      it('does allow values before the before key', () => {
        const onChange = jest.fn()
        const wrapper = mount(
          <Monthpicker
            allowedYears={{ before: 2019 }}
            month={10}
            year={2018}
            onChange={onChange}
          >
            <div className='child'>Child</div>
          </Monthpicker>
        )

        const child = wrapper.find('.child').first()
        child.simulate('click')

        wrapper.find(ArrowLeft).simulate('click')

        expect(wrapper.find(Year).text()).toBe('2017')
        expect(onChange).not.toHaveBeenCalled()
      })

      it('does not allow values after the before key', () => {
        const onChange = jest.fn()
        const wrapper = mount(
          <Monthpicker
            allowedYears={{ before: 2019 }}
            year={2018}
            onChange={onChange}
          >
            <div className='child'>Child</div>
          </Monthpicker>
        )

        const child = wrapper.find('.child').first()
        child.simulate('click')

        wrapper.find(ArrowRight).simulate('click')

        expect(wrapper.find(Year).text()).toBe('2018')
        expect(onChange).not.toHaveBeenCalled()
      })

      it('does allow values after the after key', () => {
        const onChange = jest.fn()
        const wrapper = mount(
          <Monthpicker
            allowedYears={{ after: 2017 }}
            year={2018}
            month={10}
            onChange={onChange}
          >
            <div className='child'>Child</div>
          </Monthpicker>
        )

        const child = wrapper.find('.child').first()
        child.simulate('click')

        wrapper.find(ArrowRight).simulate('click')

        expect(wrapper.find(Year).text()).toBe('2019')
        expect(onChange).not.toHaveBeenCalled()
      })

      it('does not allow values before the after key', () => {
        const onChange = jest.fn()
        const wrapper = mount(
          <Monthpicker
            allowedYears={{ after: 2017 }}
            year={2018}
            onChange={onChange}
          >
            <div className='child'>Child</div>
          </Monthpicker>
        )

        const child = wrapper.find('.child').first()
        child.simulate('click')

        wrapper.find(ArrowLeft).simulate('click')

        expect(wrapper.find(Year).text()).toBe('2018')
        expect(onChange).not.toHaveBeenCalled()
      })
    })
  })
})
