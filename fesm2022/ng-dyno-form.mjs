import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Component, Input, Output, NgModule } from '@angular/core';
import * as i1 from '@angular/forms';
import { Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3 from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import * as i4 from '@ng-select/ng-select';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class NgDynoFormService {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.7", ngImport: i0, type: NgDynoFormService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.7", ngImport: i0, type: NgDynoFormService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.7", ngImport: i0, type: NgDynoFormService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class NgDynoFormComponent {
    constructor(fb) {
        this.fb = fb;
        this.mode = 'light';
        this.callBack = new EventEmitter();
        this.passwordVisibility = {};
        this.requiredFields = {};
        this.selectList = {};
        this.nonFormTypes = ['button', 'heading'];
        this.hasCtrl = (ctrl) => this.allKeys.includes(ctrl);
        this.hasAllKeys = (arr) => arr.every(elem => this.allKeys.includes(elem));
        this.filterConfig = (key, val, bool) => this.config.filter((ele) => val ? ele[key] === val : (bool ? ele[key] : !ele[key]));
        this.getTypeKeys = (type, value, bool) => (this.filterConfig(type, value, bool)).map((ele) => ele['name']);
        this.getTypeValues = (type, value, bool) => this.getTypeKeys(type, value, bool).reduce((acc, key) => (this.rawValues.hasOwnProperty(key) ? { ...acc, [key]: this.rawValues[key] } : acc), {});
        this.dynamicForm = this.fb.group({});
    }
    ngOnInit() {
        this.buildForm();
    }
    ngOnChanges(changes) {
        if (changes['config']) {
            this.buildForm();
        }
    }
    buildForm() {
        this.dynamicForm = this.fb.group({});
        if (this.config && this.config?.length) {
            this.config.forEach((field) => {
                if (field.name && !this.nonFormTypes.includes(field.type)) {
                    let validators = [];
                    field?.required ? validators.push(Validators.required) : null;
                    field?.pattern ? validators.push(Validators.pattern(field.pattern)) : null;
                    this.dynamicForm.addControl(field.name, new FormControl({ value: field.value || null, disabled: field.disable || false }, validators));
                    if (field.type === 'file')
                        this.dynamicForm.addControl(field.name + '_name', new FormControl(field?.extra?.fileName || null));
                    if (field.type === 'password')
                        this.passwordVisibility[field.name] = false;
                    if (field.type === 'select')
                        this.selectList[field.name] = field?.extra?.options || [];
                    if (field.name)
                        this.requiredFields[field.name] = field?.required || false;
                }
            });
        }
    }
    get controls() { return this.dynamicForm.controls; }
    get allKeys() { return Object.keys(this.dynamicForm.getRawValue()); }
    get rawValues() { return this.dynamicForm.getRawValue(); }
    get formValues() { return this.dynamicForm.value; }
    addValidation(validation, ...ctrls) {
        ctrls.forEach((ctrl) => {
            if (this.hasCtrl(ctrl)) {
                this.dynamicForm.get(ctrl)?.addValidators(validation);
                this.dynamicForm.get(ctrl)?.updateValueAndValidity();
                if (this.dynamicForm.get(ctrl)?.validator)
                    this.requiredFields[ctrl] = true;
            }
        });
    }
    clearValidation(...ctrls) {
        ctrls.forEach((ctrl) => {
            if (this.hasCtrl(ctrl)) {
                this.dynamicForm.get(ctrl)?.clearValidators();
                this.dynamicForm.get(ctrl)?.updateValueAndValidity();
                this.requiredFields[ctrl] = false;
            }
        });
    }
    setValue(ctrl, value) {
        if (this.hasCtrl(ctrl)) {
            this.dynamicForm.get(ctrl)?.setValue(value);
            this.dynamicForm.get(ctrl)?.updateValueAndValidity();
        }
    }
    patchValue(obj) {
        if (obj && this.hasAllKeys(Object.keys(obj))) {
            this.dynamicForm.patchValue(obj);
        }
    }
    resetValue(type, ...ctrls) {
        if (type === 'section') {
            let section = arguments.length === 2 ? ctrls[0] : '';
            let controls = this.filterConfig('section', section ? section : undefined, false).map((e) => e.name);
            controls?.forEach((ctrl) => {
                this.setValue(ctrl, null);
            });
        }
        else {
            if (ctrls?.length === 1 && !ctrls[0])
                this.dynamicForm.reset();
            else {
                ctrls.forEach((ctrl) => {
                    if (this.hasCtrl(ctrl))
                        this.setValue(ctrl, null);
                });
            }
        }
    }
    disableField(...ctrls) {
        if (ctrls?.length === 1 && ctrls[0] === 'all')
            ctrls = Object.keys(this.dynamicForm.getRawValue());
        ctrls.forEach((ctrl) => {
            if (this.hasCtrl(ctrl)) {
                this.dynamicForm.get(ctrl)?.disable();
            }
        });
    }
    enableField(...ctrls) {
        if (ctrls?.length === 1 && ctrls[0] === 'all')
            ctrls = Object.keys(this.dynamicForm.getRawValue());
        ctrls.forEach((ctrl) => {
            if (this.hasCtrl(ctrl)) {
                this.dynamicForm.get(ctrl)?.enable();
            }
        });
    }
    sectionValidator(section) {
        if (section || section === '') {
            let ctrls = this.filterConfig('section', section ? section : undefined, false).map((e) => e.name);
            ctrls?.forEach((ctrl) => {
                this.dynamicForm.get(ctrl)?.markAsTouched();
            });
            return ctrls?.every((ctrl) => this.dynamicForm?.get(ctrl)?.valid);
        }
        else {
            this.dynamicForm.markAllAsTouched();
            return this.dynamicForm.valid;
        }
    }
    sectionSubmit(section) {
        let valid = this.sectionValidator(section);
        return {
            valid: valid,
            values: (section || section === '') ? this.getTypeValues('section', section ? section : undefined, false) : this.rawValues
        };
    }
    eventCall(e, type, section, name, submit) {
        let values = null;
        if (submit) {
            values = this.sectionSubmit(section);
        }
        this.callBack.emit({
            event: submit ? values : e,
            type: type,
            section: section,
            name: name
        });
    }
    onFileSelected(event, section, name) {
        let config = this.config.find((e) => e.name === name);
        const file = event.target.files[0];
        if (file && config && (config?.extra?.format?.includes(file.type) || !config?.extra?.format)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.setValue(name, e.target.result);
                this.setValue(name + '_name', file.name);
            };
            reader.readAsDataURL(file);
        }
        else {
            this.setValue(name, '');
            this.setValue(name + '_name', '');
            event.target.value = null;
        }
        this.eventCall(event, 'file', section, name);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.7", ngImport: i0, type: NgDynoFormComponent, deps: [{ token: i1.FormBuilder }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.7", type: NgDynoFormComponent, selector: "dyno-form", inputs: { config: "config", mainClass: "mainClass", mode: "mode" }, outputs: { callBack: "callBack" }, usesOnChanges: true, ngImport: i0, template: "<!-- Form Element -->\r\n<form [formGroup]=\"dynamicForm\" [attr.data-bs-theme]=\"mode\">\r\n  <div class=\"{{ mainClass }}\">\r\n    <!-- Loop through form fields -->\r\n    <ng-container *ngFor=\"let field of config; let i = index\">\r\n      <div *ngIf=\"!field.condition || field.condition(dynamicForm.value)\" class=\"{{ field.parentClass }} {{['file',\r\n      'password'].includes(field.type)?'position-relative':''}}\">\r\n        <!-- Label for form types non floating -->\r\n        <label *ngIf=\"!nonFormTypes.includes(field.type) && field.label && !field.floatLabel\" class=\"{{ field.labelClass }}\">\r\n          {{ field.label }}\r\n          <span style=\"color: red;\" *ngIf=\"requiredFields[field.name] && !field.hideAsterisk\">*</span>\r\n        </label>\r\n        <!-- Check for checkbox type -->\r\n        <ng-container *ngIf=\"field.type === 'checkbox'\">\r\n          <input\r\n            [formControlName]=\"field.name\"\r\n            type=\"checkbox\"\r\n            class=\"{{ field.class }}\"\r\n            (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n          />\r\n        </ng-container>\r\n        <!-- Input fields for text, number, email, password -->\r\n        <ng-container *ngIf=\"['text', 'number', 'email', 'password'].includes(field.type)\">\r\n          <input required\r\n            [formControlName]=\"field.name\" [placeholder]=\"field?.placeholder||''\"\r\n            [type]=\"field.type === 'password' ? (passwordVisibility[field.name] ? 'text' : 'password') : field.type\"\r\n            class=\"{{ field.class }} {{field.type === 'password'?'password':''}}\"\r\n            (input)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n            (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n            (blur)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n          />\r\n          <span class=\"view-icon\" *ngIf=\"field.type === 'password' && !field?.extra?.hideEye\" (click)=\"passwordVisibility[field.name] = !passwordVisibility[field.name]\"\r\n            [ngClass]=\"!passwordVisibility[field.name] ? 'eye' : 'eye-slash'\" style=\"cursor: pointer;\">\r\n            <svg xmlns=\"http://www.w3.org/2000/svg\" *ngIf=\"!passwordVisibility[field.name]\" viewBox=\"0 0 256 256\"><g fill=\"currentColor\"><path d=\"M128 56c-80 0-112 72-112 72s32 72 112 72s112-72 112-72s-32-72-112-72Zm0 112a40 40 0 1 1 40-40a40 40 0 0 1-40 40Z\" opacity=\".2\"/><path d=\"M247.31 124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57 61.26 162.88 48 128 48S61.43 61.26 36.34 86.35C17.51 105.18 9 124 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208s66.57-13.26 91.66-38.34c18.83-18.83 27.3-37.61 27.65-38.4a8 8 0 0 0 0-6.5ZM128 192c-30.78 0-57.67-11.19-79.93-33.25A133.47 133.47 0 0 1 25 128a133.33 133.33 0 0 1 23.07-30.75C70.33 75.19 97.22 64 128 64s57.67 11.19 79.93 33.25A133.46 133.46 0 0 1 231.05 128c-7.21 13.46-38.62 64-103.05 64Zm0-112a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48Zm0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32Z\"/></g></svg>\r\n            <svg xmlns=\"http://www.w3.org/2000/svg\" *ngIf=\"passwordVisibility[field.name]\" viewBox=\"0 0 256 256\"><g fill=\"currentColor\"><path d=\"M128 56c-80 0-112 72-112 72s32 72 112 72s112-72 112-72s-32-72-112-72Zm0 112a40 40 0 1 1 40-40a40 40 0 0 1-40 40Z\" opacity=\".2\"/><path d=\"M53.92 34.62a8 8 0 1 0-11.84 10.76l19.24 21.17C25 88.84 9.38 123.2 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208a127.11 127.11 0 0 0 52.07-10.83l22 24.21a8 8 0 1 0 11.84-10.76Zm47.33 75.84l41.67 45.85a32 32 0 0 1-41.67-45.85ZM128 192c-30.78 0-57.67-11.19-79.93-33.25A133.16 133.16 0 0 1 25 128c4.69-8.79 19.66-33.39 47.35-49.38l18 19.75a48 48 0 0 0 63.66 70l14.73 16.2A112 112 0 0 1 128 192Zm6-95.43a8 8 0 0 1 3-15.72a48.16 48.16 0 0 1 38.77 42.64a8 8 0 0 1-7.22 8.71a6.39 6.39 0 0 1-.75 0a8 8 0 0 1-8-7.26A32.09 32.09 0 0 0 134 96.57Zm113.28 34.69c-.42.94-10.55 23.37-33.36 43.8a8 8 0 1 1-10.67-11.92a132.77 132.77 0 0 0 27.8-35.14a133.15 133.15 0 0 0-23.12-30.77C185.67 75.19 158.78 64 128 64a118.37 118.37 0 0 0-19.36 1.57A8 8 0 1 1 106 49.79A134 134 0 0 1 128 48c34.88 0 66.57 13.26 91.66 38.35c18.83 18.83 27.3 37.62 27.65 38.41a8 8 0 0 1 0 6.5Z\"/></g></svg>\r\n          </span>\r\n        </ng-container>\r\n        <!-- Textarea field -->\r\n        <ng-container *ngIf=\"field.type === 'textarea'\">\r\n          <textarea required\r\n            [formControlName]=\"field.name\"\r\n            class=\"{{ field.class }}\" [placeholder]=\"field?.placeholder||''\"\r\n            rows=\"{{ field?.extra?.rows || 1 }}\"\r\n            (input)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n            (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n            (blur)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n          ></textarea>\r\n        </ng-container>\r\n        <!-- Select dropdown -->\r\n        <ng-container *ngIf=\"field.type === 'select'\">\r\n          <!-- Dropdown component with various event listeners -->\r\n          <ng-select #select\r\n            [formControlName]=\"field.name\"\r\n            class=\"{{ field.class }}\" [placeholder]=\"field?.placeholder||''\"\r\n            [items]=\"selectList[field.name]\"\r\n            [multiple]=\"field?.extra?.multi || false\"\r\n            [bindLabel]=\"field?.extra?.label || ''\"\r\n            [bindValue]=\"field?.extra?.key || ''\"\r\n            [searchable]=\"false\"\r\n            (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n            (close)=\"eventCall($event, 'close', field?.section, field.name)\"\r\n            (open)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n            (clear)=\"eventCall($event, 'clear', field?.section, field.name)\"\r\n            (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n            (search)=\"eventCall($event, 'search', field?.section, field.name)\"\r\n            (blur)=\"eventCall($event, 'blur', field?.section, field.name)\"\r\n          >\r\n            <!-- Custom search input -->\r\n            <ng-template ng-header-tmp>\r\n              <input #check style=\"width: 100%; line-height: 24px;\" type=\"text\" name=\"type\" placeholder=\"Search Key\"\r\n                (input)=\"select.filter(check.value)\" />\r\n            </ng-template>\r\n          </ng-select>\r\n        </ng-container>\r\n        <!-- Heading -->\r\n        <ng-container *ngIf=\"field.type === 'heading'\">\r\n          <div class=\"{{ field.class }}\" [innerHTML]=\"field.label\"></div>\r\n        </ng-container>\r\n        <!-- Radio buttons -->\r\n        <ng-container *ngIf=\"field.type === 'radio'\">\r\n          <div class=\"{{ field?.extra?.customClass }}\">\r\n            <ng-container *ngFor=\"let item of field?.extra?.options || []\">\r\n              <div class=\"{{ field.class }}\">\r\n                <input\r\n                  [formControlName]=\"field.name\"\r\n                  type=\"radio\"\r\n                  id=\"radio-{{ i }}\"\r\n                  class=\"{{ field.class }}-input\"\r\n                  [value]=\"field?.extra?.key ? item[field.extra?.key || ''] : item\"\r\n                  (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n                />\r\n                <label class=\"{{ field.class }}-label\" for=\"radio-{{ i }}\">\r\n                  {{ field?.extra?.label ? item[field.extra?.label || ''] : item }}\r\n                </label>\r\n              </div>\r\n            </ng-container>\r\n          </div>\r\n        </ng-container>\r\n        <!-- Date input -->\r\n        <ng-container *ngIf=\"field.type === 'date'\">\r\n          <input type=\"text\" required\r\n            [formControlName]=\"field.name\"\r\n            class=\"{{ field.class }}\"\r\n            [placeholder]=\"field?.placeholder||''\"\r\n            [bsConfig]=\"{\r\n              dateInputFormat: field?.extra?.format || 'DD-MM-YYYY',\r\n              adaptivePosition: true,\r\n              containerClass: field?.extra?.theme || 'theme-dark-blue',\r\n              minMode: field?.extra?.mode || 'day'\r\n            }\"\r\n            [minDate]=\"field?.extra?.minDate || undefined\"\r\n            [maxDate]=\"field?.extra?.maxDate || undefined\"\r\n            (bsValueChange)=\"eventCall($event, 'date', field?.section, field.name)\"\r\n            bsDatepicker>\r\n        </ng-container>\r\n        <!-- Date range input -->\r\n        <ng-container *ngIf=\"field.type === 'daterange'\">\r\n          <input type=\"text\" required\r\n            [formControlName]=\"field.name\"\r\n            class=\"{{ field.class }}\"\r\n            [placeholder]=\"field?.placeholder||''\"\r\n            [bsConfig]=\"{\r\n              rangeInputFormat: field?.extra?.format || 'DD-MM-YYYY',\r\n              adaptivePosition: true,\r\n              containerClass: field?.extra?.theme || 'theme-dark-blue',\r\n              minMode: field?.extra?.mode || 'day'\r\n            }\"\r\n            [minDate]=\"field?.extra?.minDate || undefined\"\r\n            [maxDate]=\"field?.extra?.maxDate || undefined\"\r\n            (bsValueChange)=\"eventCall($event, 'date', field?.section, field.name)\"\r\n            bsDaterangepicker>\r\n        </ng-container>\r\n        <!-- File input -->\r\n        <ng-container *ngIf=\"field.type === 'file'\">\r\n          <input\r\n            [type]=\"'file'\"\r\n            id=\"fileInput-{{ i }}\"\r\n            class=\"{{ field.class }} {{ field?.extra?.customText ? 'd-none' : '' }}\"\r\n            (change)=\"onFileSelected($event, field?.section, field.name)\"\r\n            [accept]=\"field?.extra?.format\"\r\n            [disabled]=\"field.disable\">\r\n          <label\r\n            for=\"fileInput-{{ i }}\"\r\n            class=\"{{ field?.extra?.customClass }} {{ field.disable ? 'disabled' : '' }}\"\r\n            *ngIf=\"field?.extra?.customClass\">\r\n            {{ dynamicForm.get(field.name + '_name')?.value ? dynamicForm.get(field.name + '_name')?.value : (field?.extra?.customText || 'No file chosen') }}\r\n          </label>\r\n        </ng-container>\r\n        <!-- Button -->\r\n        <ng-container *ngIf=\"field.type === 'button'\">\r\n          <button class=\"{{ field.class }}\" (click)=\"eventCall($event, 'click', field?.section, field.name, field?.extra?.submit || false)\">\r\n            {{ field.label }}\r\n          </button>\r\n        </ng-container>\r\n        <!-- Label for form types floating -->\r\n        <label *ngIf=\"!nonFormTypes.includes(field.type) && field.label && field.floatLabel\" class=\"{{ field.labelClass }}\">\r\n          {{ field.label }}\r\n          <span style=\"color: red;\" *ngIf=\"requiredFields[field.name] && !field.hideAsterisk\">*</span>\r\n        </label>\r\n        <!-- Validation error messages -->\r\n        <div *ngIf=\"!controls[field.name]?.valid && controls[field.name]?.touched && field?.extra?.validationMessages\"\r\n          class=\"validation-error\">\r\n          <span class=\"text-danger\" *ngIf=\"controls[field.name]?.errors?.['required']\">\r\n            {{ field?.extra?.validationMessages?.required }}\r\n          </span>\r\n          <span class=\"text-danger\" *ngIf=\"controls[field.name]?.errors?.['pattern']\">\r\n            {{ field?.extra?.validationMessages?.pattern }}\r\n          </span>\r\n        </div>\r\n      </div>\r\n    </ng-container>\r\n    <ng-content></ng-content>\r\n  </div>\r\n</form>\r\n", styles: [".was-validated .form-control:invalid,.form-control.is-invalid,.form-control.ng-touched.ng-invalid,.form-select.ng-touched.ng-invalid{border-color:red;padding-right:calc(1.5em + .75rem);background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e\");background-repeat:no-repeat;background-position:right calc(.375em + .1875rem) center;background-size:calc(.75em + .375rem) calc(.75em + .375rem)}.password.form-control.ng-touched.ng-invalid,input[bsDatepicker].form-control.ng-touched.ng-invalid{background-image:unset}.form-check-input.ng-touched.ng-invalid+label{color:red}::ng-deep .ng-select .ng-select-container{border-color:#e2e5ec;border-radius:.25rem!important}::ng-deep .ng-select .ng-select-container .ng-arrow-wrapper .ng-arrow{background-image:url(data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E);background-size:cover;background-position:center;width:9px;height:9px;background-repeat:no-repeat;border:none}::ng-deep .ng-select.ng-select-opened .ng-arrow-wrapper{top:2px}::ng-deep .ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{background-size:cover;background-position:center}::ng-deep .ng-select.ng-invalid.ng-touched .ng-select-container{border-color:red!important}.validation-error{font-size:12px}.disabled{cursor:not-allowed}.view-icon{position:absolute;bottom:0;transform:translateY(-50%);right:20px;padding-top:0;padding-bottom:0;width:20px}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i1.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i3.BsDatepickerDirective, selector: "[bsDatepicker]", inputs: ["placement", "triggers", "outsideClick", "container", "outsideEsc", "isDisabled", "minDate", "maxDate", "minMode", "daysDisabled", "datesDisabled", "datesEnabled", "dateCustomClasses", "dateTooltipTexts", "isOpen", "bsValue", "bsConfig"], outputs: ["onShown", "onHidden", "bsValueChange"], exportAs: ["bsDatepicker"] }, { kind: "directive", type: i3.BsDatepickerInputDirective, selector: "input[bsDatepicker]" }, { kind: "directive", type: i3.BsDaterangepickerDirective, selector: "[bsDaterangepicker]", inputs: ["placement", "triggers", "outsideClick", "container", "outsideEsc", "isOpen", "bsValue", "bsConfig", "isDisabled", "minDate", "maxDate", "dateCustomClasses", "daysDisabled", "datesDisabled", "datesEnabled"], outputs: ["onShown", "onHidden", "bsValueChange"], exportAs: ["bsDaterangepicker"] }, { kind: "directive", type: i3.BsDaterangepickerInputDirective, selector: "input[bsDaterangepicker]" }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["bindLabel", "bindValue", "markFirst", "placeholder", "notFoundText", "typeToSearchText", "addTagText", "loadingText", "clearAllText", "appearance", "dropdownPosition", "appendTo", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "keyDownFn", "typeahead", "multiple", "addTag", "searchable", "clearable", "isOpen", "items", "compareWith", "clearSearchOnAdd", "deselectOnClick"], outputs: ["blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"] }, { kind: "directive", type: i4.NgHeaderTemplateDirective, selector: "[ng-header-tmp]" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.7", ngImport: i0, type: NgDynoFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dyno-form', template: "<!-- Form Element -->\r\n<form [formGroup]=\"dynamicForm\" [attr.data-bs-theme]=\"mode\">\r\n  <div class=\"{{ mainClass }}\">\r\n    <!-- Loop through form fields -->\r\n    <ng-container *ngFor=\"let field of config; let i = index\">\r\n      <div *ngIf=\"!field.condition || field.condition(dynamicForm.value)\" class=\"{{ field.parentClass }} {{['file',\r\n      'password'].includes(field.type)?'position-relative':''}}\">\r\n        <!-- Label for form types non floating -->\r\n        <label *ngIf=\"!nonFormTypes.includes(field.type) && field.label && !field.floatLabel\" class=\"{{ field.labelClass }}\">\r\n          {{ field.label }}\r\n          <span style=\"color: red;\" *ngIf=\"requiredFields[field.name] && !field.hideAsterisk\">*</span>\r\n        </label>\r\n        <!-- Check for checkbox type -->\r\n        <ng-container *ngIf=\"field.type === 'checkbox'\">\r\n          <input\r\n            [formControlName]=\"field.name\"\r\n            type=\"checkbox\"\r\n            class=\"{{ field.class }}\"\r\n            (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n          />\r\n        </ng-container>\r\n        <!-- Input fields for text, number, email, password -->\r\n        <ng-container *ngIf=\"['text', 'number', 'email', 'password'].includes(field.type)\">\r\n          <input required\r\n            [formControlName]=\"field.name\" [placeholder]=\"field?.placeholder||''\"\r\n            [type]=\"field.type === 'password' ? (passwordVisibility[field.name] ? 'text' : 'password') : field.type\"\r\n            class=\"{{ field.class }} {{field.type === 'password'?'password':''}}\"\r\n            (input)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n            (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n            (blur)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n          />\r\n          <span class=\"view-icon\" *ngIf=\"field.type === 'password' && !field?.extra?.hideEye\" (click)=\"passwordVisibility[field.name] = !passwordVisibility[field.name]\"\r\n            [ngClass]=\"!passwordVisibility[field.name] ? 'eye' : 'eye-slash'\" style=\"cursor: pointer;\">\r\n            <svg xmlns=\"http://www.w3.org/2000/svg\" *ngIf=\"!passwordVisibility[field.name]\" viewBox=\"0 0 256 256\"><g fill=\"currentColor\"><path d=\"M128 56c-80 0-112 72-112 72s32 72 112 72s112-72 112-72s-32-72-112-72Zm0 112a40 40 0 1 1 40-40a40 40 0 0 1-40 40Z\" opacity=\".2\"/><path d=\"M247.31 124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57 61.26 162.88 48 128 48S61.43 61.26 36.34 86.35C17.51 105.18 9 124 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208s66.57-13.26 91.66-38.34c18.83-18.83 27.3-37.61 27.65-38.4a8 8 0 0 0 0-6.5ZM128 192c-30.78 0-57.67-11.19-79.93-33.25A133.47 133.47 0 0 1 25 128a133.33 133.33 0 0 1 23.07-30.75C70.33 75.19 97.22 64 128 64s57.67 11.19 79.93 33.25A133.46 133.46 0 0 1 231.05 128c-7.21 13.46-38.62 64-103.05 64Zm0-112a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48Zm0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32Z\"/></g></svg>\r\n            <svg xmlns=\"http://www.w3.org/2000/svg\" *ngIf=\"passwordVisibility[field.name]\" viewBox=\"0 0 256 256\"><g fill=\"currentColor\"><path d=\"M128 56c-80 0-112 72-112 72s32 72 112 72s112-72 112-72s-32-72-112-72Zm0 112a40 40 0 1 1 40-40a40 40 0 0 1-40 40Z\" opacity=\".2\"/><path d=\"M53.92 34.62a8 8 0 1 0-11.84 10.76l19.24 21.17C25 88.84 9.38 123.2 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208a127.11 127.11 0 0 0 52.07-10.83l22 24.21a8 8 0 1 0 11.84-10.76Zm47.33 75.84l41.67 45.85a32 32 0 0 1-41.67-45.85ZM128 192c-30.78 0-57.67-11.19-79.93-33.25A133.16 133.16 0 0 1 25 128c4.69-8.79 19.66-33.39 47.35-49.38l18 19.75a48 48 0 0 0 63.66 70l14.73 16.2A112 112 0 0 1 128 192Zm6-95.43a8 8 0 0 1 3-15.72a48.16 48.16 0 0 1 38.77 42.64a8 8 0 0 1-7.22 8.71a6.39 6.39 0 0 1-.75 0a8 8 0 0 1-8-7.26A32.09 32.09 0 0 0 134 96.57Zm113.28 34.69c-.42.94-10.55 23.37-33.36 43.8a8 8 0 1 1-10.67-11.92a132.77 132.77 0 0 0 27.8-35.14a133.15 133.15 0 0 0-23.12-30.77C185.67 75.19 158.78 64 128 64a118.37 118.37 0 0 0-19.36 1.57A8 8 0 1 1 106 49.79A134 134 0 0 1 128 48c34.88 0 66.57 13.26 91.66 38.35c18.83 18.83 27.3 37.62 27.65 38.41a8 8 0 0 1 0 6.5Z\"/></g></svg>\r\n          </span>\r\n        </ng-container>\r\n        <!-- Textarea field -->\r\n        <ng-container *ngIf=\"field.type === 'textarea'\">\r\n          <textarea required\r\n            [formControlName]=\"field.name\"\r\n            class=\"{{ field.class }}\" [placeholder]=\"field?.placeholder||''\"\r\n            rows=\"{{ field?.extra?.rows || 1 }}\"\r\n            (input)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n            (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n            (blur)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n          ></textarea>\r\n        </ng-container>\r\n        <!-- Select dropdown -->\r\n        <ng-container *ngIf=\"field.type === 'select'\">\r\n          <!-- Dropdown component with various event listeners -->\r\n          <ng-select #select\r\n            [formControlName]=\"field.name\"\r\n            class=\"{{ field.class }}\" [placeholder]=\"field?.placeholder||''\"\r\n            [items]=\"selectList[field.name]\"\r\n            [multiple]=\"field?.extra?.multi || false\"\r\n            [bindLabel]=\"field?.extra?.label || ''\"\r\n            [bindValue]=\"field?.extra?.key || ''\"\r\n            [searchable]=\"false\"\r\n            (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n            (close)=\"eventCall($event, 'close', field?.section, field.name)\"\r\n            (open)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n            (clear)=\"eventCall($event, 'clear', field?.section, field.name)\"\r\n            (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n            (search)=\"eventCall($event, 'search', field?.section, field.name)\"\r\n            (blur)=\"eventCall($event, 'blur', field?.section, field.name)\"\r\n          >\r\n            <!-- Custom search input -->\r\n            <ng-template ng-header-tmp>\r\n              <input #check style=\"width: 100%; line-height: 24px;\" type=\"text\" name=\"type\" placeholder=\"Search Key\"\r\n                (input)=\"select.filter(check.value)\" />\r\n            </ng-template>\r\n          </ng-select>\r\n        </ng-container>\r\n        <!-- Heading -->\r\n        <ng-container *ngIf=\"field.type === 'heading'\">\r\n          <div class=\"{{ field.class }}\" [innerHTML]=\"field.label\"></div>\r\n        </ng-container>\r\n        <!-- Radio buttons -->\r\n        <ng-container *ngIf=\"field.type === 'radio'\">\r\n          <div class=\"{{ field?.extra?.customClass }}\">\r\n            <ng-container *ngFor=\"let item of field?.extra?.options || []\">\r\n              <div class=\"{{ field.class }}\">\r\n                <input\r\n                  [formControlName]=\"field.name\"\r\n                  type=\"radio\"\r\n                  id=\"radio-{{ i }}\"\r\n                  class=\"{{ field.class }}-input\"\r\n                  [value]=\"field?.extra?.key ? item[field.extra?.key || ''] : item\"\r\n                  (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n                />\r\n                <label class=\"{{ field.class }}-label\" for=\"radio-{{ i }}\">\r\n                  {{ field?.extra?.label ? item[field.extra?.label || ''] : item }}\r\n                </label>\r\n              </div>\r\n            </ng-container>\r\n          </div>\r\n        </ng-container>\r\n        <!-- Date input -->\r\n        <ng-container *ngIf=\"field.type === 'date'\">\r\n          <input type=\"text\" required\r\n            [formControlName]=\"field.name\"\r\n            class=\"{{ field.class }}\"\r\n            [placeholder]=\"field?.placeholder||''\"\r\n            [bsConfig]=\"{\r\n              dateInputFormat: field?.extra?.format || 'DD-MM-YYYY',\r\n              adaptivePosition: true,\r\n              containerClass: field?.extra?.theme || 'theme-dark-blue',\r\n              minMode: field?.extra?.mode || 'day'\r\n            }\"\r\n            [minDate]=\"field?.extra?.minDate || undefined\"\r\n            [maxDate]=\"field?.extra?.maxDate || undefined\"\r\n            (bsValueChange)=\"eventCall($event, 'date', field?.section, field.name)\"\r\n            bsDatepicker>\r\n        </ng-container>\r\n        <!-- Date range input -->\r\n        <ng-container *ngIf=\"field.type === 'daterange'\">\r\n          <input type=\"text\" required\r\n            [formControlName]=\"field.name\"\r\n            class=\"{{ field.class }}\"\r\n            [placeholder]=\"field?.placeholder||''\"\r\n            [bsConfig]=\"{\r\n              rangeInputFormat: field?.extra?.format || 'DD-MM-YYYY',\r\n              adaptivePosition: true,\r\n              containerClass: field?.extra?.theme || 'theme-dark-blue',\r\n              minMode: field?.extra?.mode || 'day'\r\n            }\"\r\n            [minDate]=\"field?.extra?.minDate || undefined\"\r\n            [maxDate]=\"field?.extra?.maxDate || undefined\"\r\n            (bsValueChange)=\"eventCall($event, 'date', field?.section, field.name)\"\r\n            bsDaterangepicker>\r\n        </ng-container>\r\n        <!-- File input -->\r\n        <ng-container *ngIf=\"field.type === 'file'\">\r\n          <input\r\n            [type]=\"'file'\"\r\n            id=\"fileInput-{{ i }}\"\r\n            class=\"{{ field.class }} {{ field?.extra?.customText ? 'd-none' : '' }}\"\r\n            (change)=\"onFileSelected($event, field?.section, field.name)\"\r\n            [accept]=\"field?.extra?.format\"\r\n            [disabled]=\"field.disable\">\r\n          <label\r\n            for=\"fileInput-{{ i }}\"\r\n            class=\"{{ field?.extra?.customClass }} {{ field.disable ? 'disabled' : '' }}\"\r\n            *ngIf=\"field?.extra?.customClass\">\r\n            {{ dynamicForm.get(field.name + '_name')?.value ? dynamicForm.get(field.name + '_name')?.value : (field?.extra?.customText || 'No file chosen') }}\r\n          </label>\r\n        </ng-container>\r\n        <!-- Button -->\r\n        <ng-container *ngIf=\"field.type === 'button'\">\r\n          <button class=\"{{ field.class }}\" (click)=\"eventCall($event, 'click', field?.section, field.name, field?.extra?.submit || false)\">\r\n            {{ field.label }}\r\n          </button>\r\n        </ng-container>\r\n        <!-- Label for form types floating -->\r\n        <label *ngIf=\"!nonFormTypes.includes(field.type) && field.label && field.floatLabel\" class=\"{{ field.labelClass }}\">\r\n          {{ field.label }}\r\n          <span style=\"color: red;\" *ngIf=\"requiredFields[field.name] && !field.hideAsterisk\">*</span>\r\n        </label>\r\n        <!-- Validation error messages -->\r\n        <div *ngIf=\"!controls[field.name]?.valid && controls[field.name]?.touched && field?.extra?.validationMessages\"\r\n          class=\"validation-error\">\r\n          <span class=\"text-danger\" *ngIf=\"controls[field.name]?.errors?.['required']\">\r\n            {{ field?.extra?.validationMessages?.required }}\r\n          </span>\r\n          <span class=\"text-danger\" *ngIf=\"controls[field.name]?.errors?.['pattern']\">\r\n            {{ field?.extra?.validationMessages?.pattern }}\r\n          </span>\r\n        </div>\r\n      </div>\r\n    </ng-container>\r\n    <ng-content></ng-content>\r\n  </div>\r\n</form>\r\n", styles: [".was-validated .form-control:invalid,.form-control.is-invalid,.form-control.ng-touched.ng-invalid,.form-select.ng-touched.ng-invalid{border-color:red;padding-right:calc(1.5em + .75rem);background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e\");background-repeat:no-repeat;background-position:right calc(.375em + .1875rem) center;background-size:calc(.75em + .375rem) calc(.75em + .375rem)}.password.form-control.ng-touched.ng-invalid,input[bsDatepicker].form-control.ng-touched.ng-invalid{background-image:unset}.form-check-input.ng-touched.ng-invalid+label{color:red}::ng-deep .ng-select .ng-select-container{border-color:#e2e5ec;border-radius:.25rem!important}::ng-deep .ng-select .ng-select-container .ng-arrow-wrapper .ng-arrow{background-image:url(data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E);background-size:cover;background-position:center;width:9px;height:9px;background-repeat:no-repeat;border:none}::ng-deep .ng-select.ng-select-opened .ng-arrow-wrapper{top:2px}::ng-deep .ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{background-size:cover;background-position:center}::ng-deep .ng-select.ng-invalid.ng-touched .ng-select-container{border-color:red!important}.validation-error{font-size:12px}.disabled{cursor:not-allowed}.view-icon{position:absolute;bottom:0;transform:translateY(-50%);right:20px;padding-top:0;padding-bottom:0;width:20px}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.FormBuilder }]; }, propDecorators: { config: [{
                type: Input
            }], mainClass: [{
                type: Input
            }], mode: [{
                type: Input
            }], callBack: [{
                type: Output,
                args: ['callBack']
            }] } });

class NgDynoFormModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.7", ngImport: i0, type: NgDynoFormModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.7", ngImport: i0, type: NgDynoFormModule, declarations: [NgDynoFormComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, BrowserModule, BrowserAnimationsModule, BsDatepickerModule, NgSelectModule], exports: [NgDynoFormComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.7", ngImport: i0, type: NgDynoFormModule, imports: [CommonModule, FormsModule, ReactiveFormsModule, BrowserModule, BrowserAnimationsModule, BsDatepickerModule, NgSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.7", ngImport: i0, type: NgDynoFormModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgDynoFormComponent
                    ],
                    imports: [
                        CommonModule, FormsModule, ReactiveFormsModule, BrowserModule, BrowserAnimationsModule, BsDatepickerModule, NgSelectModule
                    ],
                    exports: [
                        NgDynoFormComponent
                    ]
                }]
        }] });

/*
 * Public API Surface of ng-dyno-form
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgDynoFormComponent, NgDynoFormModule, NgDynoFormService };
//# sourceMappingURL=ng-dyno-form.mjs.map
