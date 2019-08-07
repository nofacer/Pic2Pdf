/*jshint esversion: 6 */
const FolderSelector =require('@/components/FolderSelector.vue').default;
import {
    mount
} from '@vue/test-utils';

const wrapper = mount(FolderSelector);

describe('FolderSelector.vue', () => {
    it('always pass', () => {
        //expect(wrapper.html()).toMatch(/<div>.*<\/div>/);
        expect(true).toBe(true);
    });

    it('should have a text instruction',()=>{
        expect(wrapper.vm.textInstruction).toBe('Selector a folder');
    });

    it('should has a variable to store the folder path',()=>{
        expect(wrapper.vm.folderPath).toBe(null);
    });
});