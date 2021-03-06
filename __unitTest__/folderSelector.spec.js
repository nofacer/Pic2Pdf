/*jshint esversion: 9 */
const FolderSelector = require('@/components/FolderSelector.vue').default;
import {
    mount
} from '@vue/test-utils';

const wrapper = mount(FolderSelector);
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');


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
        const correctPath = path.resolve("./src/assets/content_fake_folder");
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



    it('should get convet state with running when not coverting', () => {
        wrapper.vm.folderPath = `${process.cwd()}/src/assets/content_fake_folder`;
        wrapper.vm.convert();
        expect(wrapper.vm.convertState).toBe('running');

    });

    it('should get convet state with success when finish coverting', () => {
        wrapper.vm.folderPath = `${process.cwd()}/src/assets/content_fake_folder`;
        return wrapper.vm.convert().then(() => {
            expect(wrapper.vm.convertState).toBe('success');
        });
    });

    it('should return false when there is no files in the folder', () => {
        const files = [];
        expect(wrapper.vm.preConvert(files)).toBe(false);
        expect(wrapper.vm.state).toBe(false);
    });

    it('should get correct file type', () => {
        const file1 = 'demo.jpg';
        const file2 = 'demo.png';
        expect(wrapper.vm.getFileType(file1)).toBe('jpg');
        expect(wrapper.vm.getFileType(file2)).toBe('png');
    });

    it('should return correct format file', () => {
        const files = ['1.png', 'text', '1.txt', '3.png'];
        expect(wrapper.vm.preConvert(files)).toMatchObject(['1.png', '3.png']);
    });

    it('if output path is null then output to the same path', async () => {
        const fakeFilePath = `${process.cwd()}/src/assets/content_fake_folder.pdf`;
        const isExists = fs.existsSync(fakeFilePath);
        if (isExists) {
            try {
                fs.unlinkSync(fakeFilePath);
            } catch (err) {
                console.error(err);
            }
        }

        wrapper.vm.outputPath = null;
        return wrapper.vm.convert().then(() => {
            const isExistsAgain = fs.existsSync(fakeFilePath);
            expect(isExistsAgain).toBe(true);
        });
    });

    it('if output path is not null then output to the that path', async () => {
        const fakeFilePath = os.homedir()+'/Downloads/content_fake_folder.pdf';
        const isExists = fs.existsSync(fakeFilePath);
        if (isExists) {
            try {
                fs.unlinkSync(fakeFilePath);
            } catch (err) {
                console.error(err);
            }
        }
        

        wrapper.vm.outputPath = os.homedir()+'/Downloads';
        return wrapper.vm.convert().then(() => {
            const isExistsAgain = fs.existsSync(fakeFilePath);
            expect(isExistsAgain).toBe(true);
        });
    });


});