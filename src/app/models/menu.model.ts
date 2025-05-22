export interface Menu {
    id: number;
    menuName: string;
    parentId: number;
    order: number;
    route: string;
    childCount: number;
}
