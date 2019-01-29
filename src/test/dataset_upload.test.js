import React from 'react';
import { shallow } from 'enzyme';
import { DatasetUpload } from '../dataset_upload';
import renderer from 'react-test-renderer';

describe('<DatasetUpload />', () => {
  it('rendered correctly', () => {
    const tree = renderer.create(<DatasetUpload show="true" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('starts without an uploaded file', () => {
    const wrapper = shallow(<DatasetUpload show="true" />);
    expect(wrapper.find('div#fileDetails').exists()).toBeFalsy();
  });
});
