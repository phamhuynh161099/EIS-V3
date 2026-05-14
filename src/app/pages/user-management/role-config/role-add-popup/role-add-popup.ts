import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';


import { DomSanitizer } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { Name_Language } from '../../../../../constants/constants.auth';
import { RoleConfigService } from '../role-config.service';
import { TextareaModule } from 'primeng/textarea';

export interface IPermission {
    ID: number;
    NAME: string;
    RESOURCEE: string;
    ACTION: string;
    DESCRIPTION: string;
    CATEGORY: string;
}

const ACTION_COLORS: Record<string, string> = {
    // Info severity (đọc)
    read: 'bg-blue/30 text-blue',
    // Success severity (ghi/tạo mới)
    search: 'bg-green/30 text-green',
    // Warning severity (cập nhật - PrimeNG dùng màu Cam thay vì Amber)
    update: 'bg-orange/30 text-orange',
    // Danger severity (xóa)
    delete: 'bg-red/30 text-red',
};

const CATEGORY_COLORS: Record<string, string> = {
    PP_MANAGEMENT: 'bg-purple/30 text-purple',
    USER_MANAGEMENT: 'bg-slate/30 text-slate',
};


declare var pq: any
@Component({
    // selector: 'app-new-article',
    imports: [
        FormsModule,
        FloatLabel,
        Dialog,
        TableModule,
        CommonModule,
        InputTextModule,
        TagModule,
        SelectModule,
        MultiSelectModule,
        DropdownModule,
        ButtonModule,
        IconField,
        InputIcon,
        SliderModule,
        ToastModule,
        Toast,
        ProgressSpinnerModule,
        TextareaModule,
        CardModule,
        ImageModule
    ],
    providers: [],
    standalone: true,
    templateUrl: './role-add-popup.html',
    styleUrls: ['./role-add-popup.scss']
})
export class RoleAddPopup implements OnInit, OnDestroy {
    private apiService = inject(RoleConfigService);
    private unsubscribe$ = new Subject<void>();
    private refreshSubscription?: Subscription;


    // Form data
    dataAdd = {
        id: '',
        name: '',
        description: '',
    };

    permissions: IPermission[] = [];
    selected = new Set<number>();


    // Derived
    get grouped(): Record<string, IPermission[]> {
        return this.permissions.reduce(
            (acc, p) => {
                if (!acc[p.CATEGORY]) acc[p.CATEGORY] = [];
                acc[p.CATEGORY].push(p);
                return acc;
            },
            {} as Record<string, IPermission[]>,
        );
    }

    get groupedEntries(): { category: string; perms: IPermission[] }[] {
        return Object.entries(this.grouped).map(([category, perms]) => ({
            category,
            perms,
        }));
    }

    get selectedCount(): number {
        return this.selected.size;
    }


    constructor(
        private messageService: MessageService,
        public ref: DynamicDialogRef,
        private sanitizer: DomSanitizer,
        @Inject(DynamicDialogConfig) public config: DynamicDialogConfig
    ) {
        const lang = localStorage.getItem(Name_Language);
        this.permissions = this.config.data['listPermissions'];
        this.selected = new Set();
    }


    ngOnInit(): void {

    }

    // ── Category helpers ─────────────────────────────────────────
    getCategoryState(category: string): 'all' | 'none' | 'indeterminate' {
        const ids = (this.grouped[category] ?? []).map((p) => p.ID);
        const checkedCount = ids.filter((id) => this.selected.has(id)).length;
        if (checkedCount === 0) return 'none';
        if (checkedCount === ids.length) return 'all';
        return 'indeterminate';
    }

    isCategoryAll(category: string): boolean {
        return this.getCategoryState(category) === 'all';
    }

    isCategoryIndeterminate(category: string): boolean {
        return this.getCategoryState(category) === 'indeterminate';
    }

    toggleCategory(category: string): void {
        const ids = (this.grouped[category] ?? []).map((p) => p.ID);
        const state = this.getCategoryState(category);
        const next = new Set(this.selected);
        if (state === 'all') {
            ids.forEach((id) => next.delete(id));
        } else {
            ids.forEach((id) => next.add(id));
        }
        this.selected = next;
    }

    togglePermission(id: number): void {
        const next = new Set(this.selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        this.selected = next;
    }

    isPermissionSelected(id: number): boolean {
        return this.selected.has(id);
    }

    getCategoryCheckedCount(category: string): number {
        return (this.grouped[category] ?? []).filter((p) => this.selected.has(p.ID)).length;
    }

    // ── Color helpers ─────────────────────────────────────────────
    getActionClass(action: string): string {
        return ACTION_COLORS[action] ?? 'bg-gray-50 text-gray-600 border-gray-200';
    }

    getCategoryClass(category: string): string {
        return CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-700';
    }

    closePopup() {
        this.ref.close({ result: '' });
    }

    onSubmit() {
        const parameter = {
            'data': {
                name: this.dataAdd.name,
                description: this.dataAdd.description,
                permissionIds: Array.from(this.selected),
            },
        };
        this.apiService.addRBACRole(parameter)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Role added successfully',
                    });
                },
                (error) => {
                    console.error('Error:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Add Fail',
                    });
                }
            );
    }


    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

}
