let products = [
    {
        id_product: 1,
        product_name: "Camiseta",
        product_price: 50000,
        product_quantity: 89 
    },
    {
        id_product: 2,
        product_name: "Pantalón",
        product_price: 90000,
        product_quantity: 44
    },
    {
        id_product: 3,
        product_name: "Chaqueta",
        product_price: 160000,
        product_quantity: 23 
    },
    {
        id_product: 4,
        product_name: "Correa",
        product_price: 80000,
        product_quantity: 104 
    }
]

/** 1.	Escribe una función que tome un arreglo de objetos JSON que representan productos, 
y devuelva la suma de los precios de los productos y la suma total del valor del stock de la tienda. 
Utiliza la función reduce y el spread operator para obtener los precios de cada objeto y sumarlos. */

function sumaPrecioStock(products) {
    let total = products.reduce((sum, product) => sum + product.product_price, 0)
    let stock = products.reduce((sum, product) => sum + product.product_price * product.product_quantity, 0)

    return {
        "Suma de precios": total, 
        "Suma de stock": stock
    }
}

let resultSuma = sumaPrecioStock(products)
console.log({
    "Suma de precios": resultSuma["Suma de precios"].toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0}),
    "Suma de stock": resultSuma["Suma de stock"].toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0})
})

/** Expected result: Suma de precios: $380000, Suma de stock: $20410000 */


/** 2. Escribe una función que tome un arreglo de objetos JSON que representan productos, y devuelva un objeto 
que contenga la suma de los precios de los productos, la cantidad total de productos, y el nombre del producto más caro.
Utiliza el spread operator, la función reduce, map y sort para calcular los valores necesarios. */


function analisisProducto(products) {
    
    let totalPrice = products.reduce((sum, product) => sum + product.product_price, 0);

    let totalQuantity = products.map(product => product.product_quantity).reduce((cant, quantity) => cant + quantity, 0);

    let mostExpensiveProduct = [...products].sort((a, b) => b.product_price - a.product_price)[0];

    return {
        "suma precio: ": totalPrice,
        "cantidad de productos: ": totalQuantity,
        mostExpensiveProduct: mostExpensiveProduct  ? {
            product_name: mostExpensiveProduct.product_name,
            product_price: mostExpensiveProduct.product_price,
            product_quantity: mostExpensiveProduct.product_quantity
        } : null
    };
}

let result = analisisProducto(products)
console.log(result)

/** Expected result: { totalPrice: 170, totalQuantity: 10, mostExpensiveProduct: { product_name: "Chaqueta", product_price: 160000, product_quantity: 44 } } */

/* 3. Dado un arreglo de números, escribe una función que devuelva un nuevo arreglo que contenga solo los números pares,
y cada número se multiplique por 2. Utiliza la función filter y la función map. */

let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function numPares(numbers) {     
    let numbersPares = numbers.filter(number => number % 2 === 0);
    let doblePares = numbersPares.map(number => number * 2);

    return doblePares;       
}

let resultPares = numPares(numbers)
console.log(resultPares)

/* Expected Result: [4, 8, 12, 16, 20] */

/* 4.Dado un arreglo de objetos JSON que representan usuarios, escribe una función que devuelva un nuevo arreglo 
que contenga solo los usuarios mayores de edad (18 años o más), y para cada usuario se agregue una nueva propiedad 
"ageInDays" que represente la edad del usuario en días. Utiliza el spread operator, la función map y filter. */

const users = [
    { name: "Carlos", age: 20 },
    { name: "Juana", age: 17 },
    { name: "Oliver", age: 25 },
    { name: "Katherine", age: 30 },
];

function usuarios(users) {
    let mayoresEdad = users.filter(user => user.age >= 18);
    let usuariosMayoresEdad = mayoresEdad.map(user => {
        return {
            name: user.name,
            age: user.age,
            age_in_days: user.age * 365
        }        
    });
    return usuariosMayoresEdad;
}

let resultMayoresEdad = usuarios(users);
console.log(resultMayoresEdad)

/* Expected Result: [
        { name: "Carlos", age: 20, age_in_days: 7300 },
        { name: "Oliver", age: 25, age_in_days: 9125 },
        { name: "Katherine", age: 30, age_in_days: 10950 },
    ] 
*/

/* 5.Dado un arreglo de objetos JSON que representan productos, escribe una función que devuelva un nuevo que contenga 
solo los productos que tengan un precio mayor a $70000 y una cantidad inferior a 100, luego a cada producto se debe 
agregar una nueva propiedad "taxValue" que represente el precio con el impuesto del 19% y una propiedad “totalValue” 
de valor más el impuesto calculado. Utiliza el spread operator, la función map y filter. */

function productsTaxValue(products) {
    let productsTax = products.filter(product => product.product_price > 70000 && product.product_quantity < 100);
    let productsTaxValue = productsTax.map(product => {
        return {
            ...product,
            taxValue: product.product_price * 0.19,
            totalValue: product.product_price * 0.19 + product.product_price
        }
    });
    return productsTaxValue;     
}

let resultTaxValue = productsTaxValue(products)
console.log(resultTaxValue) 

/* Expected result: [
    {
        id_product: 2,
        product_name: "Pantalón",
        product_price: 90000,
        product_quantity: 44,
        product_tax_value: 17100,
        product_total_value: 107100
    },
    {
        id_product: 3,
        product_name: "Chaqueta",
        product_price: 160000,
        product_quantity: 23,
        product_tax_value: 30400,
        product_total_value: 190400
    }
] */