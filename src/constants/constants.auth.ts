// constants.ts
export const Name_Token = 'eis_v3_token';
export const Name_Remember = 'eiv_v3-remember';
export const Name_Dark = '.eiv_v3-app-dark';
export const Name_ThemeLayout = 'eiv_v3-theme-layout';
export const Name_Language = 'language';
export const Name_Role = {
    administrator: 'system administrator',
    uiprime: 'uiprime',
    subscriber: 'General User',
    manager: 'General Manager',
    unapproved: 'Unapproved'
};
export const expectedRole = 'expectedRole';
export const Path_before_login = 'before_login_error';
export const Image_Url_Serve = 'https://ams.hsvina.com/';
export type LanguageType = "LANG_EN" | "LANG_VN" | "LANG_KR";

export const login_Language = {
    userID: {
        "LANG_EN": 'User ID',
        "LANG_VN": 'Mã người dùng',
        "LANG_KR": '사용자 ID'
    },
    password: {
        "LANG_EN": 'Password',
        "LANG_VN": 'Mật Khẩu',
        "LANG_KR": '비밀번호'
    },
    remember: {
        "LANG_EN": 'Remember me',
        "LANG_VN": 'Ghi nhớ',
        "LANG_KR": '나를 기억해'
    },
    SignIn: {
        "LANG_EN": 'Login',
        "LANG_VN": 'Đăng nhập',
        "LANG_KR": '로그인'
    },
    titleLoginMail: {
        "LANG_EN": 'or Login With mail HSV',
        "LANG_VN": 'hoặc Đăng nhập bằng email HSV',
        "LANG_KR": '또는 메일 HSV로 로그인'
    },
    MailHSV: {
        "LANG_EN": 'Mail HSVINA',
        "LANG_VN": 'Mail HSVINA',
        "LANG_KR": '메일 HSVINA'
    }
};

export const Language = {
    nameQRcode: {
        "LANG_EN": 'QR Code Management',
        "LANG_VN": 'Quản lý mã QR',
        "LANG_KR": 'QR 코드 관리'
    },

    select_Corp_emptyMessage: {
        en: "First, please select 'Corp'",
        vi: "Vui lòng chọn 'Công Ty' trước",
        ko: "먼저 '법인'을 선택해주세요"
    },
    select_Manufacturer_emptyMessage: {
        en: "First, please select 'Manufacturer'",
        vi: "Vui lòng chọn 'Nhà sản xuất' trước",
        ko: "먼저 '제조업체'을 선택해주세요"
    },
    select_Parent_emptyMessage: {
        en: "First, please select 'Parent'",
        vi: "Vui lòng chọn 'Cha' trước",
        ko: "먼저 '조상'을 선택해주세요"
    },
    select_Type_emptyMessage: {
        en: "First, please select 'Type'",
        vi: "Vui lòng chọn 'Loại' trước",
        ko: "먼저 '유형'을 선택해주세요"
    },

    // Equipment Information Page
    nameEquipmentInformation: {
        "LANG_EN": 'Equipment Information',
        "LANG_VN": 'Thông tin Trang thiết bị',
        "LANG_KR": '장비 정보'
    },
    nameCreateEquipmentInformation: {
        "LANG_EN": 'Create Equipment Information',
        "LANG_VN": 'Tạo thông tin Trang thiết bị',
        "LANG_KR": '장비 정보 생성'
    },
    searchByEquipmentInformation: {
        "LANG_EN": 'Search alphabet of Corp, Parent, Storage, Material',
        "LANG_VN": 'Tìm kiếm theo Công ty, Cha, Kho, Vật liệu',
        "LANG_KR": '코드, 이름, 브랜드 이름으로 검색'
    },
    btn_CreateEquipmentInformation: {
        "LANG_EN": 'Create Equipment Information',
        "LANG_VN": 'Tạo thông tin Trang thiết bị',
        "LANG_KR": '장비 정보 생성'
    },

    // Manufacturer Information Page
    nameManufacturerInformation: {
        "LANG_EN": 'Manufacturer Information',
        "LANG_VN": 'Thông tin Nhà sản xuất',
        "LANG_KR": '제조업체 정보'
    },
    nameCreateManufacturerInformation: {
        "LANG_EN": 'Create Manufacturer Information',
        "LANG_VN": 'Tạo thông tin Nhà sản xuất',
        "LANG_KR": '제조업체 정보 생성'
    },
    searchByManufacturerInformation: {
        "LANG_EN": 'Search alphabet of Code, Name, Brand Name',
        "LANG_VN": 'Tìm kiếm theo Mã, Tên, Thương hiệu',
        "LANG_KR": '코드, 이름, 브랜드 이름으로 검색'
    },
    btn_CreateManufacturerInformation: {
        "LANG_EN": 'Create Manufacturer Information',
        "LANG_VN": 'Tạo thông tin Nhà sản xuất',
        "LANG_KR": '제조업체 정보 생성'
    },

    // Model Information Page
    nameModelInformation: {
        "LANG_EN": 'Model Information',
        "LANG_VN": 'Thông tin Mẫu',
        "LANG_KR": '모델 정보'
    },
    nameCreateModelInformation: {
        "LANG_EN": 'Create Model Information',
        "LANG_VN": 'Tạo thông tin Mẫu',
        "LANG_KR": '모델 정보 생성'
    },
    searchByModelInformation: {
        "LANG_EN": 'Search alphabet of Code, Name, Manufacturer, Group',
        "LANG_VN": 'Tìm kiếm theo Mã, Tên, Nhà sản xuất, Nhóm',
        "LANG_KR": '코드, 이름, 제조업체, 그룹으로 검색'
    },
    btn_CreateModel: {
        "LANG_EN": 'Create Model',
        "LANG_VN": 'Tạo Mẫu',
        "LANG_KR": '모델 생성'
    },
    select_Function_emptyMessage: {
        en: "First, please select 'Group'",
        vi: "Vui lòng chọn 'Nhóm' trước",
        ko: "먼저 '그룹'을 선택해주세요"
    },

    // Supplier Information
    nameSupplierInformation: {
        "LANG_EN": 'Supplier Information',
        "LANG_VN": 'Thông tin Nhà cung cấp',
        "LANG_KR": '공급업체 정보'
    },
    nameCreateSupplierInformation: {
        "LANG_EN": 'Create Supplier Information',
        "LANG_VN": 'Tạo thông tin Nhà cung cấp',
        "LANG_KR": '공급업체 정보 생성'
    },
    searchBySupplierInformation: {
        "LANG_EN": 'Search alphabet of Code, Name, Website, Phone Number, Email',
        "LANG_VN": 'Tìm kiếm theo Mã, Tên, Trang web, Số điện thoại, Email',
        "LANG_KR": '코드, 이름, 웹사이트, 전화번호, 이메일로 검색'
    },
    searchByEquipmentAssetReport: {
        "LANG_EN": 'Search alphabet of Corp, Parent, Storage, Material',
        "LANG_VN": 'Tìm kiếm theo Công Ty, Cha, Kho, Vật liệu',
        "LANG_KR": '법인, 조상, 저장소, 재료, 로 검색'
    },
    searchByUserManagement: {
        "LANG_EN": 'Search alphabet of Id, Name, Cell Phone, Email',
        "LANG_VN": 'Tìm kiếm theo Mã, Tên, Số điện thoại, Email',
        "LANG_KR": '아이디, 이름, 휴대폰 번호, 이메일 알파벳 검색'
    },
    btn_CreateSupplier: {
        "LANG_EN": 'Create Supplier',
        "LANG_VN": 'Tạo Nhà cung cấp',
        "LANG_KR": '공급업체 생성'
    },

    Material_Search: {
        "LANG_EN": 'Material Search',
        "LANG_VN": 'Tìm kiếm Vật liệu',
        "LANG_KR": '재료 검색',
    },
    Select_Material_Code: {
        "LANG_EN": 'Select Material Code',
        "LANG_VN": 'Chọn mã Vật liệu',
        "LANG_KR": '재료 코드 선택',
    },
    Search_keyword: {
        "LANG_EN": 'Search keyword',
        "LANG_VN": 'Tìm kiếm từ khóa',
        "LANG_KR": '검색 키워드',
    },

    // Location History
    nameLocationHistory: {
        "LANG_EN": 'Location History',
        "LANG_VN": 'Lịch sử Vị trí',
        "LANG_KR": '위치 기록'
    },

    btn_Login: {
        "LANG_EN": 'Login',
        "LANG_VN": 'Đăng nhập',
        "LANG_KR": '로그인'
    },
    btn_Search: {
        "LANG_EN": 'Search',
        "LANG_VN": 'Tìm Kiếm',
        "LANG_KR": '찾다'
    },
    btn_Apply_Search: {
        "LANG_EN": 'Apply Search',
        "LANG_VN": 'Tìm Kiếm',
        "LANG_KR": '검색 적용'
    },
    btn_Add_New: {
        "LANG_EN": 'Add New',
        "LANG_VN": 'Thêm mới',
        "LANG_KR": '새로 추가'
    },
    btn_Clear_All: {
        "LANG_EN": 'Clear All',
        "LANG_VN": 'Xóa tất cả',
        "LANG_KR": '모두 지우기'
    },
    btn_Refresh: {
        "LANG_EN": 'Refresh',
        "LANG_VN": 'Làm mới',
        "LANG_KR": '새로 고치다'
    },
    btn_ClearFilter: {
        "LANG_EN": 'Clear Filter',
        "LANG_VN": 'Xóa bộ lọc',
        "LANG_KR": '필터 지우기'
    },
    btn_Clear: {
        "LANG_EN": 'Clear',
        "LANG_VN": 'Xóa',
        "LANG_KR": '지우다'
    },
    btn_ShowFilter: {
        "LANG_EN": 'Show Filter',
        "LANG_VN": 'Hiện thị bộ lọc',
        "LANG_KR": '필터 표시'
    },
    btn_Export: {
        "LANG_EN": 'Export',
        "LANG_VN": 'Xuất',
        "LANG_KR": '수출'
    },
    btn_GenerateQR: {
        "LANG_EN": 'Generate QR Code',
        "LANG_VN": 'Tạo mã QR',
        "LANG_KR": 'QR 코드 생성'
    },
    btn_Create: {
        "LANG_EN": 'Create',
        "LANG_VN": 'Tạo',
        "LANG_KR": '생성'
    },
    btn_Save: {
        "LANG_EN": 'Save',
        "LANG_VN": 'Lưu',
        "LANG_KR": '저장하다'
    },
    btn_Cancel: {
        "LANG_EN": 'Cancel',
        "LANG_VN": 'Hủy',
        "LANG_KR": '취소'
    },

    grid_Code: {
        "LANG_EN": 'Code',
        "LANG_VN": 'Mã',
        "LANG_KR": '규약'
    },
    grid_Mail: {
        "LANG_EN": 'Mail',
        "LANG_VN": 'Thư',
        "LANG_KR": '우편'
    },
    grid_Name: {
        "LANG_EN": 'Name',
        "LANG_VN": 'Tên',
        "LANG_KR": '이름'
    },
    grid_Description: {
        "LANG_EN": 'Description',
        "LANG_VN": 'Mô tả',
        "LANG_KR": '설명'
    },
    grid_Manufacturer: {
        "LANG_EN": 'Manufacturer',
        "LANG_VN": 'Nhà sản xuất',
        "LANG_KR": '제조업체'
    },
    grid_Manufacturer_Name: {
        "LANG_EN": 'Manufacturer Name',
        "LANG_VN": 'Tên nhà sản xuất',
        "LANG_KR": '제조업체 이름'
    },
    grid_Group: {
        "LANG_EN": 'Group',
        "LANG_VN": 'Nhóm',
        "LANG_KR": '그룹'
    },
    grid_Website: {
        "LANG_EN": 'Website',
        "LANG_VN": 'Trang web',
        "LANG_KR": '웹사이트'
    },
    grid_Phone_Number: {
        "LANG_EN": 'Phone Number',
        "LANG_VN": 'Số điện thoại',
        "LANG_KR": '전화번호'
    },
    grid_EMail: {
        "LANG_EN": 'E-Mail',
        "LANG_VN": 'Email',
        "LANG_KR": '이메일'
    },
    grid_Brand_Name: {
        "LANG_EN": 'Brand Name',
        "LANG_VN": 'Tên thương hiệu',
        "LANG_KR": '브랜드 이름'
    },
    grid_Logo: {
        "LANG_EN": 'Logo',
        "LANG_VN": 'Biểu tượng',
        "LANG_KR": '심벌 마크'
    },
    grid_Address: {
        "LANG_EN": 'Address',
        "LANG_VN": 'Địa chỉ',
        "LANG_KR": '주소'
    },
    grid_Model_No: {
        "LANG_EN": 'Model No',
        "LANG_VN": 'Mẫu số',
        "LANG_KR": '모델 번호'
    },
    grid_Finish: {
        "LANG_EN": 'Finish',
        "LANG_VN": 'Hoàn thành',
        "LANG_KR": '마치다'
    },
    grid_Cost_Dept: {
        "LANG_EN": 'Cost Dept',
        "LANG_VN": 'Bộ phận Chi phí',
        "LANG_KR": '비용 부서'
    },
    grid_Material_Name: {
        "LANG_EN": 'Material Name',
        "LANG_VN": 'Tên vật liệu',
        "LANG_KR": '재료 이름'
    },
    grid_Storage_Status: {
        "LANG_EN": 'Storage Status',
        "LANG_VN": 'Trạng thái Kho',
        "LANG_KR": '저장소 상태'
    },
    grid_Supplier: {
        "LANG_EN": 'Supplier',
        "LANG_VN": 'Nhà cung cấp',
        "LANG_KR": '공급업체'
    },
    grid_Supplier_Name: {
        "LANG_EN": 'Supplier Name',
        "LANG_VN": 'Tên nhà cung cấp',
        "LANG_KR": '공급업체 이름'
    },
    grid_Management_Dept: {
        "LANG_EN": 'Management Dept',
        "LANG_VN": 'Bộ phận Quản lý',
        "LANG_KR": '관리 부서'
    },
    grid_Printed_Or_Not: {
        "LANG_EN": 'Printed or Not',
        "LANG_VN": 'In hay không',
        "LANG_KR": '인쇄 여부'
    },
    grid_Used_Or_Not: {
        "LANG_EN": 'Used or Not',
        "LANG_VN": 'Sử dụng hay không',
        "LANG_KR": '사용 여부'
    },
    grid_Asset_Number: {
        "LANG_EN": 'Asset Number',
        "LANG_VN": 'Số tài sản',
        "LANG_KR": '자산 번호'
    },
    grid_Asset_Serial: {
        "LANG_EN": 'Asset Serial',
        "LANG_VN": 'Số Sê-ri',
        "LANG_KR": '자산 일련번호'
    },
    grid_Asset_No: {
        "LANG_EN": 'Asset No',
        "LANG_VN": 'Số tài sản',
        "LANG_KR": '자산 번호'
    },
    grid_Serial_Number: {
        "LANG_EN": 'Serial Number',
        "LANG_VN": 'Số seri',
        "LANG_KR": '일련번호'
    },
    grid_Serial_No: {
        "LANG_EN": 'Serial No',
        "LANG_VN": 'Số sê-ri',
        "LANG_KR": '일련번호'
    },
    grid_Schedule_Name: {
        "LANG_EN": 'Schedule Name',
        "LANG_VN": 'Tên Lịch trình',
        "LANG_KR": '일정 이름'
    },
    grid_Schedule_Code: {
        "LANG_EN": 'Schedule Code',
        "LANG_VN": 'Mã Lịch trình',
        "LANG_KR": '일정 코드'
    },
    grid_Schedule: {
        "LANG_EN": 'Schedule',
        "LANG_VN": 'Lịch trình',
        "LANG_KR": '일정'
    },
    grid_Worker: {
        "LANG_EN": 'Worker',
        "LANG_VN": 'Người lao động',
        "LANG_KR": '근로자'
    },
    grid_Worker_Name: {
        "LANG_EN": 'Worker Name',
        "LANG_VN": 'Tên người lao động',
        "LANG_KR": '근로자 이름'
    },
    grid_Workplace: {
        "LANG_EN": 'Workplace',
        "LANG_VN": 'Nơi làm việc',
        "LANG_KR": '직장'
    },
    grid_Manager: {
        "LANG_EN": 'Manager',
        "LANG_VN": 'Quản lý',
        "LANG_KR": '관리자'
    },
    grid_Manager_Name: {
        "LANG_EN": 'Manager Name',
        "LANG_VN": 'Tên quản lý',
        "LANG_KR": '관리자 이름'
    },
    grid_Purchased_Date: {
        "LANG_EN": 'Purchased Date',
        "LANG_VN": 'Ngày mua',
        "LANG_KR": '구매일'
    },
    grid_Valid_Date: {
        "LANG_EN": 'Valid Date',
        "LANG_VN": 'Ngày hết hạn',
        "LANG_KR": '만료일'
    },
    grid_Start_Date: {
        "LANG_EN": 'Start Date',
        "LANG_VN": 'Ngày bắt đầu',
        "LANG_KR": '시작일'
    },
    grid_Remark: {
        "LANG_EN": 'Remark',
        "LANG_VN": 'Ghi chú',
        "LANG_KR": '비고'
    },
    grid_Barcode: {
        "LANG_EN": 'Barcode',
        "LANG_VN": 'Mã vạch',
        "LANG_KR": '바코드'
    },
    grid_Function: {
        "LANG_EN": 'Function',
        "LANG_VN": 'Chức năng',
        "LANG_KR": '기능'
    },
    grid_Electronic_Input: {
        "LANG_EN": 'Electronic Input',
        "LANG_VN": 'Đầu vào điện tử',
        "LANG_KR": '전자 입력'
    },
    grid_Electronic_Unit: {
        "LANG_EN": 'Electronic Unit',
        "LANG_VN": 'Đơn vị điện tử',
        "LANG_KR": '전자 장치'
    },
    grid_Weight: {
        "LANG_EN": 'Weight',
        "LANG_VN": 'Trọng lượng',
        "LANG_KR": '무게'
    },
    grid_Photo_File: {
        "LANG_EN": 'Photo File',
        "LANG_VN": 'Tệp ảnh',
        "LANG_KR": '사진 파일'
    },
    grid_Model: {
        "LANG_EN": 'Model',
        "LANG_VN": 'Mẫu',
        "LANG_KR": '모델'
    },
    grid_Status_Date: {
        "LANG_EN": 'Status Date',
        "LANG_VN": 'Ngày trạng thái',
        "LANG_KR": '상태 날짜'
    },
    grid_Storage: {
        "LANG_EN": 'Storage',
        "LANG_VN": 'Kho',
        "LANG_KR": '저장소'
    },
    grid_Status: {
        "LANG_EN": 'Status',
        "LANG_VN": 'Trạng thái',
        "LANG_KR": '상태'
    },
    grid_Material: {
        "LANG_EN": 'Material',
        "LANG_VN": 'Vật liệu',
        "LANG_KR": '재료'
    },
    grid_Type: {
        "LANG_EN": 'Type',
        "LANG_VN": 'Loại',
        "LANG_KR": '유형'
    },
    grid_Create_Name: {
        "LANG_EN": 'Create Name',
        "LANG_VN": 'Tên người tạo',
        "LANG_KR": '작성자 이름'
    },
    grid_Create_Date: {
        "LANG_EN": 'Create Date',
        "LANG_VN": 'Ngày tạo',
        "LANG_KR": '작성 날짜'
    },
    grid_Reg_Name: {
        "LANG_EN": 'Reg Name',
        "LANG_VN": 'Tên người đăng ký',
        "LANG_KR": '이름 등록'
    },
    grid_Reg_Date: {
        "LANG_EN": 'Reg Date',
        "LANG_VN": 'Ngày đăng ký',
        "LANG_KR": '등록 날짜'
    },
    grid_Change_Name: {
        "LANG_EN": 'Change Name',
        "LANG_VN": 'Tên người đổi',
        "LANG_KR": '변경자 이름'
    },
    grid_Change_Date: {
        "LANG_EN": 'Change Date',
        "LANG_VN": 'Ngày đổi',
        "LANG_KR": '변경 날짜'
    },
    grid_Update_Name: {
        "LANG_EN": 'Update Name',
        "LANG_VN": 'Tên người cập nhật',
        "LANG_KR": '업데이트 이름'
    },
    grid_Update_Date: {
        "LANG_EN": 'Update Date',
        "LANG_VN": 'Ngày cập nhật',
        "LANG_KR": '업데이트 날짜'
    },
    grid_Weight_Unit: {
        "LANG_EN": 'Weight Unit',
        "LANG_VN": 'Đơn vị trọng lượng',
        "LANG_KR": '무게 단위'
    },
    grid_EConsumption: {
        "LANG_EN": 'E-Consumption',
        "LANG_VN": 'Tiêu thụ điện',
        "LANG_KR": 'E-소비량'
    },
    grid_EConsumption_Unit: {
        "LANG_EN": 'E-Consumption Unit',
        "LANG_VN": 'Đơn vị tiêu thụ điện',
        "LANG_KR": 'E-소비량 단위'
    },
    grid_Dimension: {
        "LANG_EN": 'Dimension',
        "LANG_VN": 'Kích thước',
        "LANG_KR": '크기'
    },
    grid_Choose_File: {
        "LANG_EN": 'Choose File:',
        "LANG_VN": 'Chọn tệp:',
        "LANG_KR": '파일 선택:'
    },
    grid_Drag_Drop_Files: {
        "LANG_EN": 'Drag and drop files to here to upload.',
        "LANG_VN": 'Kéo và thả tệp vào đây để tải lên.',
        "LANG_KR": '업로드하려면 파일을 여기로 드래그 앤 드롭하세요.'
    },
    grid_Corp: {
        "LANG_EN": 'Corp',
        "LANG_VN": 'Công ty',
        "LANG_KR": '법인'
    },
    grid_Parent: {
        "LANG_EN": 'Parent',
        "LANG_VN": 'Cha',
        "LANG_KR": '조상'
    },
    grid_Password: {
        "LANG_EN": 'Password',
        "LANG_VN": 'Mật khẩu',
        "LANG_KR": '비밀번호'
    },
    grid_Screen_Alarm: {
        "LANG_EN": 'Screen Alarm',
        "LANG_VN": 'Màn hình báo thức',
        "LANG_KR": '알람 화면'
    },
    grid_Material_Code: {
        "LANG_EN": 'Material code',
        "LANG_VN": 'Mã vật liệu',
        "LANG_KR": '재료 코드'
    },
    grid_Language: {
        "LANG_EN": 'Language',
        "LANG_VN": 'Ngôn ngữ',
        "LANG_KR": '언어'
    },
    grid_Material_Des: {
        "LANG_EN": 'Material description',
        "LANG_VN": 'Mô tả vật liệu',
        "LANG_KR": '재료 설명'
    },
    grid_Storage_Loca: {
        "LANG_EN": 'Storage Loca',
        "LANG_VN": 'Địa điểm lưu trữ',
        "LANG_KR": '보관 장소'
    },
    grid_Des_of_Storage_Loca: {
        "LANG_EN": 'Des of Storage Loca',
        "LANG_VN": 'Mô tả vị trí lưu trữ',
        "LANG_KR": '저장 위치 설명'
    },
    grid_Cost_Center_Name: {
        "LANG_EN": 'Cost Center Name',
        "LANG_VN": 'Tên Trung tâm Chi phí',
        "LANG_KR": '비용 센터 이름'
    },
    grid_Maker: {
        "LANG_EN": 'Maker',
        "LANG_VN": 'Nhà sản xuất',
        "LANG_KR": '제조업체'
    },
    grid_Location_State: {
        "LANG_EN": 'Location State',
        "LANG_VN": 'Trạng thái vị trí',
        "LANG_KR": '위치 상태'
    },
    grid_Machine_Description: {
        "LANG_EN": 'Machine Description',
        "LANG_VN": 'Mô tả máy',
        "LANG_KR": '기계 설명'
    },
    grid_Machine_Name: {
        "LANG_EN": 'Machine Name',
        "LANG_VN": 'Tên máy',
        "LANG_KR": '기계 이름'
    },
    grid_Storage_Updated_Date: {
        "LANG_EN": 'Storage Updated Date',
        "LANG_VN": 'Ngày cập nhật lưu trữ',
        "LANG_KR": '저장 업데이트 날짜'
    },
    grid_Location: {
        "LANG_EN": 'Location',
        "LANG_VN": 'Vị trí',
        "LANG_KR": '위치'
    },
    grid_Requester: {
        "LANG_EN": 'Requester',
        "LANG_VN": 'Người yêu cầu',
        "LANG_KR": '요청자'
    },
    grid_Receiver: {
        "LANG_EN": 'Receiver',
        "LANG_VN": 'Người nhận',
        "LANG_KR": '수신자'
    },
    grid_Input: {
        "LANG_EN": 'Input',
        "LANG_VN": 'Nhập',
        "LANG_KR": '입력'
    },
    grid_Create_QR_Date: {
        "LANG_EN": 'Create(QR) Date',
        "LANG_VN": 'Ngày tạo (QR)',
        "LANG_KR": '생성(QR) 날짜'
    },
    grid_State: {
        "LANG_EN": 'State',
        "LANG_VN": 'Tình trạng',
        "LANG_KR": '상태'
    },
    grid_Quantity: {
        "LANG_EN": 'Quantity',
        "LANG_VN": 'Số lượng',
        "LANG_KR": '수량'
    },
    grid_Unit: {
        "LANG_EN": 'Unit',
        "LANG_VN": 'Đơn vị',
        "LANG_KR": '단위'
    },
    grid_UseYN: {
        "LANG_EN": 'Use Y/N',
        "LANG_VN": 'Sử Dụng Y/N',
        "LANG_KR": '사용 여부'
    },
    grid_Buying_Date: {
        "LANG_EN": 'Buying Date',
        "LANG_VN": 'Ngày mua',
        "LANG_KR": '구매일'
    },
    grid_Reason: {
        "LANG_EN": 'Reason',
        "LANG_VN": 'Lý do',
        "LANG_KR": '이유'
    },
    grid_Output_Date: {
        "LANG_EN": 'Output Date',
        "LANG_VN": 'Ngày xuất',
        "LANG_KR": '출력 날짜'
    },
    grid_Input_Date: {
        "LANG_EN": 'Input Date',
        "LANG_VN": 'Ngày nhập',
        "LANG_KR": '입력 날짜'
    },
    grid_Request_Dept: {
        "LANG_EN": 'Request Dept',
        "LANG_VN": 'Bộ phận yêu cầu',
        "LANG_KR": '요청부서'
    },
    grid_Provide_Dept: {
        "LANG_EN": 'Provide Dept',
        "LANG_VN": 'Bộ phận cung cấp',
        "LANG_KR": '부서 제공'
    },
    grid_Machine_Code: {
        "LANG_EN": 'Machine Code',
        "LANG_VN": 'Mã máy',
        "LANG_KR": '머신코드'
    },
    grid_Equipment_Name: {
        "LANG_EN": 'Equipment Name',
        "LANG_VN": 'Tên thiết bị',
        "LANG_KR": '장비 이름'
    },
    grid_State_Name: {
        "LANG_EN": 'State Name',
        "LANG_VN": 'Tên tình trạng',
        "LANG_KR": '상태 이름'
    },
    grid_Location_Name: {
        "LANG_EN": 'Location Name',
        "LANG_VN": 'Tên địa điểm',
        "LANG_KR": '위치 이름'
    },
    grid_Location_State_Name: {
        "LANG_EN": 'Location State Name',
        "LANG_VN": 'Tên tình trạng địa điểm',
        "LANG_KR": '위치 상태 이름'
    },
    grid_Model_Code: {
        "LANG_EN": 'Model Code',
        "LANG_VN": 'Mã mẫu',
        "LANG_KR": '모델 코드'
    },
    grid_Model_Name: {
        "LANG_EN": 'Model Name',
        "LANG_VN": 'Tên mẫu',
        "LANG_KR": '모델이름'
    },
    grid_TOTAL: {
        "LANG_EN": 'TOTAL',
        "LANG_VN": 'TỔNG CỘNG',
        "LANG_KR": '전체',
    },
    grid_Total: {
        "LANG_EN": 'Total',
        "LANG_VN": 'Tổng cộng',
        "LANG_KR": '전체',
    },
    grid_Use: {
        "LANG_EN": 'Use',
        "LANG_VN": 'Sử dụng',
        "LANG_KR": '사용',
    },
    grid_Not_In_ERP: {
        "LANG_EN": 'Not In ERP',
        "LANG_VN": 'Không trong ERP',
        "LANG_KR": 'ERP에 없음',
    },
    grid_Count: {
        "LANG_EN": 'Count',
        "LANG_VN": 'số lượng',
        "LANG_KR": '개수',
    },
    grid_Asset_Count: {
        "LANG_EN": 'Asset Count',
        "LANG_VN": 'Số lượng tài sản',
        "LANG_KR": '자산 수',
    },
    grid_Rate: {
        "LANG_EN": 'Rate',
        "LANG_VN": 'Tỷ lệ',
        "LANG_KR": '비율',
    },
    grid_Using: {
        "LANG_EN": 'Using',
        "LANG_VN": 'Đang sử dụng',
        "LANG_KR": '사용 중',
    },
    grid_No_Use: {
        "LANG_EN": 'No Use',
        "LANG_VN": 'Không sử dụng',
        "LANG_KR": '사용 불가',
    },
    grid_Repair: {
        "LANG_EN": 'Repair',
        "LANG_VN": 'Sửa chữa',
        "LANG_KR": '수리하다',
    },
    grid_Waiting: {
        "LANG_EN": 'Waiting',
        "LANG_VN": 'Đang đợi',
        "LANG_KR": '대기 중',
    },
    grid_Stock: {
        "LANG_EN": 'Stock',
        "LANG_VN": 'Hàng tồn kho',
        "LANG_KR": '재고',
    },
    grid_Broken: {
        "LANG_EN": 'Broken',
        "LANG_VN": 'Hỏng',
        "LANG_KR": '고장',
    },
    grid_Useless: {
        "LANG_EN": 'Useless',
        "LANG_VN": 'Không dùng',
        "LANG_KR": '사용 불가',
    },
    grid_Rental: {
        "LANG_EN": 'Rental',
        "LANG_VN": 'Cho thuê',
        "LANG_KR": '대여',
    },
    grid_Departure: {
        "LANG_EN": 'Departure',
        "LANG_VN": 'Điểm khởi hành',
        "LANG_KR": '출발지'
    },
    grid_Destination: {
        "LANG_EN": 'Destination',
        "LANG_VN": 'Điểm đến',
        "LANG_KR": '목적지'
    },
    grid_Date: {
        "LANG_EN": 'Date',
        "LANG_VN": 'Ngày',
        "LANG_KR": '날짜'
    },
    grid_Factory: {
        "LANG_EN": 'Factory',
        "LANG_VN": 'Nhà máy',
        "LANG_KR": '공장'
    },
    grid_User_Id: {
        "LANG_EN": 'User Id',
        "LANG_VN": 'Mã người dùng',
        "LANG_KR": '사용자 ID'
    },
    grid_User_Name: {
        "LANG_EN": 'User Name',
        "LANG_VN": 'Tên người dùng',
        "LANG_KR": '사용자 이름'
    },
    grid_Grade: {
        "LANG_EN": 'Grade',
        "LANG_VN": 'Lớp',
        "LANG_KR": '학년'
    },
    grid_Cell_Number: {
        "LANG_EN": 'Cell Number',
        "LANG_VN": 'Số điện thoại',
        "LANG_KR": '휴대폰 번호'
    },
    grid_Memo: {
        "LANG_EN": 'Memo',
        "LANG_VN": 'Ghi nhớ',
        "LANG_KR": '메모'
    },
    grid_More_Info: {
        "LANG_EN": 'More Info',
        "LANG_VN": 'Xem thêm',
        "LANG_KR": '더 많은 정보'
    },
    grid_Total_Assets: {
        "LANG_EN": 'Total Assets',
        "LANG_VN": 'Tổng tài sản',
        "LANG_KR": '총 자산'
    },
    grid_Main_Code_Name: {
        "LANG_EN": 'Main Code Name',
        "LANG_VN": 'Tên mã chính',
        "LANG_KR": '주요 코드명'
    },
    grid_Main_Code_Explain: {
        "LANG_EN": 'Main Code Explain',
        "LANG_VN": 'Mã chính Giải thích',
        "LANG_KR": '주요 코드 설명'
    },
    grid_Detail_Code: {
        "LANG_EN": 'Detail Code',
        "LANG_VN": 'Mã chi tiết',
        "LANG_KR": '세부 코드'
    },
    grid_Detail_Code_Name: {
        "LANG_EN": 'Detail Code Name',
        "LANG_VN": 'Tên mã chi tiết',
        "LANG_KR": '세부 코드명'
    },
    grid_Detail_Code_Explain: {
        "LANG_EN": 'Detail Code Explain',
        "LANG_VN": 'Mã chi tiết Giải thích',
        "LANG_KR": '세부 코드 설명'
    },
    grid_Detail_Order: {
        "LANG_EN": 'Detail Order',
        "LANG_VN": 'Thứ tự chi tiết',
        "LANG_KR": '세부 순서'
    },
    grid_Main_Explain: {
        "LANG_EN": 'Main Explain',
        "LANG_VN": 'Giải thích chính',
        "LANG_KR": '주요 설명'
    },
    grid_Detail_Explain: {
        "LANG_EN": 'Detail Explain',
        "LANG_VN": 'Giải thích chi tiết',
        "LANG_KR": '세부 설명'
    },
    grid_Main_Name: {
        "LANG_EN": 'Main Name',
        "LANG_VN": 'Tên chính',
        "LANG_KR": '메인 이름'
    },
    grid_Order: {
        "LANG_EN": 'Order',
        "LANG_VN": 'Thứ tự',
        "LANG_KR": '주문'
    },
    grid_Detail_Name: {
        "LANG_EN": 'Detail Name',
        "LANG_VN": 'Tên chi tiết',
        "LANG_KR": '세부 이름'
    },
    grid_Common_Main: {
        "LANG_EN": 'Common Main',
        "LANG_VN": 'Chính chung',
        "LANG_KR": '공통 메인'
    },
    Common_Management_Tooltip: {
        "LANG_EN": 'Please select Common Main Grid',
        "LANG_VN": 'Vui lòng chọn Hàng Chính chung',
        "LANG_KR": '공통 메인 그리드를 선택하세요'
    },
    grid_Common_Detail: {
        "LANG_EN": 'Common Detail',
        "LANG_VN": 'Chi tiết chung',
        "LANG_KR": '공통 세부 정보'
    },
    grid_Save_Common_Main: {
        "LANG_EN": 'Save Common Main',
        "LANG_VN": 'Lưu chính chung',
        "LANG_KR": '공통 메인 저장'
    },
    grid_Factory_Out: {
        "LANG_EN": 'Factory Out',
        "LANG_VN": 'Đầu ra',
        "LANG_KR": '공장 출고'
    },
    grid_Factory_In: {
        "LANG_EN": 'Factory In',
        "LANG_VN": 'Đầu vào',
        "LANG_KR": '공장 입고'
    },
    grid_New_Assets: {
        "LANG_EN": 'New Assets',
        "LANG_VN": 'Tài sản mới',
        "LANG_KR": '신규 자산'
    },
    grid_Work_Date: {
        "LANG_EN": 'Work Date',
        "LANG_VN": 'Ngày làm việc',
        "LANG_KR": '근무일'
    },
    grid_Disposal: {
        "LANG_EN": 'Disposal',
        "LANG_VN": 'Thải bỏ',
        "LANG_KR": '폐기'
    },
    grid_Purchase: {
        "LANG_EN": 'Purchase',
        "LANG_VN": 'Mua',
        "LANG_KR": '구매'
    },
    grid_Year: {
        "LANG_EN": 'Year',
        "LANG_VN": 'Năm',
        "LANG_KR": '년도'
    },
    grid_LastYN: {
        "LANG_EN": 'Last Y/N',
        "LANG_VN": 'Cuối cùng Y/N',
        "LANG_KR": '마지막 Y/N'
    },
    grid_PrintYN: {
        "LANG_EN": 'Print Y/N',
        "LANG_VN": 'In Y/N',
        "LANG_KR": '인쇄 Y/N'
    },
    grid_Loc_sts_cd: {
        "LANG_EN": 'Loc sts cd',
        "LANG_VN": 'Mã trạng thái vị trí',
        "LANG_KR": '위치 상태 코드'
    },
    TPM_Schedule_Look_Save: {
        "LANG_EN": 'TPM Schedule Look & Save',
        "LANG_VN": 'Lịch trình TPM Xem & Lưu',
        "LANG_KR": 'TPM 일정 보기 및 저장'
    },
    HOME: {
        "LANG_EN": 'Home',
        "LANG_VN": 'Trang chủ',
        "LANG_KR": '홈'
    },
    Dashboard: {
        "LANG_EN": 'Dashboard',
        "LANG_VN": 'Bảng điều khiển',
        "LANG_KR": '대시보드'
    },
    EquipmentManagement: {
        "LANG_EN": 'Equipment Management',
        "LANG_VN": 'Quản lý Trang thiết bị',
        "LANG_KR": '장비 관리'
    },
    LocationManangement: {
        "LANG_EN": 'Location Manangement',
        "LANG_VN": 'Quản lý vị trí',
        "LANG_KR": '위치 관리'
    },
    TPM: {
        "LANG_EN": 'TPM',
        "LANG_VN": 'TPM',
        "LANG_KR": 'TPM'
    },
    Report: {
        "LANG_EN": 'Report',
        "LANG_VN": 'Báo cáo',
        "LANG_KR": '보고서'
    },
    SystemManagement: {
        "LANG_EN": 'System Management',
        "LANG_VN": 'Quản lý hệ thống',
        "LANG_KR": '시스템 관리'
    },
    LanguageCategory: {
        "LANG_EN": 'Language Category',
        "LANG_VN": 'Danh mục ngôn ngữ',
        "LANG_KR": '언어 범주'
    },
    QRCodeManagement: {
        "LANG_EN": 'QR Code Management',
        "LANG_VN": 'Quản lý mã QR',
        "LANG_KR": 'QR 코드 관리'
    },
    EquipmentInformation: {
        "LANG_EN": 'Equipment Information',
        "LANG_VN": 'Thông tin trang thiết bị',
        "LANG_KR": '장비 정보'
    },
    ManufacturerInformation: {
        "LANG_EN": 'Manufacturer Information',
        "LANG_VN": 'Thông tin nhà sản xuất',
        "LANG_KR": '제조업체 정보'
    },
    SupplierInformation: {
        "LANG_EN": 'Supplier Information',
        "LANG_VN": 'Thông tin nhà cung cấp',
        "LANG_KR": '공급업체 정보'
    },
    ModelInformation: {
        "LANG_EN": 'Model Information',
        "LANG_VN": 'Thông tin mẫu',
        "LANG_KR": '모델 정보'
    },
    QRScanner: {
        "LANG_EN": 'QR Scanner',
        "LANG_VN": 'Quét mã QR',
        "LANG_KR": 'QR 스캐너'
    },
    SAPNewEquipmentManagement: {
        "LANG_EN": 'SAP New Equipment Management',
        "LANG_VN": 'Quản lý trang thiết bị SAP mới',
        "LANG_KR": 'SAP 신규 장비 관리'
    },
    LocationReceivingManagement: {
        "LANG_EN": 'Location Receiving Management',
        "LANG_VN": 'Quản lý nhận vị trí',
        "LANG_KR": '위치 수신 관리'
    },
    LocationForwardingMangement: {
        "LANG_EN": 'Location Forwarding Mangement',
        "LANG_VN": 'Quản lý chuyển vị trí',
        "LANG_KR": '위치 전달 관리'
    },
    LocationHistory: {
        "LANG_EN": 'Location History',
        "LANG_VN": 'Lịch sử vị trí',
        "LANG_KR": '위치 기록'
    },
    TPMSchedule: {
        "LANG_EN": 'TPM Schedule',
        "LANG_VN": 'Lịch trình TPM',
        "LANG_KR": 'TPM 일정'
    },
    TPMReport: {
        "LANG_EN": 'TPM Report',
        "LANG_VN": 'Báo cáo TPM',
        "LANG_KR": 'TPM 보고서'
    },
    TPMActivityHistory: {
        "LANG_EN": 'TPM Activity History',
        "LANG_VN": 'Lịch sử hoạt động TPM',
        "LANG_KR": 'TPM 활동 내역'
    },
    TPMPlan: {
        "LANG_EN": 'TPM Plan',
        "LANG_VN": 'Kế hoạch TPM',
        "LANG_KR": 'TPM 계획'
    },
    LocationHistoryReport: {
        "LANG_EN": 'Location History Report',
        "LANG_VN": 'Báo cáo lịch sử vị trí',
        "LANG_KR": '위치 기록 보고서'
    },
    EquipmentStatusReport: {
        "LANG_EN": 'Equipment Status Report',
        "LANG_VN": 'Báo cáo tình trạng thiết bị',
        "LANG_KR": '장비 상태 보고서'
    },
    EquipmentAssetReport: {
        "LANG_EN": 'Equipment Asset Report',
        "LANG_VN": 'Báo cáo tài sản thiết bị',
        "LANG_KR": '장비 자산 보고서'
    },
    EquipmentPurchaseandDisposal: {
        "LANG_EN": 'Equipment Purchase and Disposal',
        "LANG_VN": 'Mua và thải bỏ thiết bị',
        "LANG_KR": '장비 구매 및 폐기'
    },
    EquipmentUNSAPReport: {
        "LANG_EN": 'Equipment UNSAP Report',
        "LANG_VN": 'Thiết bị Báo cáo UNSAP',
        "LANG_KR": '장비 UNSAP 보고서'
    },
    TPMPlanReport: {
        "LANG_EN": 'TPM Plan Report',
        "LANG_VN": 'Báo cáo kế hoạch TPM',
        "LANG_KR": 'TPM 계획 보고서'
    },
    UserManagement: {
        "LANG_EN": 'User Management',
        "LANG_VN": 'Quản lý người dùng',
        "LANG_KR": '사용자 관리'
    },
    CommonManagement: {
        "LANG_EN": 'Common Management',
        "LANG_VN": 'Quản lý chung',
        "LANG_KR": '공통 관리'
    },
    MenuManagement: {
        "LANG_EN": 'Menu Management',
        "LANG_VN": 'Quản lý thực đơn',
        "LANG_KR": '메뉴 관리'
    },
    AuthorityManagement: {
        "LANG_EN": 'Authority Management',
        "LANG_VN": 'Quản lý thẩm quyền',
        "LANG_KR": '권한 관리'
    },
    'UserAuthority(M)': {
        "LANG_EN": 'User Authority (M)',
        "LANG_VN": 'Quyền hạn người dùng (M)',
        "LANG_KR": '사용자 권한(M)'
    },
    LocationManagement: {
        "LANG_EN": 'Location Management',
        "LANG_VN": 'Quản lý vị trí',
        "LANG_KR": '위치 관리'
    },
    ParentCategory: {
        "LANG_EN": 'Parent Category',
        "LANG_VN": 'Danh mục cha',
        "LANG_KR": '상위 카테고리'
    },
    TypeCategory: {
        "LANG_EN": 'Type Category',
        "LANG_VN": 'Loại danh mục',
        "LANG_KR": '유형 카테고리'
    },
    GroupCategory: {
        "LANG_EN": 'Group Category',
        "LANG_VN": 'Nhóm danh mục',
        "LANG_KR": '그룹 카테고리'
    },
    FunctionCategory: {
        "LANG_EN": 'Function Category',
        "LANG_VN": 'Danh mục chức năng',
        "LANG_KR": '기능 범주'
    },
    TPMScheduleMaster: {
        "LANG_EN": 'TPM Schedule Master',
        "LANG_VN": 'TPM Lịch trình chính',
        "LANG_KR": 'TPM 일정 마스터'
    },
    TPMItemInformation: {
        "LANG_EN": 'TPM Item Information',
        "LANG_VN": 'Thông tin mục TPM',
        "LANG_KR": 'TPM 항목 정보'
    },
    DepartmentInformation: {
        "LANG_EN": 'Department Information',
        "LANG_VN": 'Thông tin khoa',
        "LANG_KR": '부서 정보'
    }
};
