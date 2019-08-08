/*jshint esversion: 6 */
jest.mock("electron", () => {
    return {
        remote: {
            dialog: {
                showOpenDialogSync: jest.fn().mockReturnValue('/fake_path')
            }
        }
    };
});