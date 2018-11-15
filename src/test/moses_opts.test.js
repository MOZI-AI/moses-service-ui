import React from 'react'
import { mount } from 'enzyme'
import { MosesOptionsForm } from '../moses_opts'
import renderer from 'react-test-renderer';

const mosesOpts = {
    maximumEvals: 1000,
    featureSelectionTargetSize: 4,
    reductKnobBuildingEffort: 0,
    resultCount: 100,
    numberOfThreads: 8,
    featureSelectionAlgorithm: "simple",
    enableFeatureSelection: false,
    hcWidenSearch: false,
    balance: true,
    hcCrossoverMinNeighbors: 5000,
    hcCrossoverPopSize: 1000,
    inputCategory: "older-than"
};
const additionalParameters = { a: 1 }

describe('<MosesOptionsForm />', () => {

    it('rendered correctly', () => {
        const tree = renderer.create(<MosesOptionsForm defaults={mosesOpts} show='true' />).toJSON()
        expect(tree).toMatchSnapshot()
    });

    it('shows error when attempting to add duplicate additional parameter', () => {
        const wrapper = mount(<MosesOptionsForm defaults={mosesOpts} additionalParameters={additionalParameters} show='true' />)
        const name = wrapper.find('Input[name="name"]').first()

        name.simulate('change', { target: { value: 'a' } })
        expect(wrapper.find('.has-error input[name="name"]').exists()).toBeTruthy()
    })

    it('hides feature selection options when feature selection is disabled', () => {
        const wrapper = mount(<MosesOptionsForm defaults={mosesOpts} show='true' />)
        expect(wrapper.find('div#featureSelectionAlgorithm').exists()).toBeFalsy()
        expect(wrapper.find('Input[name="featureSelectionTargetSize"]').exists()).toBeFalsy()
    })

    it('hides hcWidenSearch options when hcWidenSearch is off', () => {
        const wrapper = mount(<MosesOptionsForm defaults={mosesOpts} show='true' />)
        expect(wrapper.find('Input[name="hcCrossoverMinNeighbors"]').exists()).toBeFalsy()
        expect(wrapper.find('Input[name="hcCrossoverPopSize"]').exists()).toBeFalsy()
    })

})