import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest/presets/js-with-babel',
    setupFilesAfterEnv: [
        './src/setupTest.ts'
    ]
};

export default config;
