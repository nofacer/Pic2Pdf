/*jshint esversion: 6 */
const Version = require('@/components/Version.vue').default;

import {
    mount
} from '@vue/test-utils';

const wrapper = mount(Version);

describe('Version.vue', () => {
    it('always pass', () => {
        expect(true).toBe(true);
    });

    it('version should have a div container', () => {
        expect(wrapper.html()).toMatch(/<div>.*<\/div>/);
    });
});