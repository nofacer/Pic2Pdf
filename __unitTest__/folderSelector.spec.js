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
        expect(true).toBe(true);
    });

    it('should have a text instruction', () => {
        expect(wrapper.vm.textInstruction).toBe('Select a folder');
    });

    it('should has a variable to store the folder path', () => {
        expect(wrapper.vm.folderPath).toBe(null);
    });

    it('should be able to select a folder', () => {
        expect(wrapper.vm.selectFolder(electron)).toBe('/fake_production_path');
    });

    it('should set folderPath variable to the path', () => {
        wrapper.vm.selectFolder(electron);
        expect(wrapper.vm.folderPath).toBe('/fake_production_path');
    });

    it('should get different folder path in different env', () => {
        wrapper.vm.chooseByEnv('test');
        expect(wrapper.vm.folderPath).toBe(`${process.cwd()}/src/assets/fake_path_for_test`);
    });

    it('should valid the path is a real folder', () => {
        expect(wrapper.vm.validPath(`${process.cwd()}/src/assets/fake_path_for_test`)).toBe(true);
        expect(wrapper.vm.validPath('/fake_path')).toBe(false);
        expect(wrapper.vm.validPath(`${process.cwd()}/assets/app.js`)).toBe(false);
    });

    it('should change instruction to folder path if it is a valid folder path', () => {
        const correctPath = `${process.cwd()}/src/assets/fake_path_for_test`;
        wrapper.vm.validPath(correctPath);
        expect(wrapper.vm.textInstruction).toBe(correctPath);
    });

    it('should change instruction to error message if it is not a valid folder path', () => {
        const incorrectPath = '/fake_path';
        wrapper.vm.validPath(incorrectPath);
        expect(wrapper.vm.textInstruction).toBe('Please select a correct folder');
    });
});