import { ReplaceTypeKey } from '../../../models/replaceType';

export interface FormData {
    type: ReplaceTypeKey;
    /** 검색에 사용됩니다. */
    lookup: string;
    /** 이름 변경에 사용됩니다. */
    value: string;
}
