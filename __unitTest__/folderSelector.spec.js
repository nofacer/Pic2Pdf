/*jshint esversion: 9 */
const FolderSelector = require('@/components/FolderSelector.vue').default;
import {
    mount
} from '@vue/test-utils';

const wrapper = mount(FolderSelector);
const electron = require('electron');
const path = require('path');


describe('FolderSelector.vue', () => {
    beforeEach(() => {});

    it('always pass', () => {
        expect(true).toBe(true);
    });

    it('should have a text instruction', () => {
        expect(wrapper.vm.textInstruction).toBe('Select a folder');
    });

    it('should be able to select a folder', () => {
        expect(wrapper.vm.selectFolder()).toBe(path.resolve("./src/assets/content_fake_folder"));
    });

    it('should has a variable to store the folder path', () => {
        wrapper.vm.selectFolder();
        expect(wrapper.vm.folderPath).toBe(path.resolve("./src/assets/content_fake_folder"));
    });


    it('should valid the path is a real folder', () => {
        expect(wrapper.vm.validPath(`${process.cwd()}/src/assets/fake_path_for_test`)).toBe(true);
        expect(wrapper.vm.validPath('/fake_path')).toBe(false);
        expect(wrapper.vm.validPath(`${process.cwd()}/assets/app.js`)).toBe(false);
    });

    it('should have a state variable to know the state of selected folder', () => {
        wrapper.vm.validPath(`${process.cwd()}/src/assets/fake_path_for_test`);
        expect(wrapper.vm.state).toBe(true);
        wrapper.vm.validPath('/fake_path');
        expect(wrapper.vm.state).toBe(false);
        wrapper.vm.validPath(`${process.cwd()}/assets/app.js`);
        expect(wrapper.vm.state).toBe(false);
    });

    it('should valid after selecting a file/folder', () => {
        wrapper.vm.selectFolder();
        expect(wrapper.vm.state).toBe(true);
    });

    it('should change instruction to folder path if it is a valid folder path', () => {
        const correctPath =  path.resolve("./src/assets/content_fake_folder");
        wrapper.vm.selectFolder();
        expect(wrapper.vm.textInstruction).toBe(correctPath);
    });

    it('should change instruction to error message if it is not a valid folder path', () => {
        const incorrectPath = '/fake_path';
        wrapper.vm.validPath(incorrectPath);
        expect(wrapper.vm.textInstruction).toBe('Please select a correct folder');
    });

    it('should get file absolute path in the folder', () => {
        wrapper.vm.folderPath = `${process.cwd()}/src/assets/content_fake_folder`;
        const fileList = wrapper.vm.getFiles();
        expect(fileList).toMatchObject([path.join(wrapper.vm.folderPath, '00.jpg'), path.join(wrapper.vm.folderPath, '01.jpg')]);
    });

    it('should be able to convert images to pdf', () => {
        wrapper.vm.folderPath = `${process.cwd()}/src/assets/content_fake_folder`;
        return wrapper.vm.convert().then((result) => {
            expect(result).toBe(true);
        });
    });
});