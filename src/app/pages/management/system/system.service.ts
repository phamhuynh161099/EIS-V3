import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SystemService {
    constructor(private http: HttpClient) {}

    getUserManagement(row: any, date: string): Observable<any> {
        return this.http.get<any>(`comm/selectMemberMgt.do?start_date=&end_date=${date}&searchType=userid_mn&keyword=&_search=false&nd=1753497705662&rows=${row}&page=1&sidx=&sord=asc`);
    }

    getMenuMgtOne(id: string): Observable<any> {
        return this.http.get<any>(`system/getMenuMgtOne/${id}`);
    }

    updateUserManagement(param: any): Observable<any> {
        const formData = new FormData();
        formData.append('scr_yn', param.scr_yn);
        formData.append('mail_yn', param.mail_yn);
        formData.append('memo', param.memo);
        formData.append('uid', param.userid);
        formData.append('uname', param.uname);
        formData.append('upw', param.upw);
        formData.append('corp', param.corp);
        formData.append('grade', param.grade);
        formData.append('cel_nb', param.cell_nb);
        formData.append('e_mail', param.e_mail);

        return this.http.post(`comm/modifyMbInfo`, formData, { responseType: 'text' as const });
    }

    getMenuManagement(): Observable<any> {
        return this.http.get<any>(`system/selectmenuMgt.do?_search=false&nd=1753690344426&rows=200&page=1&sidx=&sord=asc`);
    }

    insertMenuManagement(mn_nm: any, url_link: any): Observable<any> {
        const formData = new FormData();
        formData.append('mnno', '1');
        formData.append('mn_cd', '001000000000');
        formData.append('up_mn_cd', '000000000000');
        formData.append('level_cd', '000');
        formData.append('sub_yn', 'N');
        formData.append('mn_nm', mn_nm ? mn_nm : '');
        formData.append('url_link', url_link ? url_link : '');

        return this.http.post(`system/insertMenuMgt.do`, formData, { responseType: 'text' as const });
    }

    updateMenuManagement(param: any): Observable<any> {
        const formData = new FormData();
        formData.append('mnno', param.mnno);
        formData.append('mn_cd', param.mn_cd);
        formData.append('up_mn_cd', param.up_mn_cd);
        formData.append('level_cd', param.level_cd);
        formData.append('mn_nm', param.mn_nm);
        formData.append('url_link', param.url_link);
        formData.append('order_no', param.order_no ? param.order_no : 1);
        formData.append('use_yn', param.use_yn);

        return this.http.post(`system/updateMenuMgt.do`, formData, { responseType: 'text' as const });
    }

    getCommonManagement(): Observable<any> {
        return this.http.get<any>(`system/selectCommMt.do?start_date=undefined&end_date=undefined&searchType=undefined&keyword=undefined&_search=false&nd=1753759639294&rows=500&page=1&sidx=&sord=asc`);
    }

    selectCommDt(mt_cd: string): Observable<any> {
        return this.http.get<any>(`system/selectCommDt.do?mt_cd=${mt_cd}&_search=false&nd=1753760000195&rows=500&page=1&sidx=&sord=asc`);
    }

    insertCommonMainManagement(mt_nm: string, mt_exp: string, use_yn: string): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', '');
        formData.append('mt_nm', mt_nm);
        formData.append('mt_exp', mt_exp);
        formData.append('use_yn', use_yn);

        return this.http.post(`system/insertCommMt`, formData, { responseType: 'text' as const });
    }

    insertCommonDetailManagement(param: any): Observable<any> {
        const formData = new FormData();
        formData.append('cdid', param.cdid);
        formData.append('mt_cd', param.mt_cd);
        formData.append('dt_cd', param.dt_cd);
        formData.append('dt_nm', param.dt_nm);
        formData.append('dt_exp', param.dt_exp);
        formData.append('dt_order', String(param.dt_order));
        formData.append('use_yn', param.use_yn);

        return this.http.post(`system/insertCommDt`, formData, { responseType: 'text' as const });
    }

    getCommMt(mt_cd: string): Observable<any> {
        return this.http.get<any>(`system/getCommMt/${mt_cd}`);
    }

    getCommDt(cdid: string): Observable<any> {
        return this.http.get<any>(`system/getCommDt/${cdid}`);
    }

    updateCommonMainManagement(param: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', param.mt_cd);
        formData.append('mt_nm', param.mt_nm);
        formData.append('mt_exp', param.mt_exp);
        formData.append('use_yn', param.use_yn);

        return this.http.post(`system/updateCommMt`, formData, { responseType: 'text' as const });
    }

    updateCommonDetailManagement(param: any): Observable<any> {
        const formData = new FormData();
        formData.append('cdid', param.cdid);
        formData.append('mt_cd', param.mt_cd);
        formData.append('dt_cd', param.dt_cd);
        formData.append('dt_nm', param.dt_nm);
        formData.append('dt_exp', param.dt_exp);
        formData.append('dt_order', param.dt_order);
        formData.append('use_yn', param.use_yn);

        return this.http.post(`system/updateCommDt`, formData, { responseType: 'text' as const });
    }

    getUserAuthManagement(row: any): Observable<any> {
        return this.http.get<any>(`comm/selectMemberMgt.do?_search=false&nd=1753846373447&rows=${row}&page=1&sidx=&sord=asc`);
    }

    selectMemberLocMgt(uid: string, row: any): Observable<any> {
        return this.http.get<any>(`system/selectMemberLocMgt.do?userid=${uid}&_search=false&nd=1753849736439&rows=${row}&page=1&sidx=&sord=asc`);
    }

    delMemberLocationInfo(uid: string): Observable<any> {
        return this.http.post(`system/delMemberLocationInfo`, { userid: uid }, { responseType: 'json' as const });
    }

    saveMemberLocationInfo(data: any): Observable<any> {
        return this.http.post(`system/saveMemberLocationInfo`, data, { responseType: 'json' as const });
    }

    selectDepartmentInfo(): Observable<any> {
        return this.http.get<any>(`system/selectDepartmentInfo.do?_search=false&nd=1754011621995&rows=500&page=1&sidx=&sord=asc`);
    }

    updateDepartmentInfo(param: any): Observable<any> {
        const formData = new FormData();
        formData.append('dpno', param.dpno);
        formData.append('depart_cd', param.depart_cd);
        formData.append('depart_nm', param.depart_nm);
        formData.append('use_yn', param.use_yn);
        formData.append('re_mark', param.re_mark);

        return this.http.post(`system/updateDepartmentInfo.do`, formData, { responseType: 'text' as const });
    }

    insertDepartmentInfo(param: any): Observable<any> {
        const formData = new FormData();
        formData.append('dpno', param.dpno);
        formData.append('depart_cd', param.depart_cd);
        formData.append('depart_nm', param.depart_nm);
        formData.append('use_yn', param.use_yn);
        formData.append('re_mark', param.re_mark);

        return this.http.post(`system/insertDepartmentInfo.do`, formData, { responseType: 'text' as const });
    }

    getDepartmentInfoOne(id: string): Observable<any> {
        return this.http.get<any>(`system/getDepartmentInfoOne/${id}`);
    }

    selectParentCate(mt_cd: '013' | '015'): Observable<any> {
        return this.http.get<any>(`system/selectParentCate.do?mt_cd=${mt_cd}&_search=false&nd=1754018043860&rows=200&page=1&sidx=&sord=asc`);
    }

    insertParentCate_TPMItemInformation(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);
        formData.append('dt_cd', data.dt_cd);
        formData.append('dt_nm', data.name);
        formData.append('use_yn', data.use_yn);
        formData.append('dt_order', data.dt_order);
        formData.append('dt_exp', data.explain);

        return this.http.post('system/insertParentCate', formData, { responseType: 'text' as const });
    }

    updateParentCate_TPMItemInformation(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);
        formData.append('dt_cd', data.dt_cd);
        formData.append('dt_nm', data.dt_nm);
        formData.append('use_yn', data.use_yn);
        formData.append('dt_order', data.dt_order);
        formData.append('dt_exp', data.dt_exp);

        return this.http.post('system/updateParentCate', formData, { responseType: 'text' as const });
    }

    getParentCateOne(id: string): Observable<any> {
        return this.http.get<any>(`system/getParentCateOne/${id}`);
    }

    selectLocMgt(row: number): Observable<any> {
        return this.http.get<any>(`system/selectLocMgt.do?_search=false&nd=1754290435846&rows=${row}&page=1&sidx=&sord=asc`);
    }

    getLocOne(id: string): Observable<any> {
        return this.http.get<any>(`system/getLocOne/${id}`);
    }

    getSapLoc(): Observable<any> {
        return this.http.get<any>(`system/getSapLoc.do`);
    }

    updateLocMgt(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('lctno', data.lctno);
        formData.append('lct_nm', data.lct_nm);
        formData.append('mt_yn', data.mt_yn);
        formData.append('mv_yn', data.mv_yn);
        formData.append('rt_yn', data.rt_yn);
        formData.append('use_yn', data.use_yn);
        formData.append('re_mark', data.re_mark);
        formData.append('sap_lct_cd', data.sap_lct_cd);
        formData.append('manager_nm', data.manager_nm);
        formData.append('manager_id', data.manager_id);
        formData.append('level_cd', data.level_cd);
        formData.append('up_lct_cd', data.up_lct_cd);
        formData.append('lct_cd', data.lct_cd);

        return this.http.post('system/updateLocMgt.do', formData, { responseType: 'text' as const });
    }

    insertLocMgt(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('lctno', data.lctno);
        formData.append('lct_nm', data.lct_nm);
        formData.append('mt_yn', data.mt_yn);
        formData.append('mv_yn', data.mv_yn);
        formData.append('rt_yn', data.rt_yn);
        formData.append('re_mark', data.re_mark);
        formData.append('sap_lct_cd', data.sap_lct_cd);
        formData.append('manager_nm', data.manager_nm);
        formData.append('manager_id', data.manager_id);
        formData.append('level_cd', data.level_cd);
        formData.append('up_lct_cd', data.up_lct_cd);
        formData.append('lct_cd', data.lct_cd);
        formData.append('root_yn', data.root_yn);

        return this.http.post('system/insertLocMgt.do', formData, { responseType: 'text' as const });
    }

    selectAuthMgt(row: number): Observable<any> {
        return this.http.get<any>(`system/selectAuthMgt.do?_search=false&nd=1754366910741&rows=${row}&page=1&sidx=&sord=asc`);
    }
    selectAuthMemberInfo(at_cd: string, row: number): Observable<any> {
        return this.http.get<any>(`system/selectAuthMemberInfo.do?at_cd=${at_cd}&_search=false&nd=1754368563458&rows=${row}&page=1&sidx=&sord=asc`);
    }
    selectAuthMenuInfo(at_cd: string, row: number): Observable<any> {
        return this.http.get<any>(`system/selectAuthMenuInfo.do?at_cd=${at_cd}&_search=false&nd=1754368563461&rows=${row}&page=1&sidx=&sord=asc`);
    }

    delAuthMemberInfo(at_cd: string): Observable<any> {
        return this.http.post(`system/delAuthMemberInfo`, { at_cd: at_cd, keyword: '', searchType: 'userid_mn' }, { responseType: 'json' as const });
    }

    saveAuthMemberInfo(data: any): Observable<any> {
        return this.http.post(`system/saveAuthMemberInfo`, data, { responseType: 'json' as const });
    }

    delAuthMenuInfo(at_cd: string): Observable<any> {
        return this.http.post(`system/delAuthMenuInfo`, { at_cd: at_cd }, { responseType: 'text' as const });
    }

    saveAuthMenuInfo(data: any): Observable<any> {
        return this.http.post(`system/saveAuthMenuInfo`, data, { responseType: 'text' as const });
    }

    insertAuthMgt(param: any): Observable<any> {
        const formData = new FormData();
        formData.append('atno', param.atno);
        formData.append('at_cd', param.at_cd);
        formData.append('at_nm', param.at_nm);
        formData.append('use_yn', param.use_yn);
        formData.append('re_mark', param.re_mark);

        return this.http.post(`system/insertAuthMgt`, formData, { responseType: 'text' as const });
    }

    updateAuthMgt(param: any): Observable<any> {
        const formData = new FormData();
        formData.append('atno', param.atno);
        formData.append('at_cd', param.at_cd);
        formData.append('at_nm', param.at_nm);
        formData.append('use_yn', param.use_yn);
        formData.append('re_mark', param.re_mark);

        return this.http.post(`system/updateAuthMgt`, formData, { responseType: 'text' as const });
    }

    getAuthMgt(id: string): Observable<any> {
        return this.http.get<any>(`system/getAuthMgt/${id}`);
    }

    // get Name Page
    getNamePageParent(): Observable<any> {
        return this.http.get<any>(`comm/getCurrentMnfull/parentCate`);
    }

    getParentCategory(param: any): Observable<any> {
        return this.http.get<any>(`system/selectParentCate.do?mt_cd=001&_search=false&rows=${param.rows}&page=1&sidx=&sord=asc`);
    }

    insertParentCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);
        formData.append('dt_cd', data.dt_cd);
        formData.append('dt_nm', data.name);
        formData.append('dt_kr', data.korea);
        formData.append('dt_vn', data.vietnam);
        formData.append('dt_order', data.order);
        formData.append('dt_exp', data.explain);

        return this.http.post('system/insertParentCate', formData, { responseType: 'text' as const });
    }

    updateParentCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);
        formData.append('dt_cd', data.dt_cd);
        formData.append('dt_nm', data.name);
        formData.append('dt_kr', data.korea);
        formData.append('dt_vn', data.vietnam);
        formData.append('dt_order', data.order);
        formData.append('dt_exp', data.explain);

        return this.http.post('system/updateParentCate', formData, { responseType: 'text' as const });
    }

    delParentCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);

        return this.http.post('system/delParentCate', formData, { responseType: 'text' as const });
    }

    //Type
    getNamePageType(): Observable<any> {
        return this.http.get<any>(`comm/getCurrentMnfull/typeCate`);
    }

    getTypeCategory(param: any): Observable<any> {
        return this.http.get<any>(`system/selectParentCate.do?mt_cd=002&_search=false&rows=${param.rows}&page=1&sidx=&sord=asc`);
    }

    getTypeSearchCategory(param: any): Observable<any> {
        return this.http.get<any>(`system/selectParentCate.do?mt_cd=002&_search=false&rows=${param.rows}&val1=${param.parent}&page=1&sidx=&sord=asc`);
    }

    insertTypeCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);
        formData.append('dt_cd', data.dt_cd);
        formData.append('dt_nm', data.name);
        formData.append('val1', data.parent);
        formData.append('dt_kr', data.korea);
        formData.append('dt_vn', data.vietnam);
        formData.append('dt_order', data.order);
        formData.append('dt_exp', data.explain);

        return this.http.post('system/insertParentCate', formData, { responseType: 'text' as const });
    }

    updateTypeCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);
        formData.append('dt_cd', data.dt_cd);
        formData.append('dt_nm', data.name);
        formData.append('val1', data.parent);
        formData.append('dt_kr', data.korea);
        formData.append('dt_vn', data.vietnam);
        formData.append('dt_order', data.order);
        formData.append('dt_exp', data.explain);

        return this.http.post('system/updateParentCate', formData, { responseType: 'text' as const });
    }

    delTypeCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);

        return this.http.post('system/delParentCate', formData, { responseType: 'text' as const });
    }

    //Group
    getNamePageGroup(): Observable<any> {
        return this.http.get<any>(`comm/getCurrentMnfull/groupCate`);
    }

    getGroupCategory(param: any): Observable<any> {
        return this.http.get<any>(`system/selectParentCate.do?mt_cd=003&_search=false&rows=${param.rows}&page=1&sidx=&sord=asc`);
    }

    getGroupSearchCategory(param: any): Observable<any> {
        return this.http.get<any>(`system/selectParentCate.do?mt_cd=003&_search=false&rows=${param.rows}&val1=${param.parent}&val2=${param.type}&page=1&sidx=&sord=asc`);
    }

    insertGroupCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);
        formData.append('dt_cd', data.dt_cd);
        formData.append('dt_nm', data.name);
        formData.append('val1', data.parent);
        formData.append('val2', data.type);
        formData.append('dt_kr', data.korea);
        formData.append('dt_vn', data.vietnam);
        formData.append('dt_order', data.order);
        formData.append('dt_exp', data.explain);

        return this.http.post('system/insertParentCate', formData, { responseType: 'text' as const });
    }

    updateGroupCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);
        formData.append('dt_cd', data.dt_cd);
        formData.append('dt_nm', data.name);
        formData.append('val1', data.parent);
        formData.append('val2', data.type);
        formData.append('dt_kr', data.korea);
        formData.append('dt_vn', data.vietnam);
        formData.append('dt_order', data.order);
        formData.append('dt_exp', data.explain);

        return this.http.post('system/updateParentCate', formData, { responseType: 'text' as const });
    }

    delGroupCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);

        return this.http.post('system/delParentCate', formData, { responseType: 'text' as const });
    }

    // Function
    getNamePageFunction(): Observable<any> {
        return this.http.get<any>(`comm/getCurrentMnfull/functionCate`);
    }

    getFunctionCategory(param: any): Observable<any> {
        return this.http.get<any>(`system/selectParentCate.do?mt_cd=004&_search=false&rows=${param.rows}&page=1&sidx=&sord=asc`);
    }

    getFunctionSearchCategory(param: any): Observable<any> {
        return this.http.get<any>(`system/selectParentCate.do?mt_cd=004&_search=false&rows=${param.rows}&val1=${param.parent}&val2=${param.type}&val3=${param.group}&page=1&sidx=&sord=asc`);
    }

    insertFunctionCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);
        formData.append('dt_cd', data.dt_cd);
        formData.append('dt_nm', data.name);
        formData.append('val1', data.parent);
        formData.append('val2', data.type);
        formData.append('val3', data.group);
        formData.append('dt_kr', data.korea);
        formData.append('dt_vn', data.vietnam);
        formData.append('dt_order', data.order);
        formData.append('dt_exp', data.explain);

        return this.http.post('system/insertParentCate', formData, { responseType: 'text' as const });
    }

    updateFunctionCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);
        formData.append('dt_cd', data.dt_cd);
        formData.append('dt_nm', data.name);
        formData.append('val1', data.parent);
        formData.append('val2', data.type);
        formData.append('val3', data.group);
        formData.append('dt_kr', data.korea);
        formData.append('dt_vn', data.vietnam);
        formData.append('dt_order', data.order);
        formData.append('dt_exp', data.explain);

        return this.http.post('system/updateParentCate', formData, { responseType: 'text' as const });
    }

    delFunctionCate(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('mt_cd', data.mt_cd);
        formData.append('cdid', data.cdid);

        return this.http.post('system/delParentCate', formData, { responseType: 'text' as const });
    }

    // TPM Schedule
    getNamePageScheduleMaster(): Observable<any> {
        return this.http.get<any>(`comm/getCurrentMnfull/tpmScheduleMaster`);
    }

    getScheduleMaster(param: any): Observable<any> {
        return this.http.get<any>(`tpm/selectTpmSchaduleMt.do?start_date=&end_date=&searchType=&keyword=&_search=false&rows=${param.rows}&page=1&sidx=&sord=asc`);
    }

    getScheduleDetail(param: any): Observable<any> {
        return this.http.get<any>(`tpm/selectTpmSchaduleDt.do?tc_cd=${param.tc_cd}&searchType=&keyword=&_search=false&rows=${param.rows}&val1=${param.parent}&val2=${param.type}&val3=${param.group}&page=1&sidx=&sord=asc`);
    }

    insertScheduleMaster(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('tcno', data.tcno);
        formData.append('tc_cd', data.tc_cd);
        formData.append('tc_nm', data.tc_nm);
        formData.append('tpm_cyle', data.tpm_cyle);
        formData.append('tpm_cyle_unit', data.tpm_cyle_unit);
        formData.append('mf_cd', data.mf_cd);
        formData.append('md_cd', data.md_cd);
        formData.append('alarm_yn', data.alarm_yn);
        formData.append('alarm_dt_cd', data.alarm_dt_cd);
        formData.append('use_yn', data.use_yn);
        formData.append('re_mark', data.re_mark);

        return this.http.post('tpm/insertTpmSchaduleMt', formData, { responseType: 'text' as const });
    }

    updateScheduleMaster(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('tcno', data.tcno);
        formData.append('tc_cd', data.tc_cd);
        formData.append('tc_nm', data.tc_nm);
        formData.append('tpm_cyle', data.tpm_cyle);
        formData.append('tpm_cyle_unit', data.tpm_cyle_unit);
        formData.append('mf_cd', data.mf_cd);
        formData.append('md_cd', data.md_cd);
        formData.append('alarm_yn', data.alarm_yn);
        formData.append('alarm_dt_cd', data.alarm_dt_cd);
        formData.append('use_yn', data.use_yn);
        formData.append('re_mark', data.re_mark);

        return this.http.post('tpm/updateTpmSchaduleMt', formData, { responseType: 'text' as const });
    }

    insertScheduleDetail(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('tcno', data.tcno);
        formData.append('tc_cd', data.tc_cd);
        formData.append('td_cd', data.td_cd);
        formData.append('order_no', data.order_no);
        formData.append('use_yn', data.use_yn);
        formData.append('re_mark', data.re_mark);

        return this.http.post('tpm/insertTpmSchaduleDt', formData, { responseType: 'text' as const });
    }

    updateScheduleDetail(data: any): Observable<any> {
        const formData = new FormData();
        formData.append('tdno', data.tdno);
        formData.append('tc_cd', data.tc_cd);
        formData.append('td_cd', data.td_cd);
        formData.append('order_no', data.order_no);
        formData.append('use_yn', data.use_yn);
        formData.append('re_mark', data.re_mark);

        return this.http.post('tpm/updateTpmSchaduleDt', formData, { responseType: 'text' as const });
    }

    // get Name Page Language
    getNamePageLanguage(): Observable<any> {
        return this.http.get<any>(`comm/getCurrentMnfull/parentCate`);
    }

    getLanguageCategory(param: any): Observable<any> {
        return this.http.get<any>(`utils/get-lang`);
    }

    insertLanguageCate(data: any): Observable<any> {
        return this.http.post('utils/save-lang', data, { responseType: 'text' as const });
    }

    updateLanguageCate(data: any): Observable<any> {
        return this.http.post('utils/save-lang', data, { responseType: 'text' as const });
    }

    delLanguageCate(data: any): Observable<any> {
        return this.http.post('utils/del-lang', data, { responseType: 'text' as const });
    }
}
