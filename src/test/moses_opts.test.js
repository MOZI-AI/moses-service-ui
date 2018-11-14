import React from 'react'
import { mount } from 'enzyme'
import { MosesOptionsForm } from '../moses_opts'
import renderer from 'react-test-renderer';

describe('<MosesOptionsForm />', () => {

    it('rendered correctly', () => {
        const tree = renderer.create(<MosesOptionsForm show='true' />).toJSON()
        expect(tree).toMatchSnapshot()
    });


    it('shows error when attempting to add duplicate additional parameter', () => {
        const wrapper = mount(<MosesOptionsForm additionalParameters={{ a: 1 }} show='true' />)
        const name = wrapper.find('Input[name="name"]').first()

        name.simulate('change', { target: { value: 'a' } })
        expect(wrapper.find('.has-error input[name="name"]').exists()).toBeTruthy()
    })

    it('hides feature selection options when feature selection is disabled', () => {
        const wrapper = mount(<MosesOptionsForm defaults={{ enableFeatureSelection: false }} show='true' />)
        expect(wrapper.find('div#featureSelectionAlgorithm').exists()).toBeFalsy()
        expect(wrapper.find('Input[name="featureSelectionTargetSize"]').exists()).toBeFalsy()
    })

    it('hides hcWidenSearch options when hcWidenSearch is off', () => {
        const wrapper = mount(<MosesOptionsForm defaults={{ hcWidenSearch: false }} show='true' />)
        expect(wrapper.find('Input[name="hcCrossoverMinNeighbors"]').exists()).toBeFalsy()
        expect(wrapper.find('Input[name="hcCrossoverPopSize"]').exists()).toBeFalsy()
    })

})