import { EventEmitter, SimpleChanges } from '@angular/core';
import { DynoFormConfig } from './ng-dyno-form-config.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class NgDynoFormComponent {
    private fb;
    config: DynoFormConfig[] | any;
    mainClass: any;
    mode: 'light' | 'dark';
    callBack: EventEmitter<any>;
    dynamicForm: FormGroup;
    passwordVisibility: {
        [fieldName: string]: boolean;
    };
    requiredFields: {
        [fieldName: string]: boolean;
    };
    selectList: {
        [fieldName: string]: any[];
    };
    nonFormTypes: string[];
    constructor(fb: FormBuilder);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    buildForm(): void;
    get controls(): {
        [key: string]: import("@angular/forms").AbstractControl<any, any>;
    };
    get allKeys(): string[];
    get rawValues(): any;
    get formValues(): any;
    hasCtrl: (ctrl: any) => boolean;
    hasAllKeys: (arr: any[]) => boolean;
    filterConfig: (key: any, val?: any, bool?: boolean) => any;
    getTypeKeys: (type: any, value?: any, bool?: boolean) => any;
    getTypeValues: (type: any, value?: any, bool?: boolean) => any;
    addValidation(validation: any[], ...ctrls: string[]): void;
    clearValidation(...ctrls: string[]): void;
    setValue(ctrl: string, value: any): void;
    patchValue(obj: any): void;
    resetValue(type: 'section' | 'all', ...ctrls: any): void;
    disableField(...ctrls: any): void;
    enableField(...ctrls: any): void;
    sectionValidator(section?: string): any;
    sectionSubmit(section: string): {
        valid: any;
        values: any;
    };
    eventCall(e: any, type: string, section: any, name: string, submit?: any): void;
    onFileSelected(event: any, section: any, name: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgDynoFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgDynoFormComponent, "dyno-form", never, { "config": { "alias": "config"; "required": false; }; "mainClass": { "alias": "mainClass"; "required": false; }; "mode": { "alias": "mode"; "required": false; }; }, { "callBack": "callBack"; }, never, ["*"], false, never>;
}
