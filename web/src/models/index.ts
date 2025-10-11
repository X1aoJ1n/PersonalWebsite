// 导出 BaseResponse (假设它既是值又是类型，所以保留 'export *')
export * from './BaseResponse'; 

// 👇 将所有包含 'interface' 或 'type' 定义的模型文件改为 'export type * from'
export type * from './auth';
export type * from './comment';
export type * from './contact';
export type * from './like';
export type * from './organization';
export type * from './post';
export type * from './reply';
export type * from './user';
export type * from './file';
export type * from './common';