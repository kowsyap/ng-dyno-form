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
                    field.required ? validators.push(Validators.required) : null;
                    field.pattern ? validators.push(Validators.pattern(field.pattern)) : null;
                    this.dynamicForm.addControl(field.name, new FormControl({ value: field.value || null, disabled: field.disable || false }, validators));
                    if (field.type === 'file')
                        this.dynamicForm.addControl(field.name + '_name', new FormControl(field?.extra?.fileName || null));
                    if (field.type === 'password')
                        this.passwordVisibility[field.name] = false;
                    if (field.type === 'select')
                        this.selectList[field.name] = field?.extra?.options || [];
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
            }
        });
    }
    clearValidation(...ctrls) {
        ctrls.forEach((ctrl) => {
            if (this.hasCtrl(ctrl)) {
                this.dynamicForm.get(ctrl)?.clearValidators();
                this.dynamicForm.get(ctrl)?.updateValueAndValidity();
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
    resetValue(...ctrls) {
        if (ctrls === 'all')
            this.dynamicForm.reset();
        else {
            ctrls.forEach((ctrl) => {
                if (this.hasCtrl(ctrl))
                    this.setValue(ctrl, null);
            });
        }
    }
    disableField(...ctrls) {
        if (ctrls === 'all')
            ctrls = Object.keys(this.dynamicForm.getRawValue());
        ctrls.forEach((ctrl) => {
            if (this.hasCtrl(ctrl)) {
                this.dynamicForm.get(ctrl)?.disable();
            }
        });
    }
    enableField(...ctrls) {
        if (ctrls === 'all')
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
    formsubmit() {
        this.dynamicForm.markAllAsTouched();
        return {
            valid: this.dynamicForm.valid,
            values: this.rawValues
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.7", type: NgDynoFormComponent, selector: "dyno-form", inputs: { config: "config", mainClass: "mainClass", mode: "mode" }, outputs: { callBack: "callBack" }, usesOnChanges: true, ngImport: i0, template: "<!-- Form Element -->\r\n<form [formGroup]=\"dynamicForm\" [attr.data-bs-theme]=\"mode\">\r\n    <div class=\"{{ mainClass }}\">\r\n      <!-- Loop through form fields -->\r\n      <ng-container *ngFor=\"let field of config; let i = index\">\r\n        <div *ngIf=\"!field.condition || field.condition(dynamicForm.value)\" class=\"{{ field.parentClass }} position-relative\">\r\n          <!-- Check for checkbox type -->\r\n          <ng-container *ngIf=\"field.type === 'checkbox'\">\r\n            <input\r\n              [formControlName]=\"field.name\"\r\n              type=\"checkbox\"\r\n              class=\"{{ field.class }}\"\r\n              (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n            />\r\n          </ng-container>\r\n          <!-- Label for non-form types -->\r\n          <label *ngIf=\"!nonFormTypes.includes(field.type) && field.label\" class=\"{{ field.labelClass }}\">\r\n            {{ field.label }}\r\n            <span style=\"color: red;\" *ngIf=\"field.required\">*</span>\r\n          </label>\r\n          <!-- Input fields for text, number, email, password -->\r\n          <ng-container *ngIf=\"['text', 'number', 'email', 'password'].includes(field.type)\">\r\n            <input\r\n              [formControlName]=\"field.name\"\r\n              [type]=\"field.type === 'password' ? (passwordVisibility[field.name] ? 'text' : 'password') : field.type\"\r\n              class=\"{{ field.class }}\"\r\n              (input)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n              (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n              (blur)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n            />\r\n            <span class=\"view-icon\" *ngIf=\"field.type === 'password'\" (click)=\"passwordVisibility[field.name] = !passwordVisibility[field.name]\"\r\n              [ngClass]=\"!passwordVisibility[field.name] ? 'eye' : 'eye-slash'\" style=\"cursor: pointer;\">\r\n              <!-- SVG icons for password visibility -->\r\n              <svg xmlns=\"http://www.w3.org/2000/svg\" *ngIf=\"!passwordVisibility[field.name]\" viewBox=\"0 0 256 256\">\r\n                <!-- Path for the eye icon -->\r\n              </svg>\r\n              <svg xmlns=\"http://www.w3.org/2000/svg\" *ngIf=\"passwordVisibility[field.name]\" viewBox=\"0 0 256 256\">\r\n                <!-- Path for the crossed eye icon -->\r\n              </svg>\r\n            </span>\r\n          </ng-container>\r\n          <!-- Textarea field -->\r\n          <ng-container *ngIf=\"field.type === 'textarea'\">\r\n            <textarea\r\n              [formControlName]=\"field.name\"\r\n              class=\"{{ field.class }}\"\r\n              rows=\"{{ field?.extra?.rows || 1 }}\"\r\n              (input)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n              (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n              (blur)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n            ></textarea>\r\n          </ng-container>\r\n          <!-- Select dropdown -->\r\n          <ng-container *ngIf=\"field.type === 'select'\">\r\n            <!-- Dropdown component with various event listeners -->\r\n            <ng-select #select\r\n              [formControlName]=\"field.name\"\r\n              class=\"{{ field.class }}\"\r\n              [items]=\"selectList[field.name]\"\r\n              [multiple]=\"field?.extra?.multi || false\"\r\n              [bindLabel]=\"field?.extra?.label || ''\"\r\n              [bindValue]=\"field?.extra?.key || ''\"\r\n              [searchable]=\"false\"\r\n              (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n              (close)=\"eventCall($event, 'close', field?.section, field.name)\"\r\n              (open)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n              (clear)=\"eventCall($event, 'clear', field?.section, field.name)\"\r\n              (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n              (search)=\"eventCall($event, 'search', field?.section, field.name)\"\r\n              (blur)=\"eventCall($event, 'blur', field?.section, field.name)\"\r\n            >\r\n              <!-- Custom search input -->\r\n              <ng-template ng-header-tmp>\r\n                <input #check style=\"width: 100%; line-height: 24px;\" type=\"text\" name=\"type\" placeholder=\"Search Key\"\r\n                  (input)=\"select.filter(check.value)\" />\r\n              </ng-template>\r\n            </ng-select>\r\n          </ng-container>\r\n          <!-- Heading -->\r\n          <ng-container *ngIf=\"field.type === 'heading'\">\r\n            <div class=\"{{ field.class }}\" [innerHTML]=\"field.label\"></div>\r\n          </ng-container>\r\n          <!-- Radio buttons -->\r\n          <ng-container *ngIf=\"field.type === 'radio'\">\r\n            <div class=\"{{ field?.extra?.customClass }}\">\r\n              <ng-container *ngFor=\"let item of field?.extra?.options || []\">\r\n                <div class=\"{{ field.class }}\">\r\n                  <input\r\n                    [formControlName]=\"field.name\"\r\n                    type=\"radio\"\r\n                    id=\"radio-{{ i }}\"\r\n                    class=\"{{ field.class }}-input\"\r\n                    [value]=\"field?.extra?.key ? item[field.extra?.key || ''] : item\"\r\n                    (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n                  />\r\n                  <label class=\"{{ field.class }}-label\" for=\"radio-{{ i }}\">\r\n                    {{ field?.extra?.label ? item[field.extra?.label || ''] : item }}\r\n                  </label>\r\n                </div>\r\n              </ng-container>\r\n            </div>\r\n          </ng-container>\r\n          <!-- Date input -->\r\n          <ng-container *ngIf=\"field.type === 'date'\">\r\n            <input type=\"text\"\r\n              [formControlName]=\"field.name\"\r\n              class=\"{{ field.class }}\"\r\n              [bsConfig]=\"{\r\n                dateInputFormat: field?.extra?.format || 'DD-MM-YYYY',\r\n                adaptivePosition: true,\r\n                containerClass: field?.extra?.theme || 'theme-dark-blue',\r\n                minMode: field?.extra?.mode || 'day'\r\n              }\"\r\n              [minDate]=\"field?.extra?.minDate || undefined\"\r\n              [maxDate]=\"field?.extra?.maxDate || undefined\"\r\n              (bsValueChange)=\"eventCall($event, 'date', field?.section, field.name)\"\r\n              bsDatepicker>\r\n          </ng-container>\r\n          <!-- Date range input -->\r\n          <ng-container *ngIf=\"field.type === 'daterange'\">\r\n            <input type=\"text\"\r\n              [formControlName]=\"field.name\"\r\n              class=\"{{ field.class }}\"\r\n              [bsConfig]=\"{\r\n                rangeInputFormat: field?.extra?.format || 'DD-MM-YYYY',\r\n                adaptivePosition: true,\r\n                containerClass: field?.extra?.theme || 'theme-dark-blue',\r\n                minMode: field?.extra?.mode || 'day'\r\n              }\"\r\n              [minDate]=\"field?.extra?.minDate || undefined\"\r\n              [maxDate]=\"field?.extra?.maxDate || undefined\"\r\n              (bsValueChange)=\"eventCall($event, 'date', field?.section, field.name)\"\r\n              bsDaterangepicker>\r\n          </ng-container>\r\n          <!-- File input -->\r\n          <ng-container *ngIf=\"field.type === 'file'\">\r\n            <input\r\n              [type]=\"'file'\"\r\n              id=\"fileInput-{{ i }}\"\r\n              class=\"{{ field.class }} {{ field?.extra?.customText ? 'd-none' : '' }}\"\r\n              (change)=\"onFileSelected($event, field?.section, field.name)\"\r\n              [accept]=\"field?.extra?.format\"\r\n              [disabled]=\"field.disable\">\r\n            <label\r\n              for=\"fileInput-{{ i }}\"\r\n              class=\"{{ field?.extra?.customClass }} {{ field.disable ? 'disabled' : '' }}\"\r\n              *ngIf=\"field?.extra?.customClass\">\r\n              {{ dynamicForm.get(field.name + '_name')?.value ? dynamicForm.get(field.name + '_name')?.value : (field?.extra?.customText || 'No file chosen') }}\r\n            </label>\r\n          </ng-container>\r\n          <!-- Button -->\r\n          <ng-container *ngIf=\"field.type === 'button'\">\r\n            <button class=\"{{ field.class }}\" (click)=\"eventCall($event, 'click', field?.section, field.name, field?.extra?.submit || false)\">\r\n              {{ field.label }}\r\n            </button>\r\n          </ng-container>\r\n          <!-- Validation error messages -->\r\n          <div *ngIf=\"!controls[field.name]?.valid && controls[field.name]?.touched && field?.extra?.validationMessages\"\r\n            class=\"validation-error\">\r\n            <span class=\"text-danger\" *ngIf=\"controls[field.name]?.errors?.['required']\">\r\n              {{ field?.extra?.validationMessages?.required }}\r\n            </span>\r\n            <span class=\"text-danger\" *ngIf=\"controls[field.name]?.errors?.['pattern']\">\r\n              {{ field?.extra?.validationMessages?.pattern }}\r\n            </span>\r\n          </div>\r\n        </div>\r\n      </ng-container>\r\n      <ng-content></ng-content>\r\n    </div>\r\n  </form>\r\n  ", styles: [".was-validated .form-control:invalid,.form-control.is-invalid,.form-control.ng-touched.ng-invalid,.form-select.ng-touched.ng-invalid{border-color:red;padding-right:calc(1.5em + .75rem);background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e\");background-repeat:no-repeat;background-position:right calc(.375em + .1875rem) center;background-size:calc(.75em + .375rem) calc(.75em + .375rem)}input[type=password].form-control.ng-touched.ng-invalid,input[bsDatepicker].form-control.ng-touched.ng-invalid{background-image:unset}::ng-deep .ng-select .ng-select-container{border-color:#e2e5ec;border-radius:.25rem!important}::ng-deep .ng-select .ng-select-container .ng-arrow-wrapper .ng-arrow{background-image:url(data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E);background-size:cover;background-position:center;width:9px;height:9px;background-repeat:no-repeat;border:none}::ng-deep .ng-select.ng-select-opened .ng-arrow-wrapper{top:2px}::ng-deep .ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{background-size:cover;background-position:center}::ng-deep .ng-select.ng-invalid.ng-touched .ng-select-container{border-color:red!important}.validation-error{font-size:12px}.disabled{cursor:not-allowed}.view-icon{position:absolute;bottom:0;transform:translateY(-50%);right:20px;padding-top:0;padding-bottom:0;width:20px}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i1.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i3.BsDatepickerDirective, selector: "[bsDatepicker]", inputs: ["placement", "triggers", "outsideClick", "container", "outsideEsc", "isDisabled", "minDate", "maxDate", "minMode", "daysDisabled", "datesDisabled", "datesEnabled", "dateCustomClasses", "dateTooltipTexts", "isOpen", "bsValue", "bsConfig"], outputs: ["onShown", "onHidden", "bsValueChange"], exportAs: ["bsDatepicker"] }, { kind: "directive", type: i3.BsDatepickerInputDirective, selector: "input[bsDatepicker]" }, { kind: "directive", type: i3.BsDaterangepickerDirective, selector: "[bsDaterangepicker]", inputs: ["placement", "triggers", "outsideClick", "container", "outsideEsc", "isOpen", "bsValue", "bsConfig", "isDisabled", "minDate", "maxDate", "dateCustomClasses", "daysDisabled", "datesDisabled", "datesEnabled"], outputs: ["onShown", "onHidden", "bsValueChange"], exportAs: ["bsDaterangepicker"] }, { kind: "directive", type: i3.BsDaterangepickerInputDirective, selector: "input[bsDaterangepicker]" }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["bindLabel", "bindValue", "markFirst", "placeholder", "notFoundText", "typeToSearchText", "addTagText", "loadingText", "clearAllText", "appearance", "dropdownPosition", "appendTo", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "keyDownFn", "typeahead", "multiple", "addTag", "searchable", "clearable", "isOpen", "items", "compareWith", "clearSearchOnAdd", "deselectOnClick"], outputs: ["blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"] }, { kind: "directive", type: i4.NgHeaderTemplateDirective, selector: "[ng-header-tmp]" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.7", ngImport: i0, type: NgDynoFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dyno-form', template: "<!-- Form Element -->\r\n<form [formGroup]=\"dynamicForm\" [attr.data-bs-theme]=\"mode\">\r\n    <div class=\"{{ mainClass }}\">\r\n      <!-- Loop through form fields -->\r\n      <ng-container *ngFor=\"let field of config; let i = index\">\r\n        <div *ngIf=\"!field.condition || field.condition(dynamicForm.value)\" class=\"{{ field.parentClass }} position-relative\">\r\n          <!-- Check for checkbox type -->\r\n          <ng-container *ngIf=\"field.type === 'checkbox'\">\r\n            <input\r\n              [formControlName]=\"field.name\"\r\n              type=\"checkbox\"\r\n              class=\"{{ field.class }}\"\r\n              (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n            />\r\n          </ng-container>\r\n          <!-- Label for non-form types -->\r\n          <label *ngIf=\"!nonFormTypes.includes(field.type) && field.label\" class=\"{{ field.labelClass }}\">\r\n            {{ field.label }}\r\n            <span style=\"color: red;\" *ngIf=\"field.required\">*</span>\r\n          </label>\r\n          <!-- Input fields for text, number, email, password -->\r\n          <ng-container *ngIf=\"['text', 'number', 'email', 'password'].includes(field.type)\">\r\n            <input\r\n              [formControlName]=\"field.name\"\r\n              [type]=\"field.type === 'password' ? (passwordVisibility[field.name] ? 'text' : 'password') : field.type\"\r\n              class=\"{{ field.class }}\"\r\n              (input)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n              (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n              (blur)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n            />\r\n            <span class=\"view-icon\" *ngIf=\"field.type === 'password'\" (click)=\"passwordVisibility[field.name] = !passwordVisibility[field.name]\"\r\n              [ngClass]=\"!passwordVisibility[field.name] ? 'eye' : 'eye-slash'\" style=\"cursor: pointer;\">\r\n              <!-- SVG icons for password visibility -->\r\n              <svg xmlns=\"http://www.w3.org/2000/svg\" *ngIf=\"!passwordVisibility[field.name]\" viewBox=\"0 0 256 256\">\r\n                <!-- Path for the eye icon -->\r\n              </svg>\r\n              <svg xmlns=\"http://www.w3.org/2000/svg\" *ngIf=\"passwordVisibility[field.name]\" viewBox=\"0 0 256 256\">\r\n                <!-- Path for the crossed eye icon -->\r\n              </svg>\r\n            </span>\r\n          </ng-container>\r\n          <!-- Textarea field -->\r\n          <ng-container *ngIf=\"field.type === 'textarea'\">\r\n            <textarea\r\n              [formControlName]=\"field.name\"\r\n              class=\"{{ field.class }}\"\r\n              rows=\"{{ field?.extra?.rows || 1 }}\"\r\n              (input)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n              (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n              (blur)=\"eventCall($event, 'input', field?.section, field.name)\"\r\n            ></textarea>\r\n          </ng-container>\r\n          <!-- Select dropdown -->\r\n          <ng-container *ngIf=\"field.type === 'select'\">\r\n            <!-- Dropdown component with various event listeners -->\r\n            <ng-select #select\r\n              [formControlName]=\"field.name\"\r\n              class=\"{{ field.class }}\"\r\n              [items]=\"selectList[field.name]\"\r\n              [multiple]=\"field?.extra?.multi || false\"\r\n              [bindLabel]=\"field?.extra?.label || ''\"\r\n              [bindValue]=\"field?.extra?.key || ''\"\r\n              [searchable]=\"false\"\r\n              (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n              (close)=\"eventCall($event, 'close', field?.section, field.name)\"\r\n              (open)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n              (clear)=\"eventCall($event, 'clear', field?.section, field.name)\"\r\n              (focus)=\"eventCall($event, 'focus', field?.section, field.name)\"\r\n              (search)=\"eventCall($event, 'search', field?.section, field.name)\"\r\n              (blur)=\"eventCall($event, 'blur', field?.section, field.name)\"\r\n            >\r\n              <!-- Custom search input -->\r\n              <ng-template ng-header-tmp>\r\n                <input #check style=\"width: 100%; line-height: 24px;\" type=\"text\" name=\"type\" placeholder=\"Search Key\"\r\n                  (input)=\"select.filter(check.value)\" />\r\n              </ng-template>\r\n            </ng-select>\r\n          </ng-container>\r\n          <!-- Heading -->\r\n          <ng-container *ngIf=\"field.type === 'heading'\">\r\n            <div class=\"{{ field.class }}\" [innerHTML]=\"field.label\"></div>\r\n          </ng-container>\r\n          <!-- Radio buttons -->\r\n          <ng-container *ngIf=\"field.type === 'radio'\">\r\n            <div class=\"{{ field?.extra?.customClass }}\">\r\n              <ng-container *ngFor=\"let item of field?.extra?.options || []\">\r\n                <div class=\"{{ field.class }}\">\r\n                  <input\r\n                    [formControlName]=\"field.name\"\r\n                    type=\"radio\"\r\n                    id=\"radio-{{ i }}\"\r\n                    class=\"{{ field.class }}-input\"\r\n                    [value]=\"field?.extra?.key ? item[field.extra?.key || ''] : item\"\r\n                    (change)=\"eventCall($event, 'change', field?.section, field.name)\"\r\n                  />\r\n                  <label class=\"{{ field.class }}-label\" for=\"radio-{{ i }}\">\r\n                    {{ field?.extra?.label ? item[field.extra?.label || ''] : item }}\r\n                  </label>\r\n                </div>\r\n              </ng-container>\r\n            </div>\r\n          </ng-container>\r\n          <!-- Date input -->\r\n          <ng-container *ngIf=\"field.type === 'date'\">\r\n            <input type=\"text\"\r\n              [formControlName]=\"field.name\"\r\n              class=\"{{ field.class }}\"\r\n              [bsConfig]=\"{\r\n                dateInputFormat: field?.extra?.format || 'DD-MM-YYYY',\r\n                adaptivePosition: true,\r\n                containerClass: field?.extra?.theme || 'theme-dark-blue',\r\n                minMode: field?.extra?.mode || 'day'\r\n              }\"\r\n              [minDate]=\"field?.extra?.minDate || undefined\"\r\n              [maxDate]=\"field?.extra?.maxDate || undefined\"\r\n              (bsValueChange)=\"eventCall($event, 'date', field?.section, field.name)\"\r\n              bsDatepicker>\r\n          </ng-container>\r\n          <!-- Date range input -->\r\n          <ng-container *ngIf=\"field.type === 'daterange'\">\r\n            <input type=\"text\"\r\n              [formControlName]=\"field.name\"\r\n              class=\"{{ field.class }}\"\r\n              [bsConfig]=\"{\r\n                rangeInputFormat: field?.extra?.format || 'DD-MM-YYYY',\r\n                adaptivePosition: true,\r\n                containerClass: field?.extra?.theme || 'theme-dark-blue',\r\n                minMode: field?.extra?.mode || 'day'\r\n              }\"\r\n              [minDate]=\"field?.extra?.minDate || undefined\"\r\n              [maxDate]=\"field?.extra?.maxDate || undefined\"\r\n              (bsValueChange)=\"eventCall($event, 'date', field?.section, field.name)\"\r\n              bsDaterangepicker>\r\n          </ng-container>\r\n          <!-- File input -->\r\n          <ng-container *ngIf=\"field.type === 'file'\">\r\n            <input\r\n              [type]=\"'file'\"\r\n              id=\"fileInput-{{ i }}\"\r\n              class=\"{{ field.class }} {{ field?.extra?.customText ? 'd-none' : '' }}\"\r\n              (change)=\"onFileSelected($event, field?.section, field.name)\"\r\n              [accept]=\"field?.extra?.format\"\r\n              [disabled]=\"field.disable\">\r\n            <label\r\n              for=\"fileInput-{{ i }}\"\r\n              class=\"{{ field?.extra?.customClass }} {{ field.disable ? 'disabled' : '' }}\"\r\n              *ngIf=\"field?.extra?.customClass\">\r\n              {{ dynamicForm.get(field.name + '_name')?.value ? dynamicForm.get(field.name + '_name')?.value : (field?.extra?.customText || 'No file chosen') }}\r\n            </label>\r\n          </ng-container>\r\n          <!-- Button -->\r\n          <ng-container *ngIf=\"field.type === 'button'\">\r\n            <button class=\"{{ field.class }}\" (click)=\"eventCall($event, 'click', field?.section, field.name, field?.extra?.submit || false)\">\r\n              {{ field.label }}\r\n            </button>\r\n          </ng-container>\r\n          <!-- Validation error messages -->\r\n          <div *ngIf=\"!controls[field.name]?.valid && controls[field.name]?.touched && field?.extra?.validationMessages\"\r\n            class=\"validation-error\">\r\n            <span class=\"text-danger\" *ngIf=\"controls[field.name]?.errors?.['required']\">\r\n              {{ field?.extra?.validationMessages?.required }}\r\n            </span>\r\n            <span class=\"text-danger\" *ngIf=\"controls[field.name]?.errors?.['pattern']\">\r\n              {{ field?.extra?.validationMessages?.pattern }}\r\n            </span>\r\n          </div>\r\n        </div>\r\n      </ng-container>\r\n      <ng-content></ng-content>\r\n    </div>\r\n  </form>\r\n  ", styles: [".was-validated .form-control:invalid,.form-control.is-invalid,.form-control.ng-touched.ng-invalid,.form-select.ng-touched.ng-invalid{border-color:red;padding-right:calc(1.5em + .75rem);background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e\");background-repeat:no-repeat;background-position:right calc(.375em + .1875rem) center;background-size:calc(.75em + .375rem) calc(.75em + .375rem)}input[type=password].form-control.ng-touched.ng-invalid,input[bsDatepicker].form-control.ng-touched.ng-invalid{background-image:unset}::ng-deep .ng-select .ng-select-container{border-color:#e2e5ec;border-radius:.25rem!important}::ng-deep .ng-select .ng-select-container .ng-arrow-wrapper .ng-arrow{background-image:url(data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E);background-size:cover;background-position:center;width:9px;height:9px;background-repeat:no-repeat;border:none}::ng-deep .ng-select.ng-select-opened .ng-arrow-wrapper{top:2px}::ng-deep .ng-select.ng-select-opened .ng-arrow-wrapper .ng-arrow{background-size:cover;background-position:center}::ng-deep .ng-select.ng-invalid.ng-touched .ng-select-container{border-color:red!important}.validation-error{font-size:12px}.disabled{cursor:not-allowed}.view-icon{position:absolute;bottom:0;transform:translateY(-50%);right:20px;padding-top:0;padding-bottom:0;width:20px}\n"] }]
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
