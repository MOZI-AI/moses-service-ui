import React from 'react';
import { MoziService } from '../mozi_service';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

describe('<MoziService />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<MoziService />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays form initially', () => {
    const wrapper = shallow(<MoziService handleSubmit={() => {}} />);
    expect(wrapper.find('MoziServiceForm').exists()).toBeTruthy();
  });

  it('displays results after service response', () => {
    const wrapper = shallow(<MoziService handleSubmit={() => {}} />);
    wrapper.setState({ resultLink: 'http://sample.link' });
    expect(wrapper.find('MoziServiceResult').exists()).toBeTruthy();
  });
});
