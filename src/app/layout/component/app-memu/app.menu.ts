import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { LanguageType, Name_Language, Name_Token } from '../../../../constants/constants.auth';
import { GlobalsService } from '../../../../globals.service';
import { AuthService } from '../../../pages/auth/auth.service';
import { AppMenuitem } from '../app.menuitem';
import { TabService } from '../app-tab/tab.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, ButtonModule],
    templateUrl: './app-menu.html',
    styleUrls: ['./app-menu.css']
})
export class AppMenu implements OnInit {
    menuPath: MenuItem[] = [];
    valLanguage: any;
    isButtonVisible = true;
    optionLanguage: LanguageType = 'LANG_EN';

    MENU_ITEMS_ENG = [
        {
            title: 'DCC',
            icon: 'monitor-outline',
            hidden:true,
            children: [
                {
                    title: 'Product Management(DT)',
                    children: [
                        {
                            title: 'Top 5 Lowest EOLR Dashboard',
                            link: '/pages/t5lowesteolrdashboard',
                        },
                        {
                            title: 'SF EOLR Dashboard',
                            link: '/pages/sfeolrdashboard',
                        },
                        {
                            title: 'ST EOLR Dashboard',
                            link: '/pages/eolrdashboard',
                        },
                        {
                            title: 'AS EOLR Dashboard',
                            link: '/pages/asdashboard',
                        },
                        {
                            title: 'CT EOLR Dashboard',
                            link: '/pages/cteolrdashboard',
                        },
                        {
                            title: 'Downtime Sum.Report',
                            link: '/pages/downtimesummaryreport',
                        },
                        {
                            title: 'Downtime Analysis',
                            link: '/pages/downtimeanalysis',
                        },
                        {
                            title: 'CT/SF Down.Dashboard',
                            link: '/pages/ctsfdowntimedashboard',
                        },
                        {
                            title: 'DN RFT History',
                            link: '/pages/dnrfthistory',
                        },
                        {
                            title: 'RFT Summary Dashoard',
                            link: '/pages/rftsummarydash',
                        },
                    ],
                },
                {
                    title: 'TCM ',
                    children: [
                        {
                            // title: 'Use Expenses Status',
                            title: 'Production & Tooling',
                            link: '/pages/useexpensesstatus',
                        },
                        {
                            // title: 'Use Expenses Status',
                            title: 'Shortage & B-grade',
                            link: '/pages/shortagebgrade',
                        },
                    ],
                },
                {
                    title: 'ST EOLR Detail',
                    link: '/pages/eolrdashboard-detail',
                    hidden: true,
                },
                {
                    title: 'PPH Alarm History',
                    link: '/pages/pphalarmhistory',
                },
                {
                    title: 'SPIKE',
                    link: '/pages/spikeoverallperformance',
                },
                {
                    title: 'Factory Key KPI',
                    link: '/pages/factorykeykpidashboard',
                },
                {
                    title: 'Eolr Alarm Dashboard',
                    link: '/pages/eolralarmdashboard',
                },

            ],
        },
        {
            title: 'PP Management',
            icon: 'monitor-outline',
            children: [
                {
                    title: 'New Article',
                    link: '/pages/newarticle',
                    // link: '/mgt/qrcodemanagement',
                },
                {
                    title: 'PO',
                    children: [
                        {
                            title: 'PO Complete',
                            link: '/pages/pocompletecheckboard',
                        },
                        {
                            title: 'CMA Management',
                            link: '/pages/pocmadash',
                        },
                        {
                            title: 'PO Dashboard',
                            link: '/pages/podashboard',
                            hidden: true,
                        },
                        {
                            title: 'PO Complete Dashboard',
                            link: 'pages/pocompletiondashboard',
                        },
                        {
                            title: 'HVC Weekly Plan',
                            link: '/pages/hvcweeklyplan',
                        },
                    ],
                },

                {
                    title: 'Email Config',
                    link: '/pages/emailconfig',
                },
                {
                    title: 'Holiday Config',
                    link: '/pages/holidayconfig',
                },

                {
                    title: 'DN AS ST Dashboard',
                    link: '/pages/asstdashboarddn',
                },

                {
                    title: 'New Tooling Schedule',
                    link: '/pages/newtoolingschedule',
                },

                {
                    title: 'USSport Order PGSC',
                    link: '/pages/ussport-order-pgsc',
                },
                {
                    title: 'USSport Order Dashboard',
                    link: '/pages/ussport-order-dashboard',
                },
            ],
        },
        {
            title: 'RG PCC Management',
            icon: 'monitor-outline',
            children: [
                {
                    title: 'Monthly Order Production Forcast',
                    link: '/pages/monthlyorderprodforcast',
                },
                {
                    title: 'AS ST Dashboard',
                    link: '/pages/asstdashboard',
                },
                {
                    title: 'RG Material Status',
                    link: '/pages/rgmaterialstatus',
                },
                {
                    title: 'RG Holiday Management',
                    link: '/pages/rgholidaymanagement',
                },

                {
                    title: 'RG Sole Po Complete OSC',
                    children: [
                        {
                            title: 'Dashboard',
                            link: '/pages/hvc-rg-po-complete-status',
                        },
                        {
                            title: 'List',
                            link: '/pages/hvc-rg-po-complete-list',
                        },
                    ],
                },

                {
                    title: 'RG Sole Po Complete SF',
                    children: [
                        {
                            title: 'Dashboard',
                            link: '/pages/hvc-rg-po-complete-status-sf',
                        },
                        {
                            title: 'List',
                            link: '/pages/hvc-rg-po-complete-list-sf',
                        },
                    ],
                },


                // {
                //   title: 'RG Po Complete Dashboard',
                //   link: '/pages/hvc-rg-po-complete-status',
                // },
                // {
                //   title: 'RG Po Complete List',
                //   link: '/pages/hvc-rg-po-complete-list',
                // },
            ],
        },
        {
            title: 'ME Management',
            icon: 'monitor-outline',
            children: [
                {
                    title: 'Changover Preparation',
                    link: '/pages/changoverpreparation',
                },
                {
                    title: 'ST Changover Schedule',
                    link: '/pages/changeoverschedule',
                },
                {
                    title: 'Qco Ramp Up',
                    link: '/pages/qcorampup',
                },
                {
                    title: 'QCO Analysis Dashboard',
                    link: '/pages/qcoanalysisdash',
                },
                // {
                //   title: 'OSS Tracking Dash',
                //   link: '/pages/osstrackingdash',
                // },
                {
                    title: 'Daily Product Status',
                    link: '/pages/dailyproductionstatus',
                },
                {
                    title: 'Product Performance',
                    link: '/pages/productionperformance',
                },
                {
                    title: 'PPH By Line',
                    link: '/pages/pphbyline',
                },
                {
                    title: 'PPH Ontimes Status',
                    link: '/pages/pphontimesstatus',
                },
                {
                    title: 'Pop PPH & EOLR Report',
                    link: '/pages/popppheolrreport',
                },
                {
                    title: 'In-Line Deffective Return',
                    link: '/pages/inlinedeffectivereturn',
                },
                {
                    title: 'Inline Deffective Chart',
                    link: '/pages/inline-deffective-chart',
                },
                {
                    title: 'Defective Summary Report',
                    link: '/pages/defectivesummaryreport',
                },
                // {
                //   title: 'PPH Alarm History',
                //   link: '/pages/pphalarmhistory',
                // },
                {
                    title: 'Report Page',
                    link: '/pages/reportpage',
                    hidden: true,
                },
                {
                    title: 'Top Model',
                    link: '/pages/topmodel',
                    hidden: true,
                },
                {
                    title: 'Top Model Setup',
                    link: '/pages/topmodelsetup',
                    hidden: true,
                },
                {
                    title: 'Skill Matrix Status',
                    link: '/pages/skillmatrixdashboard',
                    hidden: true,
                },
                {
                    title: 'Skill Matrix By Line',
                    link: '/pages/skillmatrixdialy',
                    hidden: true,
                },
                // {
                //   title: 'T/O Dashboard',
                //   link: '/pages/todashboard',
                // },
                {
                    title: 'TO Manpower Dash',
                    link: '/pages/tomanpowerdash',
                },
                {
                    title: 'OTP and Relief',
                    link: '/pages/otpandrelief',
                },
                {
                    title: 'Actual OT Status',
                    link: '/pages/overtimetrackingdash',
                },
                {
                    title: 'Input HWA KPI T/A',
                    link: '/pages/inputhwamekpitargetactual',
                },
                {
                    title: 'Input HWA KPI EFF And RFT',
                    link: '/pages/inputhwamekpitopeffandrft',
                },
                {
                    title: 'Input HWA KPI AQL',
                    link: '/pages/inputhwamekpitopaql',
                },
                {
                    title: 'Input HWA KPI Claim',
                    link: '/pages/inputhwamekpitopclaim',
                },
                {
                    title: 'Input HWK KPI T/A',
                    link: '/pages/inputhwkmekpitargetactual',
                },
                {
                    title: 'Dashboard Subsi',
                    link: '/pages/subsi-dashboard',
                },
                // {
                //   title: 'ST Preparation System',
                //   link: '/pages/st-preparation-system',
                // },
            ],
        },
        {
            title: 'Kaizen Register',
            icon: 'monitor-outline',
            children: [
                // {
                //   title: 'ME Master',
                //   link: '/pages/memaster',
                // },
                {
                    title: 'Model List ',
                    link: '/pages/modellist',
                },
                // {
                //   title: 'Model Detail Screen ',
                //   link: '/pages/modeldetailscreen',
                // },
                {
                    title: 'Kaizen List ',
                    link: '/pages/kaizenlist',
                },
                // {
                //   title: 'Kaizen Register',
                //   link: '/pages/kaizenregister',
                // },
                {
                    title: 'Kaizen Evaluation List ',
                    link: '/pages/kaizenevaluationlist',
                },
                // {
                //   title: 'Kaizen Evaluation Register',
                //   link: '/pages/kaizenevaluationregister',
                // },
            ],
            hidden: true,
        },
        {
            title: 'OSC Tracking',
            icon: 'monitor-outline',
            children: [
                {
                    title: 'OSC HWA Tracking',
                    link: '/pages/osctracking',
                },
                {
                    title: 'OSC HWK Tracking',
                    link: '/pages/oschwk',
                },
                {
                    title: 'New Model Tracking',
                    link: '/pages/newmodeltracking',
                },
                {
                    title: 'Monthly OSC Target',
                    link: '/pages/monthlyosctarget',
                },
            ],
        },
        {
            title: 'HVC Management',
            icon: 'monitor-outline',
            children: [
                {
                    title: ' HVC Loadplan',
                    // hidden: !checkAccountCanAccessHVC(),
                    children: [
                        {
                            title: 'BOTTOM DASHBOARD',
                            link: '/pages/hvc-dashboard-hwk',
                        },
                        {
                            // title: 'Bottom Part Status',
                            title: 'OVERALL STATUS',
                            link: '/pages/hvc-bottom-part-status',
                        },

                        {
                            title: 'OUTSOLE',
                            children: [
                                {
                                    // title: 'HVC Outsole',
                                    title: 'ALL FACTORY',
                                    link: '/pages/hvc-load-plan-dashboard',
                                },
                            ],
                        },

                        {
                            title: 'MIDSOLE',
                            children: [
                                {
                                    // title: 'HVC IM',
                                    title: 'IMEVA',
                                    link: '/pages/hvc-im-dashboard',
                                },
                                {
                                    // title: 'HVC CM',
                                    title: 'CMEVA',
                                    link: '/pages/hvc-cm-dashboard',
                                },
                            ],
                        },

                        {
                            title: 'STOCKFIT',
                            children: [
                                {
                                    // title: 'EZ SF',
                                    title: 'EZ SPORTS',
                                    link: '/pages/hvc-ez-sf',
                                },
                                {
                                    // title: 'TSRG SF',
                                    title: 'TSRG',
                                    link: '/pages/hvc-tsrg-sf',
                                },
                                {
                                    // title: 'F1 SF',
                                    title: 'FACTORY 1',
                                    link: '/pages/hvc-f1-sf',
                                },
                                {
                                    // title: 'F2 SF',
                                    title: 'FACTORY 2',
                                    link: '/pages/hvc-f2-sf',
                                },
                                {
                                    // title: 'RG SF',
                                    title: 'HSRG',
                                    link: '/pages/hvc-rg-sf',
                                },
                            ],
                        },

                        {
                            title: 'TREATMENT',
                            children: [
                                {
                                    // title: 'EZ SF',
                                    title: 'PAINTING 1',
                                    link: '/pages/hvc-treatment-painting-one',
                                },
                                {
                                    // title: 'EZ SF',
                                    title: 'PAINTING 2',
                                    link: '/pages/hvc-treatment-painting-two',
                                },
                            ],
                        },
                    ],
                },
                {
                    // title: 'HVC Holiday Config',
                    title: 'HVC set up',
                    link: '/pages/hvc-load-plan-holiday',
                },
            ],
        },
        {
            title: 'User Management',
            icon: 'monitor-outline',
            hidden: localStorage.getItem('user_name') === 'admin' ? false : true,
            children: [
                {
                    title: 'User Config',
                    link: '/pages/userconfig',
                },
                {
                    title: 'Role Config',
                    link: '/pages/role-config',
                },
            ],
        },
        {
            title: 'FACT Management',
            icon: 'monitor-outline',
            children: [

                {
                    title: 'FACT DashBoard',
                    link: '/pages/factdashboard',
                },
                {
                    title: 'FACT Input',
                    link: '/pages/inputfactdashboard',
                },
                {
                    title: 'FACT Setting',
                    link: '/pages/settingfactdashboard',
                },
            ],
            hidden: true,
        },
        {
            title: 'TQC Management',
            icon: 'monitor-outline',
            children: [
                {
                    title: 'RFT Report',
                    link: '/pages/rftreport',
                },

                {
                    title: 'Issued Lines Report',
                    link: '/pages/issuedlinesmanagement',
                },
                {
                    title: 'Hệ thống theo dõi vấn đề',
                    link: '/pages/trackingvalidationsystem',
                },


                {
                    title: 'Rach Gia',
                    children: [
                        {
                            title: 'Top 5Key KPI Analysis',
                            link: '/pages/top5keykpianalysis',
                        },
                        {
                            title: 'Quality Report Dashboard',
                            link: '/pages/qualityreportdash',
                        },
                        {
                            title: 'Leadership Team Dashboard',
                            link: '/pages/leadershipteamdash',
                        },
                    ],
                },

                {
                    title: 'Dong Nai',
                    children: [
                        {
                            title: 'Top 5Key KPI Analysis',
                            link: '/pages/top5keykpianalysis-dn',
                        },
                        {
                            title: 'Quality Report Dashboard',
                            link: '/pages/qualityreportdash-dn',
                        },
                        {
                            title: 'Leadership Team Dashboard',
                            link: '/pages/leadershipteamdash-dn',
                        },
                    ],
                },

            ],
        },
        {
            title: 'Lab Report',
            icon: 'monitor-outline',
            children: [
                {
                    title: 'Chemical Daily Report',
                    link: '/pages/chemicaldailyreport',
                },
                {
                    title: 'Chemical Yearly Report',
                    link: '/pages/chemicalyearlyreport',
                },
                {
                    title: 'Calibaration Report',
                    link: '/pages/calibration',
                },
                {
                    title: 'Calibaration Report v2',
                    link: '/pages/calibrationv2',
                },
            ],
        },

        {
            title: 'Dashboard',
            icon: 'monitor-outline',
            hidden: false,
            children: [

                {
                    title: 'Dev Sample',
                    children: [
                        {
                            title: 'Readiness By Stage',
                            link: '/pages/readiness-by-stage',
                        },
                        {
                            title: 'Adidas Performance Status',
                            link: '/pages/adidas-performance-status',
                        },
                    ],
                },
                {
                    title: 'Labor Cost',
                    children: [
                        {
                            title: 'Direct',
                            link: '/pages/laborcostdirect',
                        },
                        {
                            title: 'InDirect',
                            link: '/pages/laborcostindirect',
                        },
                        {
                            title: 'By Dept',
                            link: '/pages/laborcostbydept',
                        },
                    ],
                },
                {
                    title: 'Monthly Forecast',
                    children: [
                        {
                            title: 'All',
                            link: '/pages/monthlyforecastproductionall/',
                        },
                        {
                            title: 'Nhon Trach',
                            link: '/pages/monthlyforecastproductionfactorynt/',
                        },
                        {
                            title: 'Rach Gia',
                            link: '/pages/monthlyforecastproductionfactoryrg/',
                        },
                    ],
                },
                {
                    title: 'adidas S/B Status',
                    link: '/pages/adidassbstatus/',
                },
                {
                    title: 'adidas cs tracking',
                    link: '/pages/adidascstracking/',
                },
                {
                    title: 'adidas FGT result status',
                    link: '/pages/adidasfgtresultstatus/',
                },
                {
                    title: 'adidas Buv Ready Status',
                    link: '/pages/adidasbuvreadystatus/',
                },
                // {
                //   title: 'HVC SOC Production Status',
                //   link: '/pages/hvcsocproductionstatus',
                // },
            ],
        },
        {
            title: 'HR/GA',
            icon: 'monitor-outline',
            children: [
                // {
                //   title: 'Survey Staff',
                //   link: '/pages/surveystaff',
                // },
                // {
                //   title: 'Survey GA Team',
                //   link: '/pages/surveyga',
                // },
                {
                    title: 'Meeting Room',
                    link: '/pages/meetingroom',
                },
                {
                    title: 'Meeting Room V2',
                    link: '/pages/meetingroomv2',
                },
                {
                    title: '---',
                    link: '/pages/mrv2calendarpage',
                    hidden: true,
                },
            ],
        },
        {
            title: 'HS One',
            icon: 'monitor-outline',
            hidden: true,
            children: [
                {
                    title: 'PO',
                    children: [
                        {
                            title: 'PO Complete',
                            link: '/pages/hsonepocompletecheckboard',
                        },
                        {
                            title: 'PO Complete Dashboard',
                            link: '/pages/hsonepocompletiondashboard',
                        },
                    ],
                },
                {
                    title: 'Daily Production Status',
                    link: '/pages/ibsdailyproductionstatus',
                },
                {
                    title: 'PPH Alarm History',
                    link: '/pages/ibspphalarmhistory',
                },
                {
                    title: 'Production Performance',
                    link: '/pages/ibsproductionperformance',
                },
            ],
        },
        {
            title: 'Trainning',
            icon: 'monitor-outline',
            children: [
                {
                    title: 'Trainning Management',
                    link: '/pages/trainningmanagement',

                    // hidden: localStorage.getItem('user_name') === 'admin' ? false : true,
                },
                {
                    title: 'Quiz Management',
                    link: '/pages/quizmanagement',
                },
                {
                    title: 'Trainning Attendance',
                    link: '/pages/tranningattendance',
                },
            ],
        },
        {
            title: 'Scrap Management',
            icon: 'monitor-outline',
            children: [
                {
                    title: 'Scrap Management',
                    link: '/pages/scapmanagement',
                },
                {
                    hidden: true,
                    title: 'Scrap Request',
                    link: '/pages/scaprequest',
                },
                {
                    hidden: true,
                    title: 'Scrap Infor Print',
                    link: '/pages/scapinfoprint',
                },
                {
                    hidden: true,
                    title: 'Scrap Registration',
                    link: '/pages/scapregistration',
                },
                {
                    hidden: true,
                    title: 'Update Scrap Plan Date',
                    link: '/pages/scapplandate',
                },
                {
                    hidden: true,
                    title: 'Update Scrap Complete',
                    link: '/pages/scapcomplete',
                },
                {
                    hidden: true,
                    title: 'Update Scrap Complete view',
                    link: '/pages/scapcompleteview',
                },
            ],
        },
        {
            title: 'Smart Quality Hub',
            icon: 'monitor-outline',
            children: [
                {
                    title: 'Upload File',
                    link: '/pages/sqch-upload-link-file',
                },
            ],
        },
        {
            title: 'New Web2',
            icon: 'monitor-outline',
            hidden: localStorage.getItem('user_name') === 'khpark' ? false : true,
            children: [
                {
                    title: 'demo here',
                    link: '/pages/demo_webv2',
                },
                {
                    title: 'demo here',
                    link: '/pages/link1v2',
                    hidden: true,
                },
                {
                    title: 'demo here',
                    link: '/pages/link2v2',
                    hidden: true,
                },
            ],
        },
        {
            title: 'New Page', // menu title
            icon: 'ion-android-home', // menu icon
            hidden: true,
            link: '/pages/call-api',
        },
        {
            title: 'Layout',
            icon: 'layout-outline',
            hidden: true,
            children: [
                {
                    title: 'Stepper',
                    link: '/pages/layout/stepper',
                },
                {
                    title: 'List',
                    link: '/pages/layout/list',
                },
                {
                    title: 'Infinite List',
                    link: '/pages/layout/infinite-list',
                },
                {
                    title: 'Accordion',
                    link: '/pages/layout/accordion',
                },
                {
                    title: 'Tabs',
                    pathMatch: 'prefix',
                    link: '/pages/layout/tabs',
                },
            ],
        },
        {
            title: 'Forms',
            icon: 'edit-2-outline',
            hidden: true,
            children: [
                {
                    title: 'Form Inputs',
                    link: '/pages/forms/inputs',
                },
                {
                    title: 'Form Layouts',
                    link: '/pages/forms/layouts',
                },
                {
                    title: 'Buttons',
                    link: '/pages/forms/buttons',
                },
                {
                    title: 'Datepicker',
                    link: '/pages/forms/datepicker',
                },
            ],
        },
        {
            title: 'UI Features',
            icon: 'keypad-outline',
            link: '/pages/ui-features',
            hidden: true,
            children: [
                {
                    title: 'Grid',
                    link: '/pages/ui-features/grid',
                },
                {
                    title: 'Icons',
                    link: '/pages/ui-features/icons',
                },
                {
                    title: 'Typography',
                    link: '/pages/ui-features/typography',
                },
                {
                    title: 'Animated Searches',
                    link: '/pages/ui-features/search-fields',
                },
            ],
        },
        {
            title: 'Modal & Overlays',
            icon: 'browser-outline',
            hidden: true,
            children: [
                {
                    title: 'Dialog',
                    link: '/pages/modal-overlays/dialog',
                },
                {
                    title: 'Window',
                    link: '/pages/modal-overlays/window',
                },
                {
                    title: 'Popover',
                    link: '/pages/modal-overlays/popover',
                },
                {
                    title: 'Toastr',
                    link: '/pages/modal-overlays/toastr',
                },
                {
                    title: 'Tooltip',
                    link: '/pages/modal-overlays/tooltip',
                },
            ],
        },
        {
            title: 'Extra Components',
            icon: 'message-circle-outline',
            hidden: true,
            children: [
                {
                    title: 'Calendar',
                    link: '/pages/extra-components/calendar',
                },
                {
                    title: 'Progress Bar',
                    link: '/pages/extra-components/progress-bar',
                },
                {
                    title: 'Spinner',
                    link: '/pages/extra-components/spinner',
                },
                {
                    title: 'Alert',
                    link: '/pages/extra-components/alert',
                },
                {
                    title: 'Calendar Kit',
                    link: '/pages/extra-components/calendar-kit',
                },
                {
                    title: 'Chat',
                    link: '/pages/extra-components/chat',
                },
            ],
        },
        {
            title: 'Maps',
            icon: 'map-outline',
            hidden: true,
            children: [
                {
                    title: 'Google Maps',
                    link: '/pages/maps/gmaps',
                },
                {
                    title: 'Leaflet Maps',
                    link: '/pages/maps/leaflet',
                },
                {
                    title: 'Bubble Maps',
                    link: '/pages/maps/bubble',
                },
                {
                    title: 'Search Maps',
                    link: '/pages/maps/searchmap',
                },
            ],
        },
        // {
        //   title: 'Charts',
        //   icon: 'pie-chart-outline',
        //   hidden: false,
        //   children: [
        //     {
        //       title: 'Echarts',
        //       link: '/pages/charts/echarts',
        //     },
        //     {
        //       title: 'Charts.js',
        //       link: '/pages/charts/chartjs',
        //     },
        //     {
        //       title: 'D3',
        //       link: '/pages/charts/d3',
        //     },
        //   ],
        // },
        {
            title: 'Editors',
            icon: 'text-outline',
            hidden: true,
            children: [
                {
                    title: 'TinyMCE',
                    link: '/pages/editors/tinymce',
                },
                {
                    title: 'CKEditor',
                    link: '/pages/editors/ckeditor',
                },
            ],
        },
        {
            title: 'Tables & Data',
            icon: 'grid-outline',
            hidden: true,
            children: [
                {
                    title: 'Smart Table',
                    link: '/pages/tables/smart-table',
                },
                {
                    title: 'Tree Grid',
                    link: '/pages/tables/tree-grid',
                },
            ],
        },
        {
            title: 'Miscellaneous',
            icon: 'shuffle-2-outline',
            hidden: true,
            children: [
                {
                    title: '404',
                    link: '/pages/miscellaneous/404',
                },
            ],
        },
        {
            title: 'Auth',
            icon: 'lock-outline',
            hidden: true,
            children: [
                {
                    title: 'Login',
                    link: '/auth/login',
                },
                {
                    title: 'Register',
                    link: '/auth/register',
                },
                {
                    title: 'Request Password',
                    link: '/auth/request-password',
                },
                {
                    title: 'Reset Password',
                    link: '/auth/reset-password',
                },
            ],
        },
    ];

    constructor(
        private globalsService: GlobalsService,
        private menuService: AuthService,
        private tabService: TabService
    ) {
        const lang = localStorage.getItem(Name_Language);
        if (lang) {
            this.optionLanguage = lang as LanguageType;
        }
    }

    ngOnInit() {
        this.valLanguage = this.globalsService.getValLanguage();
        if (!this.valLanguage) {
            this.globalsService._valLanguage$.subscribe((data) => {
                this.valLanguage = data;
                this.loadStaticMenu(); // Đổi sang gọi menu tĩnh
            });
        } else {
            this.loadStaticMenu();
        }
    }

    /**
     * Khởi tạo và nạp Menu tĩnh
     */
    loadStaticMenu() {
        // Có thể kết hợp check token hoặc quyền ở đây nếu cần
        // let token = localStorage.getItem(Name_Token);

        // Gọi hàm converter để biến đổi MENU_ITEMS_ENG sang PrimeNG MenuItem
        this.menuPath = this.mapStaticMenuToPrimeNg(this.MENU_ITEMS_ENG);
    }

    /**
     * Hàm Đệ quy: Chuyển đổi định dạng Nebular (NbMenuItem) sang PrimeNG (MenuItem)
     */
    mapStaticMenuToPrimeNg(staticItems: any[]): MenuItem[] {
        return staticItems
            .filter(item => !item.hidden)
            .map(item => {
                const mappedItem: MenuItem = {
                    label: item.title,
                    icon: item.icon
                        ? `pi pi-fw pi-${this.convertIcon(item.icon)}`
                        : undefined,
                    // ← BỎ routerLink, dùng command thay thế
                    visible: !item.hidden,
                    expanded: false,
                };

                if (item.group) {
                    mappedItem['group'] = true;
                }

                // Leaf item có link → mở tab thay vì navigate thẳng
                if (item.link && (!item.children || item.children.length === 0)) {
                    mappedItem.command = () => {
                        this.tabService.openTab(item.link, item.title, mappedItem.icon);
                    };
                }

                if (item.children && item.children.length > 0) {
                    mappedItem.items = this.mapStaticMenuToPrimeNg(item.children);
                }

                return mappedItem;
            });
    }

    /**
     * Hàm hỗ trợ UI: Đảo trạng thái đóng/mở
     */
    toggleMenu(item: MenuItem) {
        if (item.items && item.items.length > 0) {
            item.expanded = !item.expanded;
        }
    }

    /**
     * Hàm phụ trợ: Chuyển đổi tên Icon từ Eva Icons (Nebular) sang PrimeIcons
     * Bạn có thể tự bổ sung thêm các case khác nếu cần
     */
    private convertIcon(evaIcon: string): string {
        const iconMap: any = {
            'shopping-cart-outline': 'shopping-cart',
            'home-outline': 'home',
            'monitor-outline': 'desktop',
            'edit-2-outline': 'pencil',
            'keypad-outline': 'th-large',
            'browser-outline': 'window-maximize',
            'message-circle-outline': 'comments',
            'map-outline': 'map',
            'text-outline': 'align-left',
            'grid-outline': 'table',
            'shuffle-2-outline': 'sitemap',
            'lock-outline': 'lock'
        };
        return iconMap[evaIcon] || 'circle'; // Trả về circle nếu không tìm thấy mapping
    }
}
