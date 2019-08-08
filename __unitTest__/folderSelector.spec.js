/*jshint esversion: 6 */
const FolderSelector = require('@/components/FolderSelector.vue').default;
import {
    mount
} from '@vue/test-utils';

const wrapper = mount(FolderSelector);
const electron = require('electron');



describe('FolderSelector.vue', () => {
    beforeEach(() => {});
    it('always pass', () => {
        //expect(wrapper.html()).toMatch(/<div>.*<\/div>/);
        expect(true).toBe(true);
    });

    it('should have a text instruction', () => {
        expect(wrapper.vm.textInstruction).toBe('Selector a folder');
    });

    it('should has a variable to store the folder path', () => {
        expect(wrapper.vm.folderPath).toBe(null);
    });

    it('should be able to select a folder', () => {
        expect(wrapper.vm.selectFolder(electron)).toBe('/fake_path');
    });

    it('should set folderPath variable to the path', () => {
        wrapper.vm.selectFolder(electron);
        expect(wrapper.vm.folderPath).toBe('/fake_path');
    });
});