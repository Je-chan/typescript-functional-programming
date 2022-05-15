export interface Item {
    readonly code: string;
    readonly outOfStock: boolean;
    readonly name: string;
    readonly price: number;
    readonly quantity: number;
    readonly discountPrice?: number;
}

export const cart: Array<Item> = [
    {
        code: 'orange',
        outOfStock: false,
        name: "오렌지",
        price: 10000,
        quantity: 4,
        discountPrice: 1000
    },
    {
        code: 'mango',
        outOfStock: true,
        name: "망고",
        price: 15000,
        quantity: 3,
        discountPrice: 2000
    },
    {
        code: 'apple',
        outOfStock: false,
        name: "사과",
        price: 5000,
        quantity: 6
    },
]