import { CommonModule, isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from "primeng/floatlabel";
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SliderModule } from 'primeng/slider';
import { TextareaModule } from 'primeng/textarea';
import { BehaviorSubject, forkJoin, of, Subject, takeUntil, timer } from 'rxjs';
import { EspService } from '../esp.service';
import { AvatarModule } from 'primeng/avatar';
import { exhaustMap, catchError, filter, switchMap } from 'rxjs/operators';
import moment from 'moment';
interface Column {
    type: 'Text' | "Date" | "Number" | "Option" | "Null" | 'MultiSelect';
    field: string;
    header: string;
    customExportHeader?: string;
}


interface ExportColumn {
    title: string;
    dataKey: string;
}

function ValidateNotNull(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === null && control.value === '') {
        return { valueInvalid: true };
    }
    return null;
}

// repair-dashboard.model.ts
export type LineStatus = 'unassigned' | 'error' | 'fixing' | 'normal';

export interface RepairLine {
    line_name: string;          // VD: 'NG aSC 01'
    status: LineStatus; // Trạng thái của ESP/Engineer
    engineerName?: String;
    initTime?: string;
    requestTime?: string; // Thời gian gọi (VD: '10:45:00')
    acceptTime?: string;
}

export interface RepairGroup {
    groupName: string;
    mp: number;
    lines: RepairLine[];
}

const TIME_POOLING = 10 * 1000 // 10s

@Component({
    providers: [MessageService, ConfirmationService],
    imports: [
        ButtonModule,
        CommonModule,
        ConfirmDialogModule,
        DatePickerModule,
        DialogModule,
        DropdownModule,
        FloatLabel,
        FormsModule,
        IconFieldModule,
        ImageModule,
        InputGroupAddonModule,
        InputGroupModule,
        InputIconModule,
        InputTextModule,
        MultiSelectModule,
        ProgressSpinnerModule,
        RadioButtonModule,
        ReactiveFormsModule,
        SelectModule,
        SliderModule,
        TableModule,
        TagModule,
        TextareaModule,
        ToastModule,
        Toast,
        AvatarModule
    ],
    selector: 'app-tpm-tracking-dashboard',
    templateUrl: './tpm_tracking_dashboard.html',
    styleUrls: ['./tpm_tracking_dashboard.scss']
})
export class TpmTrackingDashboardPage implements OnInit {
    private apiService = inject(EspService);
    private unsubscribe$ = new Subject<void>();
    // Tạo một Subject để theo dõi sự thay đổi của Type (Workshop)
    private workshopChange$ = new BehaviorSubject<string | null>(null);
    // Key để lưu vào localStorage
    private readonly WORKSHOP_STORAGE_KEY = 'tpm_selected_workshop';
    private platformId = inject(PLATFORM_ID);


    addModelForm!: FormGroup;


    searchValue: string = '';

    // Signal lưu chiều cao
    boxHeight = signal<number>(0);

    // Signal lưu chiều cao của table
    boxHeightTable = signal<number>(0);

    // chiều cao của filter
    boxHeightFilter = 0;

    // pading
    paddingTableAFilter = 24;


    selectedType: any;
    arrType = [
        { label: 'Stitching', value: "Stitching" },
        { label: 'Assembly', value: "Assembly" },
        { label: 'Cutting', value: "Cutting" },
        { label: 'Stockfit', value: "Stockfit" },
    ];

    private resizeObserver: ResizeObserver | null = null;
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {
        afterNextRender(() => {
            const layoutMainEl = document.querySelector('.layout-main') as HTMLElement;
            this.boxHeightFilter = (document.querySelector('#block-filter') as HTMLElement).offsetHeight;

            if (layoutMainEl) {
                this.boxHeight.set(layoutMainEl.clientHeight);
                this.boxHeightTable.set(Math.max(layoutMainEl.clientHeight - this.boxHeightFilter - this.paddingTableAFilter, 400))

                this.resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        this.boxHeight.set(entry.contentRect.height);
                        this.boxHeightTable.set(Math.max(entry.contentRect.height - this.boxHeightFilter - this.paddingTableAFilter, 400))
                    }
                });

                this.resizeObserver.observe(layoutMainEl);
            }
        });

        this.addModelForm = this.fb.group({
            selectEspEngineer: [null, [ValidateNotNull]],
            selectEspLine: [null, [ValidateNotNull]],
        });
    }
    ngOnInit(): void {
        this.loadSavedWorkshop();
        this.setupPollingStream();

        if (this.selectedType) {
            this.workshopChange$.next(this.selectedType);
        }
    }

    // --- Hàm đọc từ LocalStorage ---
    private loadSavedWorkshop() {
        if (isPlatformBrowser(this.platformId)) {
            const savedData = localStorage.getItem(this.WORKSHOP_STORAGE_KEY);
            if (savedData) {
                try {
                    this.selectedType = JSON.parse(savedData);
                } catch (e) {
                    console.error('Lỗi parse localStorage', e);
                }
            }
        }
    }

    onWorkshopChange($event: any) {
        this.selectedType = $event.value;

        // Lưu xuống LocalStorage
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.WORKSHOP_STORAGE_KEY, JSON.stringify($event.value));
        }

        // CHỈ CẦN GỌI LỆNH NÀY!
        // Luồng setupPollingStream sẽ tự bắt được tín hiệu, hủy timer cũ, khởi động timer mới với type mới.
        this.workshopChange$.next(this.selectedType);
    }


    // Mock data dựa trên hình ảnh của bạn
    groupData = signal<RepairGroup>({
        groupName: '',
        mp: 22,
        lines: [
            // { id: 'Line Molding Fixing Stiching UKD 12', status: 'normal' },
            // { id: 'Line Molding Fixing Stiching UKD 12', status: 'error', requestTime: "10:31 10/31" },
            // { id: 'Line Molding Fixing UKD 12', status: 'fixing' },
            // { id: 'Line Molding Fixing UKD 12', status: 'unassigned' }, // Test trạng thái trắng
        ]
    });

    setupPollingStream(): void {
        this.workshopChange$
            .pipe(
                // 1. Chỉ tiếp tục chạy nếu type có giá trị (bỏ qua null lúc mới khởi tạo nếu chưa có selectedType)
                filter(type => !!type),

                // 2. switchMap: Hủy timer cũ ngay lập tức nếu có tín hiệu chọn Workshop mới
                switchMap((currentType) => {
                    let payload = {
                        data: {
                            type: currentType
                        }
                    };

                    // 3. Bắt đầu luồng timer mới (gọi ngay lúc 0ms, lặp lại sau mỗi TIME_POOLING)
                    return timer(0, TIME_POOLING).pipe(
                        // 4. exhaustMap: Bỏ qua các nhịp timer mới nếu API trước đó đang bị treo/delay
                        exhaustMap(() => this.apiService.getListLineStatus(payload).pipe(
                            // Bắt lỗi API để không làm đứt chuỗi timer
                            catchError((error) => {
                                console.error('Lỗi khi gọi API Line Status:', error);
                                return of(null);
                            })
                        ))
                    );
                }),
                // 5. Ngắt toàn bộ luồng khi component bị destroy (chống memory leak)
                takeUntil(this.unsubscribe$)
            )
            .subscribe((responses: any) => {
                // 6. Xử lý dữ liệu khi API trả về thành công
                if (responses && responses.data && responses.data.length > 0) {
                    let rawData = responses.data;
                    let handledData = [];

                    for (let idx = 0; idx < rawData.length; idx++) {
                        const item = rawData[idx];

                        let _enginer_name = "";
                        let _init_time = null;
                        let _request_time = null;
                        let _accept_time = null;
                        let _stauts: LineStatus = 'unassigned';

                        // Logic xác định trạng thái và thời gian của Line
                        if (item['status_line_esp'] !== 'Active' || item['status_line_engineer'] !== 'Active') {
                            _stauts = 'unassigned';
                        } else {
                            if (['NONE'].includes(item['status_tracking'])) {
                                _stauts = 'error';
                                _enginer_name = item['engineer_name'];
                                _init_time = moment(item['created_at'], 'YYYY-MM-DD HH:mm:ss').format('MM.DD HH:mm');
                            } else if (['REQUESTED'].includes(item['status_tracking'])) {
                                _stauts = 'error';
                                _enginer_name = item['engineer_name'];
                                _init_time = moment(item['created_at'], 'YYYY-MM-DD HH:mm:ss').format('MM.DD HH:mm');
                                _request_time = moment(item['timestamp1'], 'YYYY-MM-DD HH:mm:ss').format('MM.DD HH:mm');
                            } else if (item['status_tracking'] === 'ACKNOWLEDGED') {
                                _stauts = 'fixing';
                                _enginer_name = item['engineer_name'];
                                _init_time = moment(item['created_at'], 'YYYY-MM-DD HH:mm:ss').format('MM.DD HH:mm');
                                _request_time = moment(item['timestamp1'], 'YYYY-MM-DD HH:mm:ss').format('MM.DD HH:mm');
                                _accept_time = moment(item['timestamp2'], 'YYYY-MM-DD HH:mm:ss').format('MM.DD HH:mm');
                            } else {
                                _stauts = 'normal';
                            }
                        }

                        // Đẩy data đã qua xử lý vào mảng
                        handledData.push({
                            line_name: item['line_name'],
                            status: _stauts,
                            initTime: _init_time,
                            engineerName: _enginer_name,
                            requestTime: _request_time,
                            acceptTime: _accept_time
                        });
                    }

                    // 7. Lấy tên Workshop hiện tại từ BehaviorSubject để làm tiêu đề động cho Group
                    const currentWorkshopName = this.workshopChange$.getValue();

                    // Cập nhật Signal để Angular 19 tự động render lại UI
                    this.groupData.set({
                        groupName: currentWorkshopName ? currentWorkshopName.toString() : 'Unknown Group',
                        mp: 22, // Bạn có thể tính tổng MP từ rawData nếu muốn số này động
                        lines: handledData as any
                    });
                } else {
                    // Optional: Xử lý trường hợp API gọi thành công nhưng mảng data rỗng
                    // Ví dụ: Xóa data cũ đi

                    this.groupData.update(current => ({
                        ...current,
                        lines: []
                    }));

                }
            });
    }

    //============ HELPER ===============
    getStatusClasses(status: LineStatus): string {
        const baseClasses = 'rounded-xl p-3 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-2';

        switch (status) {
            case 'unassigned': // Chưa có ESP board
                return `${baseClasses} bg-white text-gray-800 border-gray-200 shadow-gray-200/50`;
            case 'error':      // Đã gọi Engineer
                return `${baseClasses} bg-red-500 text-white border-red-600 shadow-red-500/30`;
            case 'fixing':     // Engineer đang đến/sửa
                return `${baseClasses} bg-orange-400 text-white border-orange-500 shadow-orange-400/30`;
            case 'normal':     // Bình thường
                return `${baseClasses} bg-green-500 text-white border-green-600 shadow-green-500/30`;
            default:
                return baseClasses;
        }
    }

    ngOnDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
