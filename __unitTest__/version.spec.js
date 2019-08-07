/*jshint esversion: 6 */
import Version from '@/components/Version.vue';
import {
    mount
} from '@vue/test-utils';

const wrapper = mount(Version);

describe('Version.vue', () => {
    it('always pass', () => {
        //expect(wrapper.html()).toMatch(/<div>.*<\/div>/);
        expect(true).toBe(true);
    });

    it('version should have a div container', () => {
        expect(wrapper.html()).toMatch(/<div>.*<\/div>/);
    });
});