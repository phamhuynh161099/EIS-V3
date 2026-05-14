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
import { TextareaModule } from 'primeng/textarea';

import { DomSanitizer } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { Name_Language } from '../../../../../constants/constants.auth';
import { RoleConfigService } from '../role-config.service';

export interface IPermission {
    ID: number;
    NAME: string;
    RESOURCE: string;
    ACTION: string;
    DESCRIPTION: string;
    CATEGORY: string;
}

export interface IUpdateRoleDialogData {
    listPermissions: IPermission[];
    roleId: string | number;
    roleName: string;
    roleDescription: string;
    permissionIds: number[];
}

const ACTION_COLORS: Record<string, string> = {
    read: 'bg-blue/30 text-blue',
    search: 'bg-green/30 text-green',
    update: 'bg-orange/30 text-orange',
    delete: 'bg-red/30 text-red',
};

const CATEGORY_COLORS: Record<string, string> = {
    PP_MANAGEMENT: 'bg-purple/30 text-purple',
    USER_MANAGEMENT: 'bg-slate/30 text-slate',
};

@Component({
    imports: [
        FormsModule,
        FloatLabel,
        Dialog,
        TableModule,
        CommonModule,
        InputTextModule,
        TextareaModule,
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
        CardModule,
        ImageModule,
    ],
    providers: [],
    standalone: true,
    templateUrl: './role-update-popup.html',
    styleUrls: ['./role-update-popup.scss'],
})
export class RoleUpdatePopup implements OnInit, OnDestroy {
    private apiService = inject(RoleConfigService);
    private unsubscribe$ = new Subject<void>();
    private refreshSubscription?: Subscription;

    dataEdit = {
        id: '' as string | number,
        name: '',
        description: '',
    };

    permissions: IPermission[] = [];

    // ✅ Luôn là number[] thuần, không lẫn string
    selectedIds: number[] = [];

    constructor(
        private messageService: MessageService,
        public ref: DynamicDialogRef,
        private sanitizer: DomSanitizer,
        @Inject(DynamicDialogConfig) public config: DynamicDialogConfig,
    ) {
        const data: IUpdateRoleDialogData = this.config.data;

        this.permissions = data.listPermissions;

        this.dataEdit = {
            id: data.roleId,
            name: data.roleName,
            description: data.roleDescription,
        };

        // ✅ Ép kiểu Number() để tránh string "1" !== number 1
        this.selectedIds = (data.permissionIds ?? []).map(id => Number(id));

        // DEBUG — xoá sau khi chạy đúng
        console.log('[RoleUpdate] permissionIds raw:', data.permissionIds);
        console.log('[RoleUpdate] selectedIds after Number():', this.selectedIds);
        console.log('[RoleUpdate] permission ID types sample:', this.permissions.slice(0, 3).map(p => ({ id: p.ID, type: typeof p.ID })));
    }

    ngOnInit(): void { }

    // ── Derived ───────────────────────────────────────────────────
    get selectedCount(): number {
        return this.selectedIds.length;
    }

    // Dùng getter có cache thủ công để tránh tính lại liên tục
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

    // ── Category helpers ──────────────────────────────────────────
    getCategoryState(category: string): 'all' | 'none' | 'indeterminate' {
        const ids = (this.grouped[category] ?? []).map(p => Number(p.ID));
        const checkedCount = ids.filter(id => this.selectedIds.includes(id)).length;
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

    getCategoryCheckedCount(category: string): number {
        return (this.grouped[category] ?? [])
            .filter(p => this.selectedIds.includes(Number(p.ID))).length;
    }

    toggleCategory(category: string): void {
        const ids = (this.grouped[category] ?? []).map(p => Number(p.ID));
        const state = this.getCategoryState(category);
        if (state === 'all') {
            this.selectedIds = this.selectedIds.filter(id => !ids.includes(id));
        } else {
            const toAdd = ids.filter(id => !this.selectedIds.includes(id));
            this.selectedIds = [...this.selectedIds, ...toAdd];
        }
    }

    togglePermission(id: number): void {
        const numId = Number(id); // ✅ ép kiểu chắc chắn
        if (this.selectedIds.includes(numId)) {
            this.selectedIds = this.selectedIds.filter(x => x !== numId);
        } else {
            this.selectedIds = [...this.selectedIds, numId];
        }
    }

    isPermissionSelected(id: number): boolean {
        return this.selectedIds.includes(Number(id));
    }

    // ── Color helpers ─────────────────────────────────────────────
    getActionClass(action: string): string {
        return ACTION_COLORS[action] ?? 'bg-gray-50 text-gray-600 border-gray-200';
    }

    getCategoryClass(category: string): string {
        return CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-700';
    }

    // ── Actions ───────────────────────────────────────────────────
    closePopup(): void {
        this.ref.close({ result: '' });
    }

    async onSubmit(): Promise<void> {
        // try {
        //     const parameter = {
        //         roleId:        this.dataEdit.id,
        //         permissionIds: [...this.selectedIds],
        //         name:          this.dataEdit.name,
        //         description:   this.dataEdit.description,
        //     };

        //     console.log('Update payload:', parameter);



        //     this.messageService.add({
        //         severity: 'success',
        //         summary:  'Success',
        //         detail:   'Role updated successfully',
        //     });

        //     this.ref.close({ result: 'success', data: parameter });
        // } catch (error) {
        //     console.error('Error:', error);
        //     this.messageService.add({
        //         severity: 'error',
        //         summary:  'Error',
        //         detail:   'Update Fail',
        //     });
        // }

        const parameter = {
            'data': {
                id: this.dataEdit.id,
                name: this.dataEdit.name,
                description: this.dataEdit.description,
                permissionIds: [...this.selectedIds],
            },
        };
        this.apiService.updateRBACRole(parameter)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (responses: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Role updated successfully',
                    });
                },
                (error) => {
                    console.error('Error:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Update Fail',
                    });
                }
            );
    }

    ngOnDestroy(): void {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
