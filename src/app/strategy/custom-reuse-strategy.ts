// // custom-reuse-strategy.ts
// import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

import { ChangeDetectorRef } from "@angular/core";
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";
import { Subject } from "rxjs";

// export class CustomReuseStrategy implements RouteReuseStrategy {
//     private storedRoutes = new Map<string, DetachedRouteHandle>();

//     // Có nên detach (lưu lại) không?
//     shouldDetach(route: ActivatedRouteSnapshot): boolean {
//         return true; // Lưu tất cả route
//     }

//     // Lưu component lại
//     store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
//         const key = this.getKey(route);
//         if (key) this.storedRoutes.set(key, handle);
//     }

//     // Có route nào đã lưu để reattach không?
//     shouldAttach(route: ActivatedRouteSnapshot): boolean {
//         const key = this.getKey(route);
//         return !!key && this.storedRoutes.has(key);
//     }

//     // Lấy lại component đã lưu
//     retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
//         const key = this.getKey(route);
//         return key ? (this.storedRoutes.get(key) ?? null) : null;
//     }

//     // Có cần reuse route hiện tại không?
//     shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
//         return future.routeConfig === curr.routeConfig;
//     }

//     // Xóa cache khi đóng tab
//     deleteRoute(path: string): void {
//         // Tìm và xóa key chứa path này
//         for (const key of this.storedRoutes.keys()) {
//             if (key.includes(path)) {
//                 this.storedRoutes.delete(key);
//                 break;
//             }
//         }
//     }

//     private getKey(route: ActivatedRouteSnapshot): string {
//         return route.pathFromRoot
//             .map(r => r.url.map(u => u.toString()).join('/'))
//             .filter(Boolean)
//             .join('/');
//     }
// }
/**
 * Hỗ trợ quản lý tab bar
 */

// v2
// import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

// export class CustomReuseStrategy implements RouteReuseStrategy {
//     private storedRoutes = new Map<string, DetachedRouteHandle>();

//     shouldDetach(route: ActivatedRouteSnapshot): boolean {
//         return true;
//     }

//     store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
//         const key = this.getKey(route);
//         if (key) this.storedRoutes.set(key, handle);
//     }

//     shouldAttach(route: ActivatedRouteSnapshot): boolean {
//         const key = this.getKey(route);
//         return !!key && this.storedRoutes.has(key);
//     }

//     retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
//         const key = this.getKey(route);
//         return key ? (this.storedRoutes.get(key) ?? null) : null;
//     }

//     shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
//         return future.routeConfig === curr.routeConfig;
//     }

//     deleteRoute(path: string): void {
//         for (const [key, handle] of this.storedRoutes.entries()) {
//             if (key.includes(path)) {
//                 this.deactivateHandle(handle); // ← destroy thật sự
//                 this.storedRoutes.delete(key);
//                 break;
//             }
//         }
//     }

//     clearAll(): void {
//         this.storedRoutes.forEach(handle => this.deactivateHandle(handle));
//         this.storedRoutes.clear();
//     }

//     // Destroy component handle để Angular cleanup đúng cách
//     private deactivateHandle(handle: DetachedRouteHandle): void {
//         const componentRef = (handle as any)?.componentRef;
//         if (componentRef) {
//             componentRef.destroy();
//         }
//     }

//     private getKey(route: ActivatedRouteSnapshot): string {
//         return route.pathFromRoot
//             .map(r => r.url.map(u => u.toString()).join('/'))
//             .filter(Boolean)
//             .join('/');
//     }
// }


// custom-reuse-strategy.ts
export class CustomReuseStrategy implements RouteReuseStrategy {
    private storedRoutes = new Map<string, DetachedRouteHandle>();
    private pendingDelete = new Set<string>(); // ← thêm cái này

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const key = this.getKey(route);
        if (!key) {
            return false;
        }

        return true;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const key = this.getKey(route);
        const result = !!key && this.storedRoutes.has(key);
        return result;
    }

    onAttach$ = new Subject<string>();
    onDetach$ = new Subject<string>();
    // retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    //     const key = this.getKey(route);
    //     if (!key) return null;

    //     const handle = this.storedRoutes.get(key);
    //     if (!handle) return null;

    //     this.markForCheck(handle);

    //     // ✅ Notify component vừa được reattach
    //     this.onAttach$.next(key);

    //     return handle;
    // }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        const key = this.getKey(route);
        if (!key) return null;

        const handle = this.storedRoutes.get(key);
        if (!handle) return null;

        this.markForCheck(handle);
        this.onAttach$.next(key); // ✅ emit key của route được attach
        return handle;
    }

    shouldReuseRoute(
        future: ActivatedRouteSnapshot,
        curr: ActivatedRouteSnapshot
    ): boolean {
        // Nếu cùng routeConfig → bình thường reuse (đang ở đúng route, không navigate đi đâu)
        if (future.routeConfig === curr.routeConfig) {
            return true;
        }
        return false;
    }

    deleteRoute(path: string): void {
        const normalizedPath = path.replace(/^\//, '');

        let found = false;
        for (const [key, handle] of this.storedRoutes.entries()) {
            if (key === normalizedPath || key.endsWith('/' + normalizedPath)) {
                this.deactivateHandle(handle);
                this.storedRoutes.delete(key);
                this.pendingDelete.add(key);
                found = true;
                break;
            }
        }

        if (!found) {
            this.pendingDelete.add(normalizedPath);
        }
    }

    // store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    //     const key = this.getKey(route);
    //     if (!key) return;

    //     // Check cả full key lẫn last segment
    //     const lastSegment = key.split('/').pop() ?? '';
    //     if (this.pendingDelete.has(key) || this.pendingDelete.has(lastSegment)) {
    //         this.pendingDelete.delete(key);
    //         this.pendingDelete.delete(lastSegment);
    //         this.deactivateHandle(handle);
    //         return;
    //     }

    //     this.storedRoutes.set(key, handle);
    // }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const key = this.getKey(route);
        if (!key) return;

        if (this.pendingDelete.has(key)) {
            this.pendingDelete.delete(key);
            this.deactivateHandle(handle);
            return;
        }

        this.storedRoutes.set(key, handle);
        this.onDetach$.next(key); // ✅ emit key của route bị detach
    }

    clearAll(): void {
        this.storedRoutes.forEach(handle => this.deactivateHandle(handle));
        this.storedRoutes.clear();
        this.pendingDelete.clear();
    }

    private markForCheck(handle: DetachedRouteHandle): void {
        const componentRef = (handle as any)?.componentRef;
        if (!componentRef) return;
        try {
            const cd = componentRef.injector.get(ChangeDetectorRef);
            cd.markForCheck();
        } catch {
            // component đã bị destroy
        }
    }

    private deactivateHandle(handle: DetachedRouteHandle): void {
        (handle as any)?.componentRef?.destroy();
    }

    private findKey(path: string): string | null {
        // exact match ưu tiên
        for (const key of this.storedRoutes.keys()) {
            if (key === path || key === path.replace(/^\//, '')) return key;
        }
        // fallback: ends-with (cho nested route)
        for (const key of this.storedRoutes.keys()) {
            if (key.endsWith('/' + path.replace(/^\//, ''))) return key;
        }
        return null;
    }

    private getKey(route: ActivatedRouteSnapshot): string {
        const segments = route.pathFromRoot
            .map(r => r.url.map(u => u.toString()).join('/'))
            .filter(Boolean)
            .join('/');
        return segments;
    }
}
