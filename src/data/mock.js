// Public mock entry point. Components import everything from '../data/mock'.
// Split into two files only because the file-write buffer in our editor caps at ~6KB.
export * from './mock-core';
export * from './mock-content';
