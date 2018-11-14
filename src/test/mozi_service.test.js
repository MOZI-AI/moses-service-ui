import React from 'react'
import { shallow } from 'enzyme'
import { MoziService } from '../mozi_service'
import renderer from 'react-test-renderer';

describe('<MoziService />', () => {

    it('renders correctly', () => {
        const tree = renderer.create(<MoziService />).toJSON();
        expect(tree).toMatchSnapshot();
    })

    it('shows dataset upload form on start', () => {
        const wrapper = shallow(<MoziService show='true' />)
        expect(wrapper.find('DatasetUpload').prop('show')).toBeTruthy()
    });


})