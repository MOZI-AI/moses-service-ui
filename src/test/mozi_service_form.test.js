import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { MoziServiceForm } from '../mozi_service_form';

describe('<MoziServiceForm />', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<MoziServiceForm />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
