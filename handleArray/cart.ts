export interface Item {
    code: string;
    outOfStock: boolean;
    name: string;
    price: number;
    quantity: number;
}

export const cart: Array<Item> = [
    {
        code: 'orange',
        outOfStock: false,
        name: "오렌지",
        price: 10000,
        quantity: 4
    },
    {
        code: 'mango',
        outOfStock: true,
        name: "망고",
        price: 15000,
        quantity: 3
    },
    {
        code: 'apple',
        outOfStock: false,
        name: "사과",
        price: 5000,
        quantity: 6
    },
]