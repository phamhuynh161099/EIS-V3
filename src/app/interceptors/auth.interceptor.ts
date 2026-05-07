import { Name_Token } from '../../constants/constants.auth';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//     const token = localStorage.getItem(Name_Token);
//     if (token !== null) {
//         const clonedRequest = req.clone({
//             setHeaders: {
//                 Authorization: `Bearer ${token || ''}`
//             }
//         });
//         return next(clonedRequest);
//     } else {
//         return next(req);
//     }
// };

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const tokenString = localStorage.getItem(Name_Token);
    let account_info = null;

    if (tokenString) {
        try {
            account_info = JSON.parse(tokenString);
        } catch (error) {
            console.error("Lỗi khi parse token từ localStorage:", error);
        }
    }

    // Danh sách các URL không cần gắn token (ví dụ: login, register)
    const excludedUrls = ['oauth/token', 'public-api'];
    const isExcluded = excludedUrls.some(url => req.url.includes(url));

    console.log("::authInterceptor before");

    // 3. Đảm bảo account_info tồn tại VÀ có thuộc tính access_token
    if (account_info && account_info.access_token && !isExcluded) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${account_info.access_token}`
            }
        });
        return next(authReq);
    }
    // Nếu không thỏa điều kiện, gửi request gốc đi
    return next(req);
};
