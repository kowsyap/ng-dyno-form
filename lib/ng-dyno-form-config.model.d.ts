import { BsDatepickerViewMode } from "ngx-bootstrap/datepicker";
type DynoFormType = 'text' | 'number' | 'password' | 'email' | 'radio' | 'checkbox' | 'select' | 'textarea' | 'button' | 'heading' | 'date' | 'daterange' | 'file';
export interface DynoFormConfig {
    name: string;
    type: DynoFormType;
    label?: string;
    required?: boolean;
    pattern?: string | RegExp;
    class?: string;
    parentClass?: string;
    labelClass?: string;
    value?: any;
    section?: string;
    extra?: {
        options?: any[];
        key?: string;
        label?: string;
        validationMessages?: {
            required?: string;
            pattern?: string;
        };
        format?: string;
        mode?: BsDatepickerViewMode;
        minDate?: Date;
        maxDate?: Date;
        theme?: string;
        customClass?: string;
        customText?: string;
        fileName?: string;
        rows?: number;
        multi?: boolean;
        submit?: boolean;
    };
    disable?: boolean;
    condition?: (field: any) => boolean;
}
export {};
