import { CommonModule } from '@angular/common';
import { Component, effect, Inject, inject, input, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { forkJoin, Subject, Subscription } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
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
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Toast, ToastModule } from 'primeng/toast';


import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Textarea } from 'primeng/textarea';
import { NewArticleService } from '../new-article.service';
import { Name_Language } from '../../../../../constants/constants.auth';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogService, DynamicDialogComponent, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';

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

        CardModule,
        ImageModule
    ],
    providers: [],
    standalone: true,
    templateUrl: './image-six-view-popup.html',
    styleUrls: ['./image-six-view-popup.scss']
})
export class ImageSixViewPopup implements OnInit, OnDestroy {
    private apiService = inject(NewArticleService);
    private unsubscribe$ = new Subject<void>();
    private refreshSubscription?: Subscription;


    // Thay thế @Input bằng signal input() của Angular 19
    dataSend = input<any[]>();

    // Khởi tạo các Signals quản lý state
    isLoading = signal<boolean>(false);
    isActive = signal<boolean>(false);
    season = signal<string>('');
    modelName = signal<string>(''); // Thay vì gán DOM thủ công
    articleNoImg = signal<string>('');

    // Gộp 6 biến src thành 1 mảng để dễ lặp ngoài HTML
    defaultImg = '../../../../../assets/images/ImgNull.png';
    images = signal<string[]>(Array(6).fill(this.defaultImg));

    // Tiêu đề của từng hình ảnh
    imageTitles = ['Lateral Image', 'Heel Image', 'Medial Image', 'Top Image', 'Bottom Image', 'Toe Image'];

    constructor(
        private messageService: MessageService,
        public ref: DynamicDialogRef,
        private sanitizer: DomSanitizer,
        @Inject(DynamicDialogConfig) public config: DynamicDialogConfig
    ) {
        const lang = localStorage.getItem(Name_Language);
        console.log('data passed into popup', this.config.data, this.dataSend());


        effect(() => {
            const data = this.config.data;
            if (data) {
                this.isActive.set(true);
                this.isLoading.set(true);

                this.articleNoImg.set(data.article_no_img);
                this.season.set(data.sesson);
                this.modelName.set(data.model_name);

                console.log('call api')
                this.loadAllImages();
            }
        });
    }

    async loadAllImages() {
        if (!this.articleNoImg() || !this.season()) {
            this.images.set(Array(6).fill(this.defaultImg));
            this.isLoading.set(false);
            return;
        }

        try {
            // Gọi 6 API cùng một lúc
            const promises = [1, 2, 3, 4, 5, 6].map(i => this.viewImage(i));
            const results = await Promise.all(promises);
            this.images.set(results);
        } catch (error) {
            console.error('Lỗi khi tải ảnh:', error);
            this.images.set(Array(6).fill(this.defaultImg));
        } finally {
            this.isLoading.set(false);
        }
    }

    async viewImage(i: number) {
        console.log('::run func', i)
        const url = `http://pdm.hsvina.com/Windchill/midas/rest/getArticleSixViewThumb?article=${this.articleNoImg()}&season=${this.season()}&ord_file=${i}`;
        try {
            const response = await fetch(url);
            return await response.json();
        } catch {
            return this.defaultImg;
        }
    }

    ngOnInit(): void {

    }

    closePopup() {
        this.ref.close({ result: 'some data' });
    }


    ngOnDestroy(): void {
        // Cleanup subscription để tránh memory leak
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

}
