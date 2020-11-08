import React from 'react';
import { mount } from 'enzyme';
import Main from '../src/Main';


describe('<Main />', () => {
  it('text should be rendered correctly', () => {
    const wrapper = mount(<Main />);
    expect(wrapper.find('div').text()).toBe("Hello World!");
  });
});