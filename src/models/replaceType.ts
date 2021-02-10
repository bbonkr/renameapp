export type ReplaceTypeKey = '1' | '2' | '3' | '4';
export interface ReplaceType {
    key: ReplaceTypeKey;
    value: string;
}

export const types: ReplaceType[] = [
    { key: '1', value: '입력값으로 치환' },
    { key: '2', value: '앞에 추가' },
    { key: '3', value: '뒤에 추가' },
    { key: '4', value: '정규식으로 치환' },
];
