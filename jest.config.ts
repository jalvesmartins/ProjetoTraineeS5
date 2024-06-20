export default {
	clearMocks: true,
	preset: 'ts-jest',
	testEnvironment: "node",
	setupFilesAfterEnv: ['./config/singleton.ts']
};